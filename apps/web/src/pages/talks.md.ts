import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { allTalksQuery } from '../lib/sanity/queries';
import { mdResponse, mdDate } from '../lib/markdown';

interface Talk {
  _id: string;
  title: string;
  slug: string;
  abstract?: string;
  topics?: string[];
  duration?: number;
  eventCount: number;
  latestEvent?: { date: string; conference: string; location: string };
}

export const GET: APIRoute = async () => {
  const talks = await sanityFetch<Talk[]>(allTalksQuery).catch(() => []);
  const deliveries = talks.reduce((sum, t) => sum + (t.eventCount || 0), 0);

  const body = [
    `# Talk catalogue — Faris Aziz`,
    ``,
    `> ${talks.length} talks, delivered ${deliveries} times. Every talk is adaptable in depth and length; most have a hands-on workshop version. Book any of them: https://faziz-dev.com/invite`,
    ``,
    ...talks.map((t) =>
      [
        `## ${t.title}`,
        ``,
        [
          t.duration ? `${t.duration} min` : null,
          t.eventCount ? `delivered ${t.eventCount}×` : null,
          t.latestEvent?.conference ? `last at ${t.latestEvent.conference} (${mdDate(t.latestEvent.date)})` : null,
          t.topics?.length ? `topics: ${t.topics.join(', ')}` : null,
        ]
          .filter(Boolean)
          .join(' · '),
        ``,
        t.abstract || '',
        ``,
        `Details: https://faziz-dev.com/talks/${t.slug} · Book this talk: https://faziz-dev.com/invite?format=talk&talk=${encodeURIComponent(t.title)}`,
      ].join('\n')
    ),
  ].join('\n');

  return mdResponse(body);
};
