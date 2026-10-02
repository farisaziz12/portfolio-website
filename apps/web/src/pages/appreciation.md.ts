import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { getAllPraise, fullDate, PLATFORM_LABEL, currentMonthYear } from '../lib/sanity/v3';
import { PRAISE_TOPIC_LABEL, praiseFilters } from '../lib/appreciation';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const praise = await getAllPraise();
  const { topics, platforms } = praiseFilters(praise);

  const items = praise.map((p) => {
    const about = [p.label, p.talk && `talk: ${p.talk.title} (${SITE}/talks/${p.talk.slug})`, p.workshop && `workshop: ${p.workshop.title} (${SITE}/workshops/${p.workshop.slug})`, p.event && `event: ${p.event.title} (${SITE}/events/${p.event.slug})`]
      .filter(Boolean)
      .join('; ');
    return [
      `### ${p.author.name}${p.author.headline ? `, ${p.author.headline}` : ''}`,
      ``,
      `> ${p.quote.replace(/\n+/g, '\n> ')}`,
      ``,
      `- Platform: ${PLATFORM_LABEL[p.platform]}${p.author.handle ? ` (${p.author.handle})` : ''}`,
      p.date ? `- Date: ${fullDate(p.date)}` : '',
      `- Topic: ${PRAISE_TOPIC_LABEL[p.topic]}${about ? ` (${about})` : ''}`,
      p.url ? `- Original: ${p.url}` : '',
    ]
      .filter((l, i) => l !== '' || i === 1 || i === 3)
      .join('\n');
  });

  const body = [
    `# What people have said about Faris`,
    ``,
    `> ${praise.length} quotes, verbatim, each with its author, platform, date, topic and a link to the original post where there is one. Last checked ${currentMonthYear()}.`,
    ``,
    topics.length ? `Topics: ${topics.map((t) => `${t.label} (${t.count})`).join(', ')}.` : '',
    platforms.length ? `Platforms: ${platforms.map((p) => `${p.label} (${p.count})`).join(', ')}.` : '',
    ``,
    `Filtered views: ${SITE}/appreciation?topic=mentoring · ${SITE}/appreciation?platform=linkedin`,
    ``,
    `## Quotes`,
    ``,
    items.length ? items.join('\n\n') : 'No quotes collected yet.',
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return mdResponse(body);
};
