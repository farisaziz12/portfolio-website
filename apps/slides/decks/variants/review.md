# Layout and sprite review

Date: 2026-09-26. Status: likenesses approved; finalized sprite checkpoint.

## Review choices

1. Editorial cover: dominant two-line title with a small duck in the corner.
2. Speaker cover: balanced title and speaking avatar.
3. Section: large topic title and thinking avatar.

Each composition has a light/dark pair. Slides 7 and 8 show all four sprites
for comparison on both surfaces. Text and layout remain DOM/Vue content.

## Evidence

- Eight new 1920 × 1080 Playwright captures in `artifacts/sprites-final/screenshots`.
- Automated checks/report in `artifacts/sprites-final/report.json`.
- Four full-sized prepared RGBA PNGs individually inspected; pixel comparison
  in `artifacts/sprites-final/pixel-audit.json` proves the art unchanged outside
  approved cleanup, reflection and logo compositing.
- All eight screenshots individually inspected for wrapping, content bounds,
  local asset loading, silhouette edges, and mode consistency.
- Typecheck and production build passed. Eight resolver/asset tests passed.
- Eight-page PDF at `artifacts/sprites-final/faris-slides-variants.pdf` exported;
  every page rendered with Poppler and inspected. Both shirts retain their
  marks and no alpha rectangles or stray flecks appear on either surface.
- Separate P1 regression capture passed; all six PNG checksums match the
  original review artifacts exactly.
- Non-local browser traffic blocked. Known FloatingVue compatibility errors
  recorded. No unexpected runtime errors or missing local assets reported.

## Asset judgment and remaining limits

- The user approved all four likenesses. Face, pose, glasses, nose,
  moustache/goatee, yellow shirt, and blue/orange duck palette are preserved.
- All four files have actual alpha channels. This is not a cream-background
  crop. They are PNG raster assets, not SVG/vector originals.
- Deterministic cleanup clears source alpha below 16/255, including the faint
  detached speaking flecks. No higher-alpha drawing pixels change outside the
  two logo regions. Original source PNGs remain intact for provenance.
- The speaking mark uses the official source geometry/letters, at the viewer's
  right chest. Its final width is 5% of the source canvas. The yellow field is
  transparent to avoid a contrasting garment patch.
- Both final avatar PNGs contain the mark. The thinking pose is reflected to
  put the hand on the viewer-left and leave the upper-left chest clear; the
  mark is not mirrored. There is no runtime overlay or SVG mask dependency.
- `FarisIllustration` hides paths, dimensions and accessible defaults. The
  deck-local preview and logo modules have been replaced. Preparation retains
  their reviewed logo-mask recipe in `scripts/prepare-sprites.mjs`.
- No animation, atlas packing, sprite timing, presenter rehearsal or full
  offline production session was tested in this slice. Raster assets should
  not be enlarged beyond their useful source resolution.
- Existing FloatingVue compatibility warnings and Poppler Type 3 glyph
  bounding-box warnings remain. No visible export defects found. PDF tagging
  and accessibility in other readers are not verified.

## Reproduce and continue

`pnpm dev:variants` opens this deck on port 4185. `pnpm capture:sprites`
regenerates the final screenshots/report. `pnpm build:variants` builds locally;
`pnpm export:variants` creates the eight-page PDF. Asset-only reproduction
instructions are in `media/sprites/PREPARATION.md`.

Review the finished sheets and export before proceeding to agent-first
authoring. Likenesses are already approved. Cover variants remain opt-in;
the default badge cover is unchanged. The P1 showcase and original artifacts
remain the baseline, and the original candidate gallery captures are preserved.

Architecture follows Slidev's documented theme/layout extension points:
[themes](https://sli.dev/guide/write-theme) and
[layouts](https://sli.dev/guide/layout), checked on 2026-09-25.
