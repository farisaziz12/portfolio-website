/**
 * schema.org builders shared by pages, so Events, Breadcrumbs and
 * CreativeWorks are described the same way everywhere (SEO + answer engines).
 * The Person node lives in SEO.astro with a stable `#person` @id.
 */
import { eventPlace, type EventEdition, type TalkWithHistory } from './sanity/v3';

export const SITE = 'https://faziz-dev.com';
const PERSON = { '@id': `${SITE}/#person` };

/**
 * How to reach the person. There is no public email or phone (forms only), so
 * each contact point is a form URL.
 */
export function personContactPoints(siteUrl = SITE): Record<string, unknown>[] {
  return [
    { '@type': 'ContactPoint', contactType: 'speaking and workshop invitations', url: `${siteUrl}/invite`, availableLanguage: 'English' },
    { '@type': 'ContactPoint', contactType: 'general enquiries', url: `${siteUrl}/contact`, availableLanguage: 'English' },
  ];
}

/** The co-founded community, as the Person's affiliation (Organization). */
export function communityOrganization(community: { name: string; url?: string; city?: string }, founder: string): Record<string, unknown> {
  return {
    '@type': 'Organization',
    name: community.name,
    ...(community.url ? { url: community.url } : {}),
    description: `JavaScript community and conference, co-founded by ${founder}.`,
    ...(community.city ? { address: { '@type': 'PostalAddress', addressLocality: community.city } } : {}),
    ...(community.url ? { contactPoint: { '@type': 'ContactPoint', contactType: 'community enquiries', url: community.url } } : {}),
  };
}

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
