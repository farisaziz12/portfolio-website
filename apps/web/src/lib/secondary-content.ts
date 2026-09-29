/**
 * Loaders for the secondary pages the V3 query layer doesn't cover:
 * projects (/projects, /projects/[slug]) and CMS service landing pages
 * (/services/[slug]). Failure-tolerant and memoised via the v3 fetch plumbing.
 * Also groups gallery photos by event.
 */
import groq from 'groq';
import { load, memo, IMAGE } from './sanity/v3/fetch';
import { getAllEvents, getPhotos, type Photo, type EventEdition, type SanityImage } from './sanity/v3';

// ─── Projects ──────────────────────────────────────────────────────────────

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  technologies: string[];
  image?: SanityImage;
  links: { liveUrl?: string; githubUrl?: string; npmUrl?: string };
  featured: boolean;
  date?: string;
}

export interface ProjectScreenshot {
  _key: string;
  image: SanityImage;
  caption?: string;
}

export interface ProjectDetail extends Project {
  role?: string;
  longDescription: unknown[];
  challenges?: string;
  /** Schema stores text; older documents stored a list. Normalised to a list. */
  outcomes: string[];
  screenshots: ProjectScreenshot[];
}

const PROJECT_FIELDS = `_id, title, "slug": slug.current, description, category, "technologies": coalesce(technologies, []),
  "image": image${IMAGE}, "links": coalesce(links, {}), "featured": featured == true, date`;

export const projectsQuery = groq`*[_type == "project" && defined(slug.current)] | order(coalesce(featured, false) desc, date desc) { ${PROJECT_FIELDS} }`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  ${PROJECT_FIELDS}, role, "longDescription": coalesce(longDescription, []), challenges, outcomes,
  "screenshots": coalesce(screenshots[]{ _key, _type, asset, hotspot, crop, alt, caption, title, description,
    "dimensions": asset->metadata.dimensions, "image": image${IMAGE} }, [])
}`;

export function getProjects(): Promise<Project[]> {
  return memo('secondary:projects', () => load<Project[]>(projectsQuery, []));
}

interface RawShot extends SanityImage {
  _key: string;
  title?: string;
  description?: string;
  image?: SanityImage;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const raw = await load<(Project & { role?: string; longDescription?: unknown[]; challenges?: string; outcomes?: string | string[]; screenshots?: RawShot[] }) | null>(
    projectBySlugQuery,
    null,
    { slug }
  );
  if (!raw) return null;
  const outcomes = Array.isArray(raw.outcomes)
    ? raw.outcomes.filter(Boolean)
    : (raw.outcomes ?? '').split(/\n+/).map((s) => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
  const screenshots = (raw.screenshots ?? [])
    .map((s) => {
      const image = s.image?.asset ? s.image : s;
      return { _key: s._key, image: { ...image, alt: image.alt || s.alt || s.title }, caption: s.caption || s.description || s.title };
    })
    .filter((s) => s.image.asset);
  return { ...raw, longDescription: raw.longDescription ?? [], outcomes, screenshots };
}

// ─── Service landing pages (/services/[slug]) ─────────────────────────────

export interface LandingCard {
  _key: string;
  title: string;
  description?: string;
}

export interface LandingOffering {
  _key: string;
  name: string;
  bestFor?: string;
  includes?: string[];
  outcome?: string;
}

export interface LandingTestimonial {
  _id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
}

export interface ServiceLandingPage {
  _id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: SanityImage;
  heroTagline?: string;
  heroHeadline: string;
  heroSubheadline?: string;
  heroPrimaryCta?: { text?: string; url?: string };
  heroSecondaryCta?: { text?: string; url?: string };
  problemTitle?: string;
  painPoints: LandingCard[];
  expertiseTitle?: string;
  expertiseAreas: LandingCard[];
  servicesTitle?: string;
  serviceOfferings: LandingOffering[];
  audienceTitle?: string;
  personas: LandingCard[];
  proofTitle?: string;
  stats: { _key: string; value: string; label: string }[];
  testimonials: LandingTestimonial[];
  faqTitle?: string;
  faqs: { _key: string; question: string; answer: string }[];
  ctaHeadline?: string;
  ctaSubheadline?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  ctaSecondaryText?: string;
}

export const landingPagesQuery = groq`*[_type == "serviceLandingPage" && published == true && defined(slug.current)] | order(coalesce(order, 999) asc) {
  _id, title, "slug": slug.current, heroHeadline, heroSubheadline, seoDescription
}`;

export const landingPageBySlugQuery = groq`*[_type == "serviceLandingPage" && slug.current == $slug && published == true][0] {
  _id, title, "slug": slug.current, seoTitle, seoDescription, seoKeywords, "ogImage": ogImage${IMAGE},
  heroTagline, heroHeadline, heroSubheadline, heroPrimaryCta { text, url }, heroSecondaryCta { text, url },
  problemTitle, "painPoints": coalesce(painPoints[]{ _key, title, description }, []),
  expertiseTitle, "expertiseAreas": coalesce(expertiseAreas[]{ _key, title, description }, []),
  servicesTitle, "serviceOfferings": coalesce(serviceOfferings[]{ _key, name, bestFor, includes, outcome }, []),
  audienceTitle, "personas": coalesce(personas[]{ _key, title, description }, []),
  proofTitle, "stats": coalesce(stats[]{ _key, value, label }, []),
  "testimonials": coalesce(testimonials[]->{ _id, quote, author, role, company }, []),
  faqTitle, "faqs": coalesce(faqs[]{ _key, question, answer }, []),
  ctaHeadline, ctaSubheadline, ctaButtonText, ctaButtonUrl, ctaSecondaryText
}`;

export function getServiceLandingPages(): Promise<Pick<ServiceLandingPage, '_id' | 'title' | 'slug' | 'heroHeadline' | 'heroSubheadline' | 'seoDescription'>[]> {
  return memo('secondary:landing', () => load(landingPagesQuery, []));
}

export async function getServiceLandingPage(slug: string): Promise<ServiceLandingPage | null> {
  const p = await load<ServiceLandingPage | null>(landingPageBySlugQuery, null, { slug });
  if (!p) return null;
  return { ...p, testimonials: (p.testimonials ?? []).filter((t) => t?.quote && t?.author) };
}

// ─── Gallery ───────────────────────────────────────────────────────────────

export interface PhotoGroup {
  key: string;
  title: string;
  slug?: string;
  date?: string;
  city?: string;
  country?: string;
  photos: Photo[];
}

/** Photos grouped by event (newest event first); photos without an event go last, as "Elsewhere". */
export async function getPhotoGroups(): Promise<PhotoGroup[]> {
  const [photos, events] = await Promise.all([getPhotos(), getAllEvents()]);
  const byId = new Map<string, EventEdition>(events.map((e) => [e._id, e]));
  const groups = new Map<string, PhotoGroup>();
  for (const p of photos) {
    if (!p.image?.asset) continue;
    const key = p.event?._id ?? '__elsewhere';
    let g = groups.get(key);
    if (!g) {
      const e = p.event ? byId.get(p.event._id) : undefined;
      g = p.event
        ? { key, title: e?.title ?? p.event.title, slug: e?.slug ?? p.event.slug, date: e?.date ?? p.event.date, city: e?.location.city, country: e?.location.country, photos: [] }
        : { key, title: 'Elsewhere', photos: [] };
      groups.set(key, g);
    }
    g.photos.push(p);
  }
  return [...groups.values()].sort((a, b) => {
    if (a.key === '__elsewhere' || b.key === '__elsewhere') return a.key === '__elsewhere' ? 1 : -1;
    return (b.date ?? '').localeCompare(a.date ?? '');
  });
}

export function photoCredit(p: Photo): string | undefined {
  return p.credit || p.image.credit || undefined;
}
