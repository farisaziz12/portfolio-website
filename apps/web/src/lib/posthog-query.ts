import { env } from './env'
import { parseRosterFocused, parseRosterSectionKey } from './workshop-roster'

export interface WorkshopRosterRow {
  email: string
  name: string
  sectionKey: string | null
  focused: boolean
  lastSeen: string
}

function posthogApiHost(): string {
  const host = env('POSTHOG_HOST') || env('PUBLIC_POSTHOG_HOST') || 'https://eu.posthog.com'
  // Ingestion host is eu.i.posthog.com — query API lives on eu.posthog.com.
  return host.replace('://eu.i.', '://eu.').replace('://us.i.', '://us.')
}

/**
 * Near-live roster from recent workshop_heartbeat events.
 * Requires POSTHOG_PERSONAL_API_KEY + POSTHOG_PROJECT_ID (server-only).
 *
 * Latest event per person uses a row_number() window so section and focus
 * come from the same heartbeat. Independent argMax(section) / argMax(toBool(focused))
 * mixed columns across events, and toBool('false') is true in ClickHouse.
 */
export async function queryWorkshopRoster(instanceToken: string): Promise<{
  rows: WorkshopRosterRow[]
  error?: string
}> {
  const apiKey = env('POSTHOG_PERSONAL_API_KEY')
  const projectId = env('POSTHOG_PROJECT_ID')

  if (!apiKey || !projectId) {
    return {
      rows: [],
      error: 'PostHog query not configured (POSTHOG_PERSONAL_API_KEY / POSTHOG_PROJECT_ID)',
    }
  }

  // Escape single quotes for HogQL string literal.
  const safeToken = instanceToken.replace(/\\/g, '\\\\').replace(/'/g, "\\'")

  const hogql = `
SELECT
  distinct_id AS email,
  name,
  section_key,
  focused,
  last_seen
FROM (
  SELECT
    distinct_id,
    coalesce(toString(properties.name), '') AS name,
    nullIf(toString(properties.section_key), '') AS section_key,
    if(
      toString(properties.focused) IN ('1', 'true', 'True'),
      1,
      0
    ) AS focused,
    timestamp AS last_seen,
    row_number() OVER (PARTITION BY distinct_id ORDER BY timestamp DESC) AS rn
  FROM events
  WHERE timestamp > now() - INTERVAL 45 SECOND
    AND event = 'workshop_heartbeat'
    AND toString(properties.instance) = '${safeToken}'
)
WHERE rn = 1
ORDER BY last_seen DESC
LIMIT 200
`.trim()

  try {
    const res = await fetch(`${posthogApiHost()}/api/projects/${projectId}/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: { kind: 'HogQLQuery', query: hogql },
        name: 'workshop-live-roster',
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { rows: [], error: `PostHog query HTTP ${res.status}: ${text.slice(0, 200)}` }
    }

    const json = (await res.json()) as {
      results?: unknown[][]
      columns?: string[]
    }

    const results = json.results || []
    const rows: WorkshopRosterRow[] = results.map((r) => ({
      email: String(r[0] ?? ''),
      name: String(r[1] ?? ''),
      sectionKey: parseRosterSectionKey(r[2]),
      focused: parseRosterFocused(r[3]),
      lastSeen: String(r[4] ?? ''),
    }))

    return { rows }
  } catch (err) {
    return {
      rows: [],
      error: err instanceof Error ? err.message : 'PostHog query failed',
    }
  }
}
