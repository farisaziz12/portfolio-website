import type { APIRoute } from 'astro';
import { getServiceLandingPages, getServiceLandingPage, type LandingCard } from '../../lib/secondary-content';
import { mdResponse } from '../../lib/markdown';
import { SITE } from '../../lib/seo';

export async function getStaticPaths() {
  const pages = await getServiceLandingPages();
  return pages.map((p) => ({ params: { slug: p.slug } }));
}

const abs = (href: string) => (href.startsWith('http') ? href : `${SITE}${href.startsWith('/') ? '' : '/'}${href}`);
const cards = (title: string, items: LandingCard[]) =>
  items.length ? `## ${title}\n\n${items.map((i) => `- **${i.title}**${i.description ? `: ${i.description}` : ''}`).join('\n')}\n` : '';

export const GET: APIRoute = async ({ params }) => {
  const p = await getServiceLandingPage(String(params.slug));
  if (!p) return new Response('Not found', { status: 404 });

  const body = [
    `# ${p.heroHeadline}`,
    ``,
    `> ${[p.heroTagline, p.heroSubheadline || p.seoDescription].filter(Boolean).join('. ')} A service by Faris Aziz: ${SITE}/services/${p.slug}`,
    ``,
    p.heroPrimaryCta?.url ? `${p.heroPrimaryCta.text || 'Get in touch'}: ${abs(p.heroPrimaryCta.url)}\n` : '',
    cards(p.problemTitle || 'Sound familiar?', p.painPoints),
    cards(p.expertiseTitle || 'Where I can help', p.expertiseAreas),
    p.serviceOfferings.length
      ? `## ${p.servicesTitle || 'Ways to work together'}\n\n${p.serviceOfferings
          .map((o) =>
            [
              `### ${o.name}\n`,
              o.bestFor ? `- Best for: ${o.bestFor}` : '',
              ...(o.includes ?? []).map((x) => `- Includes: ${x}`),
              o.outcome ? `- You get: ${o.outcome}` : '',
            ]
              .filter(Boolean)
              .join('\n')
          )
          .join('\n\n')}\n`
      : '',
    cards(p.audienceTitle || 'Who this is for', p.personas),
    p.stats.length ? `## ${p.proofTitle || 'Track record'}\n\n${p.stats.map((s) => `- ${s.value} ${s.label}`).join('\n')}\n` : '',
    p.testimonials.length
      ? p.testimonials.map((t) => `> “${t.quote}”\n> — ${[t.author, [t.role, t.company].filter(Boolean).join(' at ')].filter(Boolean).join(', ')}\n`).join('\n')
      : '',
    p.faqs.length ? `## ${p.faqTitle || 'Questions'}\n\n${p.faqs.map((f) => `**${f.question}**\n\n${f.answer}`).join('\n\n')}\n` : '',
    p.ctaHeadline ? `## ${p.ctaHeadline}\n\n${p.ctaSubheadline ?? ''}\n` : '',
    `${p.ctaButtonText || 'Get in touch'}: ${abs(p.ctaButtonUrl || p.heroPrimaryCta?.url || '/contact')} · All services: ${SITE}/services`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');

  return mdResponse(body);
};
