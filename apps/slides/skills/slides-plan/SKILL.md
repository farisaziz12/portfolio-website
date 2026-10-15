---
name: slides-plan
description: Plan a talk in the Faris Slides repository from a brief and source material. Produce a timed outline and evidence gaps before drafting slides; use for new-talk planning, not theme implementation.
---

# Plan a Faris talk

Read AGENTS.md, DESIGN.md, docs/AGENT_WORKFLOW.md and the deck's brief, outline,
sources and review files. Planning-only mode means no file edits unless the
user separately authorizes saving the plan.

For authorized new-deck creation, use `pnpm slides new <talk>` at the root.
It creates planning files and one placeholder, not a finished talk. Do not
overwrite an existing deck. Ask only about omissions that change the argument;
state sensible defaults for duration, audience and scope otherwise.

Produce slide beats with one point each, evidence, speaking time, existing
layout and necessary clicks/media. Separate facts, opinions and illustrative
examples. Record gaps without inventing data. Default to existing cover,
statement, code and section layouts. Artwork and media pipelines are separate.

Stop after the outline for approval. Do not style a full deck or approve your
own work. When the user approves, record their message, date and a SHA-256 of
the approved outline content in review.md. Substantive argument changes reopen
this gate. Tool implementation approval is not approval of a new talk's argument.

Handoff: brief, timed outline, evidence gaps, approval status and next action.
