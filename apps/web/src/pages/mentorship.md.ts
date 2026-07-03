import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { mentorshipOffersQuery } from '../lib/sanity/queries';
import { mdResponse } from '../lib/markdown';

interface ServiceOffer {
  title: string;
  shortDescription?: string;
  bestFor?: string;
  engagementFormat?: string;
  bookingUrl?: string;
}

export const GET: APIRoute = async () => {
  const offers = await sanityFetch<ServiceOffer[]>(mentorshipOffersQuery).catch(() => []);

  const body = [
    `# Mentorship — Faris Aziz`,
    ``,
    `> 1:1 coaching for software engineers: career strategy, technical mastery, public speaking, and sustainable growth. Weekly or bi-weekly cadence, typical engagements 3–6 months. Inquiries: https://faziz-dev.com/mentorship (reply within two days). Also bookable via MentorCruise: https://mentorcruise.com/mentor/farisaziz/`,
    ``,
    `## Focus areas`,
    ``,
    `- Career growth: promotion strategy, salary negotiation, role transitions`,
    `- Technical mastery: React & Next.js patterns, system design, architecture thinking`,
    `- Public speaking: CFP writing, talk preparation, stage presence`,
    `- Remote & async: communication, timezones, sustainability`,
    ``,
    `## How it works`,
    ``,
    `- Outcome-first: every session ends with concrete next steps`,
    `- Honest, direct feedback; everything discussed stays private`,
    `- Goals are tracked with real accountability`,
    `- If a session isn't valuable, it's free — engagements can stop anytime`,
    ``,
    offers.length
      ? `## Programs\n\n${offers
          .map((o) =>
            [`### ${o.title}`, o.shortDescription || '', o.bestFor ? `Best for: ${o.bestFor}` : '', o.engagementFormat ? `Format: ${o.engagementFormat}` : '', o.bookingUrl ? `Book: ${o.bookingUrl}` : '']
              .filter(Boolean)
              .join('\n\n')
          )
          .join('\n\n')}`
      : '',
    ``,
    `## How to start`,
    ``,
    `Send an inquiry with your goals, budget, and preferred cadence: https://faziz-dev.com/mentorship`,
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
