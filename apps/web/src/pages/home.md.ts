import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';
import {
  getHomePage,
  plainHeadline,
  getHomeFeatured,
  getPrimaryCommunity,
  getMetricsByDomain,
  getUpcomingEvents,
  getSpeakingStats,
  getWriting,
  getSiteSettings,
  getProfile,
  primarySession,
  sessionLine,
  eventPlace,
  fullDate,
  monthYear,
} from '../lib/sanity/v3';

const abs = (href: string) => (href.startsWith('http') ? href : `${SITE}${href}`);

export const GET: APIRoute = async () => {
  const home = await getHomePage();
  const [settings, profile, featured, community, communityMetrics, upcoming, stats, writing] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getHomeFeatured(),
    getPrimaryCommunity(home.communityId),
    getMetricsByDomain('community'),
    getUpcomingEvents(),
    getSpeakingStats(),
    getWriting(),
  ]);

  const metrics = (community?.metrics.length ? community.metrics : communityMetrics).filter((m) => m.dateLabel);
  const latest = writing.slice(0, 4);

  const statLine = [
    `${stats.talksDelivered} talks delivered`,
    stats.workshopsDelivered ? `${stats.workshopsDelivered} workshops delivered` : null,
    stats.hosted ? `${stats.hosted} events hosted (counted separately)` : null,
    `${stats.countries} countries`,
    stats.podcasts ? `${stats.podcasts} podcast appearances` : null,
    `${stats.catalogueTalks} talks in the current catalogue`,
  ]
    .filter(Boolean)
    .join(' · ');

  const body = [
    `# ${profile.name}: ${home.kicker || settings.nowLine}`,
    ``,
    `> ${plainHeadline(home.headline)} ${home.intro}`,
    ``,
    `Based in ${profile.travelBase}. ${settings.metaDescription ?? ''}`.trim(),
    ``,
    `## Speaking record (derived, as of ${fullDate(stats.asOf)})`,
    ``,
    statLine,
    ``,
    upcoming.length
      ? [
          `## Next up`,
          ``,
          ...upcoming.slice(0, 5).map((e) => {
            const s = primarySession(e);
            return `- ${fullDate(e.date)}: [${e.title}](${SITE}/events/${e.slug}), ${eventPlace(e)}${s ? `. ${sessionLine(s)}` : ''}`;
          }),
          ``,
        ].join('\n')
      : `## Next up\n\nNo public dates announced right now. [Invite me](${SITE}/invite).\n`,
    featured.length
      ? [
          `## Featured`,
          ``,
          ...featured.map((f) =>
            f.kind === 'talk'
              ? `- Talk: [${f.talk.title}](${SITE}/talks/${f.talk.slug})${f.talk.summary ? `: ${f.talk.summary}` : ''}${f.talk.recording ? ` Recording: ${f.talk.recording.url}` : ''}`
              : `- ${f.item.format === 'podcast' ? 'Podcast' : f.item.format === 'video' ? 'Video' : 'Writing'}: [${f.item.title}](${abs(f.item.href)}) (${[f.item.isInternal ? null : f.item.source, monthYear(f.item.date)].filter(Boolean).join(', ')})`,
          ),
          ``,
        ].join('\n')
      : null,
    community
      ? [
          `## ${community.name}`,
          ``,
          `${community.headline ?? ''} ${community.role ? `Role: ${community.role}.` : ''} ${community.summary ?? ''}`.replace(/\s+/g, ' ').trim(),
          ``,
          ...metrics.map((m) => `- ${m.value} ${m.label} (${m.dateLabel})`),
          ...community.recognition.map((r) => `- Recognition: ${[r.title, r.issuer, r.year].filter(Boolean).join(', ')}`),
          community.aftermovie
            ? `- Aftermovie: ${community.aftermovie.published && community.aftermovie.url ? community.aftermovie.url : 'not yet published'}`
            : null,
          ``,
          `More: ${SITE}/community`,
          ``,
        ]
          .filter((l) => l !== null)
          .join('\n')
      : null,
    latest.length
      ? [
          `## Latest writing and conversations`,
          ``,
          ...latest.map((w) => `- ${fullDate(w.date)}: [${w.title}](${abs(w.href)})${w.isInternal ? '' : ` (${w.source})`}`),
          ``,
          `All writing: ${SITE}/blog`,
          ``,
        ].join('\n')
      : null,
    `## How to book`,
    ``,
    `${home.invitePanel.body}`,
    ``,
    `- Invite me to speak: ${SITE}/invite`,
    `- Talk catalogue: ${SITE}/talks`,
    `- Workshops: ${SITE}/workshops`,
    `- Press kit (bios, photos, rider): ${SITE}/press-kit`,
    `- Everything else: ${SITE}/contact`,
  ]
    .filter((l) => l !== null)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return mdResponse(body);
};
