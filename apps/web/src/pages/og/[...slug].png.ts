import type { APIRoute } from 'astro';
import { TOPICS, titleFor } from 'shared';
import { renderOgCard, OG_HEADERS, type OgCard } from '../../lib/og';
import { lengthRange } from '../../lib/workshops-view';
import {
  getAllEvents,
  getCatalogueTalks,
  getWorkshops,
  getWriting,
  getSpeakingStats,
  getSiteSettings,
  getMetrics,
  getProfile,
  basedIn,
  eventPlace,
  fullDate,
  monthYear,
  primarySession,
  sessionLine,
} from '../../lib/sanity/v3';

/**
 * One OG card per public page. Static pages are listed here; talks, events,
 * posts and workshops get a card each. Every page passes `image` as
 * `/og/<slug>.png` to BaseLayout.
 */
export async function getStaticPaths() {
  const [talks, events, writing, workshops, stats, settings, metrics, profile] = await Promise.all([
    getCatalogueTalks(),
    getAllEvents(),
    getWriting(),
    getWorkshops(),
    getSpeakingStats(),
    getSiteSettings(),
    getMetrics(),
    getProfile(),
  ]);
  // "3 h to full day" → "3 hours to a full day"
  const range = lengthRange(workshops.filter((w) => w.isBookable)).replace(/ h\b/g, ' hours').replace('to full day', 'to a full day');
  const byline = settings.nowLine;
  const members = metrics.find((m) => m.domain === 'community');

  const statics: Record<string, OgCard> = {
    default: { kicker: byline, title: 'Faris Aziz', meta: 'Talks and workshops on production engineering, payments at scale and technical leadership.' },
    home: {
      kicker: byline,
      title: 'Product engineering, monetization and technical leadership.',
      mark: String(stats.talksDelivered),
      markLabel: 'talks delivered',
    },
    speaking: {
      kicker: 'Speaking',
      title: 'Production stories, told from the inside.',
      meta: `${stats.talksDelivered} talks delivered in ${stats.countries} countries. Booking now.`,
      mark: String(stats.talksDelivered),
      markLabel: 'talks delivered',
    },
    talks: { kicker: 'Speaking · Talk catalogue', title: `${stats.catalogueTalks} talks, ready to book.`, meta: 'Premise, audience, length and a recording where one exists.', mark: String(stats.catalogueTalks) },
    events: { kicker: 'Speaking · Schedule', title: "Where I'll be, and where I've been.", meta: `${stats.upcoming} upcoming · ${stats.countries} countries`, mark: String(stats.countries), markLabel: 'countries' },
    workshops: { kicker: 'Speaking · Workshops', title: range ? `Hands-on, ${range}.` : 'Hands-on, and you keep the repo.', meta: 'You keep the repo and the resources after.' },
    invite: { kicker: 'Invite me', title: 'What did you have in mind?', meta: `Conferences, meetups, podcasts, workshops, panels. I reply within ${profile.replyTime}.` },
    'press-kit': { kicker: 'Speaking · Press kit', title: 'Everything an organiser needs, on one page.', meta: 'Bios, photos and the practical bits for your programme.' },
    community: {
      kicker: 'Community',
      title: 'I host meetups, teach at them, and build the systems behind them.',
      ...(members ? { mark: members.value, markLabel: members.label } : {}),
    },
    blog: { kicker: 'Writing & conversations', title: "What I've written, and what I've said out loud.", meta: 'Posts, guest articles, podcasts and video in one timeline.' },
    about: { kicker: `About · ${basedIn(profile.travelBase).city}`, title: 'A builder at heart. Products, payments and a JavaScript community.', meta: byline },
    impact: { kicker: 'Track record', title: 'The work, the stages, the community.', meta: 'Everything dated and defined.', mark: String(stats.countries), markLabel: 'countries spoken in' },
    appreciation: { kicker: 'What people say', title: 'What people have said about Faris.', meta: 'Every card links to the original post.' },
    services: { kicker: 'Services', title: 'How I can help.', meta: 'Events: speaking and workshops · Advisory · Mentorship. A sentence is enough to start.' },
    mentorship: { kicker: 'Mentorship', title: 'Getting to senior, to lead, or onto a stage.', meta: 'One-to-one, every two to four weeks.' },
    contact: { kicker: 'Contact', title: "Hey, what's on your mind?", meta: 'Invite me to speak, or just drop me a message.' },
    projects: { kicker: 'About · Projects', title: 'Things I built.', meta: 'Open source and production systems.' },
    gallery: { kicker: 'About · Gallery', title: 'Stages, hallways, and the bits in between.', meta: 'Photos from events, credited.' },
  };

  const cards: { params: { slug: string }; props: { card: OgCard } }[] = Object.entries(statics).map(([slug, card]) => ({
    params: { slug },
    props: { card: { byline, ...card } },
  }));

  talks.forEach((t, i) => {
    const kicker = ['Talk', titleFor(TOPICS, t.pillar) || null, t.duration ? `${t.duration} min` : null].filter(Boolean).join(' · ');
    const meta = t.deliveredCount
      ? `Delivered ${t.deliveredCount}×${t.lastDelivery ? ` · last at ${t.lastDelivery.event.title}, ${monthYear(t.lastDelivery.event.date)}` : ''}`
      : t.summary;
    cards.push({ params: { slug: `talks/${t.slug}` }, props: { card: { byline, kicker, title: t.title, meta, mark: String(i + 1).padStart(2, '0') } } });
  });

  for (const e of events) {
    const s = primarySession(e);
    cards.push({
      params: { slug: `events/${e.slug}` },
      props: {
        card: {
          byline,
          kicker: [fullDate(e.date), eventPlace(e), e.isUpcoming ? 'Upcoming' : null].filter(Boolean).join(' · '),
          title: e.title,
          meta: s ? sessionLine(s) : e.seriesName,
          mark: String(Number(e.date.slice(8, 10))),
          markLabel: monthYear(e.date),
        },
      },
    });
  }

  for (const w of writing.filter((x) => x.isInternal)) {
    cards.push({
      params: { slug: `blog/${w.href.replace('/blog/', '')}` },
      props: {
        card: {
          byline,
          kicker: ['Writing', titleFor(TOPICS, w.topic) || null, w.minutes ? `${w.minutes} min read` : null].filter(Boolean).join(' · '),
          title: w.title,
          meta: fullDate(w.date),
          mark: 'Aa',
        },
      },
    });
  }

  for (const w of workshops) {
    cards.push({
      params: { slug: `workshops/${w.slug}` },
      props: {
        card: {
          byline,
          kicker: ['Workshop', titleFor(TOPICS, w.pillar) || null, w.duration].filter(Boolean).join(' · '),
          title: w.title,
          meta: w.summary || 'Hands-on training for conferences and teams.',
        },
      },
    });
  }

  return cards;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgCard((props as { card: OgCard }).card);
  return new Response(png, { headers: OG_HEADERS });
};
