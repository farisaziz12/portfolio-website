/**
 * Display helpers shared by the Speaking hub, the Talks catalogue and the
 * Talk detail page (and their .md mirrors), so a talk's meta line reads the
 * same everywhere. Everything is derived from the v3 loaders' shapes.
 */
import { TOPICS, titleFor } from 'shared';
import { fullDate, yearOf, type Praise, type TalkDelivery, type TalkWithHistory } from './sanity/v3';

type DeliveryEvent = TalkDelivery['event'];

/** "Engineering in production" for a pillar value. */
export function pillarTitle(pillar?: string): string {
  return titleFor(TOPICS, pillar) || '';
}

/** Event title without its trailing edition year: "Game of Codes 2026" → "Game of Codes". */
export function eventShortName(e: Pick<DeliveryEvent, 'title'>): string {
  return e.title.replace(/\s+(19|20)\d{2}$/, '').trim() || e.title;
}

/** "React Summit US 2025" (always carries the year once). */
export function eventWithYear(e: Pick<DeliveryEvent, 'title' | 'date'>): string {
  const name = eventShortName(e);
  const y = yearOf(e.date);
  return y ? `${name} ${y}` : name;
}

/** "20, 30 or 45 min versions" · "30 min" · "". */
export function lengthLabel(t: Pick<TalkWithHistory, 'duration' | 'durationOptions'>): string {
  const opts = [...new Set(t.durationOptions.filter((n) => n > 0))].sort((a, b) => a - b);
  if (opts.length > 1) return `${opts.slice(0, -1).join(', ')} or ${opts[opts.length - 1]} min versions`;
  const one = opts[0] ?? t.duration;
  return one ? `${one} min` : '';
}

/** "next: Devs.Ghent, 30 Sep 2026" */
export function nextLine(t: TalkWithHistory): string | null {
  const n = t.nextDelivery;
  return n ? `next: ${eventShortName(n.event)}, ${fullDate(n.event.date)}` : null;
}

/** "delivered 6× incl. React Summit US 2025" */
export function deliveredLine(t: TalkWithHistory): string | null {
  if (!t.deliveredCount) return null;
  const notable = t.recording?.event ?? t.lastDelivery?.event;
  if (t.deliveredCount === 1) return `delivered once${notable ? `, at ${eventWithYear(notable)}` : ''}`;
  return `delivered ${t.deliveredCount}×${notable ? ` incl. ${eventWithYear(notable)}` : ''}`;
}

/** Catalogue row meta: "30 min · recording · delivered 6× incl. React Summit US 2025". */
export function talkMeta(t: TalkWithHistory): string {
  return [t.duration ? `${t.duration} min` : null, t.recording ? 'recording' : null, nextLine(t) ?? deliveredLine(t)]
    .filter(Boolean)
    .join(' · ');
}

/** Bookable, current version = in the catalogue. Everything else is retired. */
export function isRetired(t: TalkWithHistory, catalogue: TalkWithHistory[]): boolean {
  return !catalogue.some((c) => c._id === t._id);
}

/** current = listed and bookable · earlier = an older version of a talk that moved on · retired = no longer booked. */
export function talkStatus(t: Pick<TalkWithHistory, 'isCurrent' | 'isBookable'>): 'current' | 'earlier' | 'retired' {
  if (!t.isCurrent) return 'earlier';
  return t.isBookable ? 'current' : 'retired';
}

/** The family's current version, when `t` is an earlier one. */
export function currentVersionOf(t: TalkWithHistory, talks: TalkWithHistory[]): TalkWithHistory | undefined {
  return t.isCurrent ? undefined : talks.find((c) => c.familyId === t.familyId && c.isCurrent);
}

/** Short quote for inline strips: pull quote, else the first sentence, else a trimmed quote. */
export function firstSentence(p: Pick<Praise, 'quote' | 'pullQuote'>, max = 90): string {
  if (p.pullQuote) return p.pullQuote;
  const sentences = p.quote.match(/[^.!?]+[.!?]+/g) ?? [p.quote];
  const pick = sentences.find((s) => s.trim().length > 24) ?? sentences[0];
  const s = pick.trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
}

/** "Invite me to give it" → the invite form, pre-filled. */
export function inviteHref(t: Pick<TalkWithHistory, 'title'>): string {
  return `/invite?kind=conference&talk=${encodeURIComponent(t.title)}`;
}
