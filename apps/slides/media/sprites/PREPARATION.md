# Static sprite preparation

The four likenesses and deterministic cleanup/compositing were approved on
2026-09-26. No new artwork was generated during finalization. Raw source PNGs
and generation prompts remain in `review-v1`; the avatars there are unbranded
intermediates. Use the finished files in
`packages/slidev-theme-faris/assets/illustrations`, or use the theme's
`FarisIllustration` module from Markdown.

## Exact transformations

1. Verify each source SHA-256 against `review-v1/manifest.json`.
2. Clear RGBA where alpha is below 16/255. This removes 11,187 speaking,
   6,087 thinking, 6,551 curious, and 7,908 celebrating nonzero-alpha pixels.
   All other artwork pixels remain unchanged.
3. Reflect the thinking source horizontally, matching its approved preview.
   Do not reflect the logo.
4. Render the reviewed official-logo mask with Playwright: retain original
   white/blue regions and black JS, remove the yellow field. Composite onto
   the shirt with straight-alpha source-over. Placement rounds the original
   preview percentages to whole source pixels: speaking (769,767), size 69;
   thinking (744,831), size 65. There is no yellow patch, invented letterform,
   border, or added diagonal stripe.
5. Write full-sized RGBA PNGs and a manifest. No crop, resize, generative redraw,
   or runtime compositing. The script never modifies the original PNGs.

The removed speaking flecks had alpha 1-8/255 below the torso edge. The threshold
also removes sub-6.3% antialias pixels around silhouettes; stronger edge pixels
are preserved. Inspect full-size assets and slide-size light/dark renders.

## Reproduce

Normal deck use needs only the workspace dependencies. Preparation and the
optional pixel audit need `pngjs` from an existing asset-tooling environment,
resolved via `NODE_PATH`. No new project dependency was installed.

On the reviewed machine these exact commands were used:

```sh
NODE_PATH=/Users/farisaziz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/prepare-sprites.mjs
NODE_PATH=/Users/farisaziz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/verify-sprites.mjs
node --test scripts/config.test.mjs scripts/illustrations.test.mjs
CI=true pnpm typecheck
CI=true pnpm build:variants
CI=true pnpm capture:sprites
CI=true pnpm export:variants
```

On another machine point `NODE_PATH` at its asset-tooling installation, not the
machine-specific path above. Playwright Chromium must already be installed.
Preparation blocks browser network requests and records its Chromium version.
Rerendering on a different browser version may change logo antialiasing; review
new output hashes instead of automatically accepting them.

`verify-sprites.mjs` compares every non-logo pixel with the cleaned/reflected
source and checks residual low-alpha pixels. Its report is
`artifacts/sprites-final/pixel-audit.json`. Routine registry tests need no pngjs.
The eight-slide review and PDF live in `artifacts/sprites-final`. Earlier P1 and
variant screenshots are retained separately, not overwritten as new baselines.

## Limits

Four static raster poses only. No vector sources, rigging, animation frames,
atlas packing, timing, recoloring, or arbitrary enlargement. Do not mirror the
finished avatars. Face/pose changes require a separate identity review.
