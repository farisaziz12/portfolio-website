import type { APIRoute } from 'astro';
import { getWorkshops } from '../lib/sanity/v3';
import { editionsLine, groupLine, pastDeliveries, pillarLabel, workshopInviteHref } from '../lib/workshops-view';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const workshops = (await getWorkshops())
    .filter((w) => w.isBookable)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || pastDeliveries(b).length - pastDeliveries(a).length);

  const rows = workshops.map((w) => {
    const delivered = pastDeliveries(w);
    return [
      `## ${w.title}`,
      ``,
      [
        `- Pillar: ${pillarLabel(w)}`,
        w.formats.length ? `- Editions: ${w.formats.map((f) => `${f.label}${f.duration && f.duration !== f.label ? ` (${f.duration})` : ''}`).join(', ')}` : editionsLine(w) ? `- Length: ${editionsLine(w)}` : '',
        groupLine(w) ? `- Group: ${groupLine(w)}` : '',
        w.outcomes.length ? `- You leave able to: ${w.outcomes.join('; ')}` : '',
        w.prerequisites.length ? `- Prerequisites: ${w.prerequisites.join('; ')}` : '',
        `- Delivered: ${delivered.length} time${delivered.length === 1 ? '' : 's'}`,
        w.relatedTalk ? `- Talk version: ${w.relatedTalk.title} (${SITE}/talks/${w.relatedTalk.slug})` : '',
        `- Agenda and details: ${SITE}/workshops/${w.slug}.md`,
        `- Book: ${SITE}${workshopInviteHref(w)}`,
      ]
        .filter(Boolean)
        .join('\n'),
      ...(w.summary || w.description ? [``, (w.summary || w.description) as string] : []),
    ].join('\n');
  });

  const body = [
    `# Workshops · Faris Aziz`,
    ``,
    `> Hands-on workshops. You keep the repo. ${workshops.length} workshop${workshops.length === 1 ? '' : 's'} to choose from. Each edition has its own agenda, so the length you see matches the schedule on the day. Attendees keep the material afterwards. Book one: ${SITE}/invite?kind=workshop`,
    ``,
    rows.length ? rows.join('\n\n') : '_No workshops listed right now._',
  ].join('\n');

  return mdResponse(body);
};
