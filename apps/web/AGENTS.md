# apps/web

Astro 5 site. Architecture map: [README.md](./README.md). Email subsystem: [CLAUDE.md](./CLAUDE.md).

## Run

```sh
pnpm --filter web dev          # :4321
pnpm --filter web lint         # eslint + UI guardrails + conventions
pnpm --filter web lint:ui
pnpm --filter web lint:conventions
pnpm --filter web typecheck
```

Without Sanity network access the site still renders — that is resilience, not a bug.

## Rendering

- Everything is prerendered except `/` (`prerender = false`, ISR ~1h).
- ViewTransitions (`ClientRouter`): head scripts run once per visit. Anything that must re-run after navigation listens to `astro:after-swap`.
- React islands live in `src/components/islands/`. Use the lightest directive: `client:visible` for below-the-fold forms, `client:idle` for the hero terminal, `client:load` only when needed immediately. Server-rendered React with no directive ships zero JS.

## Do not reimplement (all in `src/layouts/BaseLayout.astro`)

- Theme (dark default, `light` only if stored; `.dark` + `data-theme`)
- Scroll reveal (`.ds-reveal`)
- `data-track` → `cta_click`
- cal.com links → embedded modal + `discovery_call_opened`
- SEO/JSON-LD via `shared/SEO.astro`

## File map

```
src/components/design/     DS primitives
src/components/islands/    React (hydrate)
src/emails/                React Email — see CLAUDE.md
src/lib/sanity/            client, queries.ts (all GROQ), types
src/lib/email.ts           Resend env() + sendOrLog — never new Resend() in a route
src/lib/analytics.ts       typed track() — keep in sync with docs/measurement.md
src/pages/*.md.ts          agent markdown mirrors
src/pages/llms.txt.ts      llmstxt.org index
src/styles/global.css      Design System v2 — token source of truth
```

## When you add a page

Follow `.cursor/skills/add-site-page/SKILL.md`: `.astro` page, `.md` mirror, `llms.txt.ts`, OG map, `data-track` on CTAs.

## Visual QA

Any change under `src/pages`, `src/components`, `src/layouts`, `src/styles`, or `src/emails` is a visual surface. Capture before/after per `.cursor/skills/agent-pr-visual-evidence/SKILL.md` before opening a PR.
