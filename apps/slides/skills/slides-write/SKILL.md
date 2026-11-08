---
name: slides-write
description: Draft or revise Faris Slides Markdown talks from approved outlines using existing layouts, native clicks and presenter notes. Use for deck writing after outline approval, not artwork generation.
---

# Write a Faris talk

Read AGENTS.md, DESIGN.md, docs/AGENT_WORKFLOW.md and the deck's brief, outline,
sources and review. Verify approval against the current outline and its recorded
hash. If missing or substantively changed, return the outline for approval
instead of silently drafting the full talk.

Use ordinary Slidev Markdown, existing named slots, native code fences/clicks
and HTML-comment presenter notes. Do not copy the theme or add a custom parser
or positioning language. Put detail and transitions in notes; split dense
slides before shrinking text. Flag essential content present only in notes.

Use `FarisIllustration` by name when it serves the point. Do not mirror finished
avatars or use unbranded intermediates. Unsupported media remains an explicit
gap; do not install a future media pipeline as a drafting shortcut.

Never invent a personal anecdote, quotation, benchmark or source. Label code
with omitted interfaces as illustrative and track evidence in sources.md.
Preview with `pnpm slides dev <talk>`. Draft completion is not factual or visual
approval. Record the next claims/code, editorial, browser, visual and rehearsal
passes in review.md. Preserve unrelated slides during scoped revisions.
