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

## Editorial and voice pass (2026-11-19)

Requested by Faris: anti-slop pass plus matching the voice and framework of his previous decks.
Reference decks read: caching-dark-arts, reverse-engineering-seniority, orchestrating-payments, zurichjs-conf-retrospective.
Pattern found: Title Case headings with one or two **bold** emphasis words; small kicker labels (conf retrospective); at most a short
Title Case subtitle; bare number slides (e.g. "359", "14 KB", "0"); notes short, factual, first person, with [click] markers.

| Slide | Before | After | Why |
|---|---|---|---|
| All headings | Sentence case | Title Case with bold emphasis | Matches previous decks |
| 3 to 5 | Explanatory sentence under each feature | Version only ("React 19.2", "Stable Since October 2025") | Detail moved to notes |
| 7 | "redux-saga, all over the place." | "**redux-saga** Everywhere" | Shorter, his heading style |
| 9 to 11 | "13 years / of React in production." etc. | "13 Years", "~50,000", "5" as bare numbers | Matches number-slide pattern |
| 16 | "Tests outlive their enrolment." | "Closing A Test **Doesn’t End It**" | Plainer |
| 18 | "Derive the variant from the account." + sentence | "Derive It **From The Account**" | Detail in notes |
| 20 | "Datadog runs out after two weeks." | "Datadog: **2 Weeks** Of Data" + new slide "Bug Started 3 Weeks Ago? **It’s Gone.**" | Faris clarified: retention capped at two weeks for cost |
| 28 | "One checkout, three doors" | "Three Checkouts, **One Job**" | Faris: three checkouts lived in the codebase |
| 32 kicker | "Evidence, not instinct" | "Before Deleting" | Removed "X, not Y" formula |
| 33, 34 | Two slides (deprecation; events aren't free) plus complexity | Deprecation slide; complexity and event cost merged | One idea each, fewer slides |
| 38 | "Agents investigate. Humans decide what ships." | "Agents Investigate. **Humans Ship.**" | Shorter |
| 43 to 45 notes | Framed as the approach | Open with "We never merged the three checkouts" | Faris confirmed they were never merged |
| Notes, throughout | Longer explanations, some slogans ("It needs discipline", "This is how you keep shipping in the one you have") | Short factual sentences | Anti-slop |

Kept deliberately: "Give The Agent A Task, Not The Repo" (a contrast, but it is the talk's core line); three habits (a genuine three-part close).
React version: Faris believed 16.8 because of hooks; hooks shipped in 16.8.0 and remain in 16.14, so the scan's 16.14 is consistent. Pending his scan.
Browser review passed: artifacts/reviews/no-rewrite-no-safety-net/2026-11-19T14-33-37.754Z-l686Wa, 49 slides / 76 states.

## Revision 2.1 (2026-11-19)

US sales tax story added to section 03 from Faris's chat message (5 slides). Cuts and merges for the 30-seconds-a-slide budget listed in outline.md.
45 slides / 73 states. Browser review passed: artifacts/reviews/no-rewrite-no-safety-net/2026-11-19T14-40-51.809Z-tAp2OO. Agent inspected the new slides.
Open: the 11% figure conflicts with orchestrating-payments notes (first and last name vs country selector and postal code); how the drop was recovered.

## Revision 2.2 (2026-11-19)

Applied Faris's second codebase scan (sources.md). Corrected the three checkouts, A/B mechanics, web-view handoff, payment SDK count and
the CLAUDE.md rule; added Every Ramp Is A Deploy, Safari Users Never Enter A Test, 857, ~75% and 4.7 Years; dropped the Safari requirement
slide; "Mark It Deprecated" and "Fewer Branches" became number slides. 47 slides.

## Revision 2.3 (2026-11-19)

Faris: public clearance given for the figures and vendor names; the 11% drop was recovered through other initiatives (not part of the
story); AI helped when the tax work moved across two teams (context dumps, flagging touched paths, reconciling patterns, migrating to
TanStack Query); no Q&A channel; closing slide as in previous decks with a generated slides link; no timing constraint.
Added "Plan The Recovery Before The Rollout" and "Two Teams, One Context". Closing slide follows caching-dark-arts: connect QR
(copied connect-qr.png, decodes to https://faziz-dev.com/connect), @farisaziz12, and a new slides-qr.png generated with python qrcode
(medium error correction, four-module quiet zone) that decodes to https://faziz-dev.com/slides/no-rewrite-no-safety-net/ (OpenCV check).
That URL only resolves after `pnpm slides publish no-rewrite-no-safety-net --slug no-rewrite-no-safety-net` and a deploy. Not published.
Removed all bracketed confirm/gap notes. 49 slides / 81 states.
Browser review passed: artifacts/reviews/no-rewrite-no-safety-net/2026-11-19T14-58-04.957Z-SIhw2l. Fixed in this pass: "Find Every Door"
code block overflowed the slide (present in commit c3e059d and the PDF sent before it).

## Revision 3 (2026-11-19)

Faris's feedback: the deck read as AI slop; too much A/B too early; headings too clipped; needs a story arc that builds the problem, the
issues and the blast radius first; sentences and phrases like his previous talks; longer subtitles; no small labels; the YAML incident
(one wrong indent in an unvalidated YAML file took down the Japanese and South Korean sites for 45 minutes); conflicting patterns
(redux-saga and TanStack Query, two stores during migration) instead of the generations table; React 16 framed as custom pre-hydration
tooling with Express-based server HTML making React 18 non-trivial; "three parts building the same experience"; agents placing analytics
along the path and comparing via the Redshift MCP; no "Example Prompt" caption; no slides QR (faziz-dev.com/slides does not exist).
Rewritten as a story: newest React, the codebase you actually have, the safety net, the YAML story, then layers, checkouts, A/B tests,
deleting, AI, the tax story, and deleting again. 64 slides / 97 states. Browser review passed:
artifacts/reviews/no-rewrite-no-safety-net/2026-11-19T15-08-34.704Z-dUjRI9; arc removed from slide 3 after inspection.
