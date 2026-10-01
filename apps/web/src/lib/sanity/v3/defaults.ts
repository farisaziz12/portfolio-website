/**
 * Approved V3 copy, used ONLY when the matching Sanity field is empty. The CMS
 * always wins; these keep a fresh dataset (or a CMS outage) looking finished.
 * No numbers here: counts come from data (stats.ts) or dated metrics.
 */
import type { Community, LabelledText, Profile, SpeakingFormat, TopicPillar, HomePage, SiteSettings } from './types';

export const DEFAULT_NOW_LINE = 'Software engineer · speaker · ZurichJS co-founder';

export const DEFAULT_SITE: SiteSettings = {
  siteTitle: 'Faris Aziz',
  siteUrl: 'https://faziz-dev.com',
  nowLine: DEFAULT_NOW_LINE,
  metaDescription:
    'Faris Aziz: software engineer, conference speaker and ZurichJS co-founder in Geneva. Talks and workshops on production engineering, payments at scale and technical leadership.',
  keywords: [],
  twitterHandle: 'farisaziz12',
  discoveryCallUrl: 'https://cal.com/farisaziz12/discovery-call',
  introEnabled: true,
  links: {
    linkedin: 'https://linkedin.com/in/farisaziz12',
    github: 'https://github.com/farisaziz12',
    bluesky: 'https://bsky.app/profile/farisaziz.com',
  },
};

export const DEFAULT_HOME: HomePage = {
  heroVariant: 'band',
  headline: 'I sit at the intersection of [product engineering], [monetization] and [technical leadership].',
  intro:
    'Staff engineer, conference speaker, co-founder of ZurichJS. I build the product and the checkout behind it, lead the teams that ship them, and talk about what that actually looks like.',
  primaryCta: { label: 'Invite me to speak', href: '/invite' },
  secondaryCta: { label: "Where I'll be next", href: '/events' },
  heroPhotos: [],
  featuredRefs: [],
  praiseIds: [],
  invitePanel: {
    headline: 'Invite me to your stage.',
    body: 'Talks and workshops on production engineering, payments at scale, and growing into leadership. Every talk is adapted to its audience. I reply within two days; community meetups are usually on the house.',
  },
};

export const DEFAULT_PILLARS: TopicPillar[] = [
  {
    pillar: 'engineering',
    title: 'Caching, Payloads, and Other Dark Arts',
    description: 'Data fetching at scale when everything is against you: BFF layers, payload shaping, and what to cache where.',
  },
  {
    pillar: 'payments',
    title: 'Orchestrating Millions Across the Globe: Reactive Payments at Scale',
    description: '“Just integrate Stripe” works, until it doesn’t. Multi-provider orchestration, failure modes and the UI in between.',
  },
  {
    pillar: 'careers',
    title: 'Growing into senior and lead roles early',
    description: 'Panel and talk material on taking responsibility before you feel ready.',
  },
];

export const DEFAULT_FORMATS: SpeakingFormat[] = [
  { name: 'Keynote', duration: '30–45 min', description: 'Usually about careers, community, or something that went sideways in production and what it taught me.' },
  { name: 'Talk', duration: '20–30 min', description: 'I like to pick one real example and follow it all the way through. Slides go up the same day.' },
  { name: 'Workshop', duration: '3 h or full day', description: 'We build things together. You keep the repo and resources after.' },
  { name: 'Panel · podcast', description: 'Always up for it, especially on payments, performance, leadership or community.' },
];

export const DEFAULT_RIDER: LabelledText[] = [
  { label: 'Video', body: 'USB-C preferred (HDMI works), own laptop, 16:9' },
  { label: 'Audio', body: 'Headset mic preferred; a clicker is welcome' },
  { label: 'Timing', body: '20, 30 or 45 min; Q&A on top' },
  { label: 'Recording', body: 'Yes, please share the link afterwards' },
];

export const DEFAULT_GOOD_TO_KNOW: LabelledText[] = [
  { label: 'In person', body: 'Travelling from Geneva. For conferences, I’d expect travel and accommodation to be covered.' },
  { label: 'Remote', body: 'I love podcasts and livestreams. If there’s an in-person option, I’d pick that over remote.' },
  { label: 'Fee', body: 'An honorarium is appreciated. Community events come first, fee or not.' },
  { label: 'Tech', body: 'USB-C preferred (HDMI works). A headset mic, ideally.' },
  { label: 'Lead time', body: 'Six weeks is comfortable; shorter is often fine.' },
];

export const DEFAULT_PROFILE: Profile = {
  name: 'Faris Aziz',
  pronunciation: 'FAH-riss ah-ZEEZ',
  tagline: DEFAULT_NOW_LINE,
  jobTitle: 'Staff Software Engineer',
  travelBase: 'Geneva, Switzerland',
  replyTime: 'two working days',
  links: {
    linkedin: 'https://linkedin.com/in/farisaziz12',
    bluesky: 'https://bsky.app/profile/farisaziz.com',
    twitter: 'https://x.com/farisaziz12',
    github: 'https://github.com/farisaziz12',
    youtube: 'https://www.youtube.com/@faziz-dev',
    mentorcruise: 'https://mentorcruise.com/mentor/farisaziz/',
  },
  bios: {
    short:
      'Faris Aziz is a software engineer and conference speaker based in Geneva. He works on frontend and payment systems at scale, co-founded ZurichJS, and chairs ZurichJS Conf.',
    medium:
      'Faris Aziz is a software engineer and conference speaker based in Geneva. He builds frontend and payment systems for millions of users and speaks about what production teaches you: caching under bad conditions, payments that must not fail, resilient React, and growing into leadership early. He co-founded ZurichJS in 2024 and chairs ZurichJS Conf, where he also built the platform behind tickets, the call for papers and sponsors.',
    long:
      'Faris Aziz is a software engineer and conference speaker based in Geneva. He builds frontend and payment systems for millions of users and speaks about what production teaches you: caching under bad conditions, payments that must not fail, resilient React, and growing into leadership early. His talks and workshops have run at conferences across Europe, the US and Asia, including React Summit US, CityJS and WhatTheStack. In 2024 he co-founded ZurichJS, which he leads; the community now spans thousands of members and hosts a two-day conference, ZurichJS Conf, for which Faris built the ticketing, CFP and sponsor platform. He came into engineering by a non-traditional route and is a builder at heart.',
  },
  photos: [],
  topicPillars: DEFAULT_PILLARS,
  formats: DEFAULT_FORMATS,
  rider: DEFAULT_RIDER,
  goodToKnow: DEFAULT_GOOD_TO_KNOW,
  avatarNote:
    "Happy for you to use the cartoon me on your event graphics. Just ask and I'll send the files. Please keep it as it is: no flipping, recolouring or extra logos. The ZurichJS logo on the shirt stays.",
};

export const DEFAULT_ABOUT = {
  kicker: 'About · Geneva',
  title: 'A builder at heart. Products, payments and a JavaScript community.',
  intro:
    "By day I build frontend and payment systems for products used by millions, and lead the teams that ship them. The rest of the time I'm on stage talking about it, or running ZurichJS.",
  inShort: [
    { label: 'Work', body: 'Frontend and payment systems at scale' },
    { label: 'Speak', body: 'Production, payments, careers, community' },
    { label: 'Build', body: 'ZurichJS · the Conf platform · a Stripe Raycast extension' },
  ] as LabelledText[],
};

export const DEFAULT_SERVICES_INTRO =
  'I’m always up for figuring out how we could work together, even if it doesn’t fit neatly below. And if I’m not the right person for it, I’ll tell you. A sentence is enough to start.';

/**
 * ZurichJS until a `community` document exists in Sanity (the V3 migration
 * doesn't create one). Facts only from the approved bios; no numbers, no
 * awards, no aftermovie: those come from the CMS when recorded.
 */
export const DEFAULT_COMMUNITY: Community = {
  _id: 'default-zurichjs',
  name: 'ZurichJS',
  slug: 'zurichjs',
  role: 'Co-founder and lead',
  founded: 2024,
  city: 'Zurich',
  url: 'https://zurichjs.com',
  headline: 'I co-founded and lead ZurichJS.',
  summary:
    'I co-founded ZurichJS in 2024 and still run it. It has grown to thousands of members and a two-day conference, ZurichJS Conf, which I chair. I also built the platform behind its tickets, call for papers and sponsors.',
  pillars: [],
  metrics: [],
  recognition: [],
  photos: [],
};
