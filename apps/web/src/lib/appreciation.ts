/**
 * What people say (/appreciation and its markdown mirror): filter options
 * built from the praise that exists, so a pill never leads to nothing.
 */
import { PRAISE_PLATFORMS, PRAISE_TOPICS, type PraisePlatform, type PraiseTopic } from 'shared';
import { PLATFORM_LABEL, type Praise } from './sanity/v3';

/** Short pill labels for praise topics. */
export const PRAISE_TOPIC_LABEL: Record<PraiseTopic, string> = {
  stage: 'Speaking',
  talk: 'Talk',
  workshop: 'Workshop',
  mentoring: 'Mentoring',
  community: 'Community',
  work: 'Working together',
};

export interface PillOption {
  value: string;
  label: string;
  count: number;
}

export function praiseFilters(praise: Praise[]): { topics: PillOption[]; platforms: PillOption[] } {
  const count = <K extends string>(key: (p: Praise) => K) => {
    const m = new Map<K, number>();
    for (const p of praise) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
    return m;
  };
  const byTopic = count((p) => p.topic);
  const byPlatform = count((p) => p.platform);
  return {
    // Pill order follows PRAISE_TOPIC_LABEL (Speaking first), not the schema order.
    topics: (Object.keys(PRAISE_TOPIC_LABEL) as PraiseTopic[])
      .filter((t) => PRAISE_TOPICS.some((o) => o.value === t) && byTopic.has(t))
      .map((t) => ({ value: t, label: PRAISE_TOPIC_LABEL[t], count: byTopic.get(t) ?? 0 })),
    platforms: PRAISE_PLATFORMS.filter((p) => byPlatform.has(p.value)).map((p) => ({
      value: p.value,
      label: PLATFORM_LABEL[p.value as PraisePlatform],
      count: byPlatform.get(p.value) ?? 0,
    })),
  };
}

/** "LinkedIn, X and Bluesky" */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
