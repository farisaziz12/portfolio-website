# No Rewrite, No Safety Net: review

Outline approval: pending in the menu. The formal line is written only by `pnpm slides` > "Approve the outline".
Chat approval: Faris approved in chat on 2026-11-17: "approved, go with dark mode and write the slides".
Approved outline.md SHA-256: e191bf5f440a0d287664f76826787e660beccb56ff42b7b351488a5f54b5440b (recorded before drafting, after adding the dark-mode decision).
Draft: slides.md written 2026-11-17 by agent from the approved outline. Dark mode deck-wide. `[gap]` placeholders remain where only Faris or the Smallpdf codebase can supply the material.
Claims/code review: not run. Open items in sources.md.
Editorial/anti-slop pass: not run.
Browser review: passed 2026-11-17 (typecheck, build, 21 slides / 38 states, only the known FloatingVue warning).
Run: artifacts/reviews/no-rewrite-no-safety-net/2026-11-17T13-32-18.217Z-5stsMj (local; artifacts/ is gitignored).
The container's Playwright expected chromium_headless_shell-1234; review ran against the preinstalled 1243 build via a local symlink. No repo change.
Agent inspected every final-click screenshot. Fixed in the pass: slide 2 diff overflowed (paths shortened); slide 12 arc crossed the body text
and showed an empty annotation mark (arc removed, mark hidden deck-locally); slides 4, 10, 13, 20 rendered body text in the muted colour
(now foreground); slide 15 lists had no markers.
Known compromises: slide 9 and 19 step cards are tight at 20px detail text; acceptable at 1280 but check on the real screen share.
Human visual review: not run.
Rehearsal/export review: not run.

Next gate: Faris fills the `[gap]` items (sources.md), ideally from the Smallpdf codebase, which this session could not reach.
Then the claims and editorial passes, `pnpm slides dev no-rewrite-no-safety-net` for human review, and the menu approval line.

## Codebase material (2026-11-17)

Slides 2, 5, 8, 9 and 14 and the notes on 6 now use Faris's read-only scan of his area of smallpdf-web (see sources.md).
These fill beats already in the approved outline; no slides added or removed. Browser review passed after the change:
artifacts/reviews/no-rewrite-no-safety-net/ (latest run), 21 slides / 38 states. Fixed: slide 14 code box ran past the right margin;
slide 9 broke a hyphenated library name across lines.
Still open: slide 2 notes claim needs one check (does a caller branch on a named error?); slide 8 story; slide 12 agent example;
slide 18 traffic figure; cover and closing details.

## Revision 2 (2026-11-19)

Faris's feedback in chat, 2026-11-19, summarised: cut "Where does this land?"; Senior Software Engineer @ Netlify on the cover and the intro slide
from his other talks; open on the latest React (Activity, useEffectEvent, Compiler) versus being stuck on React 16; real constraints (50,000 users
in 30 minutes, account migrations, mobile web views, Safari storage, no tests, Datadog, TrackJS, Redshift + Metabase); three checkouts; migrating
hot paths and incremental AI; about 30 seconds per slide; then A/B segmentation via localStorage and account-flag parity; then the Redshift MCP
server, CLAUDE.md PR rule, deprecation events, complexity and event cost.
This is the author directing a restructure, recorded as approval of revision 2's direction. The formal menu line is still Faris's.
slides.md rewritten: 49 slides (48 in the outline plus the thank-you count), 76 states. Bio slide and speaker-montage.jpg copied from caching-dark-arts.
Browser review passed: artifacts/reviews/no-rewrite-no-safety-net/2026-11-19T14-24-53.913Z-zCNqmt. Agent inspected all final screenshots.
Open: Datadog wording; React version; whether the checkouts were consolidated; agent example for "task, not the repo"; public clearance of vendor
names; social handle, slides link, Q&A channel; timing in rehearsal (49 slides is at the top of a 20-minute slot).
