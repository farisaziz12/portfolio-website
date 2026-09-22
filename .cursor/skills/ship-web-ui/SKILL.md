---
name: ship-web-ui
description: Implement, lint, and browser-verify a website UI change on faziz-dev.com. Use when editing Astro pages, components, layouts, CSS, islands, or any user-visible web behavior.
paths: apps/web/**/*.{astro,css,tsx,jsx}
---

# Ship a web UI change

## Before code

1. Capture **before** screenshots per `agent-pr-visual-evidence`.
2. Read `apps/web/README.md` and `docs/ui-rules.md`. Tokens: `apps/web/src/styles/global.css`.

## Implement

- Reuse `ds-*` primitives. Do not invent a parallel button/card/link.
- Hydrate islands with the lightest directive that works.
- Do not reimplement theme, `.ds-reveal`, `data-track`, or cal.com handling.
- New CTAs: `data-track="slug"`.
- Sanity data: `.catch` to a fallback. Copy/numbers from queries or `lib/proof.ts` / `lib/availability.ts`, not hardcoded claims.
- No `mailto:`, no emojis, no raw Tailwind palettes.

## Verify

```sh
pnpm --filter web lint
pnpm --filter web typecheck
```

Then browser-verify the changed flow end to end (not a single screenshot): click, type, submit, navigate. Check light + dark if color/text changed. Check a second route that shares the component. Empty/error states if you own them.

If islands break with `jsxDEV is not a function`: `rm -rf apps/web/node_modules/.vite apps/web/.astro` and restart `pnpm web`.

## PR

Follow `agent-pr-visual-evidence`. Matching after screenshots are required.
