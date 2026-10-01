import type { APIRoute } from 'astro';
import { getCatalogueTalks, getPrimaryCommunity, getProfile, getSiteSettings, getSpeakingStats, getUpcomingEvents, getWorkshops, fullDate, eventPlace } from '../lib/sanity/v3';

// llms.txt per https://llmstxt.org: a markdown index for LLMs and agents.
// Links point at the .md mirrors, which carry the same Sanity content as the
// HTML pages with none of the markup. /llms-full.txt concatenates them.
const SITE = 'https://faziz-dev.com';

export const GET: APIRoute = async () => {
  const [talks, workshops, stats, profile, settings, upcoming, community] = await Promise.all([
    getCatalogueTalks(),
    getWorkshops(),
    getSpeakingStats(),
    getProfile(),
    getSiteSettings(),
    getUpcomingEvents(),
    getPrimaryCommunity(),
  ]);
  const communityLine = [community?.name ?? 'ZurichJS', community?.founded ? `co-founded in ${community.founded}` : null, 'with dated metrics'].filter(Boolean).join(', ');

  const summary = stats.fallback
    ? profile.bios.short
    : `${profile.bios.short} ${stats.talksDelivered} talks delivered in ${stats.countries} countries (as of ${fullDate(stats.asOf)}).`;

  const body = `# ${profile.name}

> ${summary}

${settings.nowLine}. Based in ${profile.travelBase}. Invitations: ${SITE}/invite (form; replies within ${profile.replyTime}). Everything else: ${SITE}/contact. There is no public email address; forms only.

## Speaking

- [Speaking overview](${SITE}/speaking.md): topics, formats, stats, how to book
- [Talk catalogue](${SITE}/talks.md): every bookable talk with premise, audience, lengths, recordings and delivery history
- [Schedule](${SITE}/events.md): upcoming appearances and the archive, with my role at each event (spoke / workshop / hosted / attended)
- [Workshops](${SITE}/workshops.md): hands-on formats, agendas and prerequisites
- [Invite me](${SITE}/invite.md): what to send, good to know, availability by month
- [Press kit](${SITE}/press-kit.md): bios in three lengths, pronunciation, photos with credits and crops, rider

## Articles, podcasts & community

- [Articles & podcasts](${SITE}/blog.md): posts, guest articles, podcasts and video
- [Community](${SITE}/community.md): ${communityLine}

## About

- [About](${SITE}/about.md): story and facts
- [Track record](${SITE}/impact.md): dated and defined numbers, career timeline
- [What people say](${SITE}/appreciation.md): quotes with sources

## Work together

- [Services](${SITE}/services.md): events, advisory, mentorship
- [Mentorship](${SITE}/mentorship.md)
- [Contact](${SITE}/contact.md)

## Optional

- [Home](${SITE}/home.md)
- [Everything in one file](${SITE}/llms-full.txt)
${upcoming
  .slice(0, 6)
  .map((e) => `- [Upcoming: ${e.title}, ${fullDate(e.date)}, ${eventPlace(e)}](${SITE}/events/${e.slug}.md)`)
  .join('\n')}
${talks.map((t) => `- [Talk: ${t.title}](${SITE}/talks/${t.slug}.md)`).join('\n')}
${workshops
  .filter((w) => w.isBookable)
  .map((w) => `- [Workshop: ${w.title}](${SITE}/workshops/${w.slug}.md)`)
  .join('\n')}
`;

  return new Response(body.replace(/\n{3,}/g, '\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
