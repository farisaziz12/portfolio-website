# Migration review

Status: migration implemented; Faris's visual/content approval pending. Not
conference ready until factual review and a presentation-machine rehearsal.

## Authorization

On 2026-09-30 the user requested the full slides migration with placeholders
for the video demos. This explicitly replaces the earlier proposed pilot gate.
The supplied 84-slide order is the approved outline. Approved outline SHA-256:
`1507dab746988562610227c059eeadf63a1481a5f00947639c1909c36c7638b7`.

## Scope

Preserve original notes and claims; migrate appearance and editable content.
Keep factual corrections separate. No automatic claim that a legal, pricing,
provider or internal metric is current. Video placeholders on 57 and 77 only.

## Use and edit

Run from the repository root:

```sh
pnpm slides dev orchestrating-payments
pnpm test
pnpm slides review orchestrating-payments
pnpm slides export orchestrating-payments --clicks final
```

Edit `slides.md` for content, notes, mode and layout; `style.css` for this talk's
composition. `layouts/` and `components/` are deck-local escape hatches, not a
second theme. `migration/source.json` is a read-only source inventory. Original
PPTX/PDF remain untouched in Downloads. Do not rerun extraction over this deck.

## Content and editorial pass

- 84/84 slides remain in order; the supplied deck serves as the approved outline.
- All 26 original notes match the inventory exactly, including the unexpected
  FX note on the cover. No invented notes or silently corrected factual claims.
- Tables 35/40 preserve rows, values and rankings. Diagram 37/38 and code 41–47
  are editable content. Code syntax and displayed country predicates are tested;
  full payment behavior is not. Slide 44 is an illustrative transition with old
  and new calls together, not safe runnable checkout code.
- Sentence case, restrained emphasis, no added generic motivational copy.
  Decorative source emoji omitted; obvious spelling/casing cleaned up.
- 19 local source image files have recorded hashes. Two TIFFs converted to PNG
  without resizing/cropping. No new artwork. Approved shirt logos unchanged.
- Both video positions (57/77) are explicitly labeled static poster placeholders.
  No video files, remote embeds, autoplay or playback controls were introduced.
- Source claims needing verification are listed in `sources.md`, not hidden in
  audience slides or presented as researched/current facts.

## Checks actually run

- `pnpm test`: 25/25 passed, including six migration tests.
- `node --test scripts/slides-review.browser.mjs`: 1/1 passed. Its negative probes
  detect overflow, broken assets, missing fonts, undersized code and code/header
  collisions; healthy and hidden content do not fail.
- Named-deck review runs execute vue-tsc and a native production build before
  browser review. Both stages passed. Runtime: Node 26.4.0, pnpm 11.15.1,
  Slidev 53.0.0, Chromium 151.0.7922.34.
- All 84 slide compositions inspected at full-size browser resolution across
  successive captures; corrected code 41–47 and closing 84 reinspected.
  Final empty-annotation cleanup checked in light/dark states and PDF overview.
- Native PDF export with `--clicks final`: 84 pages, 960 × 540 pt, 17,975,807 bytes.
  `pdfinfo` and `pdftoppm -scale-to 1280 -png` completed. All 84 rendered pages
  reviewed in seven contact sheets; pages 35, 41–47, 55, 57, 77 and 84 additionally
  inspected individually at 1280 × 720. No visible missing glyphs or clipping.
- A bounded presenter smoke check rendered the current cover, next-slide preview
  and its original note. A request to `/presenter/3` followed current synchronized
  state to slide 1; arbitrary presenter deep-link behavior was not established.
  Evidence: `presenter-notes.png` alongside the final export. This is not a full
  synchronization, keyboard, overview or two-display rehearsal.

## Evidence and findings

All paths below are relative to `artifacts/reviews/orchestrating-payments/`.

| Run | Result |
| --- | --- |
| `2026-09-30T14-55-55.965Z-WRK7qG` | Sandbox blocked loopback server (EPERM); rerun with approved local browser permissions. |
| `2026-09-30T14-56-33.270Z-eBDyoY` | Machine pass, visually rejected: code 43/44/47 overlapped heading/footer. |
| `2026-09-30T15-00-44.071Z-IFN21q` | Code spacing corrected with native Slidev variables; browser pass, 84 states and 83 next/back checks. |
| `2026-09-30T15-05-20.152Z-RsUQxd` | Empty annotation decoration removed. 84 captures, zero per-state visual failures; run failed on ERR_NETWORK_IO_SUSPENDED and a dynamic import fetch at slide 64. Do not treat this run as a pass. |
| `2026-09-30T15-05-28.026Z-vvRVFl` | Final PDF, rendered pages/contact sheets and presenter-note screenshot. |
| `2026-09-30T17-53-32.095Z-NiofjI` | Passed: typecheck, production build, 84 captures, 83 forward/back checks, zero per-state failures, unexpected runtime errors, blocked requests or HTTP failures. |

The overlap fix includes a new automated collision check, not a relaxed
tolerance or baseline replacement. Empty annotations no longer produce stray
yellow marks; the real annotation on 79 remains. Initial/rejected evidence is
preserved. The PDF's decorative cover arc retains the existing slight
browser/print difference; content and badge are intact.

## Remaining limits and stop condition

- Await Faris's visual/content approval; technical checks do not constitute it.
- Verify the dated legal, pricing, method and internal-metric claims listed in
  sources.md before presenting. Confirm the original QR destination.
- No actual playback to test. Original MP4s remain in the PPTX for a later
  approved media slice. Original morph transitions became simple fades.
- External origins are blocked during browser capture and local fonts/images
  are checked. A cold-start offline production rehearsal, full presenter/audience
  synchronization, overview, other browsers, projector and timed delivery remain
  unverified. PDF is an untagged static fallback without video or notes.
- Existing FloatingVue patch warning is recorded separately by the review tool.
  Poppler reports existing Type 3 glyph bounding-box warnings; rendered output
  was inspected. pnpm warns about the existing global-store setting mismatch;
  no dependencies were installed in this migration.
- No publishing, deployment, commits, new artwork or broader media framework.
  Stop here for review rather than expanding the talk/system unprompted.
