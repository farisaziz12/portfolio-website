import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { PAY_IT_FORWARD_CAL, PAY_IT_FORWARD_COPY as C, STARTERS, starterHref } from '../lib/pay-it-forward';

const SITE = 'https://faziz-dev.com';

export const GET: APIRoute = () => {
  const body = [
    `# ${C.title}`,
    ``,
    `> ${C.lede}`,
    ``,
    `Book: ${PAY_IT_FORWARD_CAL} (15 min, video call, free, one-off)`,
    ``,
    `## What we can talk about`,
    ``,
    ...STARTERS.map((s) => `- **${s.title}**: ${s.line}${s.bring ? ` Bring: ${s.bring}.` : ''} Book: ${starterHref(s)}`),
    ``,
    `## ${C.isntTitle}`,
    ``,
    C.isntBody,
    ``,
    `${C.longerTitle} ${C.longerBody} ${SITE}/mentorship`,
  ].join('\n');

  return mdResponse(body);
};
