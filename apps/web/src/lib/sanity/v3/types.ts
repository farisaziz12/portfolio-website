/**
 * Normalised V3 content shapes. Every loader in this folder returns these,
 * whether the underlying document is already V3 or still a V2 legacy shape,
 * so pages never branch on data vintage. (Speaking shapes here; writing,
 * proof and site shapes in types-site.ts.)
 */
import type { EventKind, RoleBucket, SessionRole, SessionStatus, Topic } from 'shared';

/** A Sanity image object (asset ref + hotspot/crop) with optional metadata. */
export interface SanityImage {
  _type?: 'image';
  asset?: { _ref?: string; _id?: string; url?: string };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  credit?: string;
  caption?: string;
  dimensions?: { width: number; height: number; aspectRatio: number };
  lqip?: string;
}

export interface Cta {
  label?: string;
  href?: string;
}

export interface TalkRef {
  _id: string;
  title: string;
  shortTitle?: string;
  slug: string;
  pillar?: Topic;
  summary?: string;
  duration?: number;
}

export interface WorkshopRef {
  _id: string;
  title: string;
  slug: string;
  duration?: string;
  pillar?: Topic;
}

export interface Session {
  key: string;
  role: SessionRole;
  bucket: RoleBucket;
  /** Past sessions resolve to `delivered` unless cancelled. */
  status: SessionStatus;
  title?: string;
  detail?: string;
  startsAt?: string;
  durationMinutes?: number;
  stage?: string;
  talk?: TalkRef;
  workshop?: WorkshopRef;
  recordingUrl?: string;
  recordingMinutes?: number;
  slidesUrl?: string;
  slidesNote?: string;
  repoUrl?: string;
  featured?: boolean;
  /** Synthesised from a V2 event with no sessions[]. */
  legacy?: boolean;
}

export interface EventLocation {
  venue?: string;
  city?: string;
  country?: string;
  isOnline?: boolean;
}

export interface EventEdition {
  _id: string;
  title: string;
  slug: string;
  kind?: EventKind;
  date: string;
  endDate?: string;
  timezone: string;
  location: EventLocation;
  language?: string;
  url?: string;
  description?: string;
  featured?: boolean;
  seriesName?: string;
  seriesSlug?: string;
  coverImage?: SanityImage;
  sessions: Session[];
  /** Computed in the event's own timezone. */
  isUpcoming: boolean;
  /** Distinct role buckets across sessions, in display order. */
  buckets: RoleBucket[];
}

export interface Talk {
  _id: string;
  title: string;
  shortTitle?: string;
  slug: string;
  pillar?: Topic;
  summary?: string;
  abstract?: string;
  audience?: string;
  takeaways: string[];
  tags: string[];
  duration?: number;
  durationOptions: number[];
  level?: string;
  setup?: string;
  isBookable: boolean;
  order?: number;
  version?: string;
  versionNotes?: string;
  parentId?: string;
  thumbnail?: SanityImage;
  repoUrl?: string;
  fallbackVideoUrl?: string;
  fallbackSlidesUrl?: string;
  alsoAsWorkshop?: WorkshopRef;
  relatedTalks: TalkRef[];
  seo?: Seo;
  /** Legacy homepage flag, read only as a fallback for Home → Featured. */
  legacyHomepageFeatured?: boolean;
}

/** A session of this talk (family), joined with its event. */
export interface TalkDelivery {
  session: Session;
  /** Title the talk was given under, when it differs from the version being viewed. */
  asTitle?: string;
  event: Pick<EventEdition, '_id' | 'title' | 'slug' | 'date' | 'location' | 'isUpcoming' | 'seriesName'>;
}

/** One version of a talk family (a title or abstract that changed over the years). */
export interface TalkVersion {
  _id: string;
  slug: string;
  title: string;
  version?: string;
  versionNotes?: string;
  /** The one version per family that is listed and booked. */
  isCurrent: boolean;
  isBookable: boolean;
  /** Years this version's own sessions span ("2023", "2023–2025"); empty if never delivered. */
  years: string;
  firstDelivered?: string;
  deliveredCount: number;
}

export interface TalkWithHistory extends Talk {
  /** Resolved: exactly one current version per family (explicit flag, else the newest). */
  isCurrent: boolean;
  familyId: string;
  /** Every version in the family, oldest first (a single entry when the talk never changed). */
  versions: TalkVersion[];
  deliveries: TalkDelivery[];
  deliveredCount: number;
  nextDelivery?: TalkDelivery;
  lastDelivery?: TalkDelivery;
  /** Best recording: featured session → latest delivered with a recording → fallback URL. */
  recording?: { url: string; event?: TalkDelivery['event']; minutes?: number };
  slidesUrl?: string;
}

export interface AgendaItem {
  at?: string;
  title: string;
  summary?: string;
  isBreak?: boolean;
  duration?: string;
  description?: unknown[];
}

export interface WorkshopFormat {
  label: string;
  duration?: string;
  agenda: AgendaItem[];
}

export interface Workshop {
  _id: string;
  title: string;
  slug: string;
  pillar?: Topic;
  summary?: string;
  description?: string;
  outcomes: string[];
  prerequisites: string[];
  technologies: string[];
  image?: SanityImage;
  formats: WorkshopFormat[];
  duration?: string;
  participants?: { min?: number; max?: number };
  room?: string;
  after?: string;
  relatedTalk?: TalkRef;
  isBookable: boolean;
  order?: number;
  seo?: Seo;
}

export interface WorkshopWithHistory extends Workshop {
  deliveries: TalkDelivery[];
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
}

export * from './types-site';
