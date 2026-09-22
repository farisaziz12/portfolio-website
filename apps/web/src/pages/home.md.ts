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
    `# I'm Faris Aziz`,
    ``,
    `> I'm Faris Aziz, and I ship resilient frontend and payment systems, then I go talk about how on stage. I also build ZurichJS. Staff Software Engineer and conference speaker based in Geneva. ${stats.totalEvents} events across ${stats.countries} countries. Cofounder of ZurichJS (JSNation Open Source Award). Talks, workshops, consulting, and 1:1 mentorship. ${availabilityLabel('Available')}.`,
    ``,
    `## Site map (markdown mirrors for agents)`,
    ``,
    `- [About & bios](https://faziz-dev.com/about.md)`,
    `- [Speaking](https://faziz-dev.com/speaking.md): what I speak about, how to book, paste-ready bio`,
    `- [Talk catalogue](https://faziz-dev.com/talks.md): bookable talks`,
    `- [Speaking schedule](https://faziz-dev.com/events.md): upcoming & past`,
    `- [Invite to speak](https://faziz-dev.com/invite.md): booking form, availability, practical details`,
    `- [Press kit](https://faziz-dev.com/press-kit): copy-paste bios, downloadable headshots`,
    `- [Consulting](https://faziz-dev.com/consulting.md)`,
    `- [Mentorship](https://faziz-dev.com/mentorship.md)`,
    `- [Work with me](https://faziz-dev.com/contact.md): all contact routes`,
    ``,
    upcoming.length
      ? `## Next up\n\n${upcoming
          .slice(0, 3)
          .map((e) => `- ${mdDate(e.date)}: ${e.title}${e.conference ? ` at ${e.conference}` : ''}`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
