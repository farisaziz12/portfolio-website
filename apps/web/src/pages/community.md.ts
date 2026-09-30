import type { APIRoute } from 'astro';
import { getPrimaryCommunity, getMetricsByDomain, getWriting, getSpeakingStats, getHomePage, fullDate, currentMonthYear } from '../lib/sanity/v3';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const home = await getHomePage();
  const [primary, communityMetrics, writing, stats] = await Promise.all([
    getPrimaryCommunity(home.communityId),
    getMetricsByDomain('community'),
    getWriting(),
    getSpeakingStats(),
  ]);
  const c = primary && !primary.metrics.length ? { ...primary, metrics: communityMetrics.filter((m) => !m.legacy) } : primary;
  const name = c?.name ?? 'ZurichJS';
  const posts = writing.filter((w) => w.topic === 'community');
  const abs = (href: string) => (href.startsWith('http') ? href : `${SITE}${href}`);

  const lines = [
    '# Community: Faris Aziz',
    '',
    `> I host meetups, teach at them, and build the systems behind them. ${name} is where most of that happens.`,
    '',
    ...(c
      ? [
          `## ${c.name}`,
          '',
          ...[
            c.role ? `- Role: ${c.role}` : '',
            c.founded ? `- Founded: ${c.founded}` : '',
            c.city ? `- City: ${c.city}` : '',
            c.url ? `- Website: ${c.url}` : '',
            stats.hosted > 0 ? `- Evenings hosted by Faris: ${stats.hosted} (as of ${currentMonthYear()}; not included in talks delivered)` : '',
          ].filter(Boolean),
          '',
          c.caseStudyHeadline ?? '',
          '',
          c.summary ?? '',
          '',
          ...(c.metrics.length
            ? [
                '### Metrics (dated, with definitions)',
                '',
                ...c.metrics.map((m) =>
                  `- ${m.value} ${m.label}${m.dateLabel ? ` (${m.dateLabel}${m.asOf && m.period ? `, as of ${fullDate(m.asOf)}` : ''})` : ''}${m.definition ? `. Definition: ${m.definition}` : ''}${m.sourceUrl ? ` Source: ${m.sourceUrl}` : ''}`
                ),
                '',
              ]
            : []),
          ...(c.recognition.length
            ? ['### Recognition', '', ...c.recognition.map((r) => `- ${r.title}${r.issuer ? `, ${r.issuer}` : ''}${r.year ? ` (${r.year})` : ''}${r.url ? `: ${r.url}` : ''}`), '']
            : []),
          ...(c.pillars.length
            ? ['## Host, teach, build', '', ...c.pillars.map((p) => `- **${p.kicker ?? ''}${p.title ? `: ${p.title}` : ''}.** ${p.body ?? ''}`.trim()), '']
            : []),
          ...(c.platformProject ? [`The conference platform as an engineering project: ${SITE}/projects/${c.platformProject.slug}`, ''] : []),
          `Aftermovie: ${c.aftermovie?.published && c.aftermovie.url ? c.aftermovie.url : 'not yet published'}.`,
          '',
        ]
      : []),
    ...(posts.length
      ? ['## Community writing', '', ...posts.map((p) => `- [${p.title}](${abs(p.href)}) (${p.source}, ${fullDate(p.date)})`), '']
      : []),
    '## Links',
    '',
    `- Bring Faris to your community (meetups, community conferences; community events are usually on the house): ${SITE}/invite`,
    `- Workshops: ${SITE}/workshops`,
    `- All community writing: ${SITE}/blog?topic=community`,
    '',
    `Canonical: ${SITE}/community`,
  ];

  return mdResponse(lines.join('\n').replace(/\n{3,}/g, '\n\n'));
};
