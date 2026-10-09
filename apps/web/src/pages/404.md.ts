import type { APIRoute } from 'astro';
import { mdResponse } from '../lib/markdown';
import { SITE } from '../lib/seo';

/**
 * Markdown body for 404s. Agents that send `Accept: text/markdown` get this
 * (with status 404) for any unknown path; see lib/markdown-negotiation.ts.
 */
export const GET: APIRoute = () =>
  mdResponse(
    [
      `# 404: page not found`,
      ``,
      `> There's nothing at this address. It never existed, or it moved.`,
      ``,
      `Start from the index for agents: ${SITE}/llms.txt (every page, with a Markdown version of each).`,
      ``,
      `## Where people usually meant to go`,
      ``,
      `- [Speaking](${SITE}/speaking.md): talks, workshops, where I'll be next`,
      `- [Talk catalogue](${SITE}/talks.md): every bookable talk, with recordings and slides`,
      `- [Articles & podcasts](${SITE}/blog.md): posts, guest articles, podcasts and video`,
      `- [Contact](${SITE}/contact.md): invite me to speak, or send a message`,
      ``,
      `Full list of HTML pages: ${SITE}/sitemap-index.xml`,
    ].join('\n'),
  );
