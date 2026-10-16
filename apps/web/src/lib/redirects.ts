/**
 * Permanent redirects for retired URLs (V3 IA). Used by astro.config.mjs and
 * by loaders, so a CMS page whose URL redirects away is never built.
 * /services is the "How I can help" overview again; /consulting folds into it.
 * /media folds into the press kit. CMS-driven /services/[slug] landing pages
 * still live under /services/.
 */
export const REDIRECTS: Record<string, string> = {
  '/services/speaking': '/speaking',
  '/consulting': '/services',
  '/media': '/press-kit',
  '/schedule': '/events',
  '/writing': '/blog',
  '/track-record': '/impact',
};

/** True when `path` is redirected elsewhere, so no page may be built there. */
export function isRedirected(path: string): boolean {
  return path in REDIRECTS;
}

/** CMS documents whose `<prefix>/<slug>` URL is free to build (not redirected away). */
export function withoutRedirected<T extends { slug: string }>(docs: T[], prefix: string): T[] {
  return docs.filter((d) => !isRedirected(`${prefix}/${d.slug}`));
}
