import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { upcomingEventsQuery, pastEventsQuery } from '../lib/sanity/queries';
import { mdResponse, mdDate } from '../lib/markdown';

interface EventItem {
  title: string;
  slug: string;
  type?: string;
  conference?: string;
  date: string;
  location?: { city?: string; country?: string; isOnline?: boolean };
}

function line(e: EventItem): string {
  const loc = e.location?.isOnline
    ? 'Online'
    : [e.location?.city, e.location?.country].filter(Boolean).join(', ');
  return `- ${mdDate(e.date)} — **${e.title}**${e.conference ? ` at ${e.conference}` : ''}${loc ? ` (${loc})` : ''}${e.type ? ` · ${e.type}` : ''} — https://faziz-dev.com/events/${e.slug}`;
}

export const GET: APIRoute = async () => {
  const [upcoming, past] = await Promise.all([
    sanityFetch<EventItem[]>(upcomingEventsQuery).catch(() => []),
    sanityFetch<EventItem[]>(pastEventsQuery).catch(() => []),
  ]);

  const body = [
    `# Speaking schedule — Faris Aziz`,
    ``,
    `> Where I'll be next and everywhere I've been. Invite me to your event: https://faziz-dev.com/invite`,
    ``,
    `## Upcoming (${upcoming.length})`,
    ``,
    upcoming.length ? upcoming.map(line).join('\n') : '_No public dates confirmed right now — invite me: https://faziz-dev.com/invite_',
    ``,
    `## Past (${past.length})`,
    ``,
    past.map(line).join('\n'),
  ].join('\n');

  return mdResponse(body);
};
