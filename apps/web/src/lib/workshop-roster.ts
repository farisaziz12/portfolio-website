/**
 * PostHog returns JSON numbers, booleans, or strings ('true'/'false'/'0'/'1').
 * `Boolean("false")` is true — never use Boolean() on roster fields.
 */

/** How far back a heartbeat still counts as "in the room". */
export const WORKSHOP_ROSTER_LOOKBACK = '2 MINUTE'

/**
 * GROUP BY + argMax is the HogQL shape that returned rows on this project.
 * `row_number() OVER (...)` in an unaliased subquery came back empty.
 * Focused is `toString` (parsed in JS) — ClickHouse `toBool('false')` is true.
 */
export function buildWorkshopRosterHogql(instanceToken: string): string {
  const safeToken = instanceToken.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `
SELECT
  distinct_id AS email,
  argMax(toString(properties.name), timestamp) AS name,
  argMax(toString(properties.section_key), timestamp) AS section_key,
  argMax(toString(properties.focused), timestamp) AS focused,
  max(timestamp) AS last_seen
FROM events
WHERE event = 'workshop_heartbeat'
  AND properties.instance = '${safeToken}'
  AND timestamp > now() - INTERVAL ${WORKSHOP_ROSTER_LOOKBACK}
GROUP BY distinct_id
ORDER BY last_seen DESC
LIMIT 200
`.trim()
}

export function parseRosterFocused(value: unknown): boolean {
  if (value === true || value === 1) return true
  if (value === false || value === 0 || value == null) return false
  const s = String(value).trim().toLowerCase()
  return s === 'true' || s === '1'
}

export function parseRosterSectionKey(value: unknown): string | null {
  if (value == null) return null
  const s = String(value).trim()
  if (!s || s === 'null' || s === 'undefined') return null
  return s
}
