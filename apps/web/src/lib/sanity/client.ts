import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Public published-content client. No token → Sanity CDN in production.
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

/** Same dataset, no CDN — for short-path redirects that must see Studio publishes quickly. */
const liveClient = createClient({
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
  params: Record<string, unknown> = {},
  opts: { cdn?: boolean } = {}
): Promise<T> {
  const c = opts.cdn === false ? liveClient : client;
  return c.fetch<T>(query, params);
}
