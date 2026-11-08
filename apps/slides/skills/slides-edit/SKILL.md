---
name: slides-edit
description: Review or edit Faris Slides copy for factual support, technical correctness, spoken voice and AI-style filler. Use for anti-slop and editorial passes on slides and notes; not an AI-authorship detector.
---

# Edit the talk, not the brand

Read the brief, approved outline, slides, sources and review. A review request
permits findings, not silent rewrites. An editing pass permits scoped copy
changes, not a new argument or unrelated theme work. Reopen outline approval
for substantive argument changes.

Run separate passes and record findings by slide:

- Claims/code: verify quotations and factual claims against primary sources.
  Test executable examples where practical; record commands and omissions.
  Label opinions and illustrative code. Unverified claims remain unresolved.
- Talk shape: check the promise, transitions, time budget and ending.
- Voice/density: cut generic openings, promotional inflation, vague attribution,
  fake certainty, padded lists, repetitive cadence and chatbot phrases. Replace
  filler with a decision, constraint or example, not a synonym. Read the words
  as spoken sentences and preserve Faris's stated opinions.

Patterns are editorial clues, not proof of AI authorship. Technical terms,
genuine three-part arguments, deliberate repetition and necessary uncertainty
are not defects. Never fabricate experience, statistics or quotes to humanize
copy. Preserve caveats even when they make a claim less bold.

When editing, update Markdown and add a short before/after changes table to
review.md, only for actual changes. When reviewing, quote the precise passage,
explain the issue and suggest a replacement. Consolidate overlapping findings.
Mark checks not run instead of calling the deck ready.

After edits, run `pnpm slides review <talk>` and inspect all screenshots.
Browser success does not establish that the argument or writing is good.
