/**
 * Shared fetch plumbing for the V3 loaders: failure-tolerant (a CMS outage
 * returns the fallback, never throws) and memoised for a short TTL so a
 * static build that renders 200 pages runs each query once, while the ISR
 * homepage still picks up publishes.
 */
import { sanityFetch } from '../client';

const TTL_MS = 60_000;
const cache = new Map<string, { at: number; value: Promise<unknown> }>();

export function load<T>(query: string, fallback: T, params: Record<string, unknown> = {}): Promise<T> {
  const key = `${query}::${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as Promise<T>;
  const value = sanityFetch<T | null>(query, params)
    .catch(() => fallback)
    .then((res) => (res ?? fallback) as T);
  cache.set(key, { at: Date.now(), value });
  return value;
}

/** Memoise a derived computation (same TTL as the queries it reads). */
export function memo<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(`memo::${key}`);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as Promise<T>;
  const value = fn();
  cache.set(`memo::${key}`, { at: Date.now(), value });
  // Never cache a failure: the next caller retries.
  value.catch(() => cache.delete(`memo::${key}`));
  return value;
}

export const IMAGE = `{ ..., "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip }`;
export const TALK_REF = `{ _id, title, shortTitle, "slug": slug.current, pillar, summary, duration }`;
export const WORKSHOP_REF = `{ _id, title, "slug": slug.current, duration, pillar }`;
