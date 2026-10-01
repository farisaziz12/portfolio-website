/**
 * Calendar- and page-shaped loaders: availability (derived from events),
 * career timeline (labels from dates), About, services and photos.
 */
import groq from 'groq';
import type { AvailabilityStatus, ServiceType } from 'shared';
import { yearOf } from './dates';
import { DEFAULT_ABOUT } from './defaults';
import { getAllEvents } from './events';
import { load, memo, IMAGE } from './fetch';
import type { AvailabilityMonth, CareerEntry, LabelledText, SanityImage, ServiceOffer } from './types';

const nonEmpty = <T>(v: T[] | null | undefined, fallback: T[]): T[] => (v && v.length ? v : fallback);
const str = (v: string | null | undefined, fallback = ''): string => (v && v.trim() ? v : fallback);

// ─── Availability ──────────────────────────────────────────────────────────

export const availabilityQuery = groq`*[_type == "availability"] | order(_updatedAt desc)[0] { "months": coalesce(months[]{ month, status, note }, []), leadTime }`;

/** Confirmed appearances in a month → status. 0 open · 1–2 some dates taken · 3+ limited. */
export function statusFromBookings(count: number): AvailabilityStatus {
  return count >= 3 ? 'limited' : count >= 1 ? 'some' : 'open';
}

/**
 * The next 12 months starting this month. Each month's status is DERIVED from
 * the events still ahead (appearances you're confirmed for; attending doesn't
 * count). "Ahead" is measured from `now`, not the clock, so the result
 * depends only on the date passed in.
 * A month entry in the Availability document overrides it (holidays, a month
 * you're keeping free) and can add a note.
 */
export function getAvailability(now = new Date()): Promise<{ months: AvailabilityMonth[]; leadTime?: string; fromCms: boolean }> {
  return memo(`site:availability:${now.toISOString().slice(0, 7)}`, async () => {
    const [a, events] = await Promise.all([
      load<{ months: { month?: string; status?: AvailabilityStatus; note?: string }[]; leadTime?: string } | null>(availabilityQuery, null),
      getAllEvents(),
    ]);
    const from = now.toISOString().slice(0, 10);
    const overrides = new Map((a?.months ?? []).filter((m) => m.month).map((m) => [m.month!.slice(0, 7), m]));
    const bookings = new Map<string, number>();
    for (const e of events) {
      if (e.date < from) continue;
      if (!e.sessions.some((s) => s.bucket !== 'attended' && s.status !== 'cancelled')) continue;
      const key = e.date.slice(0, 7);
      bookings.set(key, (bookings.get(key) ?? 0) + 1);
    }
    const months: AvailabilityMonth[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      const override = overrides.get(key);
      const booked = bookings.get(key) ?? 0;
      months.push({
        month: key,
        status: override?.status ?? statusFromBookings(booked),
        note: override?.note,
        booked,
        source: override?.status ? 'override' : 'events',
      });
    }
    return { months, leadTime: a?.leadTime, fromCms: overrides.size > 0 };
  });
}

// ─── Services, career, About ───────────────────────────────────────────────

export const servicesQuery = groq`*[_type == "serviceOffer" && defined(slug.current)] | order(coalesce(order, 999) asc) {
  _id, title, "slug": slug.current, serviceType, shortDescription, audience, reachOutIf, youGet, primaryCta, secondaryCta,
  bestFor, "outcomes": coalesce(outcomes, []), engagementFormat, showPricing, priceFrom, priceCurrency, priceUnit,
  bookingUrl, bookingLabel, featured, order
}`;

export function getServiceOffers(): Promise<ServiceOffer[]> {
  return memo('site:services', async () => {
    const list = await load<(Omit<ServiceOffer, 'serviceType'> & { serviceType?: string })[]>(servicesQuery, []);
    return list.map((o) => ({ ...o, serviceType: (o.serviceType === 'consulting' ? 'advisory' : o.serviceType ?? 'advisory') as ServiceType }));
  });
}

export const careerQuery = groq`*[_type == "company" && isPublic != false] | order(coalesce(order, 999) asc, coalesce(endDate, "9999") desc, startDate desc) {
  _id, name, role, periodLabel, period, startDate, endDate, description, highlight, url, order,
  "clients": coalesce(clients[defined(name)]{ name, url, note }, [])
}`;

/**
 * Timeline label from the entry's dates: "2024 →" while current, "2021–2023"
 * or "2022" once ended. A manual `periodLabel` ("Now", "Before code") wins,
 * then the legacy free-text `period`.
 */
export function careerLabel(c: Pick<CareerEntry, 'periodLabel' | 'period' | 'startDate' | 'endDate'>): string {
  if (c.periodLabel) return c.periodLabel;
  const start = yearOf(c.startDate);
  const end = yearOf(c.endDate);
  if (start && !c.endDate) return `${start} →`;
  if (start && end) return start === end ? String(start) : `${start}–${end}`;
  if (end) return String(end);
  return c.period ?? '';
}

export function getCareer(): Promise<CareerEntry[]> {
  return memo('site:career', async () => {
    const list = await load<CareerEntry[]>(careerQuery, []);
    return list.map((c) => ({ ...c, periodLabel: careerLabel(c) }));
  });
}

export const aboutPageQuery = groq`*[_type == "page" && identifier == "about"] | order(_updatedAt desc)[0] {
  kicker, title, subtitle, content, "heroImage": heroImage${IMAGE}, "inShort": coalesce(inShort[]{ label, body }, []),
  "legacyBio": aboutHero.bio, seo
}`;

export interface AboutPage {
  kicker: string;
  title: string;
  intro: string;
  content: unknown[];
  heroImage?: SanityImage;
  inShort: LabelledText[];
  seo?: { metaTitle?: string; metaDescription?: string };
}

export function getAboutPage(): Promise<AboutPage> {
  return memo('site:about', async () => {
    const p = await load<(Partial<AboutPage> & { subtitle?: string; legacyBio?: string }) | null>(aboutPageQuery, null);
    const d = DEFAULT_ABOUT;
    return {
      kicker: str(p?.kicker, d.kicker),
      title: str(p?.title, d.title),
      intro: str(p?.subtitle, d.intro),
      content: p?.content ?? [],
      heroImage: p?.heroImage,
      inShort: nonEmpty(p?.inShort?.filter((i) => i.label && i.body), d.inShort),
      seo: p?.seo,
    };
  });
}

// ─── Photos (media) ────────────────────────────────────────────────────────

export const photosQuery = groq`*[_type == "media" && type == "photo" && defined(image.asset)] | order(date desc) {
  _id, title, description, date, credit, featured,
  "image": image${IMAGE},
  "event": event->{ _id, title, "slug": slug.current, date }
}`;

export interface Photo {
  _id: string;
  title?: string;
  description?: string;
  date?: string;
  credit?: string;
  featured?: boolean;
  image: SanityImage;
  event?: { _id: string; title: string; slug: string; date?: string };
}

export function getPhotos(): Promise<Photo[]> {
  return memo('site:photos', () => load<Photo[]>(photosQuery, []));
}
