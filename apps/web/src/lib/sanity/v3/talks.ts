/**
 * Talks + workshops, joined with their delivery history from event sessions.
 * Nothing about deliveries is stored on the talk: add a recording to a
 * session and the talk page, event page and home poster all pick it up.
 */
import groq from 'groq';
import { TALK_DELIVERY_ROLES } from 'shared';
import { getAllEvents } from './events';
import { load, memo, IMAGE, TALK_REF, WORKSHOP_REF } from './fetch';
import type { EventEdition, Talk, TalkDelivery, TalkWithHistory, Workshop, WorkshopWithHistory, AgendaItem } from './types';

const SEO = `"seo": seo{ metaTitle, metaDescription, ogImage }`;

export const allTalksQuery = groq`*[_type == "talk" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc) {
  _id, title, shortTitle, "slug": slug.current, pillar, summary, abstract, audience,
  "takeaways": coalesce(takeaways, []), "tags": coalesce(topics, []),
  duration, "durationOptions": coalesce(durationOptions, []), level, setup,
  "isBookable": isBookable != false, "isCurrent": isCurrentVersion != false, order, version, versionNotes,
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

type RawTalk = Talk & { isCurrent: boolean };
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

function withHistory(talk: Talk, familyIds: Set<string>, events: EventEdition[]): TalkWithHistory {
  const deliveries = deliveriesFor(events, (s) => Boolean(s.talk && familyIds.has(s.talk._id)));
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

/** Every talk (all versions) with its history. Catalogue filtering is the caller's job. */
export function getTalks(): Promise<TalkWithHistory[]> {
  return memo('talks:all', async () => {
    const [raw, events] = await Promise.all([load<RawTalk[]>(allTalksQuery, []), getAllEvents()]);
    // A version family = parent + children; sessions of any version roll up.
    const family = new Map<string, Set<string>>();
    for (const t of raw) {
      const root = t.parentId || t._id;
      if (!family.has(root)) family.set(root, new Set());
      family.get(root)!.add(t._id);
    }
    return raw.map((t) => withHistory(t, family.get(t.parentId || t._id) ?? new Set([t._id]), events));
  });
}

/** Bookable, current-version talks: the public catalogue. */
export async function getCatalogueTalks(): Promise<TalkWithHistory[]> {
  const talks = await getTalks();
  const raw = await load<RawTalk[]>(allTalksQuery, []);
  const current = new Set(raw.filter((t) => t.isCurrent).map((t) => t._id));
  return talks.filter((t) => t.isBookable && current.has(t._id));
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
