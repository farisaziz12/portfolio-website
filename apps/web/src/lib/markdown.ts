/**
 * Markdown mirrors for AI agents.
 *
 * Every key page has a `.md` sibling (e.g. /talks -> /talks.md) rendered at
 * build time from the same Sanity data as the HTML page. Agents and LLM
 * tooling (Claude Code, ChatGPT browsing flows, Cloudflare's markdown-for-
 * agents convention) fetch these instead of parsing our HTML — 3–5× fewer
 * tokens and zero nav noise. Discovery: `<link rel="alternate"
 * type="text/markdown">` in each page head + /llms.txt index.
 *
 * Note on content negotiation: these pages are prerendered static files, so
 * runtime `Accept: text/markdown` rewriting is not possible on the CDN — the
 * `.md`-suffix URL convention is the supported path.
 */

const FOOTER = `

---

Faris Aziz — Staff Software Engineer & Conference Speaker, Geneva.
Site: https://faziz-dev.com · Invite to speak: https://faziz-dev.com/invite · Consulting: https://cal.com/farisaziz12/discovery-call · Mentorship: https://faziz-dev.com/mentorship
LinkedIn: https://linkedin.com/in/farisaziz12 · GitHub: https://github.com/farisaziz12 · Bluesky: https://bsky.app/profile/farisaziz.com
`;

export function mdResponse(body: string, { footer = true } = {}): Response {
  return new Response(body.trimEnd() + (footer ? FOOTER : '') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function mdDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

/* ── Minimal Portable Text → Markdown serializer ─────────────────────────── */

interface PTSpan {
  _type: string;
  text?: string;
  marks?: string[];
}

interface PTBlock {
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: PTSpan[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  // code block fields
  code?: string;
  language?: string;
}

function serializeSpans(block: PTBlock): string {
  const defs = new Map((block.markDefs || []).map((d) => [d._key, d]));
  return (block.children || [])
    .map((span) => {
      let text = span.text || '';
      for (const mark of span.marks || []) {
        const def = defs.get(mark);
        if (def?._type === 'link' && def.href) text = `[${text}](${def.href})`;
        else if (mark === 'strong') text = `**${text}**`;
        else if (mark === 'em') text = `*${text}*`;
        else if (mark === 'code') text = `\`${text}\``;
      }
      return text;
    })
    .join('');
}

export function portableTextToMarkdown(blocks: unknown): string {
  if (!Array.isArray(blocks)) return '';
  const out: string[] = [];
  for (const raw of blocks as PTBlock[]) {
    if (!raw || typeof raw !== 'object') continue;
    if (raw._type === 'code' && raw.code) {
      out.push('```' + (raw.language || '') + '\n' + raw.code + '\n```');
      continue;
    }
    if (raw._type !== 'block') continue; // images/embeds: skip in the text mirror
    const text = serializeSpans(raw);
    if (!text.trim()) continue;
    if (raw.listItem === 'bullet') out.push(`- ${text}`);
    else if (raw.listItem === 'number') out.push(`1. ${text}`);
    else if (raw.style === 'h1') out.push(`# ${text}`);
    else if (raw.style === 'h2') out.push(`## ${text}`);
    else if (raw.style === 'h3') out.push(`### ${text}`);
    else if (raw.style === 'h4') out.push(`#### ${text}`);
    else if (raw.style === 'blockquote') out.push(`> ${text}`);
    else out.push(text);
  }
  return out.join('\n\n');
}
