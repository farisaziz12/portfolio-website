/**
 * Singletons and small collections: site settings, home page, profile,
 * availability, communities, metrics, services, career, About.
 * Each loader merges CMS values over the approved defaults field by field.
 */
import groq from 'groq';
import { formatLegacyMetric, LEGACY_METRIC_AREA, type MetricDomain } from 'shared';
import { monthYear } from './dates';
import { DEFAULT_HOME, DEFAULT_PROFILE, DEFAULT_SITE } from './defaults';
import { load, memo, IMAGE, TALK_REF } from './fetch';
import type {
  Community,
  HomePage,
  LabelledText,
  Metric,
  Profile,
  SanityImage,
  SiteSettings,
} from './types';

/** Plain text from Portable Text blocks (paragraphs joined by blank lines). */
export function toPlainText(blocks: unknown[]): string {
  return blocks
    .map((b) => {
      const children = (b as { children?: { text?: string }[] }).children;
      return Array.isArray(children) ? children.map((c) => c.text ?? '').join('') : '';
    })
    .filter(Boolean)
    .join('\n\n');
}

const nonEmpty = <T>(v: T[] | null | undefined, fallback: T[]): T[] => (v && v.length ? v : fallback);
const str = (v: string | null | undefined, fallback = ''): string => (v && v.trim() ? v : fallback);

// ─── Site settings ─────────────────────────────────────────────────────────

export const siteSettingsQuery = groq`*[_type == "siteSettings"] | order(_updatedAt desc)[0] {
  siteTitle, siteUrl, nowLine, tagline, metaDescription, defaultMetaDescription, keywords, ogImage,
  twitterHandle, linkedinUrl, githubUrl, youtubeUrl, blueskyUrl, discoveryCallUrl, introEnabled
}`;

interface RawSettings {
  siteTitle?: string;
  siteUrl?: string;
  nowLine?: string;
  tagline?: string;
  metaDescription?: string;
  defaultMetaDescription?: string;
  keywords?: string[];
  ogImage?: SanityImage;
  twitterHandle?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  blueskyUrl?: string;
  discoveryCallUrl?: string;
  introEnabled?: boolean;
}

export function getSiteSettings(): Promise<SiteSettings> {
  return memo('site:settings', async () => {
    const s = await load<RawSettings | null>(siteSettingsQuery, null);
    const d = DEFAULT_SITE;
    return {
      siteTitle: str(s?.siteTitle, d.siteTitle),
      siteUrl: str(s?.siteUrl, d.siteUrl).replace(/\/$/, ''),
      nowLine: str(s?.nowLine, d.nowLine),
      metaDescription: str(s?.metaDescription ?? s?.defaultMetaDescription, d.metaDescription),
      keywords: s?.keywords ?? [],
      ogImage: s?.ogImage,
      twitterHandle: str(s?.twitterHandle, d.twitterHandle),
      discoveryCallUrl: str(s?.discoveryCallUrl, d.discoveryCallUrl),
      introEnabled: s?.introEnabled !== false,
      links: {
        linkedin: str(s?.linkedinUrl, d.links.linkedin),
        github: str(s?.githubUrl, d.links.github),
        youtube: s?.youtubeUrl,
        bluesky: str(s?.blueskyUrl, d.links.bluesky),
      },
    };
  });
}

// ─── Home page ─────────────────────────────────────────────────────────────

export const homePageQuery = groq`*[_type == "homePage"] | order(_updatedAt desc)[0] {
  heroVariant, kicker, headline, intro, primaryCta, secondaryCta,
  "heroPhotos": coalesce(heroPhotos[]${IMAGE}, []),
  "featuredRefs": coalesce(featured[]->{ _type, _id }, []),
  "featuredQuoteId": featuredQuote._ref,
  "praiseIds": coalesce(praise[]._ref, []),
  "communityId": community._ref,
  invitePanel
}`;

export function getHomePage(): Promise<HomePage> {
  return memo('site:home', async () => {
    const h = await load<Partial<HomePage> | null>(homePageQuery, null);
    const d = DEFAULT_HOME;
    return {
      heroVariant: h?.heroVariant === 'fullbleed' ? 'fullbleed' : 'band',
      kicker: h?.kicker || undefined,
      headline: str(h?.headline, d.headline),
      intro: str(h?.intro, d.intro),
      primaryCta: { label: str(h?.primaryCta?.label, d.primaryCta.label), href: str(h?.primaryCta?.href, d.primaryCta.href) },
      secondaryCta: { label: str(h?.secondaryCta?.label, d.secondaryCta.label), href: str(h?.secondaryCta?.href, d.secondaryCta.href) },
      heroPhotos: h?.heroPhotos ?? [],
      featuredRefs: (h?.featuredRefs ?? []).filter(Boolean),
      featuredQuoteId: h?.featuredQuoteId,
      praiseIds: h?.praiseIds ?? [],
      communityId: h?.communityId,
      invitePanel: {
        headline: str(h?.invitePanel?.headline, d.invitePanel.headline),
        body: str(h?.invitePanel?.body, d.invitePanel.body),
      },
    };
  });
}

/** Split "[bracketed]" phrases for the underlined headline treatment. */
export function headlineParts(headline: string): { text: string; mark: boolean }[] {
  return headline
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((part) => (part.startsWith('[') ? { text: part.slice(1, -1), mark: true } : { text: part, mark: false }));
}

export const plainHeadline = (headline: string) => headline.replace(/[[\]]/g, '');

// ─── Profile ───────────────────────────────────────────────────────────────

/** "Geneva, Switzerland" → { city: "Geneva", country: "Switzerland" }. */
export function basedIn(travelBase: string): { city: string; country?: string } {
  const [city, ...rest] = travelBase.split(',').map((s) => s.trim()).filter(Boolean);
  return { city: city ?? travelBase, country: rest.length ? rest.join(', ') : undefined };
}

export const profileQuery = groq`*[_type == "speakerProfile"] | order(_updatedAt desc)[0] {
  name, pronunciation, tagline, jobTitle, travelBase, replyTime, socialLinks,
  bioShort, bioMedium, bioLong, bioFull, bioUpdatedAt,
  "photos": coalesce(headshots[downloadable != false]{ ..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip }, []),
  "topicPillars": coalesce(topicClusters[]{ pillar, title, description, "talk": talk->${TALK_REF} }, []),
  "formats": coalesce(formats[]{ name, duration, description }, []),
  "rider": coalesce(rider[]{ label, body }, []),
  "goodToKnow": coalesce(goodToKnow[]{ label, body }, []),
  technicalRequirements, avatarNote
}`;

interface RawProfile {
  name?: string;
  pronunciation?: string;
  tagline?: string;
  jobTitle?: string;
  travelBase?: string;
  replyTime?: string;
  socialLinks?: Profile['links'];
  bioShort?: string;
  bioMedium?: string;
  bioLong?: string;
  bioFull?: unknown[];
  bioUpdatedAt?: string;
  photos?: Profile['photos'];
  topicPillars?: Profile['topicPillars'];
  formats?: Profile['formats'];
  rider?: LabelledText[];
  goodToKnow?: LabelledText[];
  technicalRequirements?: string;
  avatarNote?: string;
}

export function getProfile(): Promise<Profile> {
  return memo('site:profile', async () => {
    const [p, settings] = await Promise.all([load<RawProfile | null>(profileQuery, null), getSiteSettings()]);
    const d = DEFAULT_PROFILE;
    const legacyLong = p?.bioFull?.length ? toPlainText(p.bioFull) : undefined;
    const legacyRider = p?.technicalRequirements
      ? p.technicalRequirements.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
          const [label, ...rest] = l.split(':');
          return rest.length ? { label: label.trim(), body: rest.join(':').trim() } : { label: 'Setup', body: l };
        })
      : [];
    return {
      name: str(p?.name, d.name),
      pronunciation: str(p?.pronunciation, d.pronunciation),
      tagline: str(p?.tagline, settings.nowLine || d.tagline),
      jobTitle: str(p?.jobTitle, d.jobTitle),
      travelBase: str(p?.travelBase, d.travelBase),
      replyTime: str(p?.replyTime, d.replyTime),
      links: {
        linkedin: p?.socialLinks?.linkedin || d.links.linkedin,
        bluesky: p?.socialLinks?.bluesky || d.links.bluesky,
        twitter: p?.socialLinks?.twitter || d.links.twitter,
        github: p?.socialLinks?.github || d.links.github,
        youtube: p?.socialLinks?.youtube || d.links.youtube,
        mentorcruise: p?.socialLinks?.mentorcruise || d.links.mentorcruise,
      },
      bios: {
        short: str(p?.bioShort, d.bios.short),
        medium: str(p?.bioMedium, d.bios.medium),
        long: str(p?.bioLong ?? legacyLong, d.bios.long),
        updatedAt: p?.bioUpdatedAt,
      },
      photos: (p?.photos ?? []).filter((ph) => ph?.asset),
      topicPillars: nonEmpty(p?.topicPillars?.filter((t) => t.title), d.topicPillars),
      formats: nonEmpty(p?.formats?.filter((f) => f.name), d.formats),
      rider: nonEmpty(p?.rider?.filter((r) => r.label && r.body), nonEmpty(legacyRider, d.rider)),
      goodToKnow: nonEmpty(p?.goodToKnow?.filter((r) => r.label && r.body), d.goodToKnow),
      avatarNote: str(p?.avatarNote, d.avatarNote),
    };
  });
}

// ─── Metrics ───────────────────────────────────────────────────────────────

const METRIC_FIELDS = `_id, value, label, qualifier, asOf, period, definition, context, domain, area, featured, "company": company->name, sourceUrl, order`;

export const metricsQuery = groq`{
  "metrics": *[_type == "metric" && status == "approved"] | order(coalesce(order, 999) asc) { ${METRIC_FIELDS} },
  "legacy": *[_type == "impactMetricV2" && defined(headlineNumber)] | order(coalesce(order, 999) asc) {
    _id, headlineNumber, prefix, unit, label, timeWindow, contextNote, domain, order
  }
}`;

interface RawLegacyMetric {
  _id: string;
  headlineNumber?: number | string;
  prefix?: string;
  unit?: string;
  label?: string;
  timeWindow?: string;
  contextNote?: string;
  domain?: string;
  order?: number;
}

const LEGACY_DOMAIN: Record<string, MetricDomain> = { community: 'community', product: 'engineering', leadership: 'career', speaking: 'speaking' };

export function finishMetric(m: Omit<Metric, 'dateLabel'>): Metric {
  return { ...m, dateLabel: m.period || (m.asOf ? monthYear(m.asOf) : undefined) };
}

/**
 * Approved V3 metrics. Legacy impactMetricV2 numbers are used only when no V3
 * metric exists yet, and are flagged `legacy` (no definition, no date).
 */
export function getMetrics(): Promise<Metric[]> {
  return memo('site:metrics', async () => {
    const { metrics, legacy } = await load<{ metrics: Omit<Metric, 'dateLabel'>[]; legacy: RawLegacyMetric[] }>(metricsQuery, {
      metrics: [],
      legacy: [],
    });
    if (metrics?.length) return metrics.map(finishMetric);
    return (legacy ?? []).map((l) =>
      finishMetric({
        _id: l._id,
        value: formatLegacyMetric(l),
        label: l.label ?? '',
        period: l.timeWindow,
        context: l.contextNote,
        domain: LEGACY_DOMAIN[l.domain ?? ''] ?? 'engineering',
        area: LEGACY_METRIC_AREA[l.domain ?? ''],
        order: l.order,
        legacy: true,
      })
    );
  });
}

export async function getMetricsByDomain(domain: MetricDomain): Promise<Metric[]> {
  return (await getMetrics()).filter((m) => m.domain === domain);
}

// ─── Community ─────────────────────────────────────────────────────────────

export const communitiesQuery = groq`*[_type == "community"] | order(coalesce(founded, 9999) asc) {
  _id, name, "slug": slug.current, role, founded, city, url, headline, caseStudyHeadline, summary,
  "pillars": coalesce(pillars[]{ kicker, title, body, link }, []),
  "metrics": coalesce(metrics[]->{ ${METRIC_FIELDS}, status }, []),
  "recognition": coalesce(recognition[confirmed == true]{ title, issuer, year, url }, []),
  "aftermovie": aftermovie{
    title, caption, credit,
    "fileUrl": video.asset->url, "mimeType": video.asset->mimeType, "captionsUrl": captions.asset->url,
    "url": coalesce(url, video.asset->url),
    "published": published == true && (defined(url) || defined(video.asset)),
    "poster": poster${IMAGE}
  },
  "photos": coalesce(photos[]${IMAGE}, []),
  "platformProject": platformProject->{ title, "slug": slug.current }
}`;

export function getCommunities(): Promise<Community[]> {
  return memo('site:communities', async () => {
    const list = await load<Community[]>(communitiesQuery, []);
    return list.map((c) => ({
      ...c,
      metrics: ((c.metrics ?? []) as (Omit<Metric, 'dateLabel'> & { status?: string })[])
        .filter((m) => m && m.status === 'approved')
        .map(({ status: _status, ...m }) => finishMetric(m)),
    }));
  });
}

/** The primary community (ZurichJS): the one referenced from Home, else the first. */
export async function getPrimaryCommunity(id?: string): Promise<Community | undefined> {
  const list = await getCommunities();
  return list.find((c) => c._id === id) ?? list[0];
}

