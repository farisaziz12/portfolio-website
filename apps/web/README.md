# apps/web — the website

Astro 5 site with React islands, served on Vercel. This README is the
architecture map; the deeper guides live next to the code:

| Topic | Where |
|---|---|
| Email subsystem (Resend), env vars, no-mailto policy | [`CLAUDE.md`](./CLAUDE.md) |
| Design-system rules (tokens, `ds-*` classes, guardrails) | [`../../docs/ui-rules.md`](../../docs/ui-rules.md) |
| Content model + editing recipes | [`../../docs/sanity-guide.md`](../../docs/sanity-guide.md) |
| Analytics events + funnels | [`../../docs/measurement.md`](../../docs/measurement.md) |

## Commands

```sh
pnpm dev          # dev server on :4321
pnpm build        # production build (needs Sanity network access)
pnpm lint         # eslint + UI guardrails
pnpm lint:ui      # just the guardrails (scripts/ui-guardrails.mjs)
npx astro check   # typecheck
```

## How rendering works

- **Everything is prerendered at build time except `/`.** The homepage sets
  `prerender = false` and is ISR-cached (~1h) so the "Next up" band and
  availability labels stay fresh without redeploys.
- **Navigation uses Astro ViewTransitions** (`ClientRouter`). Consequences:
  - Head scripts run once per visit, not per page. Anything that must re-run
    after navigation listens to `astro:after-swap` (theme, reveals, page inits).
  - Talk titles morph between list and detail via `viewTransitionName: talk-{slug}`.
- **React islands** (`src/components/islands/`) hydrate with the lightest
  directive that works: `client:visible` for below-the-fold forms,
  `client:idle` for the hero terminal, `client:load` only when needed
  immediately. Server-rendered React components without a directive (e.g.
  `EventRow` on /speaking) ship zero JS.

## Sitewide behaviors (all in `src/layouts/BaseLayout.astro`)

These are global on purpose — pages must NOT reimplement them:

- **Theme**: dark by default, `light` only if stored; sets both `.dark` class
  and `data-theme`, re-applied on `astro:after-swap`. The toggle animates via
  the View Transitions circular reveal.
- **Scroll reveal**: one `IntersectionObserver` arms every `.ds-reveal`
  element (with a 600 ms failsafe). Pages just add the class.
- **Analytics**: one document-level listener sends `cta_click` for any element
  with `data-track`. Add `data-track="my-cta"` — done. (Event inventory:
  `docs/measurement.md`.)
- **cal.com**: clicks on `a[href^="https://cal.com/"]` open the embedded modal
  (with a popup fallback) and fire `discovery_call_opened`.
- **SEO/JSON-LD**: `shared/SEO.astro` renders the `@graph` with a stable
  `#person` entity. Pages pass `extraSchema` for Events/Services/Breadcrumbs
  and `markdownAlternate` for their markdown mirror.

## Directory map

```
src/
├── components/
│   ├── design/       # DS primitives (Kicker, IconChip, ContactPanel, …)
│   ├── events/       # EventRow — the one true event listing row
│   ├── islands/      # React (forms, filters, terminal, palette, toggle)
│   ├── services/     # ServiceOfferCard
│   ├── shared/       # SEO, utils
│   └── social/       # SocialWall
├── emails/           # React Email templates (see CLAUDE.md)
├── layouts/          # BaseLayout (head, theme, global scripts)
├── lib/
│   ├── sanity/       # client, queries.ts (all GROQ), types.ts (shared shapes)
│   ├── availability.ts  # date-driven "Available · Q3 2026" + quarterLoad urgency
│   ├── email.ts      # Resend singleton, env(), sendOrLog()
│   ├── flags.ts      # country name → flag emoji
│   ├── markdown.ts   # helpers for the .md mirror endpoints
│   ├── og.ts         # satori/resvg OG card renderer
│   └── proof.ts      # hardcoded fallback stats (single source)
├── pages/
│   ├── api/          # invite, mentorship, contact, workshop routes
│   ├── og/           # build-time OG image endpoint
│   ├── *.md.ts       # agent-facing markdown mirrors (+ llms.txt.ts)
│   └── *.astro       # pages
└── styles/global.css # Design System v2 tokens + ds-* classes
```

## Conventions that CI enforces

`pnpm lint:ui` fails the build on:

- raw Tailwind palette classes (use `rgb(var(--token) / alpha)` via `ds-*`
  classes or scoped styles);
- new hex literals beyond the baseline (satori's `og.ts` is allowlisted —
  it can't read CSS variables);
- new inline styles beyond the baseline.

Other rules that aren't automated but are load-bearing:

- **No `mailto:` links anywhere.** Contact always goes through the
  Resend-backed forms (`/contact`, `/invite`, `/mentorship`). Details and the
  one exception: `CLAUDE.md`.
- **Every Sanity fetch is failure-tolerant**: `sanityFetch(...).catch(() => [])`
  (or a fallback object). A CMS outage must never 500 a page.
- **Numbers come from data, not copy.** Availability quarters, urgency pills,
  and stats derive from `lib/availability.ts`, `lib/proof.ts`, and live
  queries so they can't go stale.
- **Agent surface stays in sync.** If you add/rename a page, update its `.md`
  mirror, `llms.txt.ts`, and the OG card map (`pages/og/[...slug].png.ts`).

## Local-dev quirks

- Without Sanity network access the site renders with fallbacks/empty states —
  that's the resilience working, not a bug.
- If islands fail with `jsxDEV is not a function` after dependency changes:
  `rm -rf node_modules/.vite .astro` and restart the dev server.
