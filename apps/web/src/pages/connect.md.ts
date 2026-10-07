import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { getAboutPage, getProfile, getSiteSettings, getSpeakingStats, basedIn, fullDate } from '../lib/sanity/v3';

const SITE = 'https://faziz-dev.com';

export const GET: APIRoute = async () => {
  const [profile, settings, about, stats] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getAboutPage(),
    getSpeakingStats(),
  ]);

  const city = basedIn(profile.travelBase).city;
  const socials = [
    ['LinkedIn', profile.links.linkedin],
    ['Bluesky', profile.links.bluesky],
    ['X', profile.links.twitter],
    ['GitHub', profile.links.github],
    ['YouTube', profile.links.youtube],
  ].filter((s): s is [string, string] => Boolean(s[1]));

  const blurb = about.intro || profile.bios.short;
  const proof =
    !stats.fallback && stats.talksDelivered > 0
      ? `${stats.talksDelivered} talks delivered in ${stats.countries} countries, as of ${fullDate(stats.asOf)}.`
      : null;

  const body = [
    `# Connect with Faris Aziz`,
    ``,
    `> Post-talk landing page for QR codes on the last slide. Thanks for coming. Grab a link, book a call, or invite Faris to speak.`,
    ``,
    `${profile.tagline}. Based in ${city}.`,
    ``,
    `## Primary actions`,
    ``,
    socials[0] ? `- Connect on LinkedIn: ${socials[0][1]}` : null,
    settings.discoveryCallUrl ? `- Book a quick call: ${settings.discoveryCallUrl}` : null,
    `- Invite me to speak: ${SITE}/invite`,
    `- Quick message: ${SITE}/contact`,
    ``,
    socials.length ? `## Socials\n\n${socials.map(([l, u]) => `- ${l}: ${u}`).join('\n')}` : null,
    ``,
    `## Who I am`,
    ``,
    blurb,
    proof,
    ``,
    `Longer story: ${SITE}/about`,
    ``,
    `## On this site`,
    ``,
    `- Talks: ${SITE}/talks`,
    `- Schedule: ${SITE}/events`,
    `- Press kit: ${SITE}/press-kit`,
    `- Mentorship: ${SITE}/mentorship`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return mdResponse(body);
};
