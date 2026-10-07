import type { APIRoute } from 'astro';
import {
  eventPlace,
  fullDate,
  getAllEvents,
  getPhotos,
  getPraiseFor,
  getTalks,
  getWorkshops,
  recordingHost,
  weekday,
  type EventEdition,
} from '../../lib/sanity/v3';
import { kindLabel, roleName, sessionMeta, sessionTitle } from '../../lib/events-view';
import { mdResponse } from '../../lib/markdown';
import { SITE } from '../../lib/seo';

export async function getStaticPaths() {
  const events = await getAllEvents();
  return events.map((e) => ({ params: { slug: e.slug }, props: { event: e } }));
}

export const GET: APIRoute = async ({ props }) => {
  const e = props.event as EventEdition;
  const [talks, workshops, photos, praise] = await Promise.all([getTalks(), getWorkshops(), getPhotos(), getPraiseFor({ eventId: e._id })]);
  const photoCount = photos.filter((p) => p.event?._id === e._id).length;

  const sessions = e.sessions.map((s) => {
    const talk = s.talk ? talks.find((t) => t._id === s.talk!._id) : undefined;
    const ws = s.workshop ? workshops.find((w) => w._id === s.workshop!._id) : undefined;
    const link = s.talk ? `${SITE}/talks/${s.talk.slug}` : s.workshop ? `${SITE}/workshops/${s.workshop.slug}` : '';
    const desc = talk?.summary || talk?.abstract || ws?.summary || ws?.description || '';
    const res = [
      s.recordingUrl ? `  - Recording: ${s.recordingUrl} (${[recordingHost(s.recordingUrl), s.recordingMinutes ? `${s.recordingMinutes} min` : ''].filter(Boolean).join(', ')})` : '',
      s.slidesUrl ? `  - Slides: ${s.slidesUrl}${s.slidesNote ? ` (${s.slidesNote})` : ''}` : '',
      s.repoUrl ? `  - Code: ${s.repoUrl}` : '',
    ].filter(Boolean);
    return [
      `### ${sessionTitle(s)}`,
      ``,
      `- Role: ${roleName(s)} · status: ${s.status}`,
      `- ${sessionMeta(e, s)}`,
      link ? `- Page: ${link}` : '',
      desc ? `\n${desc}` : '',
      res.length ? `\nResources:\n${res.join('\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const body = [
    `# ${e.title}`,
    ``,
    `> ${kindLabel(e)} · ${e.isUpcoming ? 'Upcoming' : 'Past'} · ${fullDate(e.date)}${e.endDate && e.endDate !== e.date ? ` – ${fullDate(e.endDate)}` : ''} (${weekday(e.date)}) · ${eventPlace(e, { venue: true })}`,
    ``,
    [
      e.seriesName ? `- Series: ${e.seriesName}` : '',
      e.language ? `- Language: ${e.language}` : '',
      `- Time zone: ${e.timezone}`,
      e.url ? `- Event site: ${e.url}` : '',
      e.isUpcoming ? `- Calendar: ${SITE}/events/${e.slug}.ics` : '',
      photoCount ? `- Photos: ${photoCount} (${SITE}/gallery)` : '',
      `- Page: ${SITE}/events/${e.slug}`,
    ]
      .filter(Boolean)
      .join('\n'),
    ...(e.description ? [``, e.description] : []),
    ``,
    `## My sessions at this edition`,
    ``,
    sessions.length ? sessions.join('\n\n') : '_No session recorded._',
    praise.length ? `\n## What people said\n\n${praise.map((p) => `> ${p.quote}\n>\n> ${p.author.name}${p.author.headline ? `, ${p.author.headline}` : ''}${p.url ? ` (${p.url})` : ''}`).join('\n\n')}` : '',
    ``,
    `Full schedule: ${SITE}/events.md`,
  ].join('\n');

  return mdResponse(body);
};
