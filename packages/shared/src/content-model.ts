/**
 * Content-model vocabulary shared by the Studio (option lists, validation)
 * and the site (labels, filters, counting rules). Change a list HERE and both
 * sides stay in sync. Values are stored in Sanity, so never rename a `value` —
 * add a new one and migrate instead.
 */

export interface Option<V extends string = string> {
  value: V;
  title: string;
}

// ─── Sessions: what I did at an event ────────────────────────────────────

/** A session's role at an event. Counting rules live in ROLE_BUCKET. */
export const SESSION_ROLES = [
  { value: 'speaker', title: 'Speaker (talk)' },
  { value: 'keynote', title: 'Keynote' },
  { value: 'lightning', title: 'Lightning talk' },
  { value: 'workshop', title: 'Workshop / training' },
  { value: 'panel', title: 'Panellist' },
  { value: 'host', title: 'Host / MC' },
  { value: 'organizer', title: 'Organiser / chair' },
  { value: 'judge', title: 'Judge' },
  { value: 'mentor', title: 'Mentor' },
  { value: 'guest', title: 'Podcast / livestream guest' },
  { value: 'attendee', title: 'Attendee' },
] as const satisfies readonly Option[];

export type SessionRole = (typeof SESSION_ROLES)[number]['value'];

/**
 * The four public filter buckets on /events. "Talks delivered" counts only
 * the `spoke` bucket; hosting and attending never inflate it.
 */
export type RoleBucket = 'spoke' | 'workshop' | 'hosted' | 'attended';

export const ROLE_BUCKET: Record<SessionRole, RoleBucket> = {
  speaker: 'spoke',
  keynote: 'spoke',
  lightning: 'spoke',
  panel: 'spoke',
  guest: 'spoke',
  workshop: 'workshop',
  host: 'hosted',
  organizer: 'hosted',
  judge: 'hosted',
  mentor: 'hosted',
  attendee: 'attended',
};

export const ROLE_BUCKETS: { value: RoleBucket; title: string; badge: string }[] = [
  { value: 'spoke', title: 'Spoke', badge: 'Spoke' },
  { value: 'workshop', title: 'Workshop', badge: 'Workshop' },
  { value: 'hosted', title: 'Hosted', badge: 'Hosted' },
  { value: 'attended', title: 'Attended', badge: 'Attended' },
];

/** Roles that count as a delivered talk (the "44 talks delivered" number). */
export const TALK_DELIVERY_ROLES: SessionRole[] = ['speaker', 'keynote', 'lightning'];

export const SESSION_STATUSES = [
  { value: 'confirmed', title: 'Confirmed' },
  { value: 'tba', title: 'Time & stage TBA' },
  { value: 'delivered', title: 'Delivered' },
  { value: 'cancelled', title: 'Cancelled' },
] as const satisfies readonly Option[];

export type SessionStatus = (typeof SESSION_STATUSES)[number]['value'];

// ─── Events ───────────────────────────────────────────────────────────────

export const EVENT_KINDS = [
  { value: 'conference', title: 'Conference' },
  { value: 'meetup', title: 'Meetup' },
  { value: 'workshop', title: 'Workshop day / training' },
  { value: 'podcast', title: 'Podcast' },
  { value: 'livestream', title: 'Livestream / webinar' },
  { value: 'company', title: 'Company / private event' },
  { value: 'awards', title: 'Awards / community' },
] as const satisfies readonly Option[];

export type EventKind = (typeof EVENT_KINDS)[number]['value'];

/** Legacy `event.type` → session role, used until every event has sessions[]. */
export const LEGACY_EVENT_TYPE_ROLE: Record<string, SessionRole> = {
  conference: 'speaker',
  meetup: 'speaker',
  webinar: 'speaker',
  workshop: 'workshop',
  panel: 'panel',
  podcast: 'guest',
  hosting: 'host',
  judging: 'judge',
  mentoring: 'mentor',
  attending: 'attendee',
};

// ─── Topics (one list for talks, writing, praise) ─────────────────────────

/** Topic pillars, shown as "Things I talk about" and as Writing filters. */
export const TOPICS = [
  { value: 'engineering', title: 'Engineering in production' },
  { value: 'payments', title: 'Payments & scale' },
  { value: 'careers', title: 'Careers & leadership' },
  { value: 'community', title: 'Community' },
] as const satisfies readonly Option[];

export type Topic = (typeof TOPICS)[number]['value'];

/** Short labels for filter pills. */
export const TOPIC_SHORT: Record<Topic, string> = {
  engineering: 'Engineering',
  payments: 'Payments',
  careers: 'Careers',
  community: 'Community',
};

// ─── Writing & conversations ──────────────────────────────────────────────

export const PUBLICATION_FORMATS = [
  { value: 'article', title: 'Article (written)' },
  { value: 'podcast', title: 'Podcast episode' },
  { value: 'video', title: 'Video / livestream' },
] as const satisfies readonly Option[];

export type PublicationFormat = (typeof PUBLICATION_FORMATS)[number]['value'];

/** Legacy externalPost.type → format. */
export const LEGACY_EXTERNAL_TYPE_FORMAT: Record<string, PublicationFormat> = {
  article: 'article',
  interview: 'article',
  podcast: 'podcast',
  panel: 'video',
  video: 'video',
};

// ─── Praise ───────────────────────────────────────────────────────────────

export const PRAISE_PLATFORMS = [
  { value: 'linkedin', title: 'LinkedIn' },
  { value: 'x', title: 'X' },
  { value: 'bluesky', title: 'Bluesky' },
  { value: 'mentorcruise', title: 'MentorCruise' },
  { value: 'direct', title: 'Direct (email, form, in person)' },
] as const satisfies readonly Option[];

export type PraisePlatform = (typeof PRAISE_PLATFORMS)[number]['value'];

export const PRAISE_TOPICS = [
  { value: 'talk', title: 'A talk' },
  { value: 'workshop', title: 'A workshop' },
  { value: 'stage', title: 'On stage (general speaking)' },
  { value: 'mentoring', title: 'Mentoring' },
  { value: 'community', title: 'Community / ZurichJS' },
  { value: 'work', title: 'Working together' },
] as const satisfies readonly Option[];

export type PraiseTopic = (typeof PRAISE_TOPICS)[number]['value'];

// ─── Metrics ──────────────────────────────────────────────────────────────

export const METRIC_DOMAINS = [
  { value: 'engineering', title: 'Engineering' },
  { value: 'community', title: 'Community' },
  { value: 'speaking', title: 'Speaking' },
  { value: 'career', title: 'Career' },
] as const satisfies readonly Option[];

export type MetricDomain = (typeof METRIC_DOMAINS)[number]['value'];

/** What an engineering number is about: the filter on /impact. */
export const METRIC_AREAS = [
  { value: 'payments', title: 'Payments & checkout' },
  { value: 'growth', title: 'Revenue & growth' },
  { value: 'performance', title: 'Performance' },
  { value: 'reliability', title: 'Reliability' },
  { value: 'product', title: 'Product & UX' },
  { value: 'platform', title: 'Platform & DX' },
  { value: 'leadership', title: 'Team & leadership' },
] as const satisfies readonly Option[];

export type MetricArea = (typeof METRIC_AREAS)[number]['value'];

/** V2 impactMetricV2.domain → V3 area (engineering numbers only). */
export const LEGACY_METRIC_AREA: Record<string, MetricArea> = { product: 'product', leadership: 'leadership' };

/** Only `approved` metrics render publicly. */
export const METRIC_STATUSES = [
  { value: 'draft', title: 'Draft (hidden)' },
  { value: 'needs-ok', title: 'Needs final OK (hidden)' },
  { value: 'approved', title: 'Approved for public use' },
] as const satisfies readonly Option[];

// ─── Availability ─────────────────────────────────────────────────────────

export const AVAILABILITY_STATUSES = [
  { value: 'open', title: 'Open' },
  { value: 'some', title: 'Some dates taken' },
  { value: 'limited', title: 'Limited' },
] as const satisfies readonly Option[];

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number]['value'];

// ─── Services ─────────────────────────────────────────────────────────────

export const SERVICE_TYPES = [
  { value: 'events', title: 'Events: speaking & workshops' },
  { value: 'advisory', title: 'Advisory' },
  { value: 'mentorship', title: 'Mentorship' },
] as const satisfies readonly Option[];

export type ServiceType = (typeof SERVICE_TYPES)[number]['value'];

export function titleFor<V extends string>(list: readonly Option<V>[], value?: string | null): string {
  return list.find((o) => o.value === value)?.title ?? value ?? '';
}

// ─── Legacy metric display ──────────────────────────────────────────────────

/**
 * Display string for a V2 impactMetricV2 number: headlineNumber 4.5 + unit "k"
 * → "4.5K". Used by the site's legacy fallback and the V3 migration, so a
 * migrated metric reads exactly like the old one did.
 */
export function formatLegacyMetric(m: { headlineNumber?: number | string | null; prefix?: string | null; unit?: string | null }): string {
  const raw = m.headlineNumber;
  if (raw === undefined || raw === null || raw === '') return '';
  const n = typeof raw === 'number' ? raw.toLocaleString('en-US') : String(raw);
  const prefix = m.prefix ?? '';
  switch (m.unit) {
    case 'k': return `${prefix}${n}K`;
    case 'm': return `${prefix}${n}M`;
    case 'percent': return `${prefix}${n}%`;
    case 'x': case 'multiplier': return `${prefix}${n}×`;
    case 'plus': return `${prefix}${n}+`;
    case 'chf': return `${prefix || 'CHF '}${n}`;
    case 'eur': return `${prefix || '€'}${n}`;
    case 'usd': return `${prefix || '$'}${n}`;
    case 'rating': return `${prefix}${n}/5`;
    default: return `${prefix}${n}`;
  }
}
