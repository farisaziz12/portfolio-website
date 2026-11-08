# Design specification

## Reference hierarchy

Follow explicit written decisions first. For facial proportions, drawing style, and chest-logo placement, use `references/avatar-approved.png`. Use `references/zurichjs-official.png` for logo geometry and `references/deck-direction.png` for slide composition and tone. The original badge remains a full-logo asset and historical style reference, not permission to revert the newer shirt treatment.

Exclude rejected iterations: realistic portraits, longer/thinner-face experiments, missing noses, central oversized shirt logos, extra white diagonal stripes, and generic neon/cinematic decks. The canonical avatar is the approved friendly, rounded flat illustration, not a new portrait exercise.

## Identity

Clean editorial layout, confident typography, generous whitespace, and occasional illustrated personality. Use the playful web-native qualities Faris liked without copying another project's logo or assets.

Content carries the slide. A yellow underline, blue arc, hand annotation, or duck can add emphasis. They do not all need to appear together. The layout should look intentional even with every illustration removed.

The full badge belongs on a cover, speaker slide, or closing slide, not every footer. Body slides can use a tiny Faris wordmark and slide number, with an option to hide both.

## Avatar and duck

Keep the approved face construction: short dark hair, rectangular glasses, visible nose bridge and rounded tip, separated moustache and nose, goatee, warm tan skin, and friendly proportions. Do not make the face longer or thinner again. Facial expression can change; facial identity should not drift.

The blue duck keeps its established black glasses, orange beak, simple rounded shape, and flat illustration language. Do not apply a new drawing style to it or treat it as a representation of Faris.

The shirt is yellow. The logo belongs on the wearer's upper-left chest, viewer's right in a front-facing pose, at approximately 10 to 14 percent of visible torso width as a starting target. Follow the approved sheet over an exact numeric rule where perspective differs. It is a small chest mark, not the focal point of the shirt.

## ZurichJS geometry

Use the supplied official square as the source of truth. For a unit square, its major color regions are:

- White top triangle: (0,0), (1,0), (0.5,0.5), pointing downward.
- Blue left triangle: (0,0), (0.5,0.5), (0,1), pointing right.
- Yellow lower-right triangle: (1,0), (1,1), (0,1), with black JS in the lower right.

The regions meet directly: no white diagonal separator. Preserve the official letterforms rather than substituting approximate typed JS. For a garment rendering, match the yellow region to the shirt rather than leaving a rectangular patch. Preserve the white triangle; blending yellow into the shirt is not a reason to remove white.

For standalone conference-logo use, keep the original supplied image unmodified. Shirt artwork may require a carefully derived asset with the garment treatment. Any new derivative requires a visible fidelity check.

## Initial token proposals

These are implementation starting values, not colors measured precisely from the generated mockups. Derive appropriate contrast-safe semantic variants and review them in actual slides.

| Primitive | Proposed value | Role |
| --- | --- | --- |
| ink | #0F0F10 | Dark surface, light-mode text |
| cream | #F8F4EB | Light surface, dark-mode text |
| blue | #2E88B8 | Identity accent, diagrams |
| yellow | #F4C63A | Underlines and emphasis surfaces |
| orange | #FF9F00 | Occasional illustration/secondary accent |

Use semantic tokens for background, foreground, muted text, border, surface, accent, and on-accent text. Do not assume a bright brand swatch is suitable as small text on cream. Avoid low-contrast yellow text on a light background. Diagram meaning must not depend on color alone.

A conference may override one or two accent roles and metadata. It must not change illustration colors, logo colors, body typography, grid, or the overall identity. A violet conference accent is a configuration demo, not the default theme.

## Canvas and typography proposals

Target 16:9 slides. A useful starting logical canvas is 1280 by 720; verify Slidev canvas configuration and scale all dimensions consistently. Screenshot/export resolution is a separate concern.

Suggested starting sizes in logical slide pixels: display 84, title 56, body 30, code 24, small annotation 20, metadata 16. Use 64-pixel safe margins, an 8-pixel spacing rhythm, and deliberate line heights. These values must be tested at presentation distance, not only on a laptop.

Use Inter for display/body initially, one monospace face for code, and at most one licensed handwritten accent face after selecting it. Handwriting is for a few short words, never a paragraph. Do not collect unnecessary font families. Acquire fonts from legitimate sources during implementation; none are bundled here.

Do not solve text overflow by shrinking essential text below the readable scale. Split content, shorten it, or use another layout. Aim for one main idea, a short heading, and either a small amount of body text, a diagram, or a code example.

## Layout grammar

Use clear left alignment and consistent title anchors. Reserve a separate annotation/decorative region so art cannot collide with text. Diagrams should have consistent line weights, arrows, label treatment, and spacing. Code slides should be legible without the avatar, a fake browser toolbar, and three annotations competing for attention.

Treat the reference contact sheet as nine different compositions, not as a requirement to reproduce the board's panel frames or aspect ratios. Every implemented slide must independently work at 16:9.

Use real DOM headings, captions, labels, and code. Use editable SVG primitives for suitable diagrams rather than flattening entire slides into images.

## Light and dark

Keep the same hierarchy and geometry in both modes. Light uses cream and ink; dark uses ink and warm white. Adjust semantic border, surface, syntax, and accent values rather than mechanically inverting the page.

Illustrations require clean alpha edges or an intentional graphic container on dark slides. A cream rectangle around a cropped avatar is not a finished dark-mode treatment. Transparent assets are a delivery requirement, not something already supplied by the contact sheets.

Scope CSS variables and mode to each slide root. A dark slide in an overview must not force every other slide dark. Mode changes must not remount the talk or reset click progress.

## Motion and dynamic backgrounds

Motion should support explanation. Initial proposed timing: fast 180 ms, normal 320 ms, emphasis 520 ms. Prefer a small fade or modest movement, sequential diagram reveals, and no motion where the content does not benefit.

Start with blue arcs/circles, a yellow line, and optional subtle CSS/SVG movement. Do not put drifting particles behind code. Keep animation deterministic for screenshots, reversible or state-correct for backward navigation, and disabled under reduced-motion/export settings as appropriate.

Three-dimensional scenes are a later enhancement. Reserve them for conceptual moments, not as a background on every slide.

## Illustration distribution

A reasonable starting review rule is illustrations on the opening/closing and occasional transitions or callbacks, not every slide. The exact frequency is editorial, not a required quota. Use the duck as a narrative companion, not decorative filler.
