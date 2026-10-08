/**
 * `Accept: text/markdown` content negotiation, done in Vercel's router.
 *
 * Every page except `/` is a static file, and `/` is ISR-cached by path only
 * (the cache ignores `Vary`), so negotiation cannot live in page code: the
 * first variant rendered would be served to everyone. Instead we add routes to
 * `.vercel/output/config.json` (Build Output API v3) that pick the variant
 * before any cache is consulted:
 *
 *   - `/` and every page with a `.md` mirror: `Accept: text/markdown` is
 *     rewritten to the mirror (`/` → `/home.md`, `/talks` → `/talks.md`).
 *   - Unknown paths: `Accept: text/markdown` gets `/404.md` with status 404.
 *   - All negotiated responses, HTML included, carry `Vary: Accept`.
 *
 * Browsers never send `text/markdown`, so HTML visitors see no change.
 * The routes are added by `integrations/markdown-negotiation.ts` after the
 * Vercel adapter writes its config.
 */

export interface VercelRoute {
  src?: string;
  dest?: string;
  handle?: string;
  status?: number;
  continue?: boolean;
  headers?: Record<string, string>;
  has?: { type: 'header'; key: string; value?: string }[];
  [key: string]: unknown;
}

/** Path of the markdown 404 body (src/pages/404.md.ts). */
export const NOT_FOUND_MD = '/404.md';
/** Markdown mirror of `/` (src/pages/home.md.ts). */
export const HOME_MD = '/home.md';

/** Matches any Accept header that names text/markdown. Vercel anchors `has` values. */
export const ACCEPTS_MARKDOWN = { type: 'header', key: 'accept', value: '.*text/markdown.*' } as const;

export const MARKDOWN_HEADERS = { 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept' };

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Page paths that can be negotiated: each `.md` mirror with an HTML sibling
 * (`talks.md` + `talks/index.html` → `talks`). `home.md` and `404.md` are
 * handled separately.
 */
export function negotiablePages(files: string[]): string[] {
  const set = new Set(files.map((f) => f.replace(/^\/+/, '')));
  return files
    .map((f) => f.replace(/^\/+/, ''))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.slice(0, -'.md'.length))
    .filter((page) => page !== 'home' && page !== '404')
    .filter((page) => set.has(`${page}/index.html`) || set.has(`${page}.html`))
    .sort();
}

/** Routes that go before `{ handle: 'filesystem' }`. */
export function beforeFilesystemRoutes(pages: string[]): VercelRoute[] {
  const alternation = pages.map(escapeRegex).join('|');
  const routes: VercelRoute[] = [
    // Vary on both variants, so shared caches keep HTML and Markdown apart.
    { src: pages.length ? `^/(?:${alternation})?/?$` : '^/$', headers: { Vary: 'Accept' }, continue: true },
    { src: '^/$', has: [ACCEPTS_MARKDOWN], dest: HOME_MD, headers: MARKDOWN_HEADERS },
  ];
  if (pages.length) {
    routes.push({ src: `^/(${alternation})/?$`, has: [ACCEPTS_MARKDOWN], dest: '/$1.md', headers: MARKDOWN_HEADERS });
  }
  routes.push(
    // Short-path misses redirect to /404; keep that a Markdown 404 too.
    { src: '^/404/?$', has: [ACCEPTS_MARKDOWN], dest: NOT_FOUND_MD, status: 404, headers: MARKDOWN_HEADERS },
    // The 404 body is never a 200, even when fetched by name.
    { src: `^${escapeRegex(NOT_FOUND_MD)}$`, dest: NOT_FOUND_MD, status: 404, headers: MARKDOWN_HEADERS },
  );
  return routes;
}

/** Route that goes right before the adapter's final `^/.*$` → /404.html catch-all. */
export function notFoundRoute(): VercelRoute {
  return { src: '^/.*$', has: [ACCEPTS_MARKDOWN], dest: NOT_FOUND_MD, status: 404, headers: MARKDOWN_HEADERS };
}

/**
 * Insert the negotiation routes into the adapter's route list. Returns a new
 * array; throws if the list doesn't have the shape we expect, so a future
 * adapter change fails the build instead of silently dropping negotiation.
 */
export function withMarkdownNegotiation(routes: VercelRoute[], pages: string[]): VercelRoute[] {
  // Already applied (the hook ran twice): never stack duplicate routes.
  if (routes.some((r) => r.dest === HOME_MD)) return routes;
  const out = [...routes];
  const fs = out.findIndex((r) => r.handle === 'filesystem');
  if (fs === -1) throw new Error('markdown-negotiation: no { handle: "filesystem" } route in config.json');
  out.splice(fs, 0, ...beforeFilesystemRoutes(pages));
  const catchAll = out.findLastIndex((r) => r.src === '^/.*$' && r.status === 404 && !r.has);
  if (catchAll === -1) throw new Error('markdown-negotiation: no 404 catch-all route in config.json');
  out.splice(catchAll, 0, notFoundRoute());
  return out;
}
