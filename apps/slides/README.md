# Faris Slides

Personal, Slidev-based presentation system for Faris Aziz. Part of the
faziz-dev.com monorepo; run everything from the repo root:

```bash
pnpm install
pnpm slides new <talk>          # planning files + placeholder slide
pnpm slides dev <talk>          # live editing
pnpm slides review <talk>       # typecheck, build, screenshot every state
pnpm slides publish <talk> --slug <url-slug>   # → apps/web/public/slides/<url-slug>/
```

Commit the published folder with the site; Vercel serves it at `/slides/<url-slug>/`.
Raw recordings (`media/source-video/`) and review runs (`artifacts/`) are local only.

**Status:** first visual checkpoint ready for approval. The repository contains a local
theme and a six-slide light/dark showcase for the `cover`, `statement`, and
`code` layouts.

## Run the checkpoint

Requires Node.js 22.12 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open the URL printed by Slidev. The example deck lives at
`decks/showcase/slides.md` and consumes the workspace theme
`slidev-theme-faris`.

Checkpoint validation commands:

```bash
pnpm typecheck
pnpm build
pnpm capture:p1
pnpm export:p1
```

## Read order

1. `AGENTS.md`: durable working and brand rules.
2. `PLAN.md`: actual status, checks, limitations, and next approval gate.
3. `DESIGN.md`: implementation contract and code-reading map.
4. `docs/AGENT_WORKFLOW.md`: planned authoring, writing, browser, and media passes.
5. `docs/PROJECT_BRIEF.md`, `docs/DESIGN_SPEC.md`, and `docs/ACCEPTANCE.md`: source requirements.
6. `references/README.md` and `docs/SOURCE_NOTES.md`: visual authority and primary documentation.

## First implementation checkpoint

One local theme and three representative slide types: cover, statement, and
code. Each appears once in light mode and once in dark mode. Review the six
screenshots and PDF under `artifacts/p1` before expanding the component
inventory.

The PDF expands click steps into 12 pages. Per-deck findings are in
`decks/showcase/review.md`. Presenter rehearsal and full offline production
testing are not yet complete. Agent skills, the multi-deck command wrapper,
sprites, Remotion, and interactive-demo fallbacks are planned, not built.

A usable talk comes before a general-purpose presentation engine.
