import { env } from './env'
import {
  buildWorkshopRosterHogql,
  parseRosterFocused,
  parseRosterSectionKey,
} from './workshop-roster'

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

  const hogql = buildWorkshopRosterHogql(instanceToken)

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
