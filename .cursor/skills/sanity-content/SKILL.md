---
name: sanity-content
description: Change Sanity schema, GROQ, or CMS-backed site content for faziz-dev.com. Use when editing apps/studio schemas, desk structure, or apps/web/src/lib/sanity queries and types.
paths: apps/studio/**,apps/web/src/lib/sanity/**
---

# Sanity content / schema change

Guide: `docs/sanity-guide.md`. Use the Sanity MCP to inspect schema and try GROQ before committing guesswork.

## Schema change

1. Edit `apps/studio` schema.
2. Project the new fields in the matching loader in `apps/web/src/lib/sanity/v3/` (and normalise legacy shapes there, never in pages).
3. Update `apps/web/src/lib/sanity/v3/types.ts` / `types-site.ts`; shared option lists go in `packages/shared/src/content-model.ts`.
3b. Add fixture docs to `apps/web/fixtures/build-dataset.py` and a case to `src/lib/sanity/v3/v3.test.ts`.
4. Site consumers must tolerate missing data (empty state or `lib/proof.ts`).
5. `pnpm --filter studio build` validates schema (this is what CI runs).

## IA

Talk ≠ event. Upcoming appearances are events with a future `date`; what Faris does there is a session with a role. Versioned talks use `parentTalk` + `isCurrentVersion`. Content cleanup via MCP: `docs/sanity-mcp-prompts.md`.

## Content vs code

Editorial copy, bios, talks, events, offers, testimonials belong in Studio. Code changes are for schema, queries, and rendering. If the user wants content entered, use Studio or the Sanity MCP — do not hardcode a one-off page of copy unless they asked for a fallback.

## Afterward

If a page's rendered content changed, treat it as UI and follow `agent-pr-visual-evidence`.
