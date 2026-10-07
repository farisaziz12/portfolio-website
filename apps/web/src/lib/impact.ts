/**
 * Track record (/impact and /impact.md): one loader so the page and its
 * markdown mirror read exactly the same numbers.
 */
import {
  currentMonthYear,
  getAllPraise,
  getCareer,
  getCommunities,
  getFeaturedPraise,
  getMetricsByDomain,
  getPastEvents,
  getPrimaryCommunity,
  getSpeakingStats,
  getWriting,
  monthYear,
  type Award,
  type EventEdition,
} from './sanity/v3';

const STAGE_LIMIT = 7;

/** Featured first, then most recent; one chip per series. */
function pickStages(events: EventEdition[]): EventEdition[] {
  const spoke = events
    .filter((e) => e.kind !== 'podcast' && e.kind !== 'livestream')
    .filter((e) => e.sessions.some((s) => s.bucket === 'spoke' && s.status === 'delivered'))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.date.localeCompare(a.date));
  const seen = new Set<string>();
  const out: EventEdition[] = [];
  for (const e of spoke) {
    const key = (e.seriesName || e.title.replace(/\s+(19|20)\d{2}$/, '')).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
    if (out.length >= STAGE_LIMIT) break;
  }
  return out;
}

export async function impactData() {
  const [stats, writing, community, engineering, communityDomain, career, communities, praise, featured, past] = await Promise.all([
    getSpeakingStats(),
    getWriting(),
    getPrimaryCommunity(),
    getMetricsByDomain('engineering'),
    getMetricsByDomain('community'),
    getCareer(),
    getCommunities(),
    getAllPraise(),
    getFeaturedPraise(1),
    getPastEvents(),
  ]);

  const podcasts = writing.filter((w) => w.format === 'podcast');
  const podcastDates = podcasts.map((p) => p.date).filter(Boolean).sort();
  const first = monthYear(podcastDates[0]);
  const last = monthYear(podcastDates[podcastDates.length - 1]);
  const podcastPeriod = first && last && first !== last ? `${first} – ${last}` : first || undefined;
  const podcastSources = [...new Set(podcasts.map((p) => p.source).filter(Boolean))];

  const awards: (Award & { community: string })[] = communities.flatMap((c) => c.recognition.map((r) => ({ ...r, community: c.name })));
  const quote = featured[0];

  return {
    stats,
    asOf: currentMonthYear(),
    podcasts,
    podcastPeriod,
    podcastSources,
    community,
    // The community's own approved metrics, else any approved community-domain metric.
    communityMetrics: (community?.metrics?.length ? community.metrics : communityDomain).slice(0, 2),
    engineering,
    career,
    awards,
    quote,
    praiseCount: praise.length,
    moreQuotes: quote ? Math.max(0, praise.length - 1) : 0,
    stages: pickStages(past),
  };
}
