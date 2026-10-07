/**
 * Last-resort speaking counts, used ONLY when the events query returns
 * nothing (CMS outage or an empty dataset), so pages never print "0 talks".
 * Values are the reviewed counts from the V3 design review (Sep 2026). The
 * live site derives every number from event sessions (lib/sanity/v3/stats.ts);
 * `stats.fallback` is true whenever these are in use.
 */
export const FALLBACK_SPEAKER_STATS = {
  /** Delivered talk sessions (speaker/keynote/lightning). */
  totalEvents: 44,
  countries: 22,
  cities: 31,
} as const;
