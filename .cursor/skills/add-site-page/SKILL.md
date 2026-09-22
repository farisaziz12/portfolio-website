---
name: add-site-page
description: Add or rename a public page on faziz-dev.com, including the markdown mirror, llms.txt entry, and OG card. Use when creating a new Astro route or renaming a public URL.
---

# Add or rename a public page

Public pages have four surfaces. Shipping only the `.astro` file leaves agents and social cards stale.

1. **HTML** — `apps/web/src/pages/<route>.astro` (or `[slug].astro`). Wrap in `BaseLayout`. Pass `markdownAlternate` (e.g. `"/talks.md"`).
2. **Markdown mirror** — `apps/web/src/pages/<route>.md.ts` using the same Sanity queries as the HTML page. Content-Type is set in `vercel.json`.
3. **llms.txt** — add a link in `apps/web/src/pages/llms.txt.ts`.
4. **OG card** — register the path in `apps/web/src/pages/og/[...slug].png.ts`.

Also:

- Nav: `Header.astro` / `Footer.astro` only if the page is a primary destination. Labels: 1–2 words (`Talks`, not `Speaking Engagements`).
- JSON-LD: pass `extraSchema` into `BaseLayout` when the page is an Event/Service/Article.
- CTAs: `data-track`.
- Sanity: failure-tolerant fetch.
- After rename: update every in-repo link, the `.md` filename, `llms.txt`, and the OG map. Keep a redirect only if the old URL was public.

Then visual-QA both the HTML page and (optional) the `.md` mirror in the browser, and follow `agent-pr-visual-evidence`.
