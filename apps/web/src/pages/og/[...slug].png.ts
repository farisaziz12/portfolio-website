import type { APIRoute } from 'astro';
import { sanityFetch } from '../../lib/sanity/client';
import {
  allTalksQuery,
  allEventsQuery,
  allBlogPostsQuery,
  allWorkshopsQuery,
  speakingStatsQuery,
} from '../../lib/sanity/queries';
import { renderOgCard, OG_HEADERS, type OgCard } from '../../lib/og';
import { FALLBACK_SPEAKER_STATS } from '../../lib/proof';
import { mdDate } from '../../lib/markdown';

interface Talk {
  title: string;
  slug: string;
  duration?: number;
  topics?: string[];
  eventCount?: number;
  latestEvent?: { conference?: string };
}

interface EventItem {
  title: string;
  slug: string;
  conference?: string;
  date: string;
  type?: string;
  location?: { city?: string; country?: string; isOnline?: boolean };
}

interface BlogPost {
  title: string;
  slug: string;
  publishedAt: string;
  estimatedReadingTime?: number;
  category?: string;
}

interface Workshop {
  title: string;
  slug: string;
  duration?: string;
  level?: string;
}

interface SpeakingStats {
  totalEvents: number;
  countries: number;
}

export async function getStaticPaths() {
  const [talks, events, posts, workshops, stats] = await Promise.all([
    sanityFetch<Talk[]>(allTalksQuery).catch(() => []),
    sanityFetch<EventItem[]>(allEventsQuery).catch(() => []),
    sanityFetch<BlogPost[]>(allBlogPostsQuery).catch(() => []),
    sanityFetch<Workshop[]>(allWorkshopsQuery).catch(() => []),
    sanityFetch<SpeakingStats>(speakingStatsQuery).catch(() => ({ ...FALLBACK_SPEAKER_STATS })),
  ]);

  const statLine = `${stats.totalEvents}+ talks across ${stats.countries} countries`;

  const staticCards: Record<string, OgCard> = {
    default: {
      kicker: 'Staff Software Engineer · Speaker',
      title: 'Faris Aziz',
      meta: `React, Next.js & payment systems — ${statLine}. Talks, workshops, consulting & mentorship.`,
    },
    home: {
      kicker: 'Staff Software Engineer · Speaker',
      title: 'Resilient frontends. Real stages.',
      meta: `${statLine} — talks, workshops, consulting & mentorship.`,
    },
    about: {
      kicker: 'About',
      title: 'Engineer first. Speaker because of it.',
      meta: statLine,
    },
    contact: {
      kicker: 'Work with me',
      title: 'Four doors, one inbox.',
      meta: 'Speaking · consulting · mentorship · full-time roles — pick a door, replies within two days.',
    },
    invite: {
      kicker: 'Speaker press kit',
      title: 'Invite me to your event.',
      meta: 'Keynotes, talks, panels & workshops — tailored to your audience. Bios, headshots & availability inside.',
    },
    talks: {
      kicker: 'Talk catalogue',
      title: 'Conference talks, ready to book.',
      meta: 'Production stories on React, Next.js, payments & developer experience.',
    },
    events: {
      kicker: 'Speaking schedule',
      title: 'Every stage, in one place.',
      meta: `Upcoming events and the full archive — ${statLine}.`,
    },
    workshops: {
      kicker: 'Workshops',
      title: 'Build it, then ship it.',
      meta: 'Hands-on, full-day training for engineering teams.',
    },
    services: {
      kicker: 'Services',
      title: "Let's work together.",
      meta: 'Consulting for teams · 1:1 mentorship for engineers.',
    },
    consulting: {
      kicker: 'Consulting',
      title: "Let's get your team unstuck.",
      meta: 'Architecture reviews, performance, payments & team enablement.',
    },
    mentorship: {
      kicker: 'Mentorship',
      title: "You're closer than you think.",
      meta: '1:1 coaching — career strategy, technical mastery & public speaking.',
    },
    blog: {
      kicker: 'Blog',
      title: 'Notes from production.',
      meta: 'Essays on frontend, payments & engineering life.',
    },
    impact: {
      kicker: 'Impact',
      title: 'The track record, in numbers.',
      meta: 'Community, product and leadership outcomes — measured.',
    },
    media: {
      kicker: 'Media & press kit',
      title: 'Photos, videos & press.',
      meta: 'Free for organizers and press to use — credit appreciated.',
    },
    speaking: {
      kicker: 'Speaking',
      title: 'Real-world engineering, for people who love the web.',
      meta: statLine,
    },
    projects: {
      kicker: 'Projects',
      title: 'Tools, libraries & shipped work.',
      meta: 'Open source and production systems.',
    },
    appreciation: {
      kicker: 'Appreciation',
      title: 'Kind words from the community.',
      meta: 'Testimonials from organizers, attendees & mentees.',
    },
  };

  return [
    ...Object.entries(staticCards).map(([slug, card]) => ({ params: { slug }, props: { card } })),
    ...talks.map((t) => ({
      params: { slug: `talks/${t.slug}` },
      props: {
        card: {
          kicker: `Conference talk${t.duration ? ` · ${t.duration} min` : ''}`,
          title: t.title,
          meta: [
            t.eventCount ? `Delivered ${t.eventCount}×` : null,
            t.latestEvent?.conference ? `last at ${t.latestEvent.conference}` : null,
            !t.eventCount && t.topics?.length ? t.topics.slice(0, 3).join(' · ') : null,
          ]
            .filter(Boolean)
            .join(' · '),
        } satisfies OgCard,
      },
    })),
    ...events.map((e) => ({
      params: { slug: `events/${e.slug}` },
      props: {
        card: {
          kicker: [mdDate(e.date), e.location?.isOnline ? 'Online' : e.location?.city].filter(Boolean).join(' · '),
          title: e.title,
          meta: e.conference ? `at ${e.conference}` : undefined,
        } satisfies OgCard,
      },
    })),
    ...posts.map((p) => ({
      params: { slug: `blog/${p.slug}` },
      props: {
        card: {
          kicker: `Blog${p.estimatedReadingTime ? ` · ${p.estimatedReadingTime} min read` : ''}`,
          title: p.title,
          meta: mdDate(p.publishedAt),
        } satisfies OgCard,
      },
    })),
    ...workshops.map((w) => ({
      params: { slug: `workshops/${w.slug}` },
      props: {
        card: {
          kicker: `Workshop${w.duration ? ` · ${w.duration}` : ''}${w.level ? ` · ${w.level}` : ''}`,
          title: w.title,
          meta: 'Hands-on training — bookable for teams & conferences.',
        } satisfies OgCard,
      },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard((props as { card: OgCard }).card);
  return new Response(png, { headers: OG_HEADERS });
};
