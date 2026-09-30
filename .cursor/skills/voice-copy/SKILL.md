---
name: voice-copy
description: Write, review or clean up copy on faziz-dev.com so it sounds like Faris, not an AI. Use when writing or editing any user-facing text (pages, components, emails, .md mirrors, OG cards, defaults.ts) or Sanity content, or when asked to find AI tells, fix tone, or review voice.
---

# Voice and copy

Guide: `docs/voice.md` (read it first). Rules: `packages/shared/src/voice.ts` (one list for lint, CMS scan, Studio).

## Writing or editing copy

1. Write it the way Faris would say it to an organiser: first person, short sentences, one idea each, concrete.
2. Run `pnpm --filter web lint:voice`. Fix every finding by rewriting the sentence, not by swapping a synonym.
3. Read the result out loud. The linter misses sentences that say nothing: filler, copy that explains the UI,
   triples by reflex, a claim without a number or a name. Cut those.
4. Numbers come from data (derived stats, approved metrics), never typed into copy.
5. Other people's quotes (praise) are verbatim. Never edit them, never "tidy" them.

## Reviewing Sanity content

1. `pnpm voice:cms --json` (live; needs `PUBLIC_SANITY_PROJECT_ID`) or `SANITY_FIXTURES=1 pnpm voice:cms` (offline).
2. Group findings by document. For each, propose `document · field · current → proposed · why` as a table.
3. Apply only after Faris approves, via the Sanity MCP in drafts (Prompt 13 in `docs/sanity-mcp-prompts.md`).
4. Don't change facts, names, dates, slugs or quotes while fixing voice. Unsure what he meant → ask.

## When the linter is wrong

A flagged phrase that is genuinely right (a talk title someone else chose): add `voice-ok` on that code line.
A rule firing on honest copy: tighten its pattern in `voice.ts` and add the case to
`apps/web/src/lib/voice.test.ts`. Never delete a rule to get green.

## Rewrites Faris has approved

See the before/after table in `docs/voice.md`. Match that register: warm, plain, a bit informal
("Happy for you to use…", "Just ask", "Please keep it as it is").
