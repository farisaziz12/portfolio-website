import type { APIRoute } from 'astro';
import { getServiceOffers, getSiteSettings, getProfile, DEFAULT_SERVICES_INTRO } from '../lib/sanity/v3';
import { serviceCards, howItStarts } from '../lib/services';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

const abs = (href: string) => (href.startsWith('http') ? href : `${SITE}${href}`);

export const GET: APIRoute = async () => {
  const [offers, settings, profile] = await Promise.all([getServiceOffers(), getSiteSettings(), getProfile()]);
  const cards = serviceCards(offers);
  const steps = howItStarts(profile.replyTime);

  const body = [
    `# Services: how Faris Aziz can help`,
    ``,
    `> ${DEFAULT_SERVICES_INTRO}`,
    ``,
    settings.discoveryCallUrl ? `Not sure yet? Book an intro call: ${settings.discoveryCallUrl}` : '',
    ``,
    ...cards.flatMap((c) => [
      `## ${c.n} ${c.title}`,
      ``,
      `- For: ${c.audience}`,
      `- Get in touch if ${c.reachOutIf}`,
      `- You get ${c.youGet}`,
      `- ${c.primary.label}: ${abs(c.primary.href)}`,
      c.secondary ? `- ${c.secondary.label}: ${abs(c.secondary.href)}` : '',
      ``,
    ]),
    `## How it starts`,
    ``,
    ...steps.map((s, i) => `${i + 1}. ${s.title}. ${s.body}`),
    ``,
    `Message: ${SITE}/contact · Speaking invitations: ${SITE}/invite · Mentorship: ${SITE}/mentorship`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return mdResponse(body);
};
