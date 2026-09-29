import type { APIRoute } from 'astro';
import { TOPIC_SHORT, type PublicationFormat } from 'shared';
import { getWriting, fullDate, yearOf } from '../lib/sanity/v3';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

const FORMAT: Record<PublicationFormat, string> = { article: 'Written', podcast: 'Podcast', video: 'Video' };
const abs = (href: string) => (href.startsWith('http') ? href : `${SITE}${href}`);

export const GET: APIRoute = async () => {
  const items = await getWriting();
  const years = [...new Set(items.map((i) => yearOf(i.date)))].sort((a, b) => b - a);
  const count = (f: PublicationFormat) => items.filter((i) => i.format === f).length;

  const lines = [
    '# Writing & conversations: Faris Aziz',
    '',
    "> What I've written, and what I've said out loud. Posts on this site, pieces for other publications, podcast conversations and video, in one timeline.",
    '',
    `${items.length} items: ${count('article')} written, ${count('podcast')} podcasts, ${count('video')} video. Topics: ${[...new Set(items.map((i) => i.topic).filter(Boolean))].map((t) => TOPIC_SHORT[t!]).join(', ')}.`,
    `Posts on this site have a markdown version at the same URL plus \`.md\`. RSS: ${SITE}/rss.xml`,
    '',
    ...years.flatMap((y) => [
      `## ${y}`,
      '',
      ...items
        .filter((i) => yearOf(i.date) === y)
        .map((i) => {
          const facts = [
            FORMAT[i.format],
            [i.source, i.sourceNote].filter(Boolean).join(', '),
            i.topic ? TOPIC_SHORT[i.topic] : '',
            fullDate(i.date),
            i.minutes ? `${i.minutes} min` : '',
          ].filter(Boolean);
          const md = i.isInternal ? ` (markdown: ${abs(i.href)}.md)` : '';
          return `- [${i.title}](${abs(i.href)}): ${facts.join(' · ')}${md}${i.excerpt ? `. ${i.excerpt}` : ''}`;
        }),
      '',
    ]),
    `Canonical: ${SITE}/blog`,
  ];

  return mdResponse(lines.join('\n'));
};
