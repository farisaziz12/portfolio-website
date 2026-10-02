/**
 * Display helpers shared by /events, /events/[slug], their .md mirrors and
 * the .ics endpoint, so the HTML, the markdown and the calendar file all
 * describe an edition and its sessions with the same words.
 */
import { EVENT_KINDS, ROLE_BUCKETS, titleFor, type RoleBucket, type SessionRole } from 'shared';
import { eventPlace, localTime, primarySession, type EventEdition, type Session } from './sanity/v3';
import { countryCode, getCountryFlag } from './flags';

/** "Conference", "Meetup", "Workshop day" (short, for kickers). */
export function kindLabel(e: Pick<EventEdition, 'kind'>): string {
  return titleFor(EVENT_KINDS, e.kind).split(' / ')[0] || 'Event';
}

/** What I did, as a kicker word: "Speaking", "Workshop", "Hosting", "Attending". */
const BUCKET_VERB: Record<RoleBucket, string> = { spoke: 'Speaking', workshop: 'Workshop', hosted: 'Hosting', attended: 'Attending' };
export function bucketVerb(b?: RoleBucket): string {
  return b ? BUCKET_VERB[b] : '';
}

/** Role badge in the right tense: "Spoke" / "Hosted" once past, "Speaking" / "Hosting" before. */
export function bucketBadge(b?: RoleBucket, upcoming = false): string {
  if (!b) return '';
  return upcoming ? BUCKET_VERB[b] : ROLE_BUCKETS.find((r) => r.value === b)?.badge ?? '';
}

/**
 * Session format word for the session meta line ("Talk · 25 min · …"). Nouns
 * (Talk, Keynote, Panel) read the same either way; activities take the
 * event's tense: "Hosting" before, "Hosted" once the session is delivered.
 */
const ROLE_FORMAT: Record<SessionRole, [upcoming: string, past: string]> = {
  speaker: ['Talk', 'Talk'],
  keynote: ['Keynote', 'Keynote'],
  lightning: ['Lightning talk', 'Lightning talk'],
  workshop: ['Workshop', 'Workshop'],
  panel: ['Panel', 'Panel'],
  host: ['Hosting', 'Hosted'],
  organizer: ['Organising', 'Organised'],
  judge: ['Judging', 'Judged'],
  mentor: ['Mentoring', 'Mentored'],
  guest: ['Guest appearance', 'Guest appearance'],
  attendee: ['Attending', 'Attended'],
};
/** Past = the session was delivered (events.ts resolves past, non-cancelled sessions to `delivered`). */
export function isPastSession(s: Pick<Session, 'status'>): boolean {
  return s.status === 'delivered';
}
export function sessionFormat(s: Session): string {
  const f = ROLE_FORMAT[s.role];
  return f ? f[isPastSession(s) ? 1 : 0] : 'Session';
}

/** Explicit role for the badge: "Role: speaker". */
const ROLE_NAME: Record<SessionRole, string> = {
  speaker: 'speaker',
  keynote: 'keynote speaker',
  lightning: 'lightning speaker',
  workshop: 'workshop lead',
  panel: 'panellist',
  host: 'host / MC',
  organizer: 'organiser',
  judge: 'judge',
  mentor: 'mentor',
  guest: 'guest',
  attendee: 'attendee',
};
export function roleName(s: Session): string {
  return ROLE_NAME[s.role] ?? s.role;
}

/** Title without its subtitle for dense rows: "Caching, Payloads, and Other Dark Arts". */
export function shortTalk(t: { title: string }): string {
  return t.title.split(':')[0];
}

/** One session, compactly: "Talk: Caching, Payloads, and Other Dark Arts", "Host". */
export function sessionShort(s: Session): string {
  if (s.title) return s.title;
  if (s.talk) return `${sessionFormat(s)}: ${shortTalk(s.talk)}`;
  if (s.workshop) return s.detail ? `${s.detail}: ${s.workshop.title}` : `Workshop: ${s.workshop.title}`;
  return s.detail ? `${sessionFormat(s)} · ${s.detail}` : sessionFormat(s);
}

export function liveSessions(e: EventEdition): Session[] {
  return e.sessions.filter((s) => s.status !== 'cancelled');
}

/** Every live session of an edition in one line (archive rows, md). */
export function sessionSummary(e: EventEdition): string {
  return liveSessions(e).map(sessionShort).join(' · ');
}

/** Flag emoji for the edition's country, or '' (online / unknown: no globe glyph). */
export function flagFor(e: Pick<EventEdition, 'location'>): string {
  if (e.location.isOnline || !countryCode(e.location.country)) return '';
  return getCountryFlag(e.location.country);
}

/** "Zurich, CH", "Singapore", "Online". */
export function placeShort(e: Pick<EventEdition, 'location'>): string {
  const l = e.location;
  if (l.isOnline) return 'Online';
  const cc = countryCode(l.country) || l.country;
  if (!l.city) return l.country ?? '';
  if (l.city === l.country) return l.city;
  return [l.city, cc].filter(Boolean).join(', ');
}

/** Upcoming card meta: "Ghent, Belgium · Talk: Orchestrating… · 19:00 CEST". */
export function upcomingMeta(e: EventEdition): string {
  const s = primarySession(e);
  const time = s?.startsAt && s.status !== 'tba' ? localTime(s.startsAt, e.timezone) : '';
  return [eventPlace(e, { venue: true }), ...liveSessions(e).map(sessionShort), time].filter(Boolean).join(' · ');
}

/**
 * Timing line for a session card. Before the event, a session without a
 * start time (or marked TBA) says so explicitly instead of guessing.
 */
export function sessionTiming(e: EventEdition, s: Session): string {
  if (s.status === 'cancelled') return 'Cancelled';
  const time = s.startsAt && s.status !== 'tba' ? localTime(s.startsAt, e.timezone) : '';
  if (e.isUpcoming && !time) return 'time and stage to be announced by the organisers';
  return [time, s.stage].filter(Boolean).join(' · ');
}

export function sessionMeta(e: EventEdition, s: Session): string {
  const mins = s.durationMinutes ? `${s.durationMinutes} min` : '';
  return [sessionFormat(s), mins, sessionTiming(e, s)].filter(Boolean).join(' · ');
}

/** Where a session's title should link (talk or workshop page). */
export function sessionHref(s: Session): string | undefined {
  if (s.talk) return `/talks/${s.talk.slug}`;
  if (s.workshop) return `/workshops/${s.workshop.slug}`;
  return undefined;
}

export function sessionTitle(s: Session): string {
  return s.title || s.talk?.title || s.workshop?.title || sessionFormat(s);
}

export function hasResources(e: EventEdition, photoCount = 0): boolean {
  return photoCount > 0 || e.sessions.some((s) => s.recordingUrl || s.slidesUrl);
}
