import type { APIRoute } from 'astro';
import { sanityFetch, urlFor } from '../../lib/sanity/client';
import {
  allTalksQuery,
  allEventsQuery,
  allBlogPostsQuery,
  allWorkshopsQuery,
  speakingStatsQuery,
  galleryImagesQuery,
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
  const [talks, events, posts, workshops, stats, galleryImages] = await Promise.all([
    sanityFetch<Talk[]>(allTalksQuery).catch(() => []),
    sanityFetch<EventItem[]>(allEventsQuery).catch(() => []),
    sanityFetch<BlogPost[]>(allBlogPostsQuery).catch(() => []),
    sanityFetch<Workshop[]>(allWorkshopsQuery).catch(() => []),
    sanityFetch<SpeakingStats>(speakingStatsQuery).catch(() => ({ ...FALLBACK_SPEAKER_STATS })),
    sanityFetch<unknown[]>(galleryImagesQuery).catch(() => []),
  ]);

  // Footer avatar: a random gallery photo per card, square-cropped by the
  // Sanity CDN at 2× the rendered 52px box. Undefined → "FA" monogram fallback.
  const randomAvatar = (): string | undefined => {
    if (!galleryImages.length) return undefined;
    const image = galleryImages[Math.floor(Math.random() * galleryImages.length)];
    try {
      return urlFor(image as Parameters<typeof urlFor>[0])
        .width(104)
        .height(104)
        .fit('crop')
        .quality(85)
        .format('jpg')
        .url();
    } catch {
      return undefined;
    }
  };

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
      kicker: 'Invite me to speak',
      title: 'Invite me to your event.',
      meta: 'Keynotes, talks, panels & workshops — tailored to your audience. Replies within two days.',
    },
    'press-kit': {
      kicker: 'Speaker press kit',
      title: 'Bios, headshots & practical details.',
      meta: 'Copy-paste bios in three lengths, high-res headshots in four crops, and everything worth knowing before the event.',
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
    gallery: {
      kicker: 'Photo gallery',
      title: 'Stages, hallways, and the bits in between.',
      meta: 'Event-by-event photo walkthrough from conferences around the world.',
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
    ...Object.entries(staticCards).map(([slug, card]) => ({
      params: { slug },
      props: { card: { ...card, avatarUrl: randomAvatar() } },
    })),
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
          avatarUrl: randomAvatar(),
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
          avatarUrl: randomAvatar(),
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
          avatarUrl: randomAvatar(),
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
          avatarUrl: randomAvatar(),
        } satisfies OgCard,
      },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard((props as { card: OgCard }).card);
  return new Response(png, { headers: OG_HEADERS });
};
