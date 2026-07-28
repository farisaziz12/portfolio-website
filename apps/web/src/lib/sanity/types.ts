/**
 * Shared shapes for documents returned by the GROQ queries in ./queries.ts.
 *
 * These are the superset interfaces — every field a query can project.
 * Pages that fetch narrower projections still type against these (the extra
 * fields are optional), so a schema change only needs to be reflected here.
 */

/** `serviceOffer` documents — consulting packages & mentorship programs. */
export interface ServiceOffer {
  _id: string;
  title: string;
  slug: string;
  serviceType: 'consulting' | 'mentorship';
  shortDescription: string;
  bestFor?: string;
  outcomes?: string[];
  engagementFormat?: string;
  pricingType?: 'fixed' | 'hourly' | 'retainer' | 'custom';
  price?: number;
  priceCurrency?: string;
  priceUnit?: string;
  bookingUrl: string;
  featured?: boolean;
  order?: number;
}

/** `socialPost` documents — LinkedIn/X/Bluesky mentions shown on social walls. */
export interface SocialPost {
  _id: string;
  url: string;
  platform: 'linkedin' | 'twitter' | 'bluesky';
  author: string;
  authorHandle?: string;
  authorImage?: unknown;
  authorRole?: string;
  postImage?: unknown;
  content: string;
  tweetId?: string;
  postDate?: string;
  relatedTalk?: { title: string; slug: string };
  relatedEvent?: { title: string; slug: string; conference: string };
}

/** Result shape of `quarterActivityQuery` — one quarter of activity across content types. */
export interface QuarterActivityEvent {
  _id: string;
  title: string;
  slug: string;
  type?: string;
  conference?: string;
  date: string;
  location?: { city?: string; country?: string; isOnline?: boolean };
  videoUrl?: string;
  featured?: boolean;
}

export interface QuarterActivityExternalPost {
  _id: string;
  title: string;
  url: string;
  type?: string;
  publishedAt: string;
  source?: string;
}

export interface QuarterActivityBlogPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  category?: string;
  estimatedReadingTime?: number;
}

export interface QuarterActivity {
  events: QuarterActivityEvent[];
  external: QuarterActivityExternalPost[];
  blogs: QuarterActivityBlogPost[];
}
