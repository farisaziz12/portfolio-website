import { urlFor } from './client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export function getImageUrl(
  source: SanityImageSource,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string {
  let builder = urlFor(source);

  if (options?.width) {
    builder = builder.width(options.width);
  }

  if (options?.height) {
    builder = builder.height(options.height);
  }

  if (options?.quality) {
    builder = builder.quality(options.quality);
  }

  if (options?.format) {
    builder = builder.format(options.format);
  }

  return builder.url();
}

export function getResponsiveImageUrl(
  source: SanityImageSource,
  sizes: number[] = [400, 800, 1200, 1600]
): { src: string; srcset: string } {
  const src = urlFor(source).width(800).quality(80).url();
  const srcset = sizes
    .map((size) => `${urlFor(source).width(size).quality(80).url()} ${size}w`)
    .join(', ');

  return { src, srcset };
}

export function getOgImageUrl(source: SanityImageSource): string {
  return urlFor(source).width(1200).height(630).fit('crop').url();
}
