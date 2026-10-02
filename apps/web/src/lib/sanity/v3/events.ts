/**
 * Events = dated editions with sessions. Reads V3 `sessions[]` and falls back
 * to a single synthesised session for V2 events (`type` + `talk` + `links`),
 * so the site works before, during and after the migration.
 */
import groq from 'groq';
import {
  LEGACY_EVENT_TYPE_ROLE,
  ROLE_BUCKET,
  ROLE_BUCKETS,
  SESSION_ROLES,
  type RoleBucket,
  type SessionRole,
  type SessionStatus,
} from 'shared';
import { endOfLocalDay, isUpcoming } from './dates';
import { load, memo, IMAGE, TALK_REF, WORKSHOP_REF } from './fetch';
import type { EventEdition, Session } from './types';

const SESSION_FIELDS = `
  _key, role, status, title, detail, startsAt, durationMinutes, stage,
  "recordingUrl": recording.url, "recordingMinutes": recording.durationMinutes,
  slidesUrl, slidesNote, repoUrl, featured,
  "talk": talk->${TALK_REF},
  "workshop": workshop->${WORKSHOP_REF}
`;

/** One projection for every event query. */
export const EVENT_PROJECTION = `{
  _id, title, "slug": slug.current, kind, type, date, endDate, timezone, language, description, featured,
  "location": location{ venue, city, country, isOnline },
  "url": coalesce(url, links.eventUrl),
  "seriesName": coalesce(series->name, conference),
  "seriesSlug": series->slug.current,
  "coverImage": coverImage${IMAGE},
  "sessions": select(
    count(sessions) > 0 => sessions[]{ ${SESSION_FIELDS} },
    defined(type) || defined(talk) || defined(workshop) => [{
      "_key": "legacy", "legacy": true, "legacyType": type,
      "recordingUrl": links.videoUrl, "slidesUrl": links.slidesUrl,
      "talk": talk->${TALK_REF},
      "workshop": workshop->${WORKSHOP_REF}
    }],
    []
  )
}`;

export const allEventsQuery = groq`*[_type == "event" && defined(slug.current) && defined(date)] | order(date desc) ${EVENT_PROJECTION}`;

interface RawSession {
  _key?: string;
  role?: string;
  legacy?: boolean;
  legacyType?: string;
  status?: SessionStatus;
  title?: string;
  detail?: string;
  startsAt?: string;
  durationMinutes?: number;
  stage?: string;
  recordingUrl?: string;
  recordingMinutes?: number;
  slidesUrl?: string;
  slidesNote?: string;
  repoUrl?: string;
  featured?: boolean;
  talk?: Session['talk'] | null;
  workshop?: Session['workshop'] | null;
}

interface RawEvent extends Omit<EventEdition, 'sessions' | 'isUpcoming' | 'endsAt' | 'buckets' | 'timezone' | 'location'> {
  timezone?: string;
  type?: string;
  location?: EventEdition['location'] | null;
  sessions?: RawSession[] | null;
}

const KNOWN_ROLES = new Set<string>(SESSION_ROLES.map((r) => r.value));

function resolveRole(raw: RawSession): SessionRole {
  if (raw.role && KNOWN_ROLES.has(raw.role)) return raw.role as SessionRole;
  const legacy = raw.legacyType ? LEGACY_EVENT_TYPE_ROLE[raw.legacyType] : undefined;
  if (legacy) return raw.workshop && !raw.talk ? 'workshop' : legacy;
  return raw.workshop && !raw.talk ? 'workshop' : 'speaker';
}

export function normalizeEvent(raw: RawEvent, now = Date.now()): EventEdition {
  const timezone = raw.timezone || 'Europe/Zurich';
  const upcoming = isUpcoming(raw.date, raw.endDate, timezone, now);
  const sessions: Session[] = (raw.sessions ?? []).map((s, i) => {
    const role = resolveRole(s);
    const status: SessionStatus = s.status === 'cancelled' ? 'cancelled' : upcoming ? (s.status === 'tba' ? 'tba' : 'confirmed') : 'delivered';
    return {
      key: s._key || `s${i}`,
      role,
      bucket: ROLE_BUCKET[role],
      status,
      title: s.title,
      detail: s.detail,
      startsAt: s.startsAt,
      durationMinutes: s.durationMinutes ?? s.talk?.duration,
      stage: s.stage,
      talk: s.talk ?? undefined,
      workshop: s.workshop ?? undefined,
      recordingUrl: s.recordingUrl,
      recordingMinutes: s.recordingMinutes,
      slidesUrl: s.slidesUrl,
      slidesNote: s.slidesNote,
      repoUrl: s.repoUrl,
      featured: s.featured,
      legacy: s.legacy,
    };
  });
  const order = ROLE_BUCKETS.map((b) => b.value);
  const buckets = [...new Set(sessions.filter((s) => s.status !== 'cancelled').map((s) => s.bucket))].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    kind: raw.kind ?? (raw.type === 'meetup' || raw.type === 'conference' || raw.type === 'podcast' ? raw.type : undefined),
    date: raw.date,
    endDate: raw.endDate,
    timezone,
    location: raw.location ?? {},
    language: raw.language,
    url: raw.url,
    description: raw.description,
    featured: raw.featured,
    seriesName: raw.seriesName,
    seriesSlug: raw.seriesSlug,
    coverImage: raw.coverImage,
    sessions,
    isUpcoming: upcoming,
    endsAt: raw.date ? new Date(endOfLocalDay(raw.endDate || raw.date, timezone)).toISOString() : '',
    buckets,
  };
}

/** Every event, newest first, normalised. Memoised per build / ISR window. */
export function getAllEvents(): Promise<EventEdition[]> {
  return memo('events:all', async () => {
    const raw = await load<RawEvent[]>(allEventsQuery, []);
    const now = Date.now();
    return raw.filter((e) => e?.slug && e?.date).map((e) => normalizeEvent(e, now));
  });
}

export async function getUpcomingEvents(): Promise<EventEdition[]> {
  const all = await getAllEvents();
  // Upcoming ascending; attending-only appearances aren't "where I'll be" for organisers.
  return all.filter((e) => e.isUpcoming && e.buckets.some((b) => b !== 'attended')).reverse();
}

export async function getPastEvents(): Promise<EventEdition[]> {
  return (await getAllEvents()).filter((e) => !e.isUpcoming);
}

export async function getEventBySlug(slug: string): Promise<EventEdition | undefined> {
  return (await getAllEvents()).find((e) => e.slug === slug);
}

export function eventHasBucket(e: EventEdition, bucket: RoleBucket): boolean {
  return e.buckets.includes(bucket);
}

/** "Talk: Building Resilient UIs with React", "Chair · host · platform". */
export function sessionLine(s: Session): string {
  if (s.title) return s.title;
  if (s.talk) return `${s.role === 'panel' ? 'Panel' : s.role === 'keynote' ? 'Keynote' : 'Talk'}: ${s.talk.title}`;
  if (s.workshop) return `${s.detail || 'Workshop'}: ${s.workshop.title}`;
  return s.detail || SESSION_ROLES.find((r) => r.value === s.role)?.title || '';
}

/** Primary session for one-line summaries (talks before hosting before attending). */
export function primarySession(e: EventEdition): Session | undefined {
  const order = ROLE_BUCKETS.map((b) => b.value);
  return [...e.sessions].filter((s) => s.status !== 'cancelled').sort((a, b) => order.indexOf(a.bucket) - order.indexOf(b.bucket))[0];
}

export function eventPlace(e: Pick<EventEdition, 'location'>, opts: { venue?: boolean } = {}): string {
  const l = e.location;
  if (l.isOnline) return 'Online';
  return [opts.venue ? l.venue : null, l.city, l.country].filter(Boolean).join(', ');
}
