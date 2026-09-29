import type { APIRoute } from 'astro';
import { getPraiseFor, getWorkshops, type WorkshopWithHistory } from '../../lib/sanity/v3';
import { agendaNote, deliveryLine, groupLine, lengthLine, pillarLabel, workshopInviteHref } from '../../lib/workshops-view';
import { mdResponse } from '../../lib/markdown';
import { SITE } from '../../lib/seo';

export async function getStaticPaths() {
  const workshops = await getWorkshops();
  return workshops.map((w) => ({ params: { slug: w.slug }, props: { workshop: w } }));
}

export const GET: APIRoute = async ({ props }) => {
  const w = props.workshop as WorkshopWithHistory;
  const praise = await getPraiseFor({ workshopId: w._id });

  const agenda = w.formats.map((f) =>
    [
      `### ${f.label}`,
      ``,
      f.agenda.map((a) => `- ${a.at || a.duration ? `${a.at || a.duration}: ` : ''}**${a.title}**${a.isBreak ? ' (break)' : ''}${a.summary && !a.isBreak ? `: ${a.summary}` : ''}`).join('\n'),
      ``,
      `_${agendaNote(f)}_`,
    ].join('\n')
  );

  const booking = [
    lengthLine(w) ? `- Length: ${lengthLine(w)}` : '',
    groupLine(w) ? `- Group: ${groupLine(w)}` : '',
    w.room ? `- Room: ${w.room}` : '',
    w.after ? `- After: ${w.after}` : '',
    `- Request a date: ${SITE}${workshopInviteHref(w)}`,
  ].filter(Boolean);

  const body = [
    `# ${w.title}`,
    ``,
    `> Workshop by Faris Aziz · ${pillarLabel(w)}. ${w.description || w.summary || ''}`.trimEnd(),
    ``,
    `## Agenda`,
    ``,
    agenda.length ? agenda.join('\n\n') : '_Tailored per edition; ask for the current agenda._',
    ``,
    `## Prerequisites`,
    ``,
    w.prerequisites.length ? w.prerequisites.map((p) => `- ${p}`).join('\n') : '_None listed._',
    ...(w.outcomes.length ? [``, `## You leave able to`, ``, w.outcomes.map((o) => `- ${o}`).join('\n')] : []),
    ``,
    `## Delivered at`,
    ``,
    w.deliveries.length
      ? w.deliveries.map((d) => `- ${deliveryLine(d)}${d.event.isUpcoming ? ' (upcoming)' : ''} · ${SITE}/events/${d.event.slug}`).join('\n')
      : '_No public editions listed yet._',
    ``,
    `## Book this workshop`,
    ``,
    booking.join('\n'),
    ``,
    `Attendees: use the resources link from your session. Access is per delivery; nobody is added to a mailing list by attending.`,
    w.relatedTalk ? `\nThe talk version: ${w.relatedTalk.title} · ${SITE}/talks/${w.relatedTalk.slug}` : '',
    praise.length ? `\n## What attendees said\n\n${praise.map((p) => `> ${p.quote}\n>\n> ${p.author.name}${p.author.headline ? `, ${p.author.headline}` : ''}${p.url ? ` (${p.url})` : ''}`).join('\n\n')}` : '',
    ``,
    `All workshops: ${SITE}/workshops.md`,
  ].join('\n');

  return mdResponse(body);
};
