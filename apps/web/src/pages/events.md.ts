import type { APIRoute } from 'astro';
import { ROLE_BUCKETS } from 'shared';
import { eventPlace, fullDate, getPastEvents, getSpeakingStats, getUpcomingEvents, localTime, monthYear, primarySession, yearOf } from '../lib/sanity/v3';
import { bucketBadge, kindLabel, liveSessions, sessionShort, sessionTiming } from '../lib/events-view';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const [upcoming, past, stats] = await Promise.all([getUpcomingEvents(), getPastEvents(), getSpeakingStats()]);

  const up = upcoming.map((e) => {
    const sessions = liveSessions(e)
      .map((s) => `  - ${sessionShort(s)}${s.durationMinutes ? ` (${s.durationMinutes} min)` : ''} · ${sessionTiming(e, s) || (s.startsAt ? localTime(s.startsAt, e.timezone) : 'time TBA')}`)
      .join('\n');
    return `- **${fullDate(e.date)}: ${e.title}** · ${kindLabel(e)} · ${eventPlace(e, { venue: true })} · ${SITE}/events/${e.slug}${sessions ? `\n${sessions}` : ''}`;
  });

  const years = [...new Set(past.map((e) => yearOf(e.date)))];
  const archive = years.map((y) => {
    const rows = past
      .filter((e) => yearOf(e.date) === y)
      .map((e) => {
        const role = e.buckets.map((b) => bucketBadge(b, e.isUpcoming)).join(' + ') || bucketBadge(primarySession(e)?.bucket, e.isUpcoming);
        const what = liveSessions(e).map(sessionShort).join(' · ');
        return `- ${monthYear(e.date)}: **${e.title}** (${eventPlace(e)}) · ${role}${what ? ` · ${what}` : ''} · ${SITE}/events/${e.slug}`;
      });
    return `### ${y}\n\n${rows.join('\n')}`;
  });

  const byRole = ROLE_BUCKETS.map((b) => {
    const n = past.filter((e) => e.buckets.includes(b.value)).length;
    return `- ${b.title}: ${n} past edition${n === 1 ? '' : 's'}`;
  }).join('\n');

  const body = [
    `# Schedule: upcoming and past events · Faris Aziz`,
    ``,
    `> Upcoming appearances first, then the archive with my role at each event (spoke, ran a workshop, hosted, attended). Invite me: ${SITE}/invite`,
    ``,
    `So far: ${stats.talksDelivered} talks, ${stats.workshopsDelivered} workshops, ${stats.panels} panel${stats.panels === 1 ? '' : 's'}, ${stats.hosted} hosted, ${stats.attended} attended. ${stats.countries} countries, ${stats.cities} cities. ${stats.eventRecords} event records. As of ${stats.asOf}.`,
    stats.countryList.length ? `\nCountries: ${stats.countryList.join(', ')}.` : '',
    ``,
    `## Upcoming (${upcoming.length} confirmed)`,
    ``,
    up.length ? up.join('\n') : `_No public dates confirmed right now. Invite me: ${SITE}/invite_`,
    ``,
    `## Archive (${past.length} past editions)`,
    ``,
    `By role (an edition can count under more than one):`,
    ``,
    byRole,
    ``,
    archive.join('\n\n'),
  ].join('\n');

  return mdResponse(body);
};
