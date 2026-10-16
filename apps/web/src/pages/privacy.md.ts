import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';
import { getProfile, fullDate } from '../lib/sanity/v3';
import { PRIVACY_LEDE, PRIVACY_UPDATED, privacySections } from '../lib/privacy';

export const GET: APIRoute = async () => {
  const profile = await getProfile();
  const body = [
    `# Privacy: what faziz-dev.com collects`,
    ``,
    `> ${PRIVACY_LEDE}`,
    ``,
    `Last updated ${fullDate(PRIVACY_UPDATED)}.`,
    ``,
    ...privacySections(profile.replyTime).flatMap((s) => [`## ${s.heading}`, ``, ...s.body.flatMap((p) => [p, ``])]),
    `Ask about your data: ${SITE}/contact#message`,
  ].join('\n');
  return mdResponse(body);
};
