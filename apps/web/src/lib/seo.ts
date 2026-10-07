/**
 * schema.org builders shared by pages, so Events, Breadcrumbs and
 * CreativeWorks are described the same way everywhere (SEO + answer engines).
 * The Person node lives in SEO.astro with a stable `#person` @id.
 */
import { eventPlace, type EventEdition, type TalkWithHistory } from './sanity/v3';

export const SITE = 'https://faziz-dev.com';
const PERSON = { '@id': `${SITE}/#person` };

export function breadcrumbs(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE}${it.path}` })),
  };
}

export function eventSchema(e: EventEdition): Record<string, unknown> {
  const talk = e.sessions.find((s) => s.talk)?.talk;
  return {
    '@type': 'Event',
    '@id': `${SITE}/events/${e.slug}#event`,
    name: e.title,
    startDate: e.date,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    eventStatus: e.sessions.every((s) => s.status === 'cancelled') ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: e.location.isOnline ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location: e.location.isOnline
      ? { '@type': 'VirtualLocation', url: e.url || `${SITE}/events/${e.slug}` }
      : {
          '@type': 'Place',
          name: e.location.venue || eventPlace(e),
          address: { '@type': 'PostalAddress', addressLocality: e.location.city, addressCountry: e.location.country },
        },
    ...(e.url ? { url: e.url } : {}),
    ...(e.description ? { description: e.description } : {}),
    ...(e.sessions.some((s) => ['spoke', 'workshop'].includes(s.bucket)) ? { performer: PERSON } : {}),
    ...(talk ? { about: { '@type': 'CreativeWork', name: talk.title, url: `${SITE}/talks/${talk.slug}` } } : {}),
  };
}

export function talkSchema(t: TalkWithHistory): Record<string, unknown> {
  return {
    '@type': 'CreativeWork',
    '@id': `${SITE}/talks/${t.slug}#talk`,
    name: t.title,
    ...(t.abstract || t.summary ? { abstract: t.abstract || t.summary } : {}),
    author: PERSON,
    ...(t.tags.length ? { keywords: t.tags.join(', ') } : {}),
    ...(t.recording ? { video: { '@type': 'VideoObject', name: t.title, url: t.recording.url, embedUrl: t.recording.url } } : {}),
  };
}

export function itemList(name: string, urls: string[]): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: urls.map((url, i) => ({ '@type': 'ListItem', position: i + 1, url: url.startsWith('http') ? url : `${SITE}${url}` })),
  };
}
