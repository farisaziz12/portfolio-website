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

const DEFAULT_MAX = 24;

/**
 * Default short path from an event name (e.g. "CityJS London 2026" → "cityjs-london").
 * Editors can override in Studio after Generate.
 */
export function defaultWorkshopShortPath(event: string): string {
  const base = event
    .toLowerCase()
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

  let slug = base;
  if (slug.length > DEFAULT_MAX) {
    const parts = slug.split('-').filter(Boolean);
    let built = '';
    for (const part of parts) {
      const next = built ? `${built}-${part}` : part;
      if (next.length > DEFAULT_MAX) break;
      built = next;
    }
    slug = built || slug.slice(0, DEFAULT_MAX).replace(/-$/, '');
  }

  if (!slug || RESERVED.has(slug) || !SHORT_PATH_RE.test(slug)) {
    const seed = (slug || 'ws').slice(0, 16).replace(/(^-|-$)/g, '') || 'ws';
    const rand = Math.random().toString(36).slice(2, 5);
    slug = `${seed}-${rand}`.replace(/-+/g, '-');
  }

  return slug;
}

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
