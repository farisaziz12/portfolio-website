# Acceptance and review

These are proposed tests for implementation. Nothing in this handoff claims they have run.

## P1: first visual review

Produce a cover, statement, and code slide in both modes. Capture six separate 1920 by 1080 browser images with fonts and images fully loaded and animation fixed at a known state. Inspect each full-size image, not only a contact sheet.

Check hierarchy, font weight, line wrapping, margins, light/dark contrast, illustration placement, code legibility, and unwanted empty or crowded regions. The code slide must work without decorative art. Show the exact approved reference beside the rendered result where appropriate.

Verify a basic export with a deliberate final click state. Record actual outcomes and limitations. Stop for visual approval before building the rest of the layouts.

## v0.1 completion

### Authoring

A new standard slide can be added by editing Markdown/frontmatter without touching the theme or manually positioning text. A second minimal deck consumes the same theme. One accent configuration change updates all relevant components without recoloring brand artwork. A local Vue escape hatch works for a genuinely exceptional slide.

### Layout and readability

Every layout has light/dark examples and a long-content fixture. No clipped headings, overlapping labels, accidental scrollbars, tiny code, or illegible annotations. Essential diagram labels and arrows remain understandable in a desaturated view. Missing images display an honest, deliberate development placeholder rather than broken output.

Target at least 4.5:1 contrast for normal text and 3:1 for large text as a project acceptance threshold, with additional visual review for projection. Avoid relying on low-contrast borders or hue alone for meaning.

### Behavior

Keyboard navigation, presenter view, notes, click reveals, backward navigation, deep links, overview thumbnails, and per-slide mode changes work. Background state must not leak between slides. Native Slidev behaviors remain available; the theme does not replace them.

Prefer tests for token/config resolution, override precedence, invalid metadata, and illustration lookup. Browser smoke tests should assert no console errors, missing local assets, or content overflow in the canonical fixtures.

### Offline presentation

After the initial dependency installation/build, local presentation requires no external CDN, remote font, analytics, or image service. Keep local-server requests available while blocking external requests in the offline smoke test. Test notes and the normal presentation route in this setup.

### Motion and export

Reduced motion produces a stable readable state without hiding explanatory content. Screenshots have deterministic state. PDF and PNG include the intended code, diagrams, and click-reveal state. Record whether exports use final state or expanded click steps; do not silently omit content.

Navigation-dependent global layers need an explicit export strategy. Recheck Slidev's documented `--per-slide` behavior before using them. Static exports do not carry live Three.js interactions.

### Assets and release

No whole-slide screenshot backgrounds masquerading as implementations. No font binaries copied from this handoff. No personal reference photos in distributable assets. Illustration references and cleaned production artwork are clearly distinguished. Original logo source remains intact. Missing high-resolution/alpha artwork is documented and cannot be passed off as finished.

Type checking, tests, build, screenshots, and exports must have real commands with recorded results. No publishing or deployment is part of passing these checks.

## Evidence required with each implementation milestone

Report what changed, the commands actually run, representative screenshots, remaining gaps, and the next approval decision. Do not state that something passed because a test file exists or a command was suggested.
