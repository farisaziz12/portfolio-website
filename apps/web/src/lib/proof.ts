/**
 * Last-resort speaking counts, used ONLY when the events query returns
 * nothing (CMS outage or an empty dataset), so pages never print "0 talks".
 * The live site derives every number from event sessions
 * (lib/sanity/v3/stats.ts); `stats.fallback` is true whenever these are in use.
 *
 * STALE: these are the reviewed Sep 2026 counts under the OLD rule (stage talks
 * only; hosting counted for countries). Refresh them from live data with
 * `pnpm --filter web check:stats`, which prints the current values and warns
 * while this snapshot differs.
 */
export const FALLBACK_SPEAKER_STATS = {
  /** Snapshot of `talksGiven` (HEADLINE_BUCKETS: spoke + workshop). */
  talksGiven: 44,
  countries: 22,
  cities: 31,
  /** When the snapshot was taken (shown as the "as of" date while in use). */
  asOf: '2026-09-01',
} as const;
