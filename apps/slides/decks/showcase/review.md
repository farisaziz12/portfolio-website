# P1 showcase review

Reviewed: 2026-09-25. Status: ready for Faris's visual approval.

## Scope and evidence

This is a six-slide design fixture, not a completed talk. Browser PNGs are in
`artifacts/p1/screenshots/`; the PDF is `artifacts/p1/faris-slides-p1.pdf`.
All paths are relative to the repository root. Actual commands and remaining
system checks are recorded in `PLAN.md`.

Each PNG is 1920 × 1080. Statement screenshots show the revealed sentence;
code screenshots show all lines after two highlight steps. All six images
were inspected individually. The PDF has 12 pages covering all click states;
all 12 rendered pages in `artifacts/p1/pdf-review/` were inspected.

## Findings

- Cover: title wraps consistently between modes; original badge remains intact.
  The badge intentionally sits outside the text safe area, close to the lower
  edge but wholly inside the canvas. Its placement awaits human approval.
- Statement: clear title/body hierarchy and the same wrapping in both modes.
  Reveal works; the annotation remains visible before and after the click.
- Code: native Slidev CSS initially forced cramped line spacing. Theme-scoped
  Slidev code variables now set 24 px type and 32 px line height. Final captures
  and PDF show no overlap. Both highlight steps and the all-lines state render.
- Local fonts and badge load with non-local browser requests blocked. No
  unexpected console errors, uncaught page errors, broken images, or measured
  content bounds outside the slide were reported by the final capture run.
- Decorative arcs intentionally bleed off-canvas; they are not content overflow.
- Poppler's Type 3 glyph warnings did not produce visible damage in the reviewed
  pages. A caught upstream FloatingVue error remains documented, not fixed.

## Editorial and asset limitations

Titles and sentences are short demonstration copy, not quoted research. The
cache snippet is illustrative: its dependencies are undeclared interfaces and
it has not been executed. Do not present it as production-tested code or claim
that its API proves an edge deployment architecture.

The only character asset used is the original badge copied byte-for-byte. The
approved avatar sheet remains reference-only. No new sprites, avatar variants,
or cropped concept-sheet assets were made. Annotations currently use the local
sans font with rotation/underline, not a separate handwriting font.

## Next decision

Approve or revise the cover, statement, and code pairs. Do not treat this review
as approval for more layouts or media tools. After approval, P2 introduces the
repeatable agent authoring passes and second-deck reuse proof.
