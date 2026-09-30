/**
 * Talks + workshops, joined with their delivery history from event sessions.
 * Nothing about deliveries is stored on the talk: add a recording to a
 * session and the talk page, event page and home poster all pick it up.
 */
import groq from 'groq';
import { TALK_DELIVERY_ROLES } from 'shared';
import { getAllEvents } from './events';
import { load, memo, IMAGE, TALK_REF, WORKSHOP_REF } from './fetch';
import type { EventEdition, Talk, TalkDelivery, TalkVersion, TalkWithHistory, Workshop, WorkshopWithHistory, AgendaItem } from './types';

const SEO = `"seo": seo{ metaTitle, metaDescription, ogImage }`;

export const allTalksQuery = groq`*[_type == "talk" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc) {
  _id, title, shortTitle, "slug": slug.current, pillar, summary, abstract, audience,
  "takeaways": coalesce(takeaways, []), "tags": coalesce(topics, []),
  duration, "durationOptions": coalesce(durationOptions, []), level, setup,
  "isBookable": isBookable != false, "currentFlag": isCurrentVersion, _createdAt, order, version, versionNotes,
  "parentId": parentTalk._ref,
  "thumbnail": coalesce(thumbnail, assets.thumbnailImage)${IMAGE},
  "repoUrl": assets.repoUrl, "fallbackVideoUrl": assets.videoUrl, "fallbackSlidesUrl": assets.slidesUrl,
  "alsoAsWorkshop": alsoAsWorkshop->${WORKSHOP_REF},
  "relatedTalks": coalesce(relatedTalks[]->${TALK_REF}, []),
  "legacyHomepageFeatured": homepageFeatured,
  ${SEO}
}`;

export const allWorkshopsQuery = groq`*[_type == "workshop" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc) {
  _id, title, "slug": slug.current, pillar, summary, description,
  "outcomes": coalesce(outcomes, []), "prerequisites": coalesce(prerequisites, []), "technologies": coalesce(technologies, []),
  "image": image${IMAGE},
  "formats": coalesce(formats[]{ label, duration, "agenda": coalesce(agenda, []) }, []),
  "legacyAgenda": agenda,
  duration, participants, room, after,
  "relatedTalk": relatedTalk->${TALK_REF},
  "isBookable": isBookable != false, order,
  ${SEO}
}`;

type RawTalk = Talk & { currentFlag?: boolean | null; _createdAt?: string };
type RawWorkshop = Omit<Workshop, 'formats'> & { formats: Workshop['formats']; legacyAgenda?: AgendaItem[] | null };

function deliveriesFor(events: EventEdition[], match: (s: EventEdition['sessions'][number]) => boolean): TalkDelivery[] {
  const out: TalkDelivery[] = [];
  for (const e of events) {
    for (const s of e.sessions) {
      if (s.status === 'cancelled' || !match(s)) continue;
      out.push({
        session: s,
        event: { _id: e._id, title: e.title, slug: e.slug, date: e.date, location: e.location, isUpcoming: e.isUpcoming, seriesName: e.seriesName },
      });
    }
  }
  // Newest first; events arrive date-desc already.
  return out;
}

function withHistory(talk: Talk, familyIds: Set<string>, titles: Map<string, string>, events: EventEdition[]): Omit<TalkWithHistory, 'isCurrent' | 'familyId' | 'versions'> {
  const deliveries = deliveriesFor(events, (s) => Boolean(s.talk && familyIds.has(s.talk._id))).map((d) => {
    const given = d.session.talk ? titles.get(d.session.talk._id) : undefined;
    return given && d.session.talk?._id !== talk._id && given !== talk.title ? { ...d, asTitle: given } : d;
  });
  const delivered = deliveries.filter((d) => !d.event.isUpcoming);
  const talkDelivered = delivered.filter((d) => TALK_DELIVERY_ROLES.includes(d.session.role));
  const upcoming = deliveries.filter((d) => d.event.isUpcoming);
  const withRec = delivered.filter((d) => d.session.recordingUrl);
  const best = withRec.find((d) => d.session.featured) ?? withRec[0];
  const recording = best
    ? { url: best.session.recordingUrl as string, event: best.event, minutes: best.session.recordingMinutes }
    : talk.fallbackVideoUrl
      ? { url: talk.fallbackVideoUrl }
      : undefined;
  const slidesUrl = (best ?? delivered.find((d) => d.session.slidesUrl))?.session.slidesUrl ?? talk.fallbackSlidesUrl;
  return {
    ...talk,
    deliveries,
    deliveredCount: talkDelivered.length,
    nextDelivery: upcoming[upcoming.length - 1],
    lastDelivery: delivered[0],
    recording,
    slidesUrl,
  };
}

/** A version's own delivered sessions (not the family roll-up): years and count. */
function versionOf(t: RawTalk, events: EventEdition[]): Omit<TalkVersion, 'isCurrent'> {
  const own = deliveriesFor(events, (s) => s.talk?._id === t._id && TALK_DELIVERY_ROLES.includes(s.role)).filter((d) => !d.event.isUpcoming);
  const years = own.map((d) => Number(d.event.date.slice(0, 4))).filter(Boolean);
  const first = own.at(-1)?.event.date;
  const lo = years.length ? Math.min(...years) : 0;
  const hi = years.length ? Math.max(...years) : 0;
  return {
    _id: t._id,
    slug: t.slug,
    title: t.title,
    version: t.version,
    versionNotes: t.versionNotes,
    isBookable: t.isBookable,
    years: !lo ? '' : lo === hi ? String(lo) : `${lo}–${hi}`,
    firstDelivered: first,
    deliveredCount: own.length,
  };
}

/** Sort key for "newest version": first delivery, else creation date, a new cut after its parent. */
function newness(t: RawTalk, v: Omit<TalkVersion, 'isCurrent'>): string {
  return `${v.firstDelivered ?? t._createdAt ?? ''}|${t.parentId ? 1 : 0}`;
}

/**
 * Exactly one current version per family: the one flagged current (newest if
 * several are), else the newest version that isn't explicitly flagged off.
 */
export function pickCurrent<T extends { _id: string; flag?: boolean | null; key: string }>(family: T[]): string | undefined {
  const byNew = [...family].sort((a, b) => b.key.localeCompare(a.key));
  return (byNew.find((t) => t.flag === true) ?? byNew.find((t) => t.flag !== false) ?? byNew[0])?._id;
}

/** Every talk (all versions) with its history and version family. */
export function getTalks(): Promise<TalkWithHistory[]> {
  return memo('talks:all', async () => {
    const [raw, events] = await Promise.all([load<RawTalk[]>(allTalksQuery, []), getAllEvents()]);
    // A version family = parent + its new cuts; sessions of any version roll up.
    const families = new Map<string, RawTalk[]>();
    for (const t of raw) {
      const root = t.parentId && raw.some((x) => x._id === t.parentId) ? t.parentId : t._id;
      families.set(root, [...(families.get(root) ?? []), t]);
    }
    const titles = new Map(raw.map((t) => [t._id, t.title]));
    const out: TalkWithHistory[] = [];
    for (const [familyId, members] of families) {
      const ids = new Set(members.map((m) => m._id));
      const base = members.map((m) => ({ m, v: versionOf(m, events) }));
      const current = pickCurrent(base.map(({ m, v }) => ({ _id: m._id, flag: m.currentFlag, key: newness(m, v) })));
      const versions: TalkVersion[] = base
        .map(({ m, v }) => ({ ...v, isCurrent: m._id === current, key: newness(m, v) }))
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ key: _key, ...v }) => v);
      for (const m of members) {
        // The current version carries the whole family's history; an earlier one only its own sessions.
        const scope = m._id === current ? ids : new Set([m._id]);
        out.push({ ...withHistory(m, scope, titles, events), isCurrent: m._id === current, familyId, versions });
      }
    }
    // Keep the catalogue order from the query.
    const order = new Map(raw.map((t, i) => [t._id, i]));
    return out.sort((a, b) => (order.get(a._id) ?? 0) - (order.get(b._id) ?? 0));
  });
}

/** The public catalogue: one entry per family (its current version), bookable only. */
export async function getCatalogueTalks(): Promise<TalkWithHistory[]> {
  return (await getTalks()).filter((t) => t.isCurrent && t.isBookable);
}

export async function getTalkBySlug(slug: string): Promise<TalkWithHistory | undefined> {
  return (await getTalks()).find((t) => t.slug === slug);
}

function normalizeWorkshop(w: RawWorkshop): Workshop {
  const formats = w.formats.length
    ? w.formats
    : w.legacyAgenda?.length
      ? [{ label: w.duration || 'Agenda', duration: w.duration, agenda: w.legacyAgenda }]
      : [];
  return { ...w, formats };
}

export function getWorkshops(): Promise<WorkshopWithHistory[]> {
  return memo('workshops:all', async () => {
    const [raw, events] = await Promise.all([load<RawWorkshop[]>(allWorkshopsQuery, []), getAllEvents()]);
    return raw.map((w) => ({
      ...normalizeWorkshop(w),
      deliveries: deliveriesFor(events, (s) => s.workshop?._id === w._id),
    }));
  });
}

export async function getWorkshopBySlug(slug: string): Promise<WorkshopWithHistory | undefined> {
  return (await getWorkshops()).find((w) => w.slug === slug);
}

/** YouTube thumbnail for a recording URL (no API call), or undefined. */
export function youtubeThumb(url?: string): string | undefined {
  if (!url) return undefined;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : undefined;
}

export function recordingHost(url?: string): string {
  if (!url) return '';
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host.includes('youtu')) return 'YouTube';
    if (host.includes('vimeo')) return 'Vimeo';
    if (host.includes('gitnation')) return 'GitNation';
    return host;
  } catch {
    return '';
  }
}
