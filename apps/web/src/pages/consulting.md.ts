import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { consultingOffersQuery } from '../lib/sanity/queries';
import { mdResponse } from '../lib/markdown';

interface ServiceOffer {
  title: string;
  shortDescription?: string;
  bestFor?: string;
  outcomes?: string[];
  engagementFormat?: string;
  pricingType?: string;
  price?: number;
  priceCurrency?: string;
  priceUnit?: string;
  bookingUrl?: string;
}

export const GET: APIRoute = async () => {
  const offers = await sanityFetch<ServiceOffer[]>(consultingOffersQuery).catch(() => []);

  const body = [
    `# Consulting — Faris Aziz`,
    ``,
    `> Hands-on technical consulting for teams and startups: architecture reviews, performance optimization, technical strategy, and implementation support. Specializes in React, Next.js, and payment systems. Free 20-minute discovery call: https://cal.com/farisaziz12/discovery-call`,
    ``,
    `## Areas of expertise`,
    ``,
    `- React & Next.js at production scale (server components, performance budgets)`,
    `- Payment systems (orchestration, resilience, region-aware checkout)`,
    `- Architecture (module boundaries, monorepos, micro-frontends)`,
    `- Developer experience (build tooling, CI/CD, testing strategy)`,
    `- Performance (Core Web Vitals, bundle optimization, caching)`,
    `- Security (auth patterns, API hardening)`,
    ``,
    `## Who it's for`,
    ``,
    `Startup founders, engineering teams, tech leaders, and agencies needing specialist support.`,
    ``,
    offers.length
      ? `## Engagement formats\n\n${offers
          .map((o) =>
            [
              `### ${o.title}`,
              ``,
              o.shortDescription || '',
              o.bestFor ? `Best for: ${o.bestFor}` : '',
              o.engagementFormat ? `Format: ${o.engagementFormat}` : '',
              o.outcomes?.length ? `Outcomes:\n${o.outcomes.map((x) => `- ${x}`).join('\n')}` : '',
              o.price
                ? `Pricing: from ${o.priceCurrency || 'USD'} ${o.price}${o.priceUnit ? `/${o.priceUnit}` : ''}`
                : 'Pricing: contact for a quote',
              o.bookingUrl ? `Book: ${o.bookingUrl}` : '',
            ]
              .filter(Boolean)
              .join('\n\n')
          )
          .join('\n\n')}`
      : `## Engagement formats\n\nFrom one-time architecture reviews to ongoing advisory — scoped per engagement. Start with the free discovery call.`,
    ``,
    `## How to start`,
    ``,
    `Book a free 20-minute discovery call: https://cal.com/farisaziz12/discovery-call — no pitch, no obligation.`,
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
