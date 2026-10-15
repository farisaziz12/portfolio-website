# Sprite generation record

Date: 2026-09-25. Tool: built-in image generation (no CLI/API fallback).
Status: candidates, not approved production assets. Original references unchanged.

Reference for every initial request: `references/avatar-approved.png`.
The shirt logo is deliberately not generated. The review component uses the official
source image in an SVG mask; it is a raster-source composition, not vector artwork.
Both avatar previews include the official mark as a separate layer. The thinking
image is reflected to free the upper-left chest; its logo remains unmirrored.
Raw unbranded PNGs are drawing intermediates, not final standalone branded sprites.

## faris-speaking

Saved asset: `media/sprites/review-v1/faris-speaking.png`

### Initial prompt

Use case: identity-preserve. Asset type: standalone transparent PNG character sprite for the existing Faris slide theme. Input image is the approved character sheet, the sole identity and drawing-style reference, NOT a new branding exploration. Reconstruct the specific indicated pose at clean usable resolution, preserving the rounded friendly face proportions, short dark wavy hair, black rectangular glasses, clearly visible nose bridge and rounded tip, separated moustache and goatee, warm tan skin, thick dark outlines and flat colors. Never elongate/slim the face. Waist-up bust with entire hair and arms inside canvas, 8% transparent margin, clean horizontal lower torso termination. True alpha transparent background, no cream rectangle, no checkerboard baked in, no border, no sticker outline, no shadow, no labels or captions. Shirt is flat yellow #F4C63A. IMPORTANT: leave the chest unbranded and plain yellow, with no logo or letters at all; the exact official logo will be composited deterministically in the slide component, not invented by generation. Output one character only, not a sheet. Pose: the friendly smiling 'Presenting' pose in Common poses, holding a dark microphone in the viewer-left hand, viewer-right hand open in an explanatory gesture. Torso faces mostly forward with unobstructed viewer-right upper chest for the official small logo. Preserve facial identity from the Default Balanced portrait.

### Cleanup prompt

Use case: background-extraction. Edit target is this already approved-for-cleanup transparent sprite candidate. Change only alpha edge quality: remove every disconnected yellow/orange speck below the straight bottom edge and any colored stray pixels outside the silhouette. Preserve the entire character's exact face, body, proportions, colors, pose, outlines, expression and unbranded shirt. Do not redraw or restyle the character. Clean antialiased alpha edges and true transparent background, no matte, no shadow, no checkerboard. Leave a generous transparent margin on all sides. This is a cleanup-only pass.

## faris-thinking

Saved asset: `media/sprites/review-v1/faris-thinking.png`

### Initial prompt

Use case: identity-preserve. Asset type: standalone transparent PNG character sprite for the existing Faris slide theme. Input image is the approved character sheet, the sole identity and drawing-style reference, NOT a new branding exploration. Reconstruct the specific indicated pose at clean usable resolution, preserving the rounded friendly face proportions, short dark wavy hair, black rectangular glasses, clearly visible nose bridge and rounded tip, separated moustache and goatee, warm tan skin, thick dark outlines and flat colors. Never elongate/slim the face. Waist-up bust with entire hair and arms inside canvas, 8% transparent margin, clean horizontal lower torso termination. True alpha transparent background, no cream rectangle, no checkerboard baked in, no border, no sticker outline, no shadow, no labels or captions. Shirt is flat yellow #F4C63A. IMPORTANT: leave the chest unbranded and plain yellow, with no logo or letters at all; the exact official logo will be composited deterministically in the slide component, not invented by generation. Output one character only, not a sheet. Pose: the 'Thinking' expression from Expressions, hand on chin, thoughtful closed-mouth expression, gaze slightly up toward viewer-left. Keep the same rounded face and facial hair as Default Balanced. Leave viewer-right upper chest unobstructed. No question mark.

### Cleanup prompt

Use case: background-extraction. Edit target is this already approved-for-cleanup transparent sprite candidate. Change only alpha edge quality: remove every disconnected yellow/orange speck below the straight bottom edge and any colored stray pixels outside the silhouette. Preserve the entire character's exact face, body, proportions, colors, pose, outlines, expression and unbranded shirt. Do not redraw or restyle the character. Clean antialiased alpha edges and true transparent background, no matte, no shadow, no checkerboard. Leave a generous transparent margin on all sides. This is a cleanup-only pass.

## duck-curious

Saved asset: `media/sprites/review-v1/duck-curious.png`

### Initial prompt

Use case: identity-preserve. Prepare one standalone transparent PNG of the approved blue duck from the input character sheet. Preserve exact established rounded blue rubber-duck-like silhouette, black rectangular glasses, two eyes visible in three-quarter view, orange wide rounded smiling beak, tiny rounded wing, flat illustration style, dark outlines. Pose: relaxed curious companion, head slightly tilted, facing viewer-left like the duck beside Faris in the top-left panel. Entire body and small base visible. No neck elongation, no human anatomy, no clothing, no props, no additional character, no text or question marks. Clean true alpha transparent background with 12% empty margin all around. No sticker edge, no shadow, no backdrop, no floor, no texture, no scattered pixels. Only the one blue duck; faithful asset preparation, not a character redesign.

## duck-celebrating

Saved asset: `media/sprites/review-v1/duck-celebrating.png`

### Initial prompt

Use case: identity-preserve. Prepare one standalone transparent PNG of the approved blue duck from the input sheet. Preserve exact established rounded blue rubber-duck-like silhouette, black rectangular glasses, two eyes visible in three-quarter view, orange wide rounded smiling beak, flat illustration style, dark outlines. Pose: happy cheering companion, one small wing raised in a friendly high-five as in the sheet's High five pair, facing viewer-left. Entire rounded body visible. No human arms, no neck elongation, no clothing, no props, no additional character, no text or floating decorative rays. Clean true alpha transparent background with 12% empty margin all around. No sticker edge, no shadow, no backdrop, no floor, no texture, no scattered pixels. Only the one blue duck; faithful asset preparation, not a character redesign.

