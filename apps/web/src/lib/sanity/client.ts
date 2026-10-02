import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Public published-content client. No token → Sanity CDN in production.
 */
// `?? {}` so the loaders also run under plain Node (tsx tests, scripts).
const viteEnv: Record<string, string | undefined> = import.meta.env ?? {};
const projectId = viteEnv.SANITY_STUDIO_PROJECT_ID || '94fb4yui';
const dataset = viteEnv.SANITY_STUDIO_DATASET || 'production';
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

/**
 * Offline fixture mode: `SANITY_FIXTURES=1 pnpm dev` evaluates every GROQ
 * query locally (groq-js) against `fixtures/sanity-dataset.json`, so the site
 * renders realistic content with no network or credentials. Dev/CI only.
 */
const useFixtures = Boolean(viteEnv.SANITY_FIXTURES || process.env.SANITY_FIXTURES);
let fixtureDataset: Promise<unknown[]> | null = null;

async function fixtureFetch<T>(query: string, params: Record<string, unknown>): Promise<T> {
  const [{ parse, evaluate }, { readFile }, { join }] = await Promise.all([
    import('groq-js'),
    import('node:fs/promises'),
    import('node:path'),
  ]);
  // Resolved from the app root (cwd for `astro dev` / `astro build`), not the bundle.
  const file = process.env.SANITY_FIXTURES_PATH || join(process.cwd(), 'fixtures', 'sanity-dataset.json');
  fixtureDataset ??= readFile(file, 'utf8').then(
    (raw) => JSON.parse(raw) as unknown[]
  );
  const tree = parse(query, { params });
  const result = await evaluate(tree, { dataset: await fixtureDataset, params });
  return (await result.get()) as T;
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  opts: { cdn?: boolean } = {}
): Promise<T> {
  if (useFixtures) return fixtureFetch<T>(query, params);
  const c = opts.cdn === false ? liveClient : client;
  return c.fetch<T>(query, params);
}
