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

/** `socialPost` documents — LinkedIn/Twitter mentions shown on social walls. */
export interface SocialPost {
  _id: string;
  url: string;
  platform: 'linkedin' | 'twitter';
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
