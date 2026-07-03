# World-Class Roadmap: UX craft, OG/SEO, and Agent-First (LLM) Optimization

Date: 2026-07-03 · Follows: [`ux-ia-improvement-strategy.md`](./ux-ia-improvement-strategy.md) (Phases 0–4 shipped)

This is the "what's next after the IA/theming overhaul" plan. It synthesizes three research
tracks — (1) a benchmark of world-class developer/speaker portfolios (leerob, rauno.me,
joshwcomeau, kentcdodds, cassidoo, tejaskumar, paco.me, emilkowal.ski, swyx…), (2) agent-first /
LLM-discoverability practice as of 2026, (3) OG-image + technical SEO best practice — and maps
them against a code audit of this repo. Each item carries a verdict and effort estimate.

---

> **Execution status (2026-07-03):** Tiers 0, 2, 3 and the code-side items of Tiers 1 & 4 are
> implemented on this branch: robots.txt with AI-crawler allowlist, blog posts in RSS, full
> OG/Twitter meta set, JSON-LD `@graph` (Person entity + ProfilePage + Event + Service +
> breadcrumbs), entity block on /about, markdown mirrors (`/about.md`, `/talks.md`,
> `/talks/[slug].md`, `/events.md`, `/invite.md`, `/consulting.md`, `/mentorship.md`,
> `/contact.md`, `/index.md`, `/blog/[slug].md`) + `llms.txt` + `X-Robots-Tag: noindex` headers,
> the satori build-time OG card system (per-type templates, all pages wired), the speaker rider
> on /invite, palette organizer actions (copy bio / email / work-with-me), self-hosted fonts
> (Google Fonts CDN removed), and LCP hints on the hero image.
> **Still owner actions:** Google Search Console + Bing Webmaster verification & sitemap
> submission, IndexNow key + deploy hook, Wikidata Q-item, rider honorarium specifics, a
> showreel video, testimonials reframing (needs content curation), `/now`+`/uses` pages
> (need content), and Vercel WAF check (`curl -A "ChatGPT-User" https://faziz-dev.com/`).
> Notes: TalksFilter already had delivery counts + "Most delivered" sort; talk videos were
> already click-to-load facades; runtime `Accept: text/markdown` negotiation was skipped
> deliberately — pages are prerendered static files, so the `.md`-suffix convention is the
> supported path. Sitemap `lastmod` skipped rather than faked with build time.

## The one-paragraph thesis

The site's bones are now right (IA, theming, tokens). What separates it from the world-class tier
is: **(a) two literally broken foundations** (the default OG image 404s; there is no robots.txt),
**(b) a missing "organizer kit + proof" layer** that the best speaker sites (kentcdodds.com,
cassidoo.co) treat as the product, **(c) no per-page OG images or entity-grade structured data**,
and **(d) no agent-facing surface** — no markdown mirrors, no llms.txt, no entity block — at a
moment when AI referrals convert ~10× better than search and organizers increasingly paste a
speaker's URL into ChatGPT/Claude to draft the invite.

---

## Tier 0 — Broken today; fix immediately (≈ half a day)

| # | Issue | Evidence / fix |
|---|---|---|
| 0.1 | **`/og-default.jpg` does not exist.** `BaseLayout`/`SEO.astro` fall back to it, so every page without a Sanity `ogImage` advertises a 404 image to every scraper. | Ship a real default card now; replaced by the Tier 3 OG system. |
| 0.2 | **No `public/robots.txt`.** No sitemap reference; no explicit AI-crawler policy. | Add robots.txt (Tier 2 snippet) referencing `/sitemap-index.xml`. |
| 0.3 | **Own blog posts are missing from RSS** — `rss.xml.ts` only feeds events + external posts. | Add `blogPost` documents to the feed. |
| 0.4 | **Meta gaps:** no `og:image:width/height/alt`, `og:image:type`, `og:locale`, `twitter:site`; no `article:author`. | Extend `SEO.astro` (Tier 3 checklist). |
| 0.5 | **Search Console / Bing Webmaster not confirmed.** Bing matters disproportionately: ChatGPT search retrieval leans on Bing's index. | Verify both, submit sitemap. (Owner action.) |

## Tier 1 — Conversion & credibility layer (the Kent/Cassidy patterns) (≈ 1–2 weeks, mostly content + Sanity modeling)

What the benchmark shows: the best speaker sites win with **structured proof**, not visuals.

1. **Talk delivery records + aggregate stats.** Kent's "86 talks, delivered 200 times" framing.
   The Sanity model already links events→talks; surface it: on `/talks` each card gets
   "Delivered N× · last at {conference}"; the index hero gets the aggregate ("N talks · M
   deliveries · K countries"). On `/talks/[slug]`, list every delivery (event, date, video,
   slides) — it already partially exists; make it complete and chronological. *Effort: S.*
2. **Public speaker rider on `/invite`.** Adapt Cassidy's rider: honorarium expectations,
   travel/lodging terms, CoC + lineup-diversity requirements, recording/IP terms, A/V needs.
   Almost no engineer provides this; organizers love it. Add "Copy short bio" / "Copy medium bio"
   one-click buttons (bios exist on /invite already — add copy affordances) and a 30–60s
   showreel slot at the top when one exists. *Effort: S–M (mostly writing).*
3. **Testimonials as a first-class collection.** `/appreciation` already aggregates social
   proof — but it's framed as a vanity wall. Reframe: `/testimonials` (or keep the URL) with
   filterable categories (talk / workshop / mentorship / consulting), attributed quotes with role
   + company, and 2–3 contextually surfaced on `/invite`, `/consulting`, `/mentorship` (the
   Sanity `testimonial` type already exists). *Effort: M.*
4. **Video facades.** Wherever talk recordings embed, use a poster + click-to-load facade
   (`lite-youtube-embed` or hand-rolled) — never a raw YouTube iframe. Keeps `/talks` fast with
   dozens of recordings and removes ~500KB of third-party JS per embed. *Effort: S.*
5. **Quantified outcomes on consulting.** Client-story bullets with numbers (the impact metrics
   already exist in Sanity — cross-surface them on `/consulting` per-offer). Also the single
   biggest LLM-citability lever for the consulting funnel. *Effort: S.*

## Tier 2 — Agent-first / LLM layer (≈ 2–4 days)

Verdicts from the research (2025–26 evidence):

| Technique | Verdict |
|---|---|
| Server-rendered facts (no island-only content) | **Critical** — no major AI crawler executes JS (Vercel/MERJ: zero JS execution across GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot; only Gemini renders) |
| Permissive robots.txt naming AI bots | **Critical** — a consultant's site has nothing to protect; every crawl is marketing |
| Entity block + Person/ProfilePage JSON-LD with `sameAs`/`knowsAbout` | **Do** — entity recognition gates AI citation (77% of AI-cited URLs are *not* organic top-10) |
| `.md` mirrors + `Accept: text/markdown` negotiation | **Do (cheap)** — consumed by agent fetchers (Claude Code, ChatGPT-User flows) & saves 3–5× tokens; Cloudflare/Mintlify/Sentry pattern |
| llms.txt | **Speculative but ~30 min** — no provider officially consumes it; Google says it won't. Do it last, expect nothing |
| Blocking GPTBot/ClaudeBot/Google-Extended | **Never** — you want to be in training data and search indexes |
| WebSite `SearchAction` schema | **Skip** (retired Nov 2024); FAQ rich results also dead (keep visible FAQs for AI extraction; markup optional) |

Implementation plan:

1. **robots.txt** (`public/robots.txt`):
   ```
   User-agent: *
   Allow: /
   Disallow: /api/
   Disallow: /admin

   # AI crawlers explicitly welcome (default-allow; listed for self-documentation)
   User-agent: GPTBot
   User-agent: OAI-SearchBot
   User-agent: ChatGPT-User
   User-agent: ClaudeBot
   User-agent: Claude-SearchBot
   User-agent: Claude-User
   User-agent: PerplexityBot
   User-agent: Google-Extended
   User-agent: CCBot
   Allow: /

   Sitemap: https://faziz-dev.com/sitemap-index.xml
   ```
   Also verify Vercel's WAF/bot-protection isn't challenging these UAs
   (`curl -A "ChatGPT-User" https://faziz-dev.com/`).
2. **Entity block.** Homepage + `/about` open with 2–3 declarative, quotable sentences:
   "Faris Aziz is a Staff Software Engineer and conference speaker based in Geneva. He has
   spoken at N conferences across K countries, including {top names}. He consults on frontend
   architecture, payments, and engineering leadership." LLMs quote declarative sentences —
   currently the hero copy is vibe-first. Add a visible "Last updated {month}" on `/talks` and
   `/about` (freshness ≈ 40% of Perplexity's weighting; content <12 months old cites ~3×).
3. **JSON-LD `@graph` rebuild** in `SEO.astro`/BaseLayout with stable `@id`s:
   - `Person` `#person` — `knowsAbout`, full `sameAs` (LinkedIn, GitHub, Bluesky, X, YouTube,
     Sessionize, MentorCruise, ZurichJS), `image`, `worksFor`; referenced by every page.
   - `ProfilePage` wrapping `/about` (Google-documented type, 2024).
   - `Event` per upcoming event page (`performer` → `#person`, location/VirtualLocation,
     offers where ticket URLs exist) — high-leverage for a speaker.
   - `VideoObject` per recorded talk (partially exists on `/talks/[slug]` — align to the graph).
   - `Service` (+`Offer`) on consulting/mentorship (`provider` → `#person`).
   - `BreadcrumbList` on detail pages. Drop the generic per-page `WebPage`-only markup.
   All data from Sanity so markup never drifts from visible content.
4. **Markdown mirrors.** Astro file endpoints rendering the same Sanity data as clean Markdown:
   `/about.md`, `/talks.md`, `/talks/[slug].md`, `/events.md`, `/services.md`, `/consulting.md`,
   `/mentorship.md`, `/invite.md` (bio + rider + booking info!), `/blog/[slug].md` (Portable
   Text → md serializer). Middleware: rewrite when `Accept` prefers `text/markdown`, always
   `Vary: Accept`; `X-Robots-Tag: noindex` on `.md` responses; `<link rel="alternate"
   type="text/markdown">` in heads. *This is the highest-value agent feature: an organizer
   pasting faziz-dev.com into ChatGPT gets clean facts instead of a parsed nav.*
5. **llms.txt** — small index (identity blockquote + links to the `.md` URLs). Skip `llms-full.txt`.
6. **Wikidata Q-item** with conference speaker pages as references; `sameAs` both ways. (Owner action.)

## Tier 3 — OG image system + meta completeness (≈ 2–3 days)

1. **Build-time OG generation** — satori + `@resvg/resvg-js` in a static endpoint
   (`src/pages/og/[...slug].png.ts`, `getStaticPaths` over Sanity content). Node runtime (Vercel
   deprecated edge functions); fonts read from disk (TTF, 2 weights). Per-type templates on the
   dark brand (`#0A0C10` bg + accent + 1px inner border so cards hold up on light and dark feed
   chrome):
   - **Talk:** title (≥56px, 2-line clamp) + "Delivered N× · {latest conference}" + name/avatar strip.
   - **Event:** event name + date + city + "Faris Aziz — {talk title}".
   - **Blog:** title + reading time + date + avatar + domain.
   - **Home/About/Contact:** name headline + positioning line + avatar (profile card).
   - **Services:** offer headline + name + domain.
   ISR homepage can use the static default card.
2. **`SEO.astro` completeness:** `og:image:width/height/alt/type`, `og:locale`, `twitter:site` +
   `creator`, `article:author`, `fediverse:creator`, PNG only, <1MB (Bluesky cap). Validate with
   LinkedIn Post Inspector + a real Slack/Discord paste.
3. **Sitemap `lastmod`** via `serialize` using Sanity `_updatedAt`; keep the attend/admin filter;
   add `/404` exclusions as needed.
4. **IndexNow** key + a deploy-hook POST for changed URLs (Bing/Yandex; Google doesn't consume it).

## Tier 4 — Performance & craft polish (≈ 1 week, incremental)

1. **Self-host fonts.** Replace the render-blocking Google Fonts CSS with self-hosted subsetted
   WOFF2 + preload for the two above-the-fold faces + metric-matched fallbacks
   (`size-adjust`/`ascent-override`) — Astro's Fonts API (experimental 5.7+, stable in Astro 6)
   does all of this natively. Kills the largest remaining LCP/CLS tax.
2. **Image discipline.** Sanity URLs with `?auto=format&fit=max&w=…` (already partially done),
   explicit `width`/`height` everywhere (several hero/mosaic imgs lack them), `fetchpriority="high"`
   on the LCP hero image, lazy elsewhere. Don't double-process Sanity images through astro:assets.
3. **One signature craft moment.** The benchmark consensus: radical minimalism + exactly one
   memorable interaction. Candidates that fit the existing brand: (a) the ⌘K palette upgraded with
   organizer actions — "Copy short bio", "Download headshot", "Book me", theme, search — making
   keyboard-first UX the signature (Paco pattern; palette already exists, this is additive);
   (b) view-transition morphs from talk card → talk page. Pick one, perfect it, stop.
4. **`/craft`-style proof (optional, high effort).** Interactive artifacts from talk demos —
   proves the talks are good before anyone presses play (Rauno pattern). Only if there's appetite
   to maintain it; a bad craft page is worse than none.
5. **Slash pages:** `/now` (current focus, feeds the consulting narrative), `/uses`, `/ai`
   (stance page). Cheap "a real human maintains this" signals; all three get `.md` mirrors.
6. **Consider dropping `<ClientRouter/>`** for native cross-document view transitions once
   browser support satisfies (removes the pseudo-SPA script-reinit complexity that already bit
   the theme system once). Not urgent — the after-swap handlers now work.

## Measurement

- PostHog: segment traffic by AI referrers (chatgpt.com, perplexity.ai, claude.ai) and by AI
  UAs; watch `cta_click` conversion per source. AI referrals convert ~1.66–7% vs 0.15% search —
  small volume, disproportionate value for consulting.
- Search Console + Bing Webmaster monthly review; Rich Results Test after the JSON-LD rebuild
  (Event, Video, Breadcrumb should validate; Person/ProfilePage won't show a "rich result" — expected).
- Re-run Lighthouse after Tier 4 fonts/images; target 100/100/100/100 on key pages and *claim it*.

## Benchmark cheat-sheet (what "world class" does that we now copy)

| Site | Signature move | Our adoption |
|---|---|---|
| kentcdodds.com | Talks as entities w/ delivery records + 56 filterable testimonials | Tier 1.1, 1.3 |
| cassidoo.co | Public speaker rider in the open | Tier 1.2 |
| rauno.me | /craft interactive artifacts | Tier 4.4 (optional) |
| paco.me | ⌘K as identity | Tier 4.3 (palette exists — add organizer actions) |
| joshwcomeau.com | Flash-free theming obsession | ✅ shipped in Phase 0 |
| leerob.com | Radical minimalism, prose-first | Adopted as IA philosophy (Phase 2) |
| tejaskumar.com | "Keynote Speaker" in the `<title>`, booking-first | Tier 2.2 entity block + title review |
| Stripe/Mintlify/Cloudflare | `.md` mirrors + content negotiation | Tier 2.4 |
