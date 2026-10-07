/**
 * Home page composition: resolves editorial references against the shared
 * loaders so recordings, dates and counts stay derived.
 */
import { getHomePage } from './site';
import { getAllPraise, getFeaturedPraise } from './praise';
import { getTalks } from './talks';
import { getWriting } from './writing';
import type { FeaturedItem, Praise } from './types';

/** Three posters: the flagship talk, then two conversations/posts. */
export async function getHomeFeatured(): Promise<FeaturedItem[]> {
  const [home, talks, writing] = await Promise.all([getHomePage(), getTalks(), getWriting()]);
  const picked: FeaturedItem[] = [];
  for (const ref of home.featuredRefs) {
    if (ref._type === 'talk') {
      const talk = talks.find((t) => t._id === ref._id);
      if (talk) picked.push({ kind: 'talk', talk });
    } else {
      const item = writing.find((w) => w._id === ref._id);
      if (item) picked.push({ kind: 'writing', item });
    }
  }
  if (picked.length) return picked.slice(0, 3);

  // Fallback: legacy homepage flag → a talk with a recording → podcasts, then newest writing.
  const flagship =
    talks.find((t) => t.legacyHomepageFeatured) ?? talks.find((t) => t.isBookable && t.recording) ?? talks.find((t) => t.isBookable);
  if (flagship) picked.push({ kind: 'talk', talk: flagship });
  const conversations = writing.filter((w) => w.format !== 'article');
  for (const item of [...conversations, ...writing.filter((w) => w.format === 'article')]) {
    if (picked.length >= 3) break;
    if (!picked.some((p) => p.kind === 'writing' && p.item._id === item._id)) picked.push({ kind: 'writing', item });
  }
  return picked;
}

/** "What people say": [spotlight, ...cards]. */
export async function getHomePraise(): Promise<{ spotlight?: Praise; cards: Praise[]; underPosters?: Praise }> {
  const [home, all] = await Promise.all([getHomePage(), getAllPraise()]);
  const byId = new Map(all.map((p) => [p._id, p]));
  const chosen = home.praiseIds.map((id) => byId.get(id)).filter((p): p is Praise => Boolean(p));
  const list = chosen.length ? chosen : await getFeaturedPraise(7);
  const underPosters = (home.featuredQuoteId && byId.get(home.featuredQuoteId)) || all.find((p) => p.topic === 'talk' && p.talk);
  return { spotlight: list[0], cards: list.slice(1, 7), underPosters };
}
