/** Writing, proof and site shapes (see types.ts for speaking). */
import type { AvailabilityStatus, MetricDomain, PraisePlatform, PraiseTopic, PublicationFormat, ServiceType, Topic } from 'shared';
import type { SanityImage, TalkRef, TalkWithHistory, WorkshopRef, Cta } from './types';

export interface WritingItem {
  _id: string;
  kind: 'post' | 'external';
  format: PublicationFormat;
  topic?: Topic;
  title: string;
  date: string;
  /** "On this site", "PodRocket", "iJS". */
  source: string;
  sourceNote?: string;
  href: string;
  isInternal: boolean;
  minutes?: number;
  excerpt?: string;
  image?: SanityImage;
  hasCorrections?: boolean;
  featured?: boolean;
  relatedTalk?: TalkRef;
}

export interface PraiseAuthor {
  name: string;
  handle?: string;
  headline?: string;
  image?: SanityImage;
}

export interface Praise {
  _id: string;
  quote: string;
  pullQuote?: string;
  platform: PraisePlatform;
  url?: string;
  date?: string;
  author: PraiseAuthor;
  topic: PraiseTopic;
  /** Resolved small label: "On the caching talk", "On mentoring". */
  label: string;
  talk?: TalkRef;
  workshop?: WorkshopRef;
  event?: { _id: string; title: string; slug: string };
  featured: boolean;
  order?: number;
  legacy?: boolean;
}

export interface Metric {
  _id: string;
  value: string;
  label: string;
  qualifier?: string;
  asOf?: string;
  period?: string;
  /** "Jul 2026" or the period label. */
  dateLabel?: string;
  definition?: string;
  context?: string;
  domain: MetricDomain;
  sourceUrl?: string;
  order?: number;
  legacy?: boolean;
}

export interface CommunityPillar {
  kicker?: string;
  title?: string;
  body?: string;
  link?: Cta;
}

export interface Award {
  title: string;
  issuer?: string;
  year?: number;
  url?: string;
}

export interface Community {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  founded?: number;
  city?: string;
  url?: string;
  headline?: string;
  caseStudyHeadline?: string;
  summary?: string;
  pillars: CommunityPillar[];
  metrics: Metric[];
  recognition: Award[];
  aftermovie?: {
    title?: string;
    caption?: string;
    url?: string;
    published: boolean;
    credit?: string;
    poster?: SanityImage;
  };
  photos: SanityImage[];
  platformProject?: { title: string; slug: string };
}

export interface LabelledText {
  label: string;
  body: string;
}

export interface PressPhoto extends SanityImage {
  _key: string;
  label?: string;
  tag?: string;
  downloadable?: boolean;
}

export interface TopicPillar {
  pillar?: Topic;
  title: string;
  description?: string;
  talk?: TalkRef;
}

export interface SpeakingFormat {
  name: string;
  duration?: string;
  description?: string;
}

export interface Profile {
  name: string;
  pronunciation?: string;
  tagline: string;
  travelBase: string;
  replyTime: string;
  links: { linkedin?: string; bluesky?: string; twitter?: string; github?: string; youtube?: string };
  bios: { short?: string; medium?: string; long?: string; updatedAt?: string };
  photos: PressPhoto[];
  topicPillars: TopicPillar[];
  formats: SpeakingFormat[];
  rider: LabelledText[];
  goodToKnow: LabelledText[];
  avatarNote?: string;
}

export interface AvailabilityMonth {
  /** YYYY-MM */
  month: string;
  status: AvailabilityStatus;
  note?: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteUrl: string;
  nowLine: string;
  metaDescription?: string;
  keywords: string[];
  ogImage?: SanityImage;
  twitterHandle?: string;
  discoveryCallUrl: string;
  introEnabled: boolean;
  links: { linkedin?: string; github?: string; youtube?: string; bluesky?: string };
}

export type FeaturedItem =
  | { kind: 'talk'; talk: TalkWithHistory }
  | { kind: 'writing'; item: WritingItem };

export interface HomePage {
  heroVariant: 'band' | 'fullbleed';
  kicker?: string;
  headline: string;
  intro: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  heroPhotos: SanityImage[];
  featuredRefs: { _type: string; _id: string }[];
  featuredQuoteId?: string;
  praiseIds: string[];
  communityId?: string;
  invitePanel: { headline: string; body: string };
}

export interface ServiceOffer {
  _id: string;
  title: string;
  slug: string;
  serviceType: ServiceType;
  shortDescription?: string;
  audience?: string;
  reachOutIf?: string;
  youGet?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  bestFor?: string;
  outcomes: string[];
  engagementFormat?: string;
  showPricing?: boolean;
  priceFrom?: number;
  priceCurrency?: string;
  priceUnit?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  featured?: boolean;
  order?: number;
}

export interface CareerEntry {
  _id: string;
  name: string;
  role?: string;
  periodLabel?: string;
  period?: string;
  description?: string;
  highlight?: string;
  url?: string;
  order?: number;
}

export interface SpeakingStats {
  /** Delivered talk sessions (speaker/keynote/lightning), past, not cancelled. */
  talksDelivered: number;
  workshopsDelivered: number;
  panels: number;
  hosted: number;
  attended: number;
  /** Countries where I spoke, ran a workshop or hosted (attending excluded). */
  countries: number;
  cities: number;
  countryList: string[];
  podcasts: number;
  catalogueTalks: number;
  catalogueWorkshops: number;
  upcoming: number;
  /** Total event records (for "N records total"). */
  eventRecords: number;
  /** ISO date the counts were computed. */
  asOf: string;
  /** True when counts come from the hardcoded fallback. */
  fallback: boolean;
}
