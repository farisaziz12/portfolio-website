import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { speakingStatsQuery, upcomingEventsQuery, speakerProfileQuery } from '../lib/sanity/queries';
import { mdResponse, mdDate } from '../lib/markdown';
import { FALLBACK_SPEAKER_STATS } from '../lib/proof';

interface SpeakingStats {
  totalEvents: number;
  countries: number;
  cities: number;
}

interface EventItem {
  title: string;
  conference?: string;
  date: string;
}

interface SpeakerProfile {
  bioShort?: string;
}

export const GET: APIRoute = async () => {
  const [stats, upcoming, profile] = await Promise.all([
    sanityFetch<SpeakingStats>(speakingStatsQuery).catch(() => ({ ...FALLBACK_SPEAKER_STATS })),
    sanityFetch<EventItem[]>(upcomingEventsQuery).catch(() => []),
    sanityFetch<SpeakerProfile | null>(speakerProfileQuery).catch(() => null),
  ]);

  const bio =
    profile?.bioShort ||
    `Faris Aziz is a Staff Software Engineer and conference speaker based in Geneva. He has spoken at ${stats.totalEvents}+ events across ${stats.countries} countries, cofounded the award-winning ZurichJS community, and talks about resilient frontend systems and payment integrations.`;

  const body = [
    `# Invite me to speak.`,
    ``,
    `> ${stats.totalEvents} events across ${stats.countries} countries and ${stats.cities} cities. I speak about production and scale: React, Next.js, payments, developer experience, and community. Book: https://faziz-dev.com/invite`,
    ``,
    `## What do I speak about?`,
    ``,
    `- React and Next.js — performance and architecture at scale`,
    `- Payments and fintech — resilience and scaling money globally`,
    `- Developer experience — tooling and workflows that scale teams`,
    `- Career and community — growth, speaking, and building rooms people come back to`,
    ``,
    `Full catalogue: https://faziz-dev.com/talks.md`,
    ``,
    `## How do you book me?`,
    ``,
    `Send the date, the city, the audience size, the topic, and the slot length via https://faziz-dev.com/invite. I reply within two days. Community meetups are usually on the house.`,
    ``,
    `## Short bio (paste-ready)`,
    ``,
    bio,
    ``,
    `Press kit: https://faziz-dev.com/press-kit`,
    ``,
    upcoming.length
      ? `## What's next\n\n${upcoming
          .slice(0, 5)
          .map((e) => `- ${mdDate(e.date)}: ${e.title}${e.conference ? ` at ${e.conference}` : ''}`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
