import type { APIRoute } from 'astro';
import { TOPICS, titleFor } from 'shared';
import {
  eventPlace,
  fullDate,
  getCatalogueTalks,
  getProfile,
  getSpeakingStats,
  getUpcomingEvents,
  getWorkshops,
  primarySession,
  sessionLine,
} from '../lib/sanity/v3';
import { mdResponse } from '../lib/markdown';
import { bookingYears } from '../lib/availability';
import { lengthRange } from '../lib/workshops-view';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const [profile, stats, upcomingAll, talks, workshops] = await Promise.all([
    getProfile(),
    getSpeakingStats(),
    getUpcomingEvents(),
    getCatalogueTalks(),
    getWorkshops(),
  ]);
  const upcoming = upcomingAll.filter((e) => e.buckets.some((b) => b !== 'attended'));
  const bookable = workshops.filter((w) => w.isBookable);

  const pillars = profile.topicPillars.map((p) => {
    const lead = (p.talk && talks.find((t) => t._id === p.talk!._id)) || talks.find((t) => p.pillar && t.pillar === p.pillar);
    const kicker = titleFor(TOPICS, p.pillar);
    return `- **${kicker ? `${kicker}: ` : ''}${p.title}**${p.description ? `. ${p.description}` : ''}${lead ? ` Talk: [${lead.title}](${SITE}/talks/${lead.slug}.md)` : ''}`;
  });

  const body = [
    `# Speaking: production stories, told from the inside.`,
    ``,
    `> Faris Aziz gives talks and workshops about scale, resilience, payments and the leadership calls behind real systems. React and Next.js are home base; the lessons aren't framework-specific. Every talk is adapted to its audience. Booking ${bookingYears()}. Invite: ${SITE}/invite`,
    ``,
    `## Counts (as of ${stats.asOf}; talks only, hosting and attending not included)`,
    ``,
    `- Talks delivered: ${stats.talksDelivered} (speaker, keynote and lightning sessions; hosting and attending are not counted)`,
    `- Countries: ${stats.countries} (speaking and hosting), cities: ${stats.cities}`,
    `- Workshops in the catalogue: ${bookable.length}${lengthRange(bookable) ? ` (${lengthRange(bookable)})` : ''}; workshop sessions delivered: ${stats.workshopsDelivered}`,
    `- Talks in the catalogue: ${stats.catalogueTalks}`,
    `- Reply time to an invitation: ${profile.replyTime}`,
    ``,
    `## Things I talk about`,
    ``,
    ...pillars,
    ``,
    `All ${talks.length} talks: ${SITE}/talks.md`,
    ``,
    `## Formats`,
    ``,
    ...profile.formats.map((f) => `- **${f.name}**${f.duration ? ` (${f.duration})` : ''}: ${f.description ?? ''}`.trimEnd()),
    ``,
    bookable.length ? `## Workshops\n\n${bookable.map((w) => `- [${w.title}](${SITE}/workshops/${w.slug}.md)${w.duration ? ` · ${w.duration}` : ''}${w.summary ? `. ${w.summary}` : ''}`).join('\n')}\n` : '',
    upcoming.length
      ? `## Next on the calendar\n\n${upcoming
          .slice(0, 6)
          .map((e) => {
            const s = primarySession(e);
            return `- ${fullDate(e.date)}: [${e.title}](${SITE}/events/${e.slug}.md), ${eventPlace(e)}${s ? ` · ${sessionLine(s)}` : ''}`;
          })
          .join('\n')}\n\nFull schedule and archive: ${SITE}/events.md\n`
      : '',
    `## How to book`,
    ``,
    `Fill in the invite form: ${SITE}/invite (three required fields). I reply within ${profile.replyTime}. For conferences I'd expect travel and accommodation to be covered. Travelling from ${profile.travelBase}.`,
    ``,
    `## Technical rider`,
    ``,
    ...profile.rider.map((r) => `- ${r.label}: ${r.body}`),
    ``,
    `Bios, photos and the full rider: ${SITE}/press-kit`,
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return mdResponse(body);
};
