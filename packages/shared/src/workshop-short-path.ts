/**
 * Short attend redirects: faziz-dev.com/<shortPath> → /workshops/attend/<token>
 *
 * Reserved so CMS editors cannot shadow real site routes.
 */
export const WORKSHOP_SHORT_PATH_RESERVED = [
  '404',
  'about',
  'admin',
  'api',
  'appreciation',
  'blog',
  'consulting',
  'contact',
  'events',
  'gallery',
  'home',
  'impact',
  'invite',
  'llms.txt',
  'media',
  'mentorship',
  'og',
  'press-kit',
  'projects',
  'rss.xml',
  'services',
  'speaking',
  'talks',
  'workshops',
] as const;

const RESERVED = new Set<string>(WORKSHOP_SHORT_PATH_RESERVED);

/** Lowercase kebab segment: survive, cityjs-london, … */
const SHORT_PATH_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeWorkshopShortPath(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const path = raw.trim().toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
  if (!path || path.includes('/') || path.includes('.')) return null;
  if (!SHORT_PATH_RE.test(path)) return null;
  if (RESERVED.has(path)) return null;
  return path;
}

export function isReservedWorkshopShortPath(path: string): boolean {
  return RESERVED.has(path.trim().toLowerCase());
}

export function workshopShortUrl(shortPath: string, origin = 'https://faziz-dev.com'): string {
  const path = normalizeWorkshopShortPath(shortPath);
  if (!path) throw new Error(`Invalid workshop short path: ${shortPath}`);
  return `${origin.replace(/\/$/, '')}/${path}`;
}

export function workshopAttendUrl(token: string, origin = 'https://faziz-dev.com'): string {
  return `${origin.replace(/\/$/, '')}/workshops/attend/${token}`;
}
