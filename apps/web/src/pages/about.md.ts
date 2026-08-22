import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { speakerProfileQuery, speakingStatsQuery } from '../lib/sanity/queries';
import { mdResponse, portableTextToMarkdown } from '../lib/markdown';
import { FALLBACK_SPEAKER_STATS } from '../lib/proof';

interface SpeakerProfile {
  bioShort?: string;
  bioMedium?: string;
  bioFull?: unknown;
}

interface SpeakingStats {
  totalEvents: number;
  countries: number;
  cities: number;
}

export const GET: APIRoute = async () => {
  const [profile, stats] = await Promise.all([
    sanityFetch<SpeakerProfile | null>(speakerProfileQuery).catch(() => null),
    sanityFetch<SpeakingStats>(speakingStatsQuery).catch(() => ({ ...FALLBACK_SPEAKER_STATS })),
  ]);

  const fullBio = profile?.bioFull ? portableTextToMarkdown(profile.bioFull) : '';

  const body = [
    `# About Faris Aziz`,
    ``,
    `> Faris Aziz is a Staff Software Engineer, conference speaker, and award-winning community builder based in Geneva, Switzerland. He has spoken at ${stats.totalEvents}+ events across ${stats.countries} countries, cofounded the award-winning ZurichJS community, and is available for keynotes, talks, workshops, technical consulting, and 1:1 mentorship.`,
    ``,
    `## Short bio (~50 words)`,
    ``,
    profile?.bioShort || 'Staff Software Engineer and Conference Speaker specializing in React, Next.js, and payment systems. Based in Geneva.',
    ``,
    profile?.bioMedium ? `## Medium bio (~150 words)\n\n${profile.bioMedium}` : '',
    fullBio ? `## Full bio\n\n${fullBio}` : '',
    ``,
    `## Facts`,
    ``,
    `- Role: Staff Software Engineer`,
    `- Based in: Geneva, Switzerland`,
    `- Speaking: ${stats.totalEvents}+ engagements, ${stats.countries} countries, ${stats.cities} cities`,
    `- Community: cofounder of ZurichJS (https://zurichjs.com), built in under two years into an award-winning community and one of Europe's most in-demand conferences`,
    `- Awards: JSNation Open Source Award, for building the ZurichJS community`,
    `- Topics: React, Next.js, frontend architecture, payment systems, developer experience, engineering leadership`,
    `- Speaker press kit (bios, headshots, practical details): https://faziz-dev.com/press-kit`,
    `- Availability & speaking invitations: https://faziz-dev.com/invite`,
    `- Open to full-time roles: tech lead, staff/senior frontend, full-stack (frontend-leaning), payments, product engineering, founding engineer: https://faziz-dev.com/contact?topic=role#message`,
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
