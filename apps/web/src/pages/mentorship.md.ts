import type { APIRoute } from 'astro';
import { getServiceOffers, getPraiseFor, getMetricsByDomain, getProfile, PLATFORM_LABEL, monthYear } from '../lib/sanity/v3';
import { MENTORSHIP_COPY as C, MENTORCRUISE_URL, cfpMetric, mentorshipFocus, mentorshipPrograms, mentorshipDetails, offerPrice } from '../lib/services';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

export const GET: APIRoute = async () => {
  const [offers, praise, metrics, profile] = await Promise.all([
    getServiceOffers(),
    getPraiseFor({ topic: 'mentoring' }),
    getMetricsByDomain('community'),
    getProfile(),
  ]);
  const programs = mentorshipPrograms(offers);

  const body = [
    `# Mentorship · Faris Aziz`,
    ``,
    `> ${C.title} ${C.lede}`,
    ``,
    `Apply for a seat (goal, budget, cadence): ${SITE}/mentorship#apply. Reply within ${profile.replyTime}. Also on MentorCruise: ${MENTORCRUISE_URL}`,
    ``,
    `## Focus areas`,
    ``,
    ...mentorshipFocus(cfpMetric(metrics)).map((f) => `- **${f.kicker}: ${f.title}.** ${f.body}`),
    ``,
    `## How it works`,
    ``,
    ...mentorshipDetails(programs).map((d) => `- ${d.label}: ${d.value}`),
    ``,
    programs.length ? `## Programmes\n` : '',
    ...programs.flatMap((o) => [
      `### ${o.title}\n`,
      o.shortDescription ? `${o.shortDescription}\n` : '',
      o.bestFor ? `- Best for: ${o.bestFor}` : '',
      ...o.outcomes.map((x) => `- Outcome: ${x}`),
      o.engagementFormat ? `- Format: ${o.engagementFormat}` : '',
      offerPrice(o) ? `- Cost: ${offerPrice(o)}` : '',
      o.bookingUrl ? `- ${o.bookingLabel || 'Book'}: ${o.bookingUrl}` : '',
    ].filter(Boolean).concat([''])),
    praise.length ? `## From people I've mentored and taught\n` : '',
    ...praise.slice(0, 6).map((p) => {
      const who = [p.author.name, p.author.headline, [PLATFORM_LABEL[p.platform], monthYear(p.date)].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
      return `> “${p.quote}”\n> — ${who}${p.url ? ` (${p.url})` : ''}\n`;
    }),
    praise.length ? `All mentoring mentions: ${SITE}/appreciation?topic=mentoring` : '',
    ``,
    `Other services: ${SITE}/services`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return mdResponse(body);
};
