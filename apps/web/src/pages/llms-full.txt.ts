import type { APIRoute } from 'astro';

/**
 * /llms-full.txt: every markdown mirror concatenated, for agents that want the
 * whole site in one fetch. Built at prerender time by calling the mirror
 * endpoints' GET handlers directly (no network), so it never drifts from them.
 */
const MIRRORS = import.meta.glob<{ GET?: APIRoute }>(
  [
    './home.md.ts',
    './speaking.md.ts',
    './talks.md.ts',
    './events.md.ts',
    './workshops.md.ts',
    './invite.md.ts',
    './press-kit.md.ts',
    './blog.md.ts',
    './community.md.ts',
    './about.md.ts',
    './impact.md.ts',
    './appreciation.md.ts',
    './services.md.ts',
    './mentorship.md.ts',
    './contact.md.ts',
    './connect.md.ts',
    './privacy.md.ts',
  ],
  { eager: true }
);

const ORDER = Object.keys(MIRRORS);

export const GET: APIRoute = async (ctx) => {
  const parts: string[] = [];
  for (const key of ORDER) {
    const handler = MIRRORS[key]?.GET;
    if (!handler) continue;
    try {
      const res = await handler(ctx);
      if (res instanceof Response && res.ok) {
        const path = key.replace('./', '/').replace('.md.ts', '.md');
        parts.push(`<!-- source: https://faziz-dev.com${path} -->\n\n${(await res.text()).trim()}`);
      }
    } catch {
      // A failing mirror is skipped, never fatal.
    }
  }
  return new Response(parts.join('\n\n\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
