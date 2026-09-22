import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Public published-content client. No token → Sanity CDN in production.
 * Mutations use `getSanityWriteClient()` (SANITY_API_TOKEN) instead.
 */
const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID || '94fb4yui';
const dataset = import.meta.env.SANITY_STUDIO_DATASET || 'production';
const apiVersion = '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/** Origin API (no CDN) — for admin live phase so End/Reopen isn't masked by a stale cache. */
export const freshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return client.fetch<T>(query, params);
}

export async function sanityFetchFresh<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return freshClient.fetch<T>(query, params);
}
