import type { APIRoute } from 'astro';
import { getCatalogueTalks, getSpeakingStats, numberWord } from '../lib/sanity/v3';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';
import { deliveredLine, inviteHref, lengthLabel, nextLine, pillarTitle } from '../lib/talks';

export const GET: APIRoute = async () => {
  const [talks, stats] = await Promise.all([getCatalogueTalks(), getSpeakingStats()]);

  const entries = talks.map((t) =>
    [
      `## [${t.title}](${SITE}/talks/${t.slug}.md)`,
      ``,
      t.summary ?? '',
      ``,
      t.pillar ? `- Topic: ${pillarTitle(t.pillar)}` : '',
      t.audience ? `- Audience: ${t.audience}` : '',
      lengthLabel(t) ? `- Length: ${lengthLabel(t)}` : '',
      t.level ? `- Level: ${t.level}` : '',
      `- Deliveries: ${deliveredLine(t)?.replace(/^delivered /, '') ?? 'none yet'}`,
      nextLine(t) ? `- Upcoming: ${nextLine(t)!.replace(/^next: /, '')}` : '',
      t.recording ? `- Recording: ${t.recording.url}` : '',
      t.slidesUrl ? `- Slides: ${t.slidesUrl}` : '',
      `- Book it: ${SITE}${inviteHref(t)}`,
    ]
      .filter((l, i) => l !== '' || i === 1 || i === 3)
      .join('\n')
  );

  const body = [
    `# ${talks.length ? `${numberWord(talks.length)} talks, ready to book.` : 'Talk catalogue'}`,
    ``,
    `> Conference talks by Faris Aziz: short premise, audience, length and a recording where one exists. Every talk adapts to your slot and audience. ${stats.talksDelivered} talks delivered in ${stats.countries} countries (${stats.cities} cities) as of ${stats.asOf}. Book: ${SITE}/invite`,
    ``,
    ...entries.flatMap((e) => [e, '']),
    `Need something built for your theme? Tell me what you'd like your audience to leave with and I'll propose a talk within two days: ${SITE}/invite`,
    ``,
    `Where these were delivered: ${SITE}/events.md · Speaking overview: ${SITE}/speaking.md`,
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return mdResponse(body);
};
