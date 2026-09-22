/**
 * PostHog returns JSON numbers, booleans, or strings ('true'/'false'/'0'/'1').
 * `Boolean("false")` is true — never use Boolean() on roster fields.
 */
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
