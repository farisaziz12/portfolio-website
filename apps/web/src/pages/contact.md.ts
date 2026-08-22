import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { availabilityLabel } from '../lib/availability';

export const GET: APIRoute = async () => {
  const body = [
    `# Work with Faris Aziz`,
    ``,
    `> ${availabilityLabel('Available')}. Four ways to work together. Every route lands straight in Faris's inbox, and he replies within two days. He'd rather make something work than say no.`,
    ``,
    `## 1. Invite him to speak`,
    ``,
    `Keynotes, conference talks, panels, and full-day workshops. Submit an invitation: https://faziz-dev.com/invite`,
    ``,
    `## 2. Book a consulting call`,
    ``,
    `Free 20-minute discovery call about architecture, performance, payments, or team enablement: https://cal.com/farisaziz12/discovery-call`,
    ``,
    `## 3. Get mentored`,
    ``,
    `1:1 coaching for engineers: career strategy, skills, confidence. Send an inquiry: https://faziz-dev.com/mentorship`,
    ``,
    `## 4. Hire him full-time`,
    ``,
    `Faris is open to full-time roles: tech lead, staff/senior frontend engineer, full-stack (frontend-leaning), payments, product engineering, and founding engineer. Send the role and team details via the contact form: https://faziz-dev.com/contact?topic=role#message`,
    ``,
    `## Direct`,
    ``,
    `Contact form (goes straight to Faris's inbox): https://faziz-dev.com/contact#message · LinkedIn: https://linkedin.com/in/farisaziz12`,
  ].join('\n');

  return mdResponse(body, { footer: false });
};
