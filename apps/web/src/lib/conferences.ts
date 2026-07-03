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

/**
 * Build the "logo wall" list: the most frequent real conference names from a
 * set of events, deduped case- and spacing-insensitively (so "Zurich JS" and
 * "ZurichJS" collapse into one entry). Single source of truth — the same loop
 * used to be copy-pasted (with diverging dedupe keys) on the home, speaking,
 * and invite pages.
 */
export function topConferences(
  events: Array<{ conference?: string | null }>,
  limit = 6
): string[] {
  const counts = new Map<string, { display: string; count: number }>();
  for (const e of events) {
    const raw = e.conference?.trim();
    if (!isRealConference(raw)) continue;
    // Strip all non-alphanumerics for the key so spacing/punctuation variants collapse.
    const key = raw!.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existing = counts.get(key);
    if (existing) existing.count += 1;
    else counts.set(key, { display: raw!, count: 1 });
  }
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((c) => c.display);
}
