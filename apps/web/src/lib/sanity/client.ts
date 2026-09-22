import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Public published-content client. No token → Sanity CDN in production.
 * Mutations use `getSanityWriteClient()` (SANITY_API_TOKEN) instead.
 */
export const client = createClient({
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || '94fb4yui',
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
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
