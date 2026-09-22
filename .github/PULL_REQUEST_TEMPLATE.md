## Summary

<!-- What changed and why. Link the issue/discussion if there is one. -->

## How to test

<!-- Commands and URLs a reviewer should hit. -->

```sh
pnpm --filter web lint
pnpm --filter web typecheck
pnpm web   # http://localhost:4321
```

## Visual evidence

<!--
Agent-authored PRs: this section is enforced by
`.github/workflows/agent-pr-visual-evidence.yml`.

UI diffs (pages, components, layouts, styles, emails, OG, tailwind config)
MUST embed before AND after screenshots of the real pages. Alt text or
headings must include the words "before" and "after".

Non-UI diffs may use the HTML comment below plus one sentence of reason.
-->

### Before

<!-- Embed a screenshot. Alt text must include "before". -->

### After

<!-- Embed a matching screenshot. Alt text must include "after". -->

Non-UI agent PRs only: add an HTML comment whose inner text is exactly `visual-evidence: not-applicable`, then one sentence of reason. Do not leave a placeholder.

## Checklist

- [ ] `pnpm --filter web lint` (includes UI guardrails) and typecheck pass locally, or CI covers them
- [ ] No new `mailto:`, emojis, raw Tailwind palettes, or inline styles
- [ ] Sanity fetches still fail open; new fields are in GROQ queries
- [ ] Public page add/rename: `.md` mirror, `llms.txt`, OG map updated
- [ ] Analytics: `data-track` on new CTAs; new events documented in `docs/measurement.md`
- [ ] Visual evidence filled (before/after or valid N/A)
