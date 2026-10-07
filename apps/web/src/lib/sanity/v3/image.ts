/**
 * Image helpers that need no network: the editor's hotspot as a CSS focus,
 * and the home hero's photo set with its press-photo fallback.
 */
import type { PressPhoto, SanityImage } from './types';

const pct = (n: number) => `${Math.round(Math.min(1, Math.max(0, n)) * 1000) / 10}%`;

/**
 * The hotspot centre as an `object-position` value, relative to the image
 * the CDN serves (Sanity applies the editor's crop first, so the hotspot is
 * re-expressed inside that rectangle). Undefined when no hotspot is set.
 */
export function hotspotFocus(image?: SanityImage | null): string | undefined {
  const h = image?.hotspot;
  if (!h || !Number.isFinite(h.x) || !Number.isFinite(h.y)) return undefined;
  const c = image?.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const w = 1 - c.left - c.right;
  const hgt = 1 - c.top - c.bottom;
  const x = w > 0 ? (h.x - c.left) / w : h.x;
  const y = hgt > 0 ? (h.y - c.top) / hgt : h.y;
  return `${pct(x)} ${pct(y)}`;
}

/** Press photo tags that make a good wide hero shot, best first. */
const HERO_TAG_ORDER = ['stage', 'speaking', 'workshop', 'community', 'hosting'];

/**
 * Home hero photos: the ones picked on the Home page, else the press photos
 * (stage shots first, portraits last), so the hero is never an empty band.
 */
export function homeHeroPhotos(heroPhotos: SanityImage[], pressPhotos: PressPhoto[]): SanityImage[] {
  const picked = heroPhotos.filter((p) => p?.asset);
  if (picked.length) return picked;
  const rank = (p: PressPhoto) => {
    const i = HERO_TAG_ORDER.indexOf((p.tag ?? '').toLowerCase());
    return i === -1 ? HERO_TAG_ORDER.length : i;
  };
  return pressPhotos
    .filter((p) => p?.asset)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i)
    .map(({ p }) => p)
    .slice(0, 3);
}
