import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { INVITE_KINDS } from '../lib/invite-kinds';
import { AVAILABILITY_STATUSES } from 'shared';
import { dayMonth, eventPlace, getAvailability, getProfile, getUpcomingEvents, yearOf } from '../lib/sanity/v3';

const SITE = 'https://faziz-dev.com';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const GET: APIRoute = async () => {
  const [profile, availability, upcoming] = await Promise.all([getProfile(), getAvailability(), getUpcomingEvents()]);
  const status = (s: string) => AVAILABILITY_STATUSES.find((o) => o.value === s)?.title ?? 'Open';
  const lead = availability.leadTime;
  const goodToKnow = profile.goodToKnow.map((r) => (lead && /lead time/i.test(r.label) ? { ...r, body: lead } : r));

  const body = [
    `# Invite Faris Aziz`,
    ``,
    `> Conferences and meetups, podcasts and livestreams, workshops and team training, panels, articles and interviews, or something else. Send the form at ${SITE}/invite; Faris replies within ${profile.replyTime}. The inquiry goes to him only and adds nobody to any list. There is no public email address.`,
    ``,
    `## What to send`,
    ``,
    `Required: your name, your email, and one line that depends on what it's for:`,
    ``,
    ...INVITE_KINDS.map((k) => `- ${k.label}: ${k.field.toLowerCase()} (${k.placeholder})`),
    ``,
    `Optional: when (a date, a window, or flexible), audience (who, and roughly how many), anything else (topic, links, budget or travel, accessibility needs).`,
    ``,
    `Pre-filled links: ${SITE}/invite?kind=workshop&workshop=<title> or ${SITE}/invite?talk=<title>.`,
    ``,
    `A confirmation with a reference number (FA-yymmdd-XXXX) appears only once the inquiry is stored. If sending fails, the page says nothing was stored and keeps the text.`,
    ``,
    `## Good to know`,
    ``,
    ...goodToKnow.map((r) => `- ${r.label}: ${r.body}`),
    ``,
    `## Availability by month (next 12 months)`,
    ``,
    ...availability.months.map((m) => {
      const [y, mo] = m.month.split('-').map(Number);
      return `- ${MONTHS[mo - 1]} ${y}: ${status(m.status)}${m.note ? ` (${m.note})` : ''}`;
    }),
    ``,
    upcoming.length
      ? [`## Already booked`, ``, ...upcoming.map((e) => `- ${dayMonth(e.date)} ${yearOf(e.date)}: [${e.title}](${SITE}/events/${e.slug})${eventPlace(e) ? `, ${eventPlace(e)}` : ''}`)].join('\n')
      : '',
    ``,
    `## Rider`,
    ``,
    ...profile.rider.map((r) => `- ${r.label}: ${r.body}`),
    ``,
    `Bios, photos with crops and the full rider: ${SITE}/press-kit (markdown: ${SITE}/press-kit.md).`,
  ].join('\n');

  return mdResponse(body);
};
