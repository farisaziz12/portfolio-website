/**
 * Single source of truth for the hardcoded proof/track-record numbers used as
 * fallbacks when Sanity content is missing. These used to be duplicated as
 * independent literals on the home, services, impact, and about pages — and
 * had already drifted apart (60 vs 86 events). Update them HERE only; better
 * yet, keep the real values in Sanity (impactMetricV2 / speakerStats) so these
 * never render.
 */

export const PROOF = {
  /** ZurichJS community growth */
  communityMembers: 425,
  communityNote: 'Added to ZurichJS during 2025.',

  /** Team leadership */
  engineersLed: 15,
  engineersNote: 'Cross-functional squad, 2022–2024.',

  /** Product impact */
  revenueMultiplier: 3.5,
  revenueNote: 'In APAC after launching Alipay.',
} as const;

/** Fallback speaker stats (mirrors the shape of speakerStatsQuery). */
export const FALLBACK_SPEAKER_STATS = {
  totalEvents: 86,
  upcomingEvents: 0,
  countries: 20,
  cities: 29,
  talks: 0,
  workshops: 0,
} as const;
