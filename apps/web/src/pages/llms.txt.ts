import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { allTalksQuery, speakingStatsQuery } from '../lib/sanity/queries';
import { FALLBACK_SPEAKER_STATS } from '../lib/proof';

interface Talk {
  title: string;
  slug: string;
  abstract?: string;
}

interface SpeakingStats {
  totalEvents: number;
  countries: number;
}

// llms.txt per https://llmstxt.org — a markdown index for LLMs and agents.
// Links point at the .md mirrors, which carry the same Sanity content as the
// HTML pages with none of the markup overhead.
export const GET: APIRoute = async () => {
  const [talks, stats] = await Promise.all([
    sanityFetch<Talk[]>(allTalksQuery).catch(() => []),
    sanityFetch<SpeakingStats>(speakingStatsQuery).catch(() => ({ ...FALLBACK_SPEAKER_STATS })),
  ]);

  const body = `# Faris Aziz

> Staff Software Engineer, conference speaker, and award-winning community builder based in Geneva, Switzerland. ${stats.totalEvents}+ speaking engagements across ${stats.countries} countries. Cofounder of ZurichJS (JSNation Open Source Award). Speaks and consults on React, Next.js, frontend architecture, payment systems, developer experience, and engineering leadership. Available for keynotes, talks, workshops, consulting, and 1:1 mentorship.

To book: speaking invitations at https://faziz-dev.com/invite (form; replies within two days), consulting discovery calls at https://cal.com/farisaziz12/discovery-call, mentorship inquiries at https://faziz-dev.com/mentorship.

## About

- [Bio & facts](https://faziz-dev.com/about.md): copy-ready short/medium/full bios, stats, topics
- [Work with me](https://faziz-dev.com/contact.md): all contact routes in one place

## Speaking

- [Talk catalogue](https://faziz-dev.com/talks.md): every bookable talk with abstracts and delivery history
- [Schedule](https://faziz-dev.com/events.md): upcoming and past engagements
- [Invite & press kit](https://faziz-dev.com/invite.md): logistics, speaker rider, bios, availability

## Services

- [Consulting](https://faziz-dev.com/consulting.md): expertise areas and engagement formats
- [Mentorship](https://faziz-dev.com/mentorship.md): focus areas and how it works

## Optional

- [Homepage overview](https://faziz-dev.com/home.md)
${talks
  .slice(0, 12)
  .map((t) => `- [Talk: ${t.title}](https://faziz-dev.com/talks/${t.slug}.md)`)
  .join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
