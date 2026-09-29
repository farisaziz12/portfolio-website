import type { APIRoute } from 'astro';
import { mdResponse, portableTextToMarkdown } from '../lib/markdown';
import { getAboutPage, getCareer, getCommunities, getProfile, getSpeakingStats, currentMonthYear } from '../lib/sanity/v3';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const [about, profile, stats, career, communities] = await Promise.all([
    getAboutPage(),
    getProfile(),
    getSpeakingStats(),
    getCareer(),
    getCommunities(),
  ]);

  const story = portableTextToMarkdown(about.content) || profile.bios.medium || '';
  const links = [
    ['LinkedIn', profile.links.linkedin],
    ['Bluesky', profile.links.bluesky],
    ['X', profile.links.twitter],
    ['GitHub', profile.links.github],
    ['YouTube', profile.links.youtube],
  ].filter(([, href]) => href);
  const awards = communities.flatMap((c) => c.recognition.map((r) => `${[r.title, r.issuer, r.year].filter(Boolean).join(', ')} (${c.name})`));

  const body = [
    `# ${about.title}`,
    ``,
    `> ${about.intro}`,
    ``,
    `Kicker: ${about.kicker}. This is the entity home for ${profile.name}${profile.pronunciation ? ` (pronounced ${profile.pronunciation})` : ''}, based in ${profile.travelBase}.`,
    ``,
    `## Story (first person)`,
    ``,
    story,
    ``,
    `## In short`,
    ``,
    ...about.inShort.map((r) => `- ${r.label}: ${r.body}`),
    ``,
    `## Facts`,
    ``,
    `- Talks delivered: ${stats.talksDelivered} (delivered talk sessions from event records; hosting and attending excluded; as of ${currentMonthYear()})`,
    `- Countries spoken in: ${stats.countries} · cities: ${stats.cities}`,
    ...(career.length ? career.map((c) => `- ${c.periodLabel ?? ''}${c.periodLabel ? ': ' : ''}${[c.role, c.name].filter(Boolean).join(', ')}`) : []),
    ...awards.map((a) => `- Recognition: ${a}`),
    ``,
    `## Bios`,
    ``,
    profile.bios.short ? `### Short\n\n${profile.bios.short}\n` : '',
    profile.bios.medium ? `### Medium\n\n${profile.bios.medium}\n` : '',
    profile.bios.long ? `### Long\n\n${profile.bios.long}\n` : '',
    `## Elsewhere`,
    ``,
    ...links.map(([label, href]) => `- ${label}: ${href}`),
    ``,
    `## Track record`,
    ``,
    `- Track record (dated, defined numbers; career timeline): ${SITE}/impact`,
    `- What people say (quotes with sources): ${SITE}/appreciation`,
    `- Projects: ${SITE}/projects`,
    `- Gallery: ${SITE}/gallery`,
    `- Press kit (bios, headshots): ${SITE}/press-kit`,
    `- Invite to speak: ${SITE}/invite`,
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return mdResponse(body);
};
