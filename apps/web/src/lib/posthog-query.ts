import { env } from './email'

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
  argMax(toString(properties.name), timestamp) AS name,
  argMax(toString(properties.section_key), timestamp) AS section_key,
  argMax(toBool(properties.focused), timestamp) AS focused,
  max(timestamp) AS last_seen
FROM events
WHERE event = 'workshop_heartbeat'
  AND properties.instance = '${safeToken}'
  AND timestamp > now() - INTERVAL 45 SECOND
GROUP BY distinct_id
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
      sectionKey: r[2] != null && String(r[2]) !== '' ? String(r[2]) : null,
      focused: Boolean(r[3]),
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
