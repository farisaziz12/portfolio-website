/**
 * "Writing & conversations": one timeline for posts on this site and
 * articles, podcasts and videos published elsewhere.
 */
import groq from 'groq';
import { LEGACY_EXTERNAL_TYPE_FORMAT, type PublicationFormat, type Topic } from 'shared';
import { load, memo, IMAGE, TALK_REF } from './fetch';
import type { WritingItem } from './types';

const TOPIC_BY_CATEGORY: Record<string, Topic> = {
  retrospective: 'careers',
  announcement: 'community',
};

export const writingQuery = groq`{
  "posts": *[_type == "blogPost" && published == true && defined(slug.current)] | order(publishedAt desc) {
    _id, title, "slug": slug.current, excerpt, publishedAt, topic, category, featured,
    "hasCorrections": count(corrections) > 0,
    "image": coverImage${IMAGE},
    "relatedTalk": relatedTalk->${TALK_REF},
    "minutes": round(length(pt::text(body)) / 5 / 220)
  },
  "external": *[_type == "externalPost" && defined(url)] | order(publishedAt desc) {
    _id, title, url, format, type, topic, source, episode, excerpt, publishedAt, durationMinutes, featured,
    "image": image${IMAGE},
    "relatedTalk": relatedTalk->${TALK_REF}
  }
}`;

interface RawPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  topic?: Topic;
  category?: string;
  featured?: boolean;
  hasCorrections?: boolean;
  image?: WritingItem['image'];
  relatedTalk?: WritingItem['relatedTalk'] | null;
  minutes?: number;
}

interface RawExternal {
  _id: string;
  title: string;
  url: string;
  format?: PublicationFormat;
  type?: string;
  topic?: Topic;
  source?: string;
  episode?: string;
  excerpt?: string;
  publishedAt?: string;
  durationMinutes?: number;
  featured?: boolean;
  image?: WritingItem['image'];
  relatedTalk?: WritingItem['relatedTalk'] | null;
}

export function getWriting(): Promise<WritingItem[]> {
  return memo('writing:all', async () => {
    const { posts, external } = await load<{ posts: RawPost[]; external: RawExternal[] }>(writingQuery, { posts: [], external: [] });
    const items: WritingItem[] = [
      ...(posts ?? []).map<WritingItem>((p) => ({
        _id: p._id,
        kind: 'post',
        format: 'article',
        topic: p.topic ?? (p.category ? TOPIC_BY_CATEGORY[p.category] : undefined) ?? 'engineering',
        title: p.title,
        date: p.publishedAt,
        source: 'On this site',
        sourceNote: p.hasCorrections ? 'includes corrections' : undefined,
        href: `/blog/${p.slug}`,
        isInternal: true,
        minutes: p.minutes ? Math.max(1, p.minutes) : undefined,
        excerpt: p.excerpt,
        image: p.image,
        hasCorrections: p.hasCorrections,
        featured: p.featured,
        relatedTalk: p.relatedTalk ?? undefined,
      })),
      ...(external ?? []).map<WritingItem>((e) => ({
        _id: e._id,
        kind: 'external',
        format: e.format ?? LEGACY_EXTERNAL_TYPE_FORMAT[e.type ?? ''] ?? 'article',
        topic: e.topic,
        title: e.title,
        date: e.publishedAt ?? '',
        source: e.source || hostLabel(e.url),
        sourceNote: e.episode,
        href: e.url,
        isInternal: false,
        minutes: e.durationMinutes,
        excerpt: e.excerpt,
        image: e.image,
        featured: e.featured,
        relatedTalk: e.relatedTalk ?? undefined,
      })),
    ];
    return items.filter((i) => i.date).sort((a, b) => b.date.localeCompare(a.date));
  });
}

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** "Read · 4 min" / "Listen" / "Watch" */
export function writingAction(item: Pick<WritingItem, 'format' | 'minutes'>): string {
  if (item.format === 'podcast') return 'Listen';
  if (item.format === 'video') return 'Watch';
  return item.minutes ? `Read · ${item.minutes} min` : 'Read';
}
