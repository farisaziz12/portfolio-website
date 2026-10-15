# Faris Slides: agent instructions

## Working mode

Respect the current task's mode. During a planning-only request, inspect files and current primary documentation but do not modify files, install dependencies, generate assets, scaffold code, commit, or deploy. Return a concrete plan and wait for explicit approval. These restrictions do not permanently prohibit implementation after approval.

Before any work, inspect existing repository instructions, files, and package configuration. Preserve unrelated work and existing conventions. The initial handoff contains documentation and visual references, not an implemented framework.

## Product

Build a thin personal presentation system on Slidev. Talks should be mostly Markdown with a few layout choices and optional components. Reuse Slidev's navigation, presenter workflow, code rendering, and export facilities rather than rebuilding them. Validate extension points against the selected version.

Read `docs/PROJECT_BRIEF.md`, `docs/DESIGN_SPEC.md`, `docs/ACCEPTANCE.md`, and `references/README.md` before proposing architecture or visual changes.

## Brand invariants

Use the approved avatar sheet as the character reference. Preserve its face proportions, glasses, clearly visible nose, moustache, goatee, skin tone, and friendly flat drawing style. Do not elongate or slim the face again. Keep the blue duck's established appearance.

The yellow shirt has a small ZurichJS logo on the wearer's upper-left chest, the viewer's right in a front-facing pose. Use the official square logo as the geometric source: white downward-pointing top triangle, blue right-pointing left triangle, yellow lower-right half, black JS. No added white diagonal stripe, border, central placement, or contrasting yellow patch. Yellow should blend into the garment.

Every displayed avatar T-shirt must retain that mark, including sprite previews.
If a pose obscures the chest, adjust the pose/composition instead of omitting
the logo. Keep the mark unmirrored when reflecting a character pose. Raw blank
shirt image-generation intermediates are not final deliverable sprites.

Use `FarisIllustration` and the prepared PNGs in the theme's
`assets/illustrations` for approved static poses. Do not reference the raw
`media/sprites/review-v1` avatars from a deck or apply a CSS reflection to a
finished avatar: its baked logo would be mirrored. Preparation and pixel-audit
instructions live in `media/sprites/PREPARATION.md`.

Use the original badge intact when a full badge is needed. Its older shirt detail does not override the official logo or newer placement rules for standalone illustrations.

Preserve the clean editorial design: warm cream or near-black surfaces, bold typography, restrained blue/yellow accents, occasional handwritten notes, and ample empty space. Do not redesign this into generic purple gradients, glass cards, a dashboard, or an illustration on every slide.

## Implementation discipline, once approved

Prefer a single reusable theme package with internal modules and example decks. Do not pre-create separate core, motion, diagram, asset, and scene packages. Add dependencies only when the approved milestone needs them. Use TypeScript and verify supported Slidev conventions.

Generated reference images are raster concept sheets, not production SVGs, valid code, or canonical presentation text. Do not embed them as whole-slide screenshots. Do not fabricate clean standalone assets by claiming a crop or raster-in-SVG wrapper is a vector asset. Report asset gaps explicitly.

Build real DOM text and code; use SVG for suitable authored diagrams and decorative primitives. Keep theme, slide mode, and conference overrides scoped to the slide so previews and exports do not leak state.

After visual changes, capture and inspect browser screenshots. Passing type checks alone does not establish design quality. Do not update screenshot baselines to conceal regressions. Report commands actually run and any checks that remain unverified.

Never publish packages, create a remote repository, push, or deploy without approval. Never include personal reference photos in published assets.

## Continuity and handoff

`DESIGN.md` is the implementation-facing design contract. `PLAN.md` is the live
milestone tracker and handoff record. Keep both accurate when implementation
decisions, status, commands, validation results, or known limitations change.

Before continuing implementation, read this file, `DESIGN.md`, `PLAN.md`, and
the source documents named above. Resume from the next incomplete item in
`PLAN.md`; do not repeat completed work or begin a later milestone early.

The current stop condition is authoritative. At a visual checkpoint, hand the
rendered artifacts to the user and wait for approval before expanding scope.

## Agent-first authoring

The repository's authoring skills are in `skills/`, not installed in the
protected `.agents` directory. Read the matching SKILL.md directly when doing
the pass: `slides-plan` for briefs/outlines, `slides-write` for approved drafts,
`slides-edit` for factual/editorial/anti-slop review, and `slides-review` for
browser/export evidence. These paths are relative to `skills/`. This routing
does not claim automatic skill discovery in the app.

This workspace lives in the faziz-dev.com monorepo at `apps/slides`. Use
`pnpm slides new|dev|review|export|publish <talk>` from the repo root. `new` creates only
planning files and a placeholder. `publish` runs the checked static build and
writes it to `apps/web/public/slides/<slug>/`; it never commits or deploys.
Raw recordings in `media/source-video/` and everything in `artifacts/` are
gitignored: the repo is public, and they are too large for git. Outline approval is a human/agent gate, not
a CLI attestation. Automated report success never grants visual approval.

Keep the human-facing workflow smaller than the implementation. A normal talk
starts from Markdown, a short brief, and a named deck. Do not make the author
understand theme internals, Playwright selectors, export flags, or media build
steps.

Use one agent task by default. Treat planning, writing, factual review,
anti-slop editing, visual review, and rehearsal as explicit passes with saved
evidence. Specialist agents are useful only when a pass is independent and has
a clear output. Do not create an agent swarm for routine deck edits.

For new talks, stop after the plan and outline for approval before styling the
full deck. Keep factual claims and sources separate from visual direction.
Editorial review must remove generic AI phrasing, padded lists, fake quotations,
vague attribution, repetitive cadence, and inflated claims without sanding off
Faris's point of view.

Faris's writing preferences: no em dashes and no standalone word "boundary"
in presentation prose, labels, accessibility descriptions, speaker notes or
agent explanations. Name the actual thing, such as the server or BFF, and
describe data entering or leaving it. Preserve exact library/API identifiers
when needed for correct code; do not rename historical evidence paths.
Keep wording simple and spoken. Audience captions should explain the subject,
not give instructions such as “keep the same time axis” or “now add networks.”

Playwright is the browser review mechanism. It should drive the real Slidev
route, exercise click states and navigation, block unapproved external traffic,
and save screenshots plus machine-readable failures. Browser evidence is part
of the handoff, not a baseline to update automatically.

Prefer Slidev's native `SlidevVideo`, iframe layouts, and ordinary Vue
components. Interactive websites and videos need a poster or recorded fallback
for offline use and export. Remotion is a future media authoring tool that
renders local video and poster assets; it must not become a second slide
runtime. Sprite work must start from approved art, include a preview sheet, and
pass an identity and edge-quality review before use.
