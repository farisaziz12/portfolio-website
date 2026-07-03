import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { speakingStatsQuery, upcomingEventsQuery } from '../lib/sanity/queries';
import { mdResponse, mdDate } from '../lib/markdown';
import { FALLBACK_SPEAKER_STATS } from '../lib/proof';
import { availabilityLabel } from '../lib/availability';

interface SpeakingStats {
  totalEvents: number;
  countries: number;
  cities: number;
}

interface EventItem {
  title: string;
  conference?: string;
  date: string;
  slug: string;
}

export const GET: APIRoute = async () => {
  const [stats, upcoming] = await Promise.all([
    sanityFetch<SpeakingStats>(speakingStatsQuery).catch(() => ({ ...FALLBACK_SPEAKER_STATS })),
    sanityFetch<EventItem[]>(upcomingEventsQuery).catch(() => []),
  ]);

  const body = [
    `# Faris Aziz — Staff Software Engineer & Conference Speaker`,
    ``,
    `> Faris Aziz is a Staff Software Engineer and conference speaker based in Geneva, Switzerland. ${stats.totalEvents}+ speaking engagements across ${stats.countries} countries. He helps teams ship resilient frontend systems and payment integrations, and offers talks, workshops, consulting, and 1:1 mentorship. ${availabilityLabel('Available')}.`,
    ``,
    `## Site map (markdown mirrors for agents)`,
    ``,
    `- [About & bios](https://faziz-dev.com/about.md)`,
    `- [Talk catalogue — bookable talks](https://faziz-dev.com/talks.md)`,
    `- [Speaking schedule — upcoming & past](https://faziz-dev.com/events.md)`,
    `- [Invite to speak — logistics, rider, press kit](https://faziz-dev.com/invite.md)`,
    `- [Consulting](https://faziz-dev.com/consulting.md)`,
    `- [Mentorship](https://faziz-dev.com/mentorship.md)`,
    `- [Work with me — all contact routes](https://faziz-dev.com/contact.md)`,
    ``,
    upcoming.length
      ? `## Next up\n\n${upcoming
          .slice(0, 3)
          .map((e) => `- ${mdDate(e.date)} — ${e.title}${e.conference ? ` at ${e.conference}` : ''}`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
