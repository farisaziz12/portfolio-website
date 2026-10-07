import type { APIRoute } from 'astro';
import { getPhotoGroups, photoCredit } from '../lib/secondary-content';
import { monthYear } from '../lib/sanity/v3';
import { urlFor } from '../lib/sanity/client';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

function full(image: Parameters<typeof urlFor>[0]): string {
  try {
    return urlFor(image).width(2400).auto('format').url();
  } catch {
    return '';
  }
}

export const GET: APIRoute = async () => {
  const groups = await getPhotoGroups();

  const body = [
    `# Gallery · Faris Aziz`,
    ``,
    `> Event photos of Faris Aziz, grouped by event (newest first). Each photo keeps its photographer's credit. Press photos cleared for reuse: ${SITE}/press-kit`,
    ``,
    ...(groups.length
      ? groups.flatMap((g) => [
          `## ${g.title}`,
          ``,
          ...[[g.city, g.country, monthYear(g.date), g.slug && `${SITE}/events/${g.slug}`].filter(Boolean).join(' · ')].filter(Boolean).flatMap((l) => [l, ``]),
          ...g.photos.map((p) => {
            const alt = p.image.alt || p.title || 'Photo';
            const credit = photoCredit(p);
            const url = full(p.image);
            return `- ${url ? `[${alt}](${url})` : alt}${credit ? ` (photo: ${credit})` : ''}`;
          }),
          ``,
        ])
      : ['No photos published yet.']),
  ].join('\n');

  return mdResponse(body);
};
