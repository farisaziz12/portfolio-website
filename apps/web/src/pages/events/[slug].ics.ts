import type { APIRoute } from 'astro';
import { eventPlace, getAllEvents, type EventEdition } from '../../lib/sanity/v3';
import { liveSessions, sessionPlace, sessionShort } from '../../lib/events-view';
import { SITE } from '../../lib/seo';

/** "Add to calendar" file for an edition: timed when the session start is known, all-day otherwise. */
export async function getStaticPaths() {
  const events = await getAllEvents();
  return events.map((e) => ({ params: { slug: e.slug }, props: { event: e } }));
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
const utc = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const ymd = (d: string) => d.slice(0, 10).replace(/-/g, '');
function nextDay(d: string): string {
  const [y, m, day] = d.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day + 1)).toISOString().slice(0, 10).replace(/-/g, '');
}

function ics(e: EventEdition): string {
  const sessions = liveSessions(e);
  const timed = sessions.find((s) => s.startsAt && s.status !== 'tba');
  const url = `${SITE}/events/${e.slug}`;
  const when = timed?.startsAt
    ? (() => {
        const start = Date.parse(timed.startsAt);
        const end = start + (timed.durationMinutes ?? 60) * 60_000;
        return [`DTSTART:${utc(start)}`, `DTEND:${utc(end)}`];
      })()
    : [`DTSTART;VALUE=DATE:${ymd(e.date)}`, `DTEND;VALUE=DATE:${nextDay(e.endDate || e.date)}`];
  const summary = sessions.map(sessionShort).join(' · ');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//faziz-dev.com//Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e._id}@faziz-dev.com`,
    `DTSTAMP:${utc(Date.now())}`,
    ...when,
    `SUMMARY:${esc(`${e.title}: Faris Aziz`)}`,
    `DESCRIPTION:${esc([summary, url].filter(Boolean).join('\n'))}`,
    `LOCATION:${esc([timed ? sessionPlace(timed) : '', eventPlace(e, { venue: true })].filter(Boolean).join(', '))}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export const GET: APIRoute = ({ props }) => {
  const e = props.event as EventEdition;
  return new Response(ics(e) + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${e.slug}.ics"` },
  });
};
