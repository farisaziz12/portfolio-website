# Agent instructions — faziz-dev.com

Personal site for Faris Aziz. Treat this as a design-sensitive, CMS-backed marketing site, not a generic CRUD app.

This file is the always-on map. Do **not** copy long guides into chat — open the linked file when the task needs it.

## Stack

| Piece | Where | Notes |
|---|---|---|
| Astro 5 + React islands | `apps/web` | Vercel. Homepage is ISR (`prerender = false`); everything else is prerendered. |
| Sanity v3 | `apps/studio` | Content. GROQ in `apps/web/src/lib/sanity/queries.ts`. |
| Design System v2 | `apps/web/src/styles/global.css` | Tokens + `ds-*` classes. Guardrails: `apps/web/scripts/ui-guardrails.mjs`. |
| Resend + React Email | `apps/web/src/emails`, `apps/web/src/pages/api` | No `mailto:` on the site. Spec: `apps/web/CLAUDE.md`. |
| PostHog (EU) | `apps/web/src/components/posthog.astro`, `apps/web/src/lib/analytics.ts` | Inventory: `docs/measurement.md`. |

Ignore `/src` at the repo root — leftover Next.js, not part of the build.

## Commands

```sh
pnpm install
pnpm web          # site → http://localhost:4321
pnpm studio       # Sanity Studio
pnpm --filter web lint          # eslint + UI guardrails
pnpm --filter web lint:ui
pnpm --filter web typecheck     # astro check
```

The site must still render without Sanity/Resend/PostHog credentials (empty states / hardcoded proof fallbacks). Missing env is not a crash.

## Canonical docs (read, don't duplicate)

| When | Open |
|---|---|
| Architecture, islands, ViewTransitions, conventions | `apps/web/README.md` |
| Email / Resend / no-mailto | `apps/web/CLAUDE.md` |
| Tokens, a11y, no emojis, component checklist | `docs/ui-rules.md` (tokens in `global.css` win if they disagree) |
| Content model, talk vs event, editing recipes | `docs/sanity-guide.md` |
| Events, identify, recordings | `docs/measurement.md` |
| Cursor rules / skills / MCPs | `.cursor/README.md` |

Nested `AGENTS.md` files in `apps/web` and `apps/studio` apply when you work in those trees.

## Hard constraints

1. **No `mailto:`** in site UI. Contact goes through Resend forms. The only allowed `mailto:` is inside admin email templates.
2. **No raw Tailwind palette classes** (`bg-slate-800`, `text-blue-500`, …). Use `ds-*` / `rgb(var(--token) / …)`. `pnpm --filter web lint:ui` fails the build.
3. **No new hex literals** outside `global.css` and emails (satori `og.ts` is allowlisted). No new inline `style=""` in `.astro` files.
4. **No emojis in the UI.** SVG icons only.
5. **Sanity fetches are failure-tolerant:** `sanityFetch(...).catch(() => [])` (or a fallback object). A CMS outage must never 500 a page.
6. **Numbers come from data**, not copy (`lib/availability.ts`, `lib/proof.ts`, live queries).
7. **Talk ≠ event.** A talk is bookable and timeless. An event has a date. Never model an upcoming appearance as a talk.
8. **Agent surface stays in sync.** New/renamed public pages need a `.md` mirror, an `llms.txt.ts` entry, and an OG card in `pages/og/[...slug].png.ts`.
9. **Do not reimplement** theme, scroll-reveal, `data-track` analytics, or cal.com modal — they live in `BaseLayout.astro`.
10. **Do not add analytics events** unless a decision depends on them. If you do, update `AnalyticsEvent` and `docs/measurement.md` together.

## MCPs for this repo

Project servers live in `.cursor/mcp.json` (OAuth, no secrets in git):

| Server | Use for |
|---|---|
| Sanity | Schema, GROQ, documents — never guess field names |
| PostHog | Event inventory, insights, docs — don't invent event names |
| Vercel | Preview deploys, runtime logs, env |
| GitHub | PRs, checks, review threads |

Authenticate in Cursor (Customize → MCP) if a server shows `needsAuth`. Do not put tokens in `mcp.json`.

## Agent PRs — visual evidence is mandatory

If you are an agent (Cursor, Claude Code, Copilot, Codex, …) opening a PR:

1. Follow `.cursor/skills/agent-pr-visual-evidence/SKILL.md`.
2. Fill `.github/PULL_REQUEST_TEMPLATE.md` (and the agent template when applicable).
3. **UI changes require before + after screenshots** of the real pages (desktop; mobile too if layout/CSS changed). Interactive flows need a short recording.
4. `<!-- visual-evidence: not-applicable -->` is allowed **only** when the diff touches no visual surface. CI rejects N/A on UI paths.
5. Embed images in the PR body. Cloud agents: HTML `<img>` tags pointing at walkthrough artifact files.

CI: `.github/workflows/agent-pr-visual-evidence.yml`.
