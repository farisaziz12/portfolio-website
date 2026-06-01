/**
 * Conference name helpers.
 *
 * Sanity events sometimes carry placeholder values ("TBD", "TBA", etc.) for
 * the `conference` field while a real lineup is still being confirmed. These
 * placeholders should never bubble up into public-facing logo walls or
 * dedupe groupings.
 */

const PLACEHOLDERS = new Set<string>([
  'tbd',
  'tba',
  'tbc',
  'tbd.',
  'tba.',
  'to be determined',
  'to be announced',
  'to be confirmed',
  'unknown',
  'n/a',
  'na',
  '?',
  '??',
  '???',
  '-',
  '—',
]);

export function isRealConference(name?: string | null): boolean {
  if (!name) return false;
  const normalized = name.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!normalized) return false;
  return !PLACEHOLDERS.has(normalized);
}
