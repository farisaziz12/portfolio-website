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

/** A talk nobody has seen yet: no past session of any version in its family. */
export function isNewTalk(t: Pick<TalkWithHistory, 'deliveries'>): boolean {
  return !t.deliveries.some((d) => !d.event.isUpcoming);
}

/** "new · premiere: Game of Codes, 9 Oct 2026" · "new". */
export function newTalkLine(t: TalkWithHistory): string {
  const n = t.nextDelivery;
  return n ? `new · premiere: ${eventShortName(n.event)}, ${fullDate(n.event.date)}` : 'new';
}

/** "Premieres at JSworld Conference, 19th Mar 2027" for a new talk · "Next: Devs.Ghent, 30th Sep 2026" · null. */
export function upcomingLine(t: TalkWithHistory): string | null {
  const n = t.nextDelivery;
  if (!n) return null;
  const where = `${eventShortName(n.event)}, ${fullDate(n.event.date)}`;
  return isNewTalk(t) ? `Premieres at ${where}` : `Next: ${where}`;
}

/** The audience's first sentence, for rows and posters; the talk page has the rest. */
export function audienceLine(t: Pick<TalkWithHistory, 'audience'>): string {
  return t.audience?.match(/^[^.!?]+[.!?]?/)?.[0].replace(/\.$/, '') ?? '';
}

/** Where a delivery happened, short: "Zurich", "Online". */
export function deliveryCity(d: TalkDelivery): string {
  const l = d.event.location;
  if (l.isOnline) return 'Online';
  return l.city || l.country || '';
}

export interface DeliveryYear {
  year: number;
  items: TalkDelivery[];
}

/**
 * Past deliveries, newest first, one entry per event, grouped by year.
 * `limit` caps how many are listed; the rest is counted in `earlier`.
 */
export function deliveryYears(t: Pick<TalkWithHistory, 'deliveries'>, limit = Infinity): { years: DeliveryYear[]; earlier: number } {
  const seen = new Set<string>();
  const past = t.deliveries
    .filter((d) => !d.event.isUpcoming)
    .sort((a, b) => b.event.date.localeCompare(a.event.date))
    .filter((d) => (seen.has(d.event._id) ? false : (seen.add(d.event._id), true)));
  const shown = past.slice(0, limit);
  const years: DeliveryYear[] = [];
  for (const d of shown) {
    const y = yearOf(d.event.date);
    const g = years.find((x) => x.year === y);
    if (g) g.items.push(d);
    else years.push({ year: y, items: [d] });
  }
  return { years, earlier: past.length - shown.length };
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

/** "Invite me to give this talk" → the invite form, pre-filled. */
export function inviteHref(t: Pick<TalkWithHistory, 'title'>): string {
  return `/invite?kind=conference&talk=${encodeURIComponent(t.title)}`;
}

/** Popularity / recency / newness keys for a talk (server order below). */
export function talkSortKeys(t: TalkWithHistory) {
  return {
    popular: t.deliveredCount,
    recent: t.lastDelivery?.event.date ?? '',
    newest: t._createdAt ?? t.versions[0]?.firstDelivered ?? '',
  };
}

/** Server order = "Most popular": most given, then most recently given, then editor order. */
export function byPopularity(a: TalkWithHistory, b: TalkWithHistory): number {
  const ka = talkSortKeys(a);
  const kb = talkSortKeys(b);
  return kb.popular - ka.popular || kb.recent.localeCompare(ka.recent) || (a.order ?? 999) - (b.order ?? 999);
}
