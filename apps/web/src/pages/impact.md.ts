import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { impactData } from '../lib/impact';
import { SITE } from '../lib/seo';
import { METRIC_AREAS } from 'shared';
import { fullDate, monthYear, COUNTING_RULE, type Metric } from '../lib/sanity/v3';

function metricLine(m: Metric): string {
  const when = m.dateLabel || m.company ? ` (${[m.company, m.dateLabel].filter(Boolean).join(', ')})` : '';
  const def = m.definition ? ` Definition: ${m.definition}` : '';
  const ctx = m.context ? ` ${m.context}` : '';
  const src = m.sourceUrl ? ` Source: ${m.sourceUrl}` : '';
  return `- **${m.value}** ${m.label}${m.qualifier ? ` ${m.qualifier}` : ''}${when}.${ctx}${def}${src}`;
}

/** Engineering numbers grouped by area (unassigned last). */
function engineeringByArea(list: Metric[]): string {
  const groups = [...METRIC_AREAS.map((a) => ({ title: a.title, items: list.filter((m) => m.area === a.value) })), { title: 'Other', items: list.filter((m) => !m.area) }];
  const used = groups.filter((g) => g.items.length);
  if (used.length < 2) return list.map(metricLine).join('\n');
  return used.map((g) => `### ${g.title}\n\n${g.items.map(metricLine).join('\n')}`).join('\n\n');
}

export const GET: APIRoute = async () => {
  const d = await impactData();
  const s = d.stats;

  const body = [
    `# Track record: the work, the stages, the community`,
    ``,
    `> Everything here is dated and defined. Speaking counts only delivered sessions (hosting and attending never inflate them); community numbers belong to everyone who built ${d.community?.name ?? 'the community'}. Counts as of ${d.asOf}.`,
    ``,
    `## Speaking (derived from event session records, ${d.asOf})`,
    ``,
    `- **${s.sessionsDelivered}** sessions: ${COUNTING_RULE}.`,
    `  - of which ${s.conferenceTalks} conference talks, ${s.workshopsDelivered} workshops, ${s.panels} panel${s.panels === 1 ? '' : 's'}, ${s.guestSpots} podcast or livestream guest spot${s.guestSpots === 1 ? '' : 's'}.`,
    s.hosted ? `- **${s.hosted}** hosted or MC'd (not counted in sessions).` : '',
    `- **${s.countries}** countries spoken in, **${s.cities}** cities: in person, where he spoke or ran a workshop; hosting and attending excluded.${s.countryList.length ? ` Countries: ${s.countryList.join(', ')}.` : ''}`,
    `- **${s.podcasts}** podcast appearances${d.podcastPeriod ? ` (${d.podcastPeriod})` : ''}: podcast episodes in the writing and media list.${d.podcastSources.length ? ` Shows: ${d.podcastSources.join(', ')}.` : ''}`,
    ``,
    d.communityMetrics.length ? `## Community${d.community ? ` (${d.community.name})` : ''}\n\n${d.communityMetrics.map(metricLine).join('\n')}\n` : '',
    d.engineering.length ? `## Engineering: shipped, measured, corrected\n\n${engineeringByArea(d.engineering)}\n` : '',
    d.career.length
      ? `## Career: a non-traditional route to building things\n\n${d.career
          .map((c) => `- ${c.periodLabel || c.period || ''}${c.periodLabel || c.period ? ': ' : ''}${[c.role, c.name].filter(Boolean).join(', ')}${c.description ? `. ${c.description}` : ''}${c.clients?.length ? `. Clients: ${c.clients.map((cl) => (cl.note ? `${cl.name} (${cl.note})` : cl.name)).join(', ')}` : ''}`)
          .join('\n')}\n\nThe longer story: ${SITE}/about\n`
      : '',
    d.awards.length
      ? `## Recognition\n\n${d.awards.map((a) => `- ${a.title}${a.issuer ? `, ${a.issuer}` : ''}${a.year ? `, ${a.year}` : ''} (${a.community})${a.url ? `: ${a.url}` : ''}`).join('\n')}\n`
      : '',
    d.quote
      ? `## What people say\n\n> ${d.quote.quote}\n\n${d.quote.author.name}${d.quote.author.headline ? `, ${d.quote.author.headline}` : ''}${d.quote.date ? `, ${fullDate(d.quote.date)}` : ''}${d.quote.url ? ` (${d.quote.url})` : ''}. All ${d.praiseCount} quotes: ${SITE}/appreciation.md\n`
      : '',
    d.stages.length
      ? `## Stages (recent, one per series)\n\n${d.stages
          .map((e) => `- ${e.title}, ${monthYear(e.date)}${e.location.city ? `, ${e.location.city}` : ''}: ${SITE}/events/${e.slug}`)
          .join('\n')}\n\nFull schedule: ${SITE}/events\n`
      : '',
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return mdResponse(body);
};
