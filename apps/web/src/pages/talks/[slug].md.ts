import type { APIRoute } from 'astro';
import { fullDate, getCatalogueTalks, getProfile, getTalks, getWriting, type TalkWithHistory } from '../../lib/sanity/v3';
import { mdResponse } from '../../lib/markdown';
import { SITE } from '../../lib/seo';
import { eventShortName, inviteHref, isRetired, lengthLabel, pillarTitle } from '../../lib/talks';

export async function getStaticPaths() {
  const talks = await getTalks();
  return talks.map((talk) => ({ params: { slug: talk.slug }, props: { talk } }));
}

export const GET: APIRoute = async ({ props }) => {
  const talk = (props as { talk?: TalkWithHistory }).talk;
  if (!talk) return new Response('Not found', { status: 404 });
  const [catalogue, writing, profile] = await Promise.all([getCatalogueTalks(), getWriting(), getProfile()]);
  const retired = isRetired(talk, catalogue);
  const podcasts = writing.filter((w) => w.format === 'podcast' && w.relatedTalk?._id === talk._id);

  const deliveries = talk.deliveries.map((d) => {
    const s = d.session;
    const place = d.event.location.isOnline ? 'Online' : [d.event.location.city, d.event.location.country].filter(Boolean).join(', ');
    const extra = [
      d.event.isUpcoming ? 'upcoming' : null,
      s.recordingUrl ? `recording: ${s.recordingUrl}` : null,
      s.slidesUrl ? `slides: ${s.slidesUrl}` : null,
    ].filter(Boolean);
    return `- ${fullDate(d.event.date)}: [${eventShortName(d.event)}](${SITE}/events/${d.event.slug}.md)${place ? `, ${place}` : ''}${extra.length ? ` (${extra.join('; ')})` : ''}`;
  });

  const facts = [
    talk.pillar ? `Topic: ${pillarTitle(talk.pillar)}` : null,
    lengthLabel(talk) ? `Length: ${lengthLabel(talk)}` : null,
    talk.level ? `Level: ${talk.level}` : null,
    `Delivered: ${talk.deliveredCount}×`,
    retired ? 'Status: retired version, no longer booked' : null,
  ].filter(Boolean);

  const body = [
    `# ${talk.title}`,
    ``,
    `> Conference talk by Faris Aziz. ${facts.join(' · ')}.${retired ? ` Current catalogue: ${SITE}/talks.md` : ` Book it: ${SITE}${inviteHref(talk)}`}`,
    ``,
    retired && talk.versionNotes ? `${talk.versionNotes}\n` : '',
    talk.abstract || talk.summary ? `## The premise\n\n${talk.abstract || talk.summary}\n` : '',
    talk.audience ? `## Who it's for\n\n${talk.audience}\n` : '',
    talk.takeaways.length ? `## You leave with\n\n${talk.takeaways.map((k) => `- ${k}`).join('\n')}\n` : '',
    talk.recording || talk.slidesUrl
      ? `## Recording and slides\n\n${[
          talk.recording ? `- Recording${talk.recording.event ? ` (${eventShortName(talk.recording.event)}, ${fullDate(talk.recording.event.date)})` : ''}: ${talk.recording.url}` : null,
          talk.slidesUrl ? `- Slides: ${talk.slidesUrl}` : null,
        ]
          .filter(Boolean)
          .join('\n')}\n`
      : '',
    `## Where it's been delivered\n\n${deliveries.length ? deliveries.join('\n') : 'No sessions on record yet.'}\n\nEach entry is a session of this talk, counted from event records.\n`,
    podcasts.length ? `## Heard as a podcast\n\n${podcasts.map((p) => `- ${p.source}: [${p.title}](${p.href.startsWith('http') ? p.href : SITE + p.href}) (${fullDate(p.date)})`).join('\n')}\n` : '',
    talk.relatedTalks.length
      ? `## Pairs well with\n\n${talk.relatedTalks.map((r) => `- [${r.title}](${SITE}/talks/${r.slug}.md)`).join('\n')}\n`
      : '',
    retired
      ? ''
      : `## Booking\n\n` +
        [
          `- Invite me to give it: ${SITE}${inviteHref(talk)}`,
          `- Setup: ${talk.setup || profile.rider[0]?.body || 'own laptop'}`,
          talk.alsoAsWorkshop ? `- Also as a workshop: [${talk.alsoAsWorkshop.title}](${SITE}/workshops/${talk.alsoAsWorkshop.slug}.md)` : '',
          `- I reply within ${profile.replyTime}. Press kit and rider: ${SITE}/press-kit`,
        ]
          .filter(Boolean)
          .join('\n'),
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return mdResponse(body);
};
