# Project brief

## Goal

Create the system Faris uses to author repeatable, recognisable technical conference talks and workshops. It should reduce manual formatting and setup without making talk authoring feel like application development.

The core workflow is: write an outline in Markdown, select a layout, add code or a diagram where useful, select a conference skin, rehearse, present in a browser, and produce a dependable static fallback.

Keynote is an occasional downstream tool, not the source of truth. The goal is not a generic presentation SaaS, a drag-and-drop editor, or a new slide runtime.

## Fixed product decisions

- Slidev is the base. Prefer Vue 3 components, TypeScript, and native extension points.
- Content stays primarily in Markdown. Exceptional slides can use local Vue components.
- The design must support light and dark slides from one system.
- Conference colors are bounded accent overrides, not a replacement brand.
- Approved avatar and duck references must stay recognisable.
- Technical text and code must remain selectable browser content.
- Offline presentation, predictable click steps, and static exports matter from the first usable release.
- Start in plan mode. This document is a brief, not permission to implement all phases.

## Defaults to validate, not sacred decisions

Use pnpm for a new repository unless existing tooling dictates otherwise. Prefer the current stable, mutually compatible Slidev/Vue/Node toolchain; document exact versions selected during implementation and commit a lockfile then. Do not assume a version or API from old examples in the conversation.

Start with Inter for display/body and one appropriate monospace face for code. Local font delivery is the preferred presentation setup, subject to checking distribution rights. No font binaries are included in this handoff.

Prefer ordinary CSS/custom properties and Slidev's styling facilities over a second design framework. Use existing code highlighting and click-reveal behavior before introducing wrappers. Only add a configuration validation dependency if its benefit justifies it.

## Recommended architecture

Begin with one local theme package and example decks. Keep tokens, branded components, illustration registry, backgrounds, and motion rules inside that package. Use a workspace only if it makes the theme and deck boundary simpler.

A possible eventual layout is:

```text
packages/
  slidev-theme-faris/
    layouts/
    components/
    styles/
    setup/
    assets/
    lib/
decks/
  showcase/
  minimal-reuse-check/
docs/
references/
```

This is a proposal for Codex to confirm against actual theme discovery and asset resolution. Do not create empty future packages. Keep global appearance in the theme; consider an addon later for behavior genuinely useful independently of the theme. No public npm publishing in v0.1.

Prefer a single small configuration resolver rather than several overlapping theme APIs. Resolve semantic colors, mode, background preset, footer visibility, and optional illustration consistently.

## Proposed authoring contract

A normal slide should require a layout, its content, and at most a few meaningful options. Standard syntax must work without custom pre-parsers.

Use native Slidev headmatter/frontmatter for native features. Place Faris-specific options in an explicit namespace. The following is a proposed API, not a built-in Slidev feature:

```yaml
# Proposed deck defaults, inside native themeConfig:
themeConfig:
  faris:
    mode: light
    conference:
      name: Example conference
      accent: '#7C3AED'
    background: arc

# Proposed per-slide metadata:
layout: statement
faris:
  mode: dark
  background: none
  illustration: duck-thinking
```

Define merge precedence: base identity, deck/conference defaults, then allowed per-slide overrides. Conference settings must not recolor the avatar, duck, or official logos. A slide may switch mode without altering neighboring thumbnails or export pages.

Specify the schema, defaults, validation messages, and examples in the plan. Any custom option must have an actual consuming implementation in its milestone. Do not add pretend metadata that silently does nothing.

Allow an escape hatch through a local slide/component, not a large position-by-pixel configuration language. Avoid requiring raw utility-class choreography for standard slides.

## v0.1 scope

### Foundation and components

Implement semantic design tokens, a slide frame with content-safe margins, light/dark modes, one default palette, and one synthetic conference accent preset to demonstrate overrides. Add branded underline, arrow, annotation, and arc primitives. Provide a small illustration registry only for assets that actually exist and meet the quality bar.

Start with static backgrounds plus restrained CSS/SVG motion where it earns its place. Support explicit no-motion and no-background modes. Keep decoration away from code and diagrams.

### Layouts

Target ten layouts after the first visual checkpoint:

| Layout | Main contract |
| --- | --- |
| cover | Title, subtitle, speaker, optional event and illustration |
| statement | One main thought, optional short reveal |
| section | Section number and title; short context optional |
| split | Two content regions with intentional text/visual hierarchy |
| code | Heading, native code area, optional short annotations |
| diagram | Heading and large diagram region |
| comparison | Two parallel positions or approaches |
| image | Large image with optional caption and attribution |
| takeaways | Three short conclusions, no dense checklist |
| closing | Speaker/contact fields and optional real QR destination |

Metrics and quotations can initially be compositions of these layouts. Do not add layout names merely to match every imaginable talk.

### Showcase

Use a 12 to 15 slide technical example, provisionally titled **Modern Frontend Architectures: Patterns That Survive Production**. Demonstrate light and dark slides, code, a three-step request flow, one comparison, a major statement, and restrained use of the avatar and duck.

The reference montage is visual direction only. Its code, technical claims, labels, links, and chart values are not validated content. Rewrite examples with accurate semantics, cite relevant primary documentation in source notes where needed, and label illustrative data as illustrative. Do not imply that the code shown in the mockup is production-ready.

The deck doubles as a layout gallery and visual regression fixture. Include a tiny second consumer deck to prove reuse without copying the theme.

### Presentation and output

Use Slidev's existing presenter, click, navigation, and build/export workflows. Prove PDF and PNG output, plus a local web build. Native editable Keynote output is not a requirement. PPTX is optional and must be described according to the tested export mode; do not promise preservation of live web interactions or exact editable layout fidelity.

Document one command per routine task after implementation: development, showcase, type checking, tests, visual checks, build, PDF, and PNG export. A dedicated CLI is unnecessary at this stage.

## Assets are a separate delivery concern

The approved contact sheets are RGB raster images, not transparent illustration packs. Their small individual portraits are not suitable as arbitrary-size assets without preparation.

During planning, inventory which assets can be reused intact and which need extraction, cleanup, vector construction, or separately approved artwork. For the first visual checkpoint, the original badge may be used intact. Clearly framed temporary assets are acceptable for a prototype but do not count as finished standalone illustrations.

Keep illustrations optional so missing artwork cannot block typography/layout work. Do not regenerate Faris or the duck as a shortcut. Use deterministic geometry or the supplied source for the official logo, not a generative interpretation. A raster wrapped in an SVG remains raster.

## Milestones and approval gates

### P0: Plan only, now

Inspect the repository and reference assets; validate documentation; identify genuine blockers; propose architecture, file responsibilities, authoring examples, scope, tests, and asset preparation. Return the plan in the conversation. Do not save a plan file unless separately authorised outside plan-only constraints.

### P1: Visual foundation, after approval

Scaffold the smallest workable local theme and showcase. Implement tokens, frame, and three slides: cover, statement, and code. Produce six full-size screenshots: each slide in light and dark. Verify one simple export. Stop for visual review before adding more layouts.

### P2: Reusable authoring system

Expand to the ten layouts, the complete showcase, one diagram primitive, validated metadata, conference accents, small approved asset registry, and a second minimal consumer deck. Test that a standard slide can be added without changing the framework.

### P3: Presentation reliability

Complete offline asset checks, presenter and click-step checks, reduced-motion behavior, static output, screenshot regression fixtures, and authoring documentation. Close the v0.1 acceptance criteria.

### Later: Spatial/interactive visuals

After the baseline deck works, investigate an optional Three.js or TresJS integration. Start with one signature scene, not a scene engine.

The design should allow a scene adapter later, but v0.1 should not install 3D libraries or build speculative controllers. A future live scene should have deterministic state derived from slide identity and click progress, correct backward navigation, a static fallback, cleanup, bounded device pixel ratio, and explicit reduced-motion/export behavior.

A persistent canvas should be scoped to an actual presentation instance. Presenter windows, slide overviews, and export pages require separate lifecycle decisions. Do not assume one global canvas automatically handles every view. Recheck global-layer export behavior, including the documented per-slide export requirement when navigation-dependent global state is used.

Later still: a scaffold CLI, asset tooling, advanced code/diagram narratives, or a CMS integration. Add them only when repeated use demonstrates the need.

## Non-goals

No drag-and-drop editor, backend, auth, cloud account, content database, custom router, new Markdown compiler, runtime image generation, public package publishing, complete asset-redesign project, or six-package SDK in v0.1. Do not implement a dedicated testing dashboard or plugin system.

## Planning output requested

Return a recommended architecture with actual file/module responsibilities; a narrowly scoped first implementation slice; a proposed metadata API with three example slides; a native-versus-custom capability map; an honest asset inventory; dependencies and compatibility checks; milestone acceptance criteria; visual/test strategy; risks and defaults; and at most a few questions that materially block implementation.

Stop after the plan. Approval of the plan and approval of visual output are separate checkpoints.
