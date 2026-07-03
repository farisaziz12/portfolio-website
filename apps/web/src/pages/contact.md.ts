import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { availabilityLabel } from '../lib/availability';

export const GET: APIRoute = async () => {
  const body = [
    `# Work with Faris Aziz`,
    ``,
    `> ${availabilityLabel('Available')}. Three ways to work together — every route lands straight in Faris's inbox, and he replies within two days. He'd rather make something work than say no.`,
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
    `1:1 coaching for engineers — career strategy, skills, confidence. Send an inquiry: https://faziz-dev.com/mentorship`,
    ``,
    `## Direct`,
    ``,
    `Email: hello@farisaziz.com · LinkedIn: https://linkedin.com/in/farisaziz12`,
  ].join('\n');

  return mdResponse(body, { footer: false });
};
