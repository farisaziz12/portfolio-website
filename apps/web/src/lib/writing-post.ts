/**
 * One post on this site, with its body, for /blog/[slug] and its .md mirror.
 * The timeline (getWriting) carries list fields only; the article needs the
 * Portable Text body, corrections and related talk/event. Failure-tolerant
 * like every v3 loader: a CMS outage resolves to null, never throws.
 */
import groq from 'groq';
import type { Topic } from 'shared';
import { load, IMAGE, TALK_REF } from './sanity/v3/fetch';
import type { SanityImage, TalkRef } from './sanity/v3';

export interface Correction {
  date?: string;
  note: string;
}

export interface WritingPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body: unknown[];
  coverImage?: SanityImage;
  publishedAt: string;
  updatedAt?: string;
  topic?: Topic;
  category?: string;
  tags: string[];
  corrections: Correction[];
  relatedTalk?: TalkRef;
  relatedEvent?: { _id: string; title: string; slug: string; date?: string };
  seoTitle?: string;
  seoDescription?: string;
  minutes?: number;
}

export const writingPostQuery = groq`*[_type == "blogPost" && published == true && slug.current == $slug][0] {
  _id, title, "slug": slug.current, excerpt, publishedAt, updatedAt, topic, category,
  "tags": coalesce(tags, []),
  "body": coalesce(body[]{ ..., _type == "image" => { ..., "dimensions": asset->metadata.dimensions } }, []),
  "coverImage": coverImage${IMAGE},
  "corrections": coalesce(corrections[defined(note)]{ date, note }, []),
  "relatedTalk": relatedTalk->${TALK_REF},
  "relatedEvent": relatedEvent->{ _id, title, "slug": slug.current, date },
  seoTitle, seoDescription,
  "minutes": round(length(pt::text(body)) / 5 / 220)
}`;

const TOPIC_BY_CATEGORY: Record<string, Topic> = { retrospective: 'careers', announcement: 'community' };

export async function getWritingPost(slug: string): Promise<WritingPost | null> {
  const p = await load<WritingPost | null>(writingPostQuery, null, { slug });
  if (!p) return null;
  return {
    ...p,
    topic: p.topic ?? (p.category ? TOPIC_BY_CATEGORY[p.category] : undefined) ?? 'engineering',
    body: p.body ?? [],
    tags: p.tags ?? [],
    corrections: (p.corrections ?? []).sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '')),
    relatedTalk: p.relatedTalk ?? undefined,
    relatedEvent: p.relatedEvent?.slug ? p.relatedEvent : undefined,
    minutes: p.minutes ? Math.max(1, p.minutes) : undefined,
  };
}

/** Share intents: plain links, no SDKs. */
export function shareLinks(url: string, title: string): { label: string; href: string }[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'Bluesky', href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}` },
    { label: 'X', href: `https://x.com/intent/post?text=${t}&url=${u}` },
  ];
}
