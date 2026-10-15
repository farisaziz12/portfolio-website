# Visual references and authority

These four files are unmodified copies from the design conversation. No personal photos, rejected alternate portraits, font files, or newly generated assets are included.

## 1. avatar-approved.png

This is the sheet Faris approved after returning to the previous friendly face style and moving the small shirt logo off-center. It is the primary reference for facial construction, glasses, nose, skin tone, proportions, drawing style, duck identity, and chest-logo placement.

Do not use the discarded longer/thinner face. Do not replace the nose with a dot or merge it into the moustache. Preserve the duck's rounded blue illustration and black glasses.

The sheet includes expressions and poses for visual reference, not a complete production asset inventory. At 1536 by 1024 pixels, the individual portraits are small. It is RGB, with no alpha channel. Do not claim these portraits are ready-made transparent SVGs.

## 2. deck-direction.png

The latest technical presentation mockup: editorial typography, cream backgrounds, selective blue/yellow emphasis, short hand annotations, real space for code and diagrams, and restrained character illustrations.

Use as visual direction, not source code, factual evidence, a font specification, or a set of pre-cropped 16:9 slides. Its drawn text, code, logos, links, and tiny labels may contain generated inaccuracies. Body text and code must be rebuilt as actual content.

The design brief also requires a dark mode even though this reference focuses on light slides.

## 3. original-badge.png

The user-supplied original logo. This remains usable intact as a badge and an illustration-style reference. It is not the source for the revised standalone avatar's chest-logo placement or official shirt geometry. Do not crop and silently substitute the original face for the newer approved sheet.

## 4. zurichjs-official.png

The official square logo provided by Faris. Preserve its geometric regions and JS letterforms. The white top triangle points down, the blue left triangle points right, and the lower-right yellow triangle contains JS. There is no white diagonal stripe between the shapes.

For a new shirt illustration only, use the small off-center chest placement and blend the yellow into the garment. The unmodified standalone logo remains in this folder as the authoritative master.

## Asset handling

Explicit written requirements override incidental rendering errors in reference images. Inspect each source visually before using it. Do not copy generated contact-sheet labels, color hex strings, or code as authoritative data.

Plan a separate, honest asset-preparation step. Cropping may help prototypes, but clean alpha edges, usable resolution, and faithful branding require review before production use. Do not simply wrap raster artwork in SVG and call it vector.

`manifest.json` records source filenames, sizes, modes, and checksums. Original copies should remain unchanged.
