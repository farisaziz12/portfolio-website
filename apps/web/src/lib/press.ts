/**
 * Press kit helpers: bio metadata and per-photo crop variants with direct
 * Sanity download URLs. Shared by /press-kit and /press-kit.md.
 *
 * Crop math (from the V3 mock): for a target ratio r, keep the full height
 * when the source is wider than r, otherwise keep the full width. Downloads use
 * `fit=crop&crop=focalpoint` with the editor's hotspot as `fp-x/fp-y`, and
 * `dl=faris-aziz-<tag>-<ratio>.jpg` so browsers save a sensible file name.
 */
import { urlFor } from './sanity/client';
import type { PressPhoto } from './sanity/v3';

export const CROPS = [
  { key: 'original', label: 'Original', ratio: null },
  { key: '1x1', label: '1:1', ratio: 1 },
  { key: '4x5', label: '4:5', ratio: 4 / 5 },
  { key: '16x9', label: '16:9', ratio: 16 / 9 },
] as const;

export type CropKey = (typeof CROPS)[number]['key'];

export interface PhotoVariant {
  key: CropKey;
  label: string;
  /** Final pixel size of the download. */
  width: number;
  height: number;
  size: string;
  filename: string;
  download: string;
  preview: string;
  previewWidth: number;
  previewHeight: number;
}

export interface PressPhotoView {
  id: string;
  tag: string;
  label: string;
  alt: string;
  credit?: string;
  variants: PhotoVariant[];
}

const PREVIEW_W = 600;

/** Asset dimensions from metadata, else parsed from the `image-<id>-WxH-ext` ref. */
export function photoDims(p: PressPhoto): { width: number; height: number } | undefined {
  if (p.dimensions?.width && p.dimensions?.height) return { width: p.dimensions.width, height: p.dimensions.height };
  const ref = p.asset?._ref || p.asset?._id || '';
  const m = /-(\d+)x(\d+)-[a-z0-9]+$/i.exec(ref);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : undefined;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo';
}

function cropped(p: PressPhoto, w: number, h: number) {
  let b = urlFor(p).width(w).height(h).fit('crop').crop('focalpoint');
  if (p.hotspot) b = b.focalPoint(Number(p.hotspot.x.toFixed(4)), Number(p.hotspot.y.toFixed(4)));
  return b;
}

export function pressPhotoView(p: PressPhoto, i: number): PressPhotoView | undefined {
  const dims = photoDims(p);
  if (!dims || !p.asset) return undefined;
  const tag = p.tag ? p.tag.charAt(0).toUpperCase() + p.tag.slice(1) : `Photo ${i + 1}`;
  const variants = CROPS.map((c): PhotoVariant => {
    let width = dims.width;
    let height = dims.height;
    if (c.ratio) {
      if (dims.width / dims.height > c.ratio) width = Math.round(dims.height * c.ratio);
      else height = Math.round(dims.width / c.ratio);
    }
    const filename = `faris-aziz-${slug(p.tag || `photo-${i + 1}`)}-${c.key}.jpg`;
    const download = c.ratio ? cropped(p, width, height).forceDownload(filename).url() : urlFor(p).forceDownload(filename).url();
    const previewHeight = Math.round(PREVIEW_W / (c.ratio ?? dims.width / dims.height));
    const preview = (c.ratio ? cropped(p, PREVIEW_W, previewHeight) : urlFor(p).width(PREVIEW_W)).quality(75).auto('format').url();
    return { key: c.key, label: c.label, width, height, size: `${width}×${height}`, filename, download, preview, previewWidth: PREVIEW_W, previewHeight };
  });
  return {
    id: p._key || `photo-${i}`,
    tag,
    label: p.label || p.caption || tag,
    alt: p.alt || p.label || `Photo of Faris Aziz (${tag.toLowerCase()})`,
    credit: p.credit,
    variants,
  };
}

export function wordCount(text?: string): number {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

export const BIO_TABS = [
  { key: 'short', label: 'Short' },
  { key: 'medium', label: 'Medium' },
  { key: 'long', label: 'Long' },
] as const;

/** "linkedin.com/in/farisaziz12", "@farisaziz.com on Bluesky", "@farisaziz12 on X". */
export function linkLabel(kind: string, url: string): string {
  const bare = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const last = bare.split('/').pop() || bare;
  if (kind === 'bluesky') return `@${last} on Bluesky`;
  if (kind === 'twitter') return `@${last} on X`;
  if (kind === 'github') return `github.com/${last}`;
  return bare;
}
