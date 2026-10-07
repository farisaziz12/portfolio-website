/**
 * Praise: V3 `praise` documents, plus V2 `socialPost` / `testimonial` mapped
 * into the same shape until they're migrated. A legacy document is skipped
 * once a praise document records it in `legacyId`.
 */
import groq from 'groq';
import { PRAISE_TOPICS, type PraisePlatform, type PraiseTopic } from 'shared';
import { load, memo, TALK_REF, WORKSHOP_REF } from './fetch';
import { monthYear } from './dates';
import type { Praise } from './types';

const EVENT_REF = `{ _id, title, "slug": slug.current }`;

export const praiseQuery = groq`{
  "praise": *[_type == "praise" && defined(quote)] {
    _id, quote, pullQuote, platform, url, date, topic, label, featured, order, legacyId,
    "author": author{ name, handle, headline, image },
    "talk": talk->${TALK_REF}, "workshop": workshop->${WORKSHOP_REF}, "event": event->${EVENT_REF}
  },
  "social": *[_type == "socialPost" && defined(content)] {
    _id, "quote": content, platform, url, "date": postDate, context, featured, order,
    "author": { "name": author, "handle": authorHandle, "headline": authorRole, "image": authorImage },
    "talk": relatedTalk->${TALK_REF}, "event": relatedEvent->${EVENT_REF}
  },
  "testimonials": *[_type == "testimonial" && defined(quote)] {
    _id, quote, type, "url": source, date, context, featured,
    "author": { "name": author, "headline": array::join([role, company][defined(@)], " · "), "image": image }
  }
}`;

type RawPraise = Omit<Praise, 'label' | 'featured' | 'topic' | 'platform'> & {
  platform?: string;
  topic?: PraiseTopic;
  label?: string;
  featured?: boolean;
  legacyId?: string;
  context?: string;
  type?: string;
};

const SOCIAL_CONTEXT: Record<string, PraiseTopic> = { talk: 'talk', work: 'work', recommendation: 'work', mention: 'stage', other: 'stage' };
const TESTIMONIAL_CONTEXT: Record<string, PraiseTopic> = {
  mentored: 'mentoring',
  workshop_attendee: 'workshop',
  conference_attendee: 'stage',
  speaking: 'stage',
  worked_together: 'work',
  managed: 'work',
  reported: 'work',
  consulting: 'work',
  collaboration: 'work',
};
const TESTIMONIAL_TYPE: Record<string, PraiseTopic> = { workshop: 'workshop', talk: 'talk', mentorcruise: 'mentoring' };

function platformOf(p?: string, type?: string): PraisePlatform {
  if (p === 'twitter' || p === 'x') return 'x';
  if (p === 'linkedin' || p === 'bluesky' || p === 'mentorcruise' || p === 'direct') return p;
  if (type === 'linkedin') return 'linkedin';
  if (type === 'mentorcruise') return 'mentorcruise';
  return 'direct';
}

/** "On the caching talk" · "On the workshop" · "On mentoring" · "On stage". */
export function praiseLabel(p: Pick<Praise, 'topic' | 'talk' | 'workshop'> & { label?: string }): string {
  if (p.label) return p.label;
  if (p.topic === 'talk' && p.talk) return `On ${p.talk.shortTitle || p.talk.title}`;
  switch (p.topic) {
    case 'talk':
      return 'On the talk';
    case 'workshop':
      return 'On the workshop';
    case 'mentoring':
      return 'On mentoring';
    case 'community':
      return 'On ZurichJS';
    case 'work':
      return 'On working together';
    default:
      return 'On stage';
  }
}

function finish(raw: RawPraise, extra: Partial<Praise> = {}): Praise | null {
  if (!raw.quote || !raw.author?.name) return null;
  const topic = (extra.topic ?? raw.topic ?? (raw.talk ? 'talk' : 'stage')) as PraiseTopic;
  const base = {
    _id: raw._id,
    quote: raw.quote.trim(),
    pullQuote: raw.pullQuote,
    platform: platformOf(raw.platform, raw.type),
    url: raw.url,
    date: raw.date,
    author: raw.author,
    topic: PRAISE_TOPICS.some((t) => t.value === topic) ? topic : 'stage',
    talk: raw.talk ?? undefined,
    workshop: raw.workshop ?? undefined,
    event: raw.event ?? undefined,
    featured: Boolean(raw.featured),
    order: raw.order,
    ...extra,
  } satisfies Omit<Praise, 'label'>;
  return { ...base, label: praiseLabel({ ...base, label: raw.label }) };
}

export function getAllPraise(): Promise<Praise[]> {
  return memo('praise:all', async () => {
    const data = await load<{ praise: RawPraise[]; social: RawPraise[]; testimonials: RawPraise[] }>(praiseQuery, {
      praise: [],
      social: [],
      testimonials: [],
    });
    const migrated = new Set((data.praise ?? []).map((p) => p.legacyId?.split(':').pop()).filter(Boolean));
    const out = [
      ...(data.praise ?? []).map((p) => finish(p)),
      ...(data.social ?? [])
        .filter((p) => !migrated.has(p._id))
        .map((p) => finish(p, { legacy: true, topic: SOCIAL_CONTEXT[p.context ?? ''] ?? (p.talk ? 'talk' : 'stage') })),
      ...(data.testimonials ?? [])
        .filter((p) => !migrated.has(p._id))
        .map((p) =>
          finish(p, { legacy: true, topic: TESTIMONIAL_CONTEXT[p.context ?? ''] ?? TESTIMONIAL_TYPE[p.type ?? ''] ?? 'work' })
        ),
    ].filter((p): p is Praise => Boolean(p));
    return out.sort(byCmsOrder);
  });
}

/** CMS order: featured first, then `order` ascending, then newest. */
export function byCmsOrder(a: Praise, b: Praise): number {
  return (
    Number(b.featured) - Number(a.featured) ||
    (a.order ?? 999) - (b.order ?? 999) ||
    (b.date ?? '').localeCompare(a.date ?? '')
  );
}

/**
 * The first `limit` community-topic quotes from an already CMS-ordered list.
 * No fallback to stage or workshop praise: fewer community quotes means fewer cards.
 */
export function pickCommunityPraise(all: Praise[], limit = 2): Praise[] {
  return all.filter((p) => p.topic === 'community').slice(0, limit);
}

/** Quotes about ZurichJS and its organisers, for the community page and its mirror. */
export async function getCommunityPraise(limit = 2): Promise<Praise[]> {
  return pickCommunityPraise(await getAllPraise(), limit);
}

export async function getFeaturedPraise(limit = 6): Promise<Praise[]> {
  const all = await getAllPraise();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getPraiseFor(opts: { talkId?: string; workshopId?: string; eventId?: string; topic?: PraiseTopic }): Promise<Praise[]> {
  const all = await getAllPraise();
  return all.filter(
    (p) =>
      (opts.talkId && p.talk?._id === opts.talkId) ||
      (opts.workshopId && p.workshop?._id === opts.workshopId) ||
      (opts.eventId && p.event?._id === opts.eventId) ||
      (opts.topic && p.topic === opts.topic)
  );
}

/** Card text: the pull quote when set, else the quote trimmed to ~`max` chars at a word boundary. */
export function shortQuote(p: Pick<Praise, 'quote' | 'pullQuote'>, max = 140): string {
  if (p.pullQuote) return p.pullQuote;
  if (p.quote.length <= max) return p.quote;
  const cut = p.quote.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
}

export const PLATFORM_LABEL: Record<PraisePlatform, string> = {
  linkedin: 'LinkedIn',
  x: 'X',
  bluesky: 'Bluesky',
  mentorcruise: 'MentorCruise',
  direct: 'Direct',
};

/** "Name · Headline · LinkedIn, Mar 2026": the attribution line under a quote card. */
export function praiseAttribution(p: Pick<Praise, 'author' | 'platform' | 'date'>): string {
  const when = [PLATFORM_LABEL[p.platform] !== 'Direct' ? PLATFORM_LABEL[p.platform] : null, monthYear(p.date)].filter(Boolean).join(', ');
  return [p.author.name, p.author.headline, when].filter(Boolean).join(' · ');
}
