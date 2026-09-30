import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { getProfile, monthYear } from '../lib/sanity/v3';
import { BIO_TABS, pressPhotoView, wordCount, type PressPhotoView } from '../lib/press';

const SITE = 'https://faziz-dev.com';
const NAMES = { linkedin: 'LinkedIn', bluesky: 'Bluesky', twitter: 'X', github: 'GitHub' } as const;

export const GET: APIRoute = async () => {
  const profile = await getProfile();
  const photos = profile.photos.map((p, i) => pressPhotoView(p, i)).filter((p): p is PressPhotoView => Boolean(p));
  const updated = profile.bios.updatedAt ? `, updated ${monthYear(profile.bios.updatedAt)}` : '';
  const links = [
    `Website: ${SITE}`,
    ...(['linkedin', 'bluesky', 'twitter', 'github'] as const)
      .filter((k) => profile.links[k])
      .map((k) => `${NAMES[k]}: ${profile.links[k]}`),
  ];

  const body = [
    `# Press kit: ${profile.name}`,
    ``,
    `> Bios, pronunciation, photos and the speaker rider for your programme. Take whatever you need. Invitations: ${SITE}/invite.`,
    ``,
    `## Name and links`,
    ``,
    `- Name: ${profile.name}${profile.pronunciation ? ` (pronounced ${profile.pronunciation})` : ''}`,
    `- Title: ${profile.tagline}`,
    `- Based: ${profile.travelBase}`,
    ...links.map((l) => `- ${l}`),
    ``,
    `## Bios (third person${updated})`,
    ``,
    ...BIO_TABS.filter((t) => profile.bios[t.key]).flatMap((t) => [
      `### ${t.label} (${wordCount(profile.bios[t.key])} words)`,
      ``,
      profile.bios[t.key]!,
      ``,
    ]),
    `## Rider`,
    ``,
    ...profile.rider.map((r) => `- ${r.label}: ${r.body}`),
    ``,
    `## Photos (${photos.length})`,
    ``,
    photos.length
      ? photos
          .map((p) =>
            [
              `### ${p.tag}: ${p.label}`,
              ``,
              `${p.alt}.${p.credit ? ` Photo: ${p.credit}.` : ''}`,
              ``,
              ...p.variants.map((v) => `- ${v.label} (${v.size}, JPG): ${v.download}`),
              ``,
            ].join('\n'),
          )
          .join('\n')
      : `No downloadable photos are published yet. Ask for a set via ${SITE}/invite.`,
    profile.avatarNote ? `## The cartoon version\n\n${profile.avatarNote}` : '',
  ].join('\n');

  return mdResponse(body);
};
