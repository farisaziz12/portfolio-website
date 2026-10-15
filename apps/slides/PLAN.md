# Faris Slides implementation plan and handoff

Last updated: 2026-10-09

This is the live execution record. The approved architecture and design rules
are in `DESIGN.md`. Any agent continuing the work should read `AGENTS.md`,
`DESIGN.md`, this file, and the source documents listed in `AGENTS.md` before
changing code.

## Current checkpoint

**Moved into the portfolio monorepo (2026-10-15):** copied from the standalone
`faris-slides` folder to `apps/slides` (theme stays at `packages/`, now a
workspace via `apps/slides/packages/*`). New `pnpm slides publish <talk>
[--slug <name>]` runs the checked build at `/slides/<slug>/` and writes it to
`apps/web/public/slides/<slug>/` (drops `_redirects`). `artifacts/` and
`media/source-video/` are gitignored; the two raw-video hash tests skip those
checks when the files are absent. `markdown-it` pinned to 14.3.2 (a 15.x peer
broke `@comark/markdown-it`). Other transitive deps resolved newer; all 109
caching screenshots are byte-identical to the standalone build. 67 tests pass;
`vue-tsc` now passes (the 12 `$slidev`/`$frontmatter` errors below don't reproduce here).

**Website hosting (2026-10-10):** `pnpm slides build <talk> [--base /path/]`
builds a static folder (default base `/talks/<talk>/`, hash routing so no host
rewrites, `--without-notes`), then serves it at that base and loads every slide
in Playwright. Caching media 379 MB → 20 MB via
`scripts/prepare-caching-web-media.mjs` (1080p H.264 CRF 23, photos to JPEG);
4K/PNG originals archived in `media/source-video` and `media/source-images`,
hashes in `migration/web-media.json`. Deck `vite.config.mjs` registers
SlidevVideo poster/printPoster for base rewriting (posters 404ed before). 67
tests pass. `pnpm typecheck` fails with 12 `$slidev`/`$frontmatter` errors in
untouched layout .vue files (caching, payments, variants); not investigated. Slide 93 fixed: code 20px (was 19px and overflowing), columns
1.25fr/1fr sized to the code, client `useQuery` call wrapped onto two lines,
same-key highlight moved to client line 3; server code unchanged so the 92→93
travel still matches. Clicks 0-2 measured clean and inspected on dev. Run
`2026-10-10T18-25-32.562Z-jQoX8R`: 109/109 pass, no 404s/external
requests/notes. Not deployed. No click-state or presenter pass on the build.


**Keynote notes (2026-10-09):** transferred presenter notes from the Keynote
PDF onto sourceSlide 1, 4, 5, 18, 23, 24, 29, 34, 38, 57, 58, 59, 70, 71, 72,
84, 91 and 95 (placeholders replaced or appended). Skipped: 26/27 (not in
deck), 30-33 (repeat of 29), 48 (Nuxt editor theme not used), 55/77/61/87
(already covered), 21/105 (no real text). Amazon note uses 2024 net sales
(about $6.4B); overhead note uses 200 ms to match the model. Slidev parser
confirms notes; 66 tests passed. No visual change, browser/export not rerun.


**Intro copy (2026-10-09):** removed A Pragmatic Case Study from cover metadata.
Targeted browser screenshot intro-copy/cover.png inspected. Preview 59866/1.
No full review/export rerun for this single-line removal.


**QR CTA (2026-10-09):** added yellow Connect With Me above the closing QR.
Screenshot connect-cta/closing.png inspected. Preview 59130/109. No full
review/export rerun for this scoped copy/style change.


**Closing montage (2026-10-09):** photo now covers the full-height right third.
Left content/footer constrained to avoid overlap. Targeted browser confirms
y=0 and height=1080 at 1920×1080; screenshot inspected in closing-full-height.
Preview remains http://127.0.0.1:54418/109. No full review/export rerun.


**Code travel and spotlight (2026-10-09):** 92→93 shares an active-scoped
prefetch-code native transition object (1100 ms). Route 93 starts server-lit,
then client-lit, then matching key lines only. Removed key chips, outcomes and
caption. 109 slides / 170 states, 27 clicked slides. 66 tests passed. Browser
verified native transition duration and exact two spotlighted lines; all three
screenshots inspected, no page errors. Evidence hydration-spotlight/report.json.
Preview http://127.0.0.1:54418/92. Full review/export not rerun.


**Router transition / recap titles (2026-10-09):** all four Current State
prefixes white, solution names yellow. Removed repeated partial-prerendering
slide; route 97 now flips Pages Router to App Router on one click (1100 ms),
followed by the retained streaming diagram on 98. 109 slides / 168 states.
66 tests passed. Six screenshots inspected in router-transition; no page errors
in capture report. Actual forward/reverse clicks verified. Reduced motion uses
the global 1-microsecond override (strict zero-duration assertion failed, not
visible motion). No full-deck/export rerun. Preview http://127.0.0.1:53621/96.


**Matching-key code comparison (2026-10-09):** new route 93 after prefetch
code shows getServerSideProps/useQuery side by side, matching key chips and
fresh-data versus absent-data outcomes. Notes explain provider/hydration wiring
and normal client fetching, not detection of missing server promises. Now
109 slides / 170 states; Demo 3 94/95, recap 96, streaming 97/98, closing 109.
66 tests passed before final whitespace compaction. Final browser screenshot
inspected after fixing grid specificity and caption overlap. Evidence:
hydration-pair/final.png. Preview http://127.0.0.1:52959/93.
No full browser/export rerun. Stop for feedback.


**CDN example separated (2026-10-09):** 51 retains only the 14 KB statement;
new extension slide 52 holds the larger CDN example and measurement reminder.
Source 61 stays removed. Counts return to 108 slides / 169 states. 66 tests
passed, including corrected expectation for the approved white “and” on 15.
Two targeted screenshots inspected with no page errors in cdn-window-split.
Preview http://127.0.0.1:50781/51. No full browser review/export rerun.


**Duplicate takeaway removed (2026-10-09):** removed source 61/current slide
52, formerly Send Less / Wait Less, most recently the critical-payload takeaway.
The 14 KB/CDN example remains. Now 107 slides / 168 states; subsequent routes
shift down one. No visual styles changed. Browser/export not rerun.


**Initial-window takeaway (2026-10-09):** slide 51 adds ~46 KB as a larger
CDN example, not a contemporary default. Slide 52 restores the requested
critical-payload / initial-window takeaway. Primary research and dated
observations recorded in sources and notes. Two targeted browser screenshots
inspected; no page errors. Evidence initial-window. Preview
http://127.0.0.1:49930/51. Full review/tests/export not rerun for these copy edits.


**Slide 15 emphasis (2026-10-09):** connecting “and” is white; surrounding
highlighted words remain yellow. Targeted browser color check and screenshot
inspected in question-and-white. Old preview retained stale Markdown; refreshed
preview http://127.0.0.1:65355/15 verified. No full-deck/export rerun.


**Prefetch recap and streaming (2026-10-09):** consolidated sources 110–112
after Demo 3 into route 95. New routes 96/97 each have three click steps for
App Router streaming and partial prerendering. Demo 3 intro/video now 93/94;
real-world section remains 98 onward. 108 slides / 169 states. Query recap
includes custom jitter; potential v6 default is a tentative private reminder.
66 tests and typecheck passed. Eleven targeted screenshots inspected, reverse
clicks and reduced-motion/print checked without page errors. Evidence:
artifacts/reviews/caching-dark-arts/streaming-model/. Preview:
http://127.0.0.1:63117/95. No full-deck/export rerun. Stop for visual feedback.


**Fresh-cache / 429 animation (2026-10-09):** route 85's existing fourth click
shows five-minute global staleTime, repeated fresh hits and fading 429/retry
path. Explicitly symptom reduction, not removal of API limits. Route 86's
one-minute override removed for consistency. 108 slides / 163 states unchanged.
66 tests and typecheck passed. Three targeted screenshots inspected; browser
verified final fade, reverse restoration and reduced motion without page errors.
Evidence query-fresh-hits under deck review artifacts. Preview:
http://127.0.0.1:61426/85?clicks=3. No full-deck/export rerun. Stop for feedback.

**Download/hosting motion (2026-10-09):** plain-language transfer qualifier,
760 ms native row transitions, slow-client → client → Lambda reveal and stable
clients on the EC2 comparison. New ProxyCapacity component, no dependencies.
108 slides / 163 states; routes unchanged. 66 tests passed and typecheck passed
after replacing a Slidev client-source import with the established active prop.
Fresh preview http://127.0.0.1:60390/83?clicks=0. Targeted evidence in deck review;
no full-deck/export rerun. Stop for feedback.

**Recap motion and batch edits (2026-10-09):** cards glide in on summaries
47/70/88 without extra clicks. BFF step 1 gets a visible 700 ms entrance.
Simplified slides 51/52, renamed 64 to A Slimmed Payload / Slimmed Response,
varied the illustrative monthly bars on 67, renamed Demo 2 to BFF With
Optimized Payload. Counts remain 108 slides / 161 states. 66 tests and
typecheck passed; updated two exact-copy tests for approved wording.
Targeted browser evidence is recorded in the deck review. Preview:
http://127.0.0.1:57951/47. No full-deck/export rerun. Stop for feedback.

**Question emphasis (2026-10-09):** slide 15 highlights “complex data fetching
and management” in yellow. Playwright confirmed text and rgb(244,198,58) on
fresh preview 56917; screenshot in challenges-highlight inspected. Old preview
56246 retained stale Markdown, so its initial locator check timed out.
No full-deck/export rerun. Preview http://127.0.0.1:56917/15.

**Closing QR (2026-10-09):** replaced the caching closing QR with a local
code for https://faziz-dev.com/connect, also linked to that address. Generated
using macOS Core Image without dependencies. Playwright screenshot on route
108 inspected; native Vision decoded that screenshot to the exact URL.
Evidence: artifacts/reviews/caching-dark-arts/connect-qr/closing.png.
No full review/export rerun. Preview http://127.0.0.1:56246/108.

**Website footer (2026-10-09):** shared frame now links faziz-dev.com instead
of displaying Faris Aziz. Preserves page numbers and footer-free layouts.
Browser checked link text/target on route 2; screenshot `footer-9w3KpG/footer.png`
inspected. No full-deck or export rerun. Preview http://127.0.0.1:54277/2.

**Demo autoplay (2026-10-09):** enabled native autoplay/muted on the three
recordings, keeping controls and posters. 66 tests passed. Targeted browser
`autoplay-KrrJOS` verified start/pause-on-leave/resume for routes 46/69/97 and
paused overview. Three playback screenshots inspected. Strict zero-error check
failed on one native play/pause interruption promise during rapid navigation;
behavior checks passed. No dependency patch or swallowed errors. Presenter and
export not rerun. Old production media script expects manual play and is now
historical. Preview http://127.0.0.1:54277/45. Stop for feedback.

**Subtle exit blur (2026-10-09):** outgoing primary heading snapshot fades
with 0–3 px blur over 280 ms. Incoming text, code, diagrams and videos stay
sharp. Targeted Playwright `heading-blur-fine88` verified blur keyframes,
sharp settled text and reduced-motion isolation with no page errors.
Motion/settled/print screenshots inspected. No full-deck review/export rerun.
Preview remains http://127.0.0.1:64034/7. Stop for feedback.

**Object-level motion (2026-10-09):** replaced character splitting in
MagicHeading with one whole-heading transition object. Code morphs unchanged.
Typecheck passed. Targeted Playwright `object-motion-Vj5hLX` verified exactly
one heading transition group, no character wrappers, reverse navigation and
reduced motion. Motion/settled/print screenshots inspected, no page errors.
No full-deck layout/export pass; natural wrapping can differ on other slides.
The old `review-caching-magic.mjs` remains a historical character/route fixture,
not a current acceptance check. Preview http://127.0.0.1:64034/7.
Stop for feedback.

**Prefetch title (2026-10-09):** source 109/current slide 92 renamed to
“Prefetch, But Don’t Wait Forever” as approved. Title-only change; no new
browser/export pass. Code and timing unchanged.

**Prefetch code spacing (2026-10-09):** formatted source 109, requested as
slide 94 in the older preview, now route 92. Added operation spacing and
32 px line height, extracted the long URL without changing behavior. 66 tests
passed. Final targeted Playwright `prefetch-code-CkTB23` passed screen/print
bounds with no page errors; both screenshots inspected. Initial overly long
fetch was caught and fixed. No full review/export. Preview:
http://127.0.0.1:54360/92. Stop for feedback.

**Query recap (2026-10-09):** consolidated sources 102/104/105 into route 88,
after the retained cache-hit animation. Reused six-card current-state layout.
108 slides / 161 states. 66 tests passed before the final label shortening;
targeted final Playwright `query-summary-ay0oix` passed screen/print bounds
with no page errors. Both final screenshots inspected. Earlier request label
was crowded and shortened without shrinking type. No full build/export rerun.
Preview http://127.0.0.1:53574/88. Stop for feedback; prefetch recap pending.

**Query code transition (2026-10-09):** route 86 now starts with route 66's
exact BFF after-snippet and morphs into useQuery on one 800 ms click. Added
readable spacing, kept fetch on one line and retained HTTP/signal behavior.
110 slides / 163 states. Updated test extraction for the new second code fence.
65 tests passed. Targeted Playwright `query-morph-F1wDf4` checked both states
and reverse navigation with no bounds/page errors; both screenshots inspected.
No full review/export rerun. Preview http://127.0.0.1:52466/86?clicks=0.
Stop for feedback. Proposed proxy visuals and Query diagram wording remain
unimplemented; those were suggestions, not part of this edit.

**Query intro cut (2026-10-09):** removed only prior slides 85/86, source
98/99 homepage/features screenshots. Retained Query architecture/code/demos.
110 slides / 162 states. Updated migration expectations and website sample
routes. 65 tests passed. Targeted Playwright `query-cut-Ti7vxP` checked forward
84 to 85 and reverse navigation with no page errors. Route 85 screenshot
inspected. No full review/export rerun. Preview http://127.0.0.1:51598/84.
Removed slide content remains in original migration sources; media files kept.
Stop for feedback.

**Proxy capacity support (2026-10-09):** sources 96/97, routes 83/84 now
compare named AWS capacity figures with the existing client-rate examples.
Official Lambda quota and EC2 baseline checked, calculations separated from
measured latency and billing. Source links and limitations saved in sources.md.
65 tests passed. Targeted Playwright `proxy-capacity-JBRcgF` passed screen/print
bounds with no page errors or blocked requests. All four screenshots inspected.
No full-deck review, export, or real network benchmark run. Preview:
http://127.0.0.1:50823/83. Stop for feedback.

**Slide 66 code spacing (2026-10-09):** increased line height from 26 to
34 px and separated the after-state operations with blank lines. Before-state
object compacted without changing behavior. 65 tests passed. Targeted browser
forward/reverse checks passed with no bounds or page errors; both screenshots
in `code-spacing-rki1xJ` inspected. Earlier capture caught header overlap and
was corrected. No new export/full build. Preview:
http://127.0.0.1:49741/66?clicks=1. Stop for feedback.

**Normal download timing (2026-10-09):** removed the 2.5× acceleration and
speed wording from payload slides and notes. All six states now use a 200 ms
wait plus the calculated transfer duration. 65 tests passed. Targeted
Playwright `normal-download-m69pbT` verified all six timings, early navigation,
and slide bounds with no page errors. Both screenshots (74 and 78) inspected.
No full build/export or presenter rehearsal rerun. Preview:
http://127.0.0.1:64438/74?clicks=0. Stop for feedback.

**BFF current-state recap (2026-10-09):** consolidated sources 77–79 and 83
into route 70 directly after Demo 2. Same six bordered card positions as the
client recap; improvements accented, unchanged responsibilities neutral.
Payload-shaping animation remains before the demo. Total 112 slides / 164
states. 65 tests and typecheck passed. Targeted `bff-summary-shCt4k` passed
title, screen/print bounds, no page/external errors. Both screenshots inspected.
No full build/export or presenter rehearsal rerun. Preview:
http://127.0.0.1:63738/70. Stop for feedback; Query/prefetch recap untouched.

**BFF after-title wording (2026-10-09):** after-state title changed exactly
to “After: One Request to Proxy”, with Proxy highlighted. No code or motion
change. This wording-only edit has not had a new browser/export pass.

**BFF before/after code motion (2026-10-09):** merged sources 75/76 into
route 66 with one native code-morph click, duration 800 ms. Fetch is now one
line; shared hook and changed mapping remain syntax-highlighted. Total 115
slides / 167 states, preserving the number of advances. Updated code extraction
tests and website sample routes. 64 tests and typecheck passed. Targeted
`code-move-u28HFD` exercised forward/reverse token motion, final bounds and
static reduced/print captures. All four screenshots inspected. No new full
build/PDF or presenter rehearsal. Preview http://127.0.0.1:62559/66?clicks=0.
Stop for feedback. Later summary consolidation remains pending.

**Slide 21 title clarified (2026-10-09):** click 2 now says “Greater Than
1 Sec”, highlighting 1 Sec; clicks 0/1 retain “1 Second”. This resolves the
earlier slide-number question. Targeted Playwright `title21-eojTAy` checked
both titles and bounds; both screenshots inspected. No full build/export
rerun. Preview http://127.0.0.1:60860/21?clicks=2.

**Summary title and separation (2026-10-09):** route 47 now says “Current
State: Client-Side Fetching” and separates six facts with subtle bordered
cards. Payload remains dominant. 64 tests passed; targeted Playwright
`summary-bordered-bdB6s9` checked title, six cards and screen/print bounds.
Both screenshots inspected with no clipping; no page/external errors.
No full-deck build/export rerun. Preview http://127.0.0.1:60252/47.
Later summaries still await approval of this checkpoint.

**14 KB question-first reveal (2026-10-09):** route 48 now contains only a
large centered 14 KB, no footer/caption. Route 49 retains the diagram and now
contains the explanation and caveats. 64 tests passed. Targeted Playwright
`14kb-EBax7j` verified exact text, centering, bounds and loaded assets; both
screenshots inspected. No full-deck build/export rerun. Preview:
http://127.0.0.1:59660/48. Summary checkpoint remains pending approval.

**Faster search start and hand cursor (2026-10-09):** route 22 now starts
searching after 400 ms instead of 2.2 seconds. The ten-second loading interval
is unchanged. Animated cursor uses a hand over Search and an arrow on departure;
native button hover uses pointer styling. 64 tests, typecheck and targeted
`search-9KYipL` browser checks passed. Six new screenshots inspected; reduced
and print captures byte-identical to previously inspected `search-2MK7QN`.
No full build/export rerun. Preview http://127.0.0.1:58286/22?clicks=0.
First summary still awaits approval before expanding to later recaps.

**First product-style recap (2026-10-09, awaiting visual approval):** user
approved a first-summary checkpoint. Combined source slides 51–56 after Demo 1
into route 47: payload, requests, caching, recovery, state and mapping. Existing
caveats retained in notes. No new clicks, assets or dependencies. Total now
116 slides / 167 states; routes after 47 move back five. Later demo summaries
are untouched. Website review route list updated; historical cut-comparison
script remains a dated fixture, not a current review command.
`pnpm test` passed 64 tests; `pnpm typecheck` passed. Targeted Playwright check
`summary-2vKm2U` passed six-fact content, screen/print bounds, next/previous
navigation and no page/HTTP/external failures. Both full-size screenshots
inspected. No new full-deck review, production build, PDF or presenter rehearsal.
Preview: http://127.0.0.1:58286/47. Stop for feedback before later recaps.

**Search, wait, reorient (2026-10-09):** user approved replacing only the
ten-second example on route 22. SearchWaitDemo renders the search, ten-second
loading phase and return to query/results with highlighted key words. The
existing native click count, instant and typing examples remain unchanged.
63 tests and typecheck passed. Targeted browser review `search-2MK7QN` passed
timing, immediate navigation, reverse, reduced-motion and print checks; all
seven screenshots inspected. No new full-deck build/export or presenter
rehearsal. Preview: http://127.0.0.1:56481/22?clicks=0. Stop for visual feedback.
The proposed “Longer Than 1 Sec” heading is still awaiting slide-number
clarification, so neither route 16 nor 21 was changed.

**Slide 15 wording restored (2026-10-09):** restored Faris's exact question,
including sentence case, with dark styling unchanged. Targeted Playwright
capture `slide15-Cxg5of/15.png` inspected; text matches and bounds checks pass.
No full-deck tests or export rerun for this wording-only change. Fresh preview:
http://127.0.0.1:55174/15. Previous server retained stale Markdown.

**Dark-first caching deck (2026-10-09, awaiting visual feedback):** native
Slidev color scheme, theme default and all slide overrides now use dark mode.
Scoped diagram colors, focus surfaces and performance highlights are dark-safe.
Content, media, animations, sprites, logos, full-height bands and other decks
are unchanged. `pnpm test` passed 63 tests. `pnpm slides review caching-dark-arts`
passed typecheck, production build, all 172 states across 121 slides and 171
navigation checks. Evidence: `2026-10-09T12-31-48.391Z-d7RQGB` in the deck review
artifacts. All full-deck screenshots covered: 136 changed images individually
inspected, 36 exact byte matches to the previously inspected run. Targeted
`website-plyjCt` passed all eight routes, including full-height bands and
24-pixel character separation. No runtime errors, HTTP failures or unexpected
external requests. Existing warnings remain. No new PDF export, projector or
paired presenter rehearsal. Preview: http://127.0.0.1:49833/1.
Stop for visual feedback. Earlier checkpoints below are historical.

**Full-height band correction (2026-10-09):** user rejected the sliced corner
accent. Restored full-height diagonal bands in a reserved right-hand strip,
moved characters inward, and adjusted cover/text columns. Targeted Playwright
run `website-DixuWO` passed all eight routes, with explicit full-height and
24-pixel character-separation assertions. All eight screenshots individually
inspected. Fonts/assets, print bounds, unchanged adjacent-slide styling and
negative font test passed; no unexpected runtime/HTTP/external requests.
`pnpm test` passed all 61 tests.
No content, artwork, click or other-deck change. Full-deck/build/export evidence
below predates this CSS correction; no new full run or export for this scoped
layout change. Preview remains http://127.0.0.1:60089/1. Stop for visual feedback.

**Website design and sprites (2026-10-09, awaiting visual approval):** user requested
design drawn from faziz-dev.com and more use of approved Faris/duck sprites.
First visual checkpoint changes routes 1, 3, 6, 42, 45, 77, 109 and 121 only:
opt-in local Figtree, yellow underlines, angled blue/yellow bands and four
existing PNG poses. ZurichJS marks stay intact. Diagrams, code, recordings,
slide order and 172 click states are unchanged. No new artwork/dependencies.
Follow-up: diagonal bands must never sit behind avatars or ducks. They now
occupy a separate short top-right corner area, with a browser gap assertion.
Website inspection and font/license provenance are in deck sources.md;
reusable classes are in DESIGN.md. All 61 tests passed. Full review
`2026-10-09T12-20-57.854Z-tFxEGB` passed typecheck/build, 172 states and 171
navigation checks. It spans the follow-up band-position edit, so its build
and six styled screenshots predate that correction. Final targeted review
`website-8dDoAb` passed all eight current slides, band separation, loaded fonts,
images, print bounds, no mirroring and missing-font detection. All eight final
screenshots inspected; full-run images covered by exact matches plus direct
inspection. No unexpected runtime/HTTP/external requests. Known warnings remain.
No new PDF, production rebuild after the band-only correction, projector or
paired presenter rehearsal. See review.md for exact evidence. Preview:
http://127.0.0.1:60089/1. Stop after this sample for user visual approval.

**Latest typing example (2026-10-09):** user requested typing that falls behind,
causes confusion, then backspace. Route 21 retains two clicks and now compares
typed text with on-screen output. First click stays responsive; second starts
smoothly, delays output three seconds, repeats letters, then corrects them.
No new slides, clicks, dependencies or artwork. All 61 tests passed. Full
review `2026-10-09T12-06-03.822Z-5GZOSi` passed typecheck, build, 172 states
and 171 navigation checks. 169 screenshots exactly match inspected previous
evidence; all three changed route-21 states were inspected directly. Targeted
`response-fXyXnH` passed normal/lag/correction timing, completion, early exit,
reverse, reduced motion, print and presenter notes; all 26 images visually
covered. No unexpected runtime/HTTP/external requests; known warnings remain.
No new PDF or physical rehearsal. Fresh preview:
http://127.0.0.1:55806/21?clicks=0. Stop for visual feedback under slides-review.

**Latest Ethernet timing edit (2026-10-09):** user requested motion readable
on a large, low-refresh-rate screen. Latency playback now adds a shared 1,200 ms
travel allowance: Ethernet 1,260 ms instead of 60 ms, broadband 2,200 ms, and
the slow example at most 4,000 ms. Connection order and numeric ranges remain
unchanged; the legend and notes no longer claim proportional 20× playback.
58 tests passed. Full review `2026-10-09T11-55-49.228Z-g1pG9L` passed
typecheck, build, 172 states and 171 navigation checks. All full captures
visually covered: 161 exact matches to prior inspected evidence, nine exact
matches to inspected targeted captures, two demo frames inspected directly.
Targeted `performance-Npy84I` passed nine states, four motion cases, reverse,
reduced-motion, print and presenter checks; all 19 images inspected. No
unexpected runtime/HTTP/external-request failures. Known FloatingVue/pnpm
warnings remain. No physical low-refresh display check or new PDF this pass.
Current preview including the later typing edit:
http://127.0.0.1:55806/61?clicks=0. Stop for user visual feedback.

**Latest duplicate-request cut (2026-10-09):** source 46 and its four native
clicks removed at the user's request. Source 45 now leads to the client diagram
on source 47 (route 43), retaining eleven clicks. Moved upstream constraint and
selective-retry bookkeeping into existing notes. Total: 121 slides / 172 states.
Original identifiers and media remain intact. All 57 tests passed. Full review
`2026-10-09T11-47-54.215Z-hyWS6b` passed typecheck, build, 172 states and 171
navigation checks. All 172 screenshots match inspected prior evidence outside
the small page-number area; the new junction was also inspected directly.
Targeted `architecture-cbARcR` passed 29 states, reverse/deep links, motion,
print and presenter checks. All 36 targeted images visually covered by pixel
comparison or direct inspection. Existing FloatingVue/pnpm warnings remain;
no unexpected runtime/HTTP/external-request failures. No PDF or physical
rehearsal this pass. Preview: http://127.0.0.1:64190/43?clicks=0.
Stop for visual feedback under slides-review.
All dated route/count references below are historical.

**Latest response-time interaction edit (2026-10-09):** user requested animated
0.1 / 1 / 10 second examples, including a smooth workflow interrupted by a
longer wait. Routes 20–22 now use a shared local ResponseTimeDemo; route 21
adds a second click for a three-second contrast. Totals: 122 slides / 177 states.
No dependencies, artwork or source recordings changed. All 57 tests passed.
Full review `2026-10-09T11-40-13.358Z-ob36qu` passed typecheck, build, 177
states and 176 navigation checks. All full-deck screenshots visually covered:
170 exact matches to previously inspected evidence and seven exact matches
to inspected targeted captures. Targeted `response-LrrcRv` passed real delays,
complete ten-second playback, early interruption, reverse/deep links, reduced
motion, print and presenter notes. All 20 targeted images covered. No unexpected
runtime/HTTP/external requests; known FloatingVue/pnpm warnings remain.
DESIGN.md and deck review.md record behavior, iterations and evidence. No PDF,
projector, paired presenter synchronization or offline production rehearsal
this pass. Preview: http://127.0.0.1:59113/20?clicks=0. Stop for visual feedback.

**Latest network wording edit (2026-10-09):** routes 62–64 now say Ethernet
for the device's wired connection, without implying a local server. Titles
and captions use plain wording; the mobile title is “What About 4G And 5G?”
Retained example times, measured mobile ranges, animations and native clicks.
Notes explain that Ethernet can carry broadband too and does not guarantee
1–5 ms internet requests. All 55 tests passed. Full review
`2026-10-09T11-22-10.501Z-wgbzfb` passed typecheck, build, 173 states and
172 navigation checks. Targeted `performance-ni0CsN` passed; all 15 images
inspected. Full screenshots are visually covered by exact matches to inspected
evidence plus direct inspection of demo 111. Known FloatingVue warnings remain.
No PDF or physical rehearsal this pass. Details are at the top of review.md.
Fresh preview: http://127.0.0.1:53652/64?clicks=0. Stop for visual feedback.

**Latest vocabulary edit (2026-10-09):** routes 90/91 now label the BFF as
“Our Server” and describe data entering/leaving it in notes and accessible text.
Faris's vocabulary and punctuation preferences are recorded in AGENTS.md.
No animation, layout, media or click-count changes. All 55 tests passed;
full review `2026-10-09T10-18-42.253Z-8veJER` passed all 173 states and
172 navigation checks. All screenshots visually covered: 168 exact matches
to inspected evidence and five changed captures individually inspected.
Targeted motion, print and presenter checks passed. Known FloatingVue warnings
remain; no new runtime/HTTP failures. Details are at the top of review.md.
Fresh preview: http://127.0.0.1:65525/90?clicks=0. Stop for visual feedback.

**Latest approved content refinement (2026-10-09):** the user approved items
1–4 from the conversational critique: upstream API scope, HTTP error handling
and quantity semantics, request-time prefetch, and qualified infrastructure /
initial-window claims. Applied in the existing 122 slides / 173 states, with
no new dependency or media. All editable caching text and notes are em-dash-free.
Faris confirms quantity means five upstream requests and the helper races fetch
against a timeout, then explicitly aborts. Original helper source remains absent;
the signal-callback example is a clarified contract, not verified original code.
Typecheck and 54 tests passed. Final full review
`2026-10-09T10-11-14.436Z-jjHnb4` passed build, all 173 states and 172 navigation
checks. All screenshots visually covered by direct inspection and exact hash
matches to inspected images. Targeted animation/print review `technical-dLDP7l`
passed with all 17 images covered. No new runtime/HTTP/external-request failures.
Known FloatingVue/pnpm warnings remain. No PDF, projector or synchronization
rehearsal this pass. See the top of the deck's review.md for exact commands,
failed iterations, visual coverage and remaining helper-validation limitations.
The separate benchmark-measurement critique remains deferred. The earlier
records below are historical and do not override this approval.
**Stop:** visual feedback after this scoped pass. Do not apply other critique
items automatically. Fresh preview: http://127.0.0.1:62293/104?clicks=0.

**Latest motion refinement (2026-10-09):** user requested smoother, less
aggressive character Magic Move. `MagicHeading.vue` now uses 760 ms gentle
ease-in/ease-out instead of 420 ms fast-start ease-out, with 320 ms snapshot
crossfades and root duration. Diagram animations, content and click counts are
unchanged. Typecheck, 49 tests and production build passed. Targeted browser
review `magic-MZQwRO` passed six forward/reverse pairs, actual timing/easing,
rapid interruption, presenter, overview, reduced motion, print and unsupported
browser fallback. All 14 PNGs inspected; settled layouts remain intact.
No full-deck rerun or PDF for this timing-only change. Fresh verified preview:
http://127.0.0.1:55873/7. Use this rather than the stale 64668 server.
Stop for visual feedback per `slides-review`; unrelated critique fixes remain
unapproved. Exact evidence/commands and the initial checker failure are in
`decks/caching-dark-arts/review.md`.

**Latest scoped update (2026-10-09):** ingress/egress animations implemented on
routes 90/91, retaining the 122-slide order. One native click each gives 173
total states. Shared BFF boundary, incoming blue data, outgoing ochre data,
stable anchors and no replay of ingress on the egress slide. `pnpm typecheck`,
`pnpm test` (49 tests) and the caching production build passed. Targeted
Playwright review `boundary-yHHA0i` passed all four changed states, finite
motion, reverse/deep links, continuity, reduced motion, print emulation and
presenter notes. All 11 PNGs individually inspected with no overlap/clipping.
No unexpected runtime/HTTP errors or external requests. Known FloatingVue and
pnpm configuration warnings remain. No new PDF or full 173-state review run.
The previous 171-state evidence below predates this two-slide revision.
Fresh preview: http://127.0.0.1:55873/90?clicks=0 (session 23055). The old
64668 preview served stale content and remains running; use the fresh URL.
**Stop:** user visual feedback, per `slides-review`. Other end-to-end critique
fixes remain proposals, not authorized by this ingress/egress request.

**Milestone:** Caching talk — full-deck migration and motion review  
**Status:** full migration completed, then source pages 25–27 (Technologies,
Next.js, TanStack Query intros) removed at the user's request. Current deck:
122 slides, preserving original source identifiers. Three
original MP4s remain unchanged and full-canvas, preceded by topic-labeled intros
at source 49/81/113 (current routes 46/78/110). Source 47 retains eleven native clicks, conditional refetch and
ALL/ONLY FAILED retry emphasis. Editable code, three additional server-flow
diagrams and ten source image assets complete the review draft. Important words
retain source-inspired emphasis; short native transitions and gentle entrances
add motion without extra clicks or waits. Reduced-motion and static PDF modes
are supported. Evidence and remaining factual limits are in the deck's review.md.
Payment talk, shared theme and approved artwork remain unchanged.  
**Latest feedback:** “do all” approves six explanatory motion additions:
latency, throughput, payload shaping, parallel retries, cache paths and prefetch
timing. Implemented in existing source positions 46, 65–67, 80, 85–87, 89–91,
103 and 107. No new routes or dependencies. Targeted and whole-deck validation
passed. Awaiting the user's visual feedback; do not expand scope.
Network/model qualifications and sources are recorded in the deck documents.
The user also approved Keynote-like character transitions between slides.
Native Slidev view transitions and deck-local heading decoration are implemented.
37 performance states, reverse/deep links, finite motion, print and presenter
checks passed in `performance-gRGBN3` (57 PNGs individually inspected).
Character transitions passed in `magic-FbPfm2` (14 PNGs individually inspected).
Final copy, screen/print layout and actual playback/pause of all three videos
passed in `final-ZnEmp5` (11 PNGs individually inspected). Typecheck, build and
48 tests passed. The first full run captured 171 states, all visually covered
by individual inspection or byte-identical matching to inspected captures; one
video-readiness failure exposed an async-mount race in the checker, now fixed.
Final full rerun: `2026-10-09T09-38-14.959Z-yTN76g` passed typecheck, build,
171 states and 170 navigation checks, with no state/runtime/HTTP/blocked-request
failures. 166 screenshots match the visually covered preceding run byte-for-byte;
all five changed screenshots were individually inspected. No new overlap or
clipping. User visual approval is still pending, not granted by machine success.
Evidence lives under `artifacts/reviews/caching-dark-arts/`; exact commands,
failed iterations and remaining limitations are in the deck's review.md.
Previous dev preview: http://127.0.0.1:64668/62?clicks=0 (superseded above).

**End-to-end critique (2026-10-09):** completed the user-requested content,
technical, editorial and visual review without changing slides. Detailed findings
and primary references are at the top of `decks/caching-dark-arts/review.md`.
The user reports 128 slides in about 23 minutes; preserve that rapid-paced style
and assess explanation density rather than impose a slide-count target. Priorities
proposed for approval: HTTP error handling in examples; explicit upstream API
constraint; request-time SSR/prefetch and timeout semantics; scoped infrastructure
and initial-window claims; comparable demo measurements; concrete closing rule.
Verified current Markdown matches the last 171-state browser report; reopened
14 critique-relevant captures and checked primary documentation. A minimal local
500-response experiment confirmed `res.json()` can return error JSON as resolved
data. No demo application source was available in the scoped deck to validate
custom fetching/prefetch helpers. Application tests, factual sign-off and timed
delivery are still pending. Next step is approval of refinements and obtaining
demo source/traces for validation, not automatic implementation.

**Previous feedback:** rebuild all four architecture diagrams as a cumulative,
click-driven sequence with animated connectors and stable familiar blocks.
Implemented in a shared deck-local renderer and pure snapshot model, retaining
the source identities and 122-slide order. Native clicks are 11/5/4/5 on routes
44/71/97/105. Skill research, exact commands and validation status are recorded
at the top of the deck's review.md. 42 tests passed. Full review passed typecheck,
build and 147 browser states; final label-spacing adjustments were rechecked
in all 29 architecture states, with animation, reverse/deep-link navigation,
reduced-motion, print-media and presenter checks passing. Final targeted evidence:
`artifacts/reviews/caching-dark-arts/architecture-Eo2CqI/`. All diagram states
were visually inspected across iterations, including corrected recovery states.
Of the 118 other slides, 117 match prior reviewed screenshots byte-for-byte;
the one native-video loading-indicator variation was inspected. Full evidence:
`artifacts/reviews/caching-dark-arts/2026-10-08T21-38-13.749Z-beREZG/`.
No PDF regenerated. The known caught FloatingVue warning remains.
Stop for the user's visual feedback; do not expand the diagram scope.
No new dependency, artwork, theme package or animation runtime.

**Earlier feedback:** remove visible migration/review commentary throughout the
caching deck, keep provenance in the handoff docs, and expand the biography
montage to the full right third with clearly separated experience items.
Implementation is scoped to that cleanup; factual backlog remains unresolved.
The cleanup is implemented and browser-reviewed: 34 tests, typecheck, production
build and 136 browser states passed. All 39 changed screenshots were inspected;
97 others match the preceding reviewed run exactly. Evidence is in
`artifacts/reviews/caching-dark-arts/2026-10-08T20-52-37.372Z-QvSHwH/`.
No PDF was regenerated for this revision; prior PDFs are historical. The
updated preview is ready for the user's next visual feedback.
Follow-up: source slide 4's traffic photograph now fills the whole slide with
no heading or footer. `pnpm test` passed 35 tests and `pnpm typecheck` passed.
Targeted Playwright screen/print-media captures were inspected, exact full-canvas
bounds and forward/backward navigation passed. Evidence:
`artifacts/reviews/caching-dark-arts/full-photo-2026-10-08-a5EUy2/`.
No new whole-deck build or PDF export for this single-slide revision.
Latest copy follow-up: the user supplied 620,000 as the intended mileage.
Slide 5 now reads **620,000 Miles**, without a review note. All editable
audience prose and diagram labels use Start Case; code, technical names, units,
URLs, handles and text baked into source media retain their original spelling.
`pnpm test` passed 36 tests. `pnpm slides review caching-dark-arts` passed
typecheck, production build and all 136 browser states. All 136 screenshots
were individually inspected with no new clipping or overlap. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-08T21-03-45.435Z-gSvQC2/`.
Citation cleanup follow-up: removed visible attribution/source URLs and editorial
labels (Paraphrased, Illustrative Code/Comparison), while retaining substantive
technical qualifications. Provenance stays in sources.md. `pnpm test` passed
37 tests; the full named-deck review passed typecheck, build and 136 browser
states. Inspected all 22 changed screenshots; 114 are byte-identical to the
previous individually inspected run. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-08T21-11-39.026Z-0Xx8MZ/`.
Real-world-results photo follow-up: slides 116–118 are now image-only, full-canvas
cover fit with no titles, captions or footers. The lead-in on 115 is unchanged.
38 tests and typecheck passed; six targeted browser screen/print captures were
inspected, with exact image bounds and forward/backward navigation passing.
Evidence: `artifacts/reviews/caching-dark-arts/results-photos-2026-10-08-dtiYHG/`.
No full-deck build or PDF rerun for this three-slide change.
Technology-introduction cut: removed original source pages 25–27 at the user's
request, retaining later practical Query examples. API Types now follows source
24 directly. The approved outline and original-source-aware regression tests
are updated. 38 tests passed; full review passed typecheck, build and 133 browser
states. Inspected the new junction and three native-video variations; the other
130 captures match prior reviewed pixels outside the changing footer numbers.
Evidence: `artifacts/reviews/caching-dark-arts/2026-10-08T21-20-54.226Z-xO90Ml/`.
Historical live preview: http://127.0.0.1:65002/44. Older preview URLs below are
historical. No new PDF; remaining factual review and rehearsal are still pending.
**Approval:** On 2026-09-25 the user accepted the P1 direction ("visual looks
good so far") and requested variants and avatar/duck sprites. This advances
the sprite review slice ahead of the original roadmap; it does not authorize
Remotion, Three.js, or the entire asset library. On 2026-09-26 the user approved
the four likenesses and deterministic cleanup with baked official logos.  
The user subsequently said "love this, next steps?" then "go", approving the
scoped agent-first authoring slice. They additionally requested a portable folder
of sprites and design ingredients for their website session.  
On 2026-09-30 the user said website work was done, supplied matching PPTX/PDF,
and explicitly authorized “the full slides migration and placeholder for the
video demos”. This approves all 84 source slides, replacing the proposed pilot
gate; it does not authorize fact changes or actual video/interactive playback.  
On 2026-10-08 the user supplied Keynote/PDF for the caching talk and replied
“yes” to the migration outline, including a representative visual checkpoint
before completing the full deck. Approved outline and its SHA-256 are recorded
in `decks/caching-dark-arts/review.md`.
The user then explicitly requested the full deck for end-to-end analysis, named
demo slides, source-PDF highlights and smooth non-interrupting animations. This
supersedes the pilot gate; the amended outline hash is recorded in review.md.
**Stop condition:** deliver the revised 122-slide review draft, working demos
and browser evidence; wait for feedback before further refinements. The migration
PDF is historical; no PDF is regenerated for this motion checkpoint. Migration
coverage is complete, but factual approval and timed rehearsal are not.
No more artwork, Remotion, Three.js, or deployment.
Do not reopen likeness exploration. The default remains the original badge cover.

## Completed

- Read the brief, design spec, acceptance criteria, source notes, reference
  guide, and all supplied reference images.
- Validated the architecture against current official Slidev documentation.
- Selected and pinned Slidev 53.0.0 with Node.js 22.12 or newer.
- Created the pnpm workspace and reusable `slidev-theme-faris` package.
- Added local Inter and JetBrains Mono font dependencies.
- Added typed per-deck and per-slide configuration resolution.
- Added the scoped slide frame and initial `cover`, `statement`, and `code`
  layouts.
- Copied the original badge intact into the theme and verified its SHA-256 is
  unchanged from `references/original-badge.png`.
- Added a six-slide Markdown showcase with paired light and dark examples.
- Added deterministic screenshot automation with network blocking, local font
  checks, broken-image checks, overflow checks, and runtime-error checks.
- Documented the agent-first authoring flow, anti-slop editorial pass,
  Playwright review loop, monorepo direction, sprite review, recorded demos,
  interactive embeds, and deferred Remotion adapter.
- Installed the pinned workspace dependencies and Playwright Chromium.
- Passed type checking and the production build after the final typography fix.
- Captured and individually inspected all six 1920 × 1080 browser screenshots.
- Exported the 12-page click-expanded PDF, rendered every page to PNG, and
  inspected all 12 pages. No visible missing glyphs, overlap, or clipping found.
- Recorded deck-specific findings in `decks/showcase/review.md`.

## P1 approval

- The six screenshots and PDF remain the original P1 review deliverables.
- User accepted the direction and requested the scoped P2a review below.

## First-checkpoint acceptance

- [x] Theme resolves locally as `slidev-theme-faris`.
- [x] Typecheck/build pass; no unexpected browser errors (known exception below).
- [x] Cover renders in light and dark mode.
- [x] Statement renders in light and dark mode, including its click reveal.
- [x] Code renders in light and dark mode with stepped line highlights.
- [x] No screenshot has unintended overflow, clipped text, missing fonts, or a
  broken image.
- [x] The original badge is used intact and no new avatar artwork exists.
- [x] Six browser screenshots are present under `artifacts/p1/screenshots`.
- [x] `artifacts/p1/faris-slides-p1.pdf` exports and renders correctly.
- [x] P1 assets/fonts load with external browser requests blocked.
- [x] P1 artifacts are included in the review handoff.
- [x] User approves continuing from the P1 visual direction.

## Commands

```bash
pnpm install
CI=true pnpm typecheck
CI=true pnpm build
CI=true pnpm capture:p1
CI=true pnpm export:p1
pdfinfo artifacts/p1/faris-slides-p1.pdf
pdftoppm -scale-to 1280 -png artifacts/p1/faris-slides-p1.pdf artifacts/p1/pdf-review/page
```

The capture script starts its own local Slidev process on port 4173 and blocks
all non-local requests during capture.

All commands above completed successfully on 2026-09-25. Validation used
Node.js 24.18.0 and pnpm 11.15.1. The production build is written to
`decks/showcase/dist/showcase/` because Slidev resolves its output relative to
the deck. Browser screenshots use final reveal states; the PDF includes every
click step: two cover pages, four statement pages, and six code pages.

P1 is not the complete v0.1 acceptance suite. Presenter/audience synchronization,
notes, backward navigation, overview, system auto-mode, conference overrides,
long-content fixtures, numeric contrast measurements, config unit tests, and
full offline production rehearsal remain unverified. The capture script
reports failures to the terminal; a persistent machine-readable review report
is P2 work.

## Known constraints

- The identity reference remains a raster contact sheet. Four approved
  likenesses now have prepared RGBA PNGs in the theme's `assets/illustrations`.
  The files under `media/sprites/review-v1` remain source intermediates, not
  final branded avatars. Neither set is vector artwork or an animation atlas.
- The copied original badge is the only approved character asset used in P1.
- Conference-specific accent overrides are designed as a future token mapping
  but are not implemented in P1.
- Three.js remains explicitly deferred.
- PDF is the current export baseline. Editable PowerPoint is out of scope.
- Slidev 53's optional Twoslash client logs a caught FloatingVue compatibility
  message even when Twoslash is unused. The capture harness filters the known
  `Failed to patch FloatingVue` prefix and fails on other console errors and
  uncaught page errors. Export also logged this caught error and exited zero.
- Poppler emitted Type 3 glyph bounding-box warnings while rendering the PDF.
  All 12 rendered pages were inspected with no visible glyph corruption. Other
  PDF viewers and text accessibility have not been tested.
- P2b adds the command wrapper and explicit authoring skill sources. Animated
  sprites, Remotion, recorded demos, and interactive fallback modules remain
  future work. P2a contains static preparation, not animation or atlas tooling.

## P2a work and evidence

- Added opt-in `faris.coverVariant: editorial | speaker | badge` (badge default)
  and a `section` layout, using the same theme and token system.
- Added `decks/variants/slides.md` as a second theme consumer: two covers and
  one section composition, each in light/dark, plus two sprite review sheets.
- Prepared four PNG candidates through the built-in image tool with the
  approved sheet as reference. Both avatar candidates received alpha cleanup.
  Exact prompts, dimensions, alpha presence, and checksums are saved alongside
  the files. Original references remain unchanged.
- Kept the sprite registry and shirt-mark composition local to the review deck.
  The speaking logo uses the supplied official source through an SVG mask,
  retaining its geometry/letterforms and showing the garment through yellow.
  Both avatar previews retain the mark. The thinking image is reflected to
  free the viewer-right chest, while its separate official logo is unmirrored.
  This follows the user's explicit 2026-09-26 instruction to keep it on all shirts.
- Extended the capture script to save JSON reports and keep regression captures
  separate from the approved P1 artifacts.
- Passed `CI=true pnpm typecheck`, `CI=true pnpm build:variants`, and
  `node --test scripts/config.test.mjs` (three tests).
- Captured all eight variant slides with `CI=true pnpm capture:variants`.
  Inspected the full-size PNGs, including the final chest marks on both avatars.
- Passed `CI=true node scripts/capture-p1.mjs p1-regression`. All six resulting
  PNGs are SHA-256 identical to the original P1 screenshots. Approved P1 files
  were not overwritten.
- Browser report: no unexpected console/page errors, missing fonts/images, or
  measured content overflow. The known FloatingVue error is recorded explicitly
  in `artifacts/variants/report.json` rather than hidden from the report.

Run `pnpm dev:variants` to inspect the gallery on port 4185. Review artifacts
are in `artifacts/variants/screenshots`. Those initial candidate captures are
preserved. The finalized PNG-based review and its new PDF are described below;
presenter rehearsal, animation and atlas validation remain out of scope.

## P2a finalized sprites and evidence

- User approved the four likenesses, then authorized deterministic pixel
  cleanup instead of further image-generation attempts. No new generated art
  was used in this step.
- Added `scripts/prepare-sprites.mjs`: verifies original checksums, clears
  alpha below 16/255, reflects only the thinking source, and bakes the reviewed
  official logo into both shirts. Original source PNGs remain byte-for-byte
  intact. Prepared files and provenance live in the theme's
  `assets/illustrations`. Exact recipe: `media/sprites/PREPARATION.md`.
- Added `FarisIllustration` with a typed name registry, local URLs, intrinsic
  dimensions, accessible descriptions, decorative mode and explicit fallback.
  Markdown authors need only a name in the existing `visual` slot.
- Replaced the two deck-local preview/logo modules with the shared module.
  Their composition recipe is retained in the preparation script and docs;
  the old raw-source rendering is no longer part of the deck.
- Added five registry/asset tests; all eight tests pass including the existing
  config tests. Typecheck and variants production build pass.
- Pixel audit passes for all four files. Every non-logo pixel matches the
  exact cleanup/reflection rule, with no low-alpha leftovers. The only other
  changes are 2,652 speaking and 2,364 thinking pixels in logo bounds.
- Captured all eight updated 1920 × 1080 slides with external requests blocked.
  Individually inspected all eight and all four full-size prepared PNGs:
  no stray flecks, missing logos, yellow patches, clipping or changed likeness.
- Exported the new eight-page PDF; rendered and inspected all eight pages.
  Both baked marks and alpha silhouettes survive export on light/dark surfaces.
- Recaptured the six original P1 slides into `artifacts/p1-regression`; every
  PNG is byte-identical to its original P1 artifact. No approved baseline was
  replaced.
- Evidence: `artifacts/sprites-final/report.json`, `pixel-audit.json`,
  `screenshots/`, `faris-slides-variants.pdf` and `pdf-review/`.
- Known existing warnings remain: caught FloatingVue message during capture
  and export, and Poppler Type 3 glyph bounding-box warnings. No visible PDF
  glyph defects were found. The PDF is untagged; accessibility across PDF
  readers and full presenter/offline production rehearsal remain unverified.

Commands completed on 2026-09-26:

```sh
# Preparation/audit NODE_PATH is documented in media/sprites/PREPARATION.md.
node scripts/prepare-sprites.mjs
node scripts/verify-sprites.mjs
CI=true pnpm typecheck
node --test scripts/config.test.mjs scripts/illustrations.test.mjs
CI=true pnpm build:variants
CI=true pnpm capture:sprites
CI=true pnpm export:variants
pdfinfo artifacts/sprites-final/faris-slides-variants.pdf
pdftoppm -scale-to 1280 -png artifacts/sprites-final/faris-slides-variants.pdf artifacts/sprites-final/pdf-review/page
CI=true node scripts/capture-p1.mjs p1-regression
```

The first sandboxed preparation attempt failed to launch Chromium; rerunning
with approved local browser permissions succeeded. No dependencies installed,
commits, remote writes, package publication or deployment in this step.
The existing gallery server on port 4185 was confirmed healthy (HTTP 200).
A redundant start reported the port in use; the existing process was preserved.

## Post-P1 roadmap

### P2b delivered: agent-first authoring (2026-09-29)

- One internal `scripts/slides/` module exposes `pnpm slides new|dev|review|export
  <talk>`. No new package or dependency. Validated typed input, real local deck
  paths, no-overwrite creation, unique run directories, owned loopback server,
  cleanup, process logs, source checksum and machine reports.
- Added repository skill sources in `skills/` for plan, write, edit, and review.
  AGENTS.md routes agents explicitly. These are not automatically installed app
  skills. Writes to protected `.agents` were denied; no bypass was attempted.
  The skill-creator Python validator could not run without PyYAML. Existing
  installed YAML tooling provides equivalent metadata checks in unit tests;
  do not claim the original validator ran successfully.
- Planning scaffold includes brief, outline, sources, review, and placeholder
  slides. Outline approval is an explicit user gate, not a CLI attestation.
- New authoring-example fixture reuses approved showcase content with notes
  documenting claims/code assumptions. Two executable tests extract its actual
  displayed code. Editorial pass retained concise approved copy without inventing
  facts or reporting nonexistent rewrites.
- Generic browser review captures every native click state, checks real loaded
  fonts, images, layout bounds, text overflow, minimum code size, errors, HTTP,
  external requests/WebSockets, and forward/back navigation. Failed runs retain
  evidence and exit nonzero. A negative browser fixture verifies diagnostics.
- `pnpm test`: all 19 tests passed. `node --test scripts/slides-review.browser.mjs`:
  one test passed. Named showcase and example reviews passed typecheck/build and
  12/6 browser states. Individually inspected all 18 images: no clipping, missing
  images/fonts, or content overlap. Showcase run preceded stricter font/WebSocket
  checks; the final example run includes them. No P1 baselines overwritten.
- Native example PDF: six pages, each rendered and inspected. Final-state PNG:
  three images, each inspected. Minor PDF-only arc hairline/position differences
  remain documented in `decks/authoring-example/review.md`; no visible glyph loss.
- `pnpm slides dev authoring-example` printed its own port, served HTTP 200 and
  stopped via Ctrl+C. Existing variants server was not stopped.

Commands completed:

```sh
pnpm slides new authoring-example
pnpm test
node --test scripts/slides-review.browser.mjs
pnpm slides review showcase
pnpm slides review authoring-example
pnpm slides export authoring-example
pnpm slides export authoring-example --format png --clicks final
pnpm slides dev authoring-example
```

Evidence directories (workspace-relative):

- Showcase: `artifacts/reviews/showcase/2026-09-29T14-28-50.428Z-W0btXU/`.
- Final example browser: `artifacts/reviews/authoring-example/2026-09-29T14-33-10.240Z-fJHbK9/`.
- PDF + rendered pages: `artifacts/reviews/authoring-example/2026-09-29T14-32-34.797Z-4qIyDe/`.
- PNG: `artifacts/reviews/authoring-example/2026-09-29T14-40-51.325Z-sGE7gX/`.

Validation runtime: Node 26.4.0, pnpm 11.15.1, Slidev 53.0.0, Chromium
151.0.7922.34. pnpm reports an existing node_modules/global-store configuration
mismatch. `verifyDepsBeforeRun: warn` prevents routine runs from silently
reinstalling; the initial implicit-install attempt aborted, no install completed.
Known FloatingVue and Poppler warnings remain. No commits, remote writes, or
deployment. This folder currently has no Git repository.

Limitations: source hashing covers slides.md only. Review uses pinned dev
navigation internals, Faris layouts, and reduced motion; presenter/overview,
full offline production rehearsal, numeric contrast and media behavior remain
unverified. No real new talk has passed the complete human outline approval
loop. This fixture proves the mechanics, not conference readiness.

### Website handoff delivered (2026-09-29)

- Portable folder: `artifacts/website-handoff/faris-brand-kit/`; sibling
  `faris-brand-kit.zip` for AirDrop. Not a website implementation or deployment.
- Contains exact final sprite PNGs, intact badge, Inter Latin/OFL, scoped
  light/dark/auto CSS, responsive preview, source hashes/dimensions, README,
  DESIGN, AGENTS, REVIEW, and ready-to-paste HANDOFF prompt.
- No personal photos, raw unbranded intermediates, node_modules, secrets, or
  Slidev runtime. Avatar/duck unchanged; ZurichJS chest marks remain baked in.
- `node scripts/review-website-kit.mjs` passes local-file preview at 1440 and
  390 px in both modes, fonts/images, no external traffic/errors/overflow, auto
  theme and visible keyboard focus. Individually inspected all four screenshots
  in `artifacts/website-handoff/review/`. Destination site and other browsers
  still require testing; instructions enforce a planning/visual approval gate.

### P2: authoring workflow and reuse

- Add the rest of the approved layout set; the variants deck already proves a
  second theme consumer. A real talk should drive further authoring decisions.
- Delivered in P2b: local pass instructions, one internal command module, and
  named-deck Playwright reports. A real talk should drive further refinements.

### P3: media reliability

- Prove local recorded demos through `SlidevVideo` with poster and print poster.
- Prove one local interactive website and one remote embed with offline
  fallbacks.
- Add presenter, overview, deep-link, backward-navigation, and offline checks.

### P4: media production

- Build the reviewed sprite preview and asset metadata flow.
- Add an isolated Remotion workspace that renders video and poster files for
  Slidev to consume.
- Recheck versions, licensing, codecs, render reproducibility, and export
  behavior before adding dependencies.

## Next agent action

Hand off the current 122-slide caching deck and await end-to-end feedback. Exact
artifacts, commands and limitations are in `decks/caching-dark-arts/review.md`.
Live preview: `http://127.0.0.1:65002/44` (restarted for the cumulative architecture
revision with `pnpm slides dev caching-dark-arts`). ArrowRight/Space advances native click
states; ArrowLeft reverses them. Keep this owned server running for user review.
Architecture routes are 44/71/97/105. Demo intros are 46/78/110, recordings
47/79/111. Diagram successors begin on the preceding completed architecture.
Use audience-window video controls: presenter playback is independent.
Do not repeat the migration or mistake historical pilot gates below for current
scope. Recover Keynote notes, media trims and build settings before claiming
complete original playback fidelity. Refine only after user feedback.
Do not regenerate approved media, payment slides, website handoff or sprites.
The full factual backlog is in the caching sources.md. Preserve earlier runs.
No remote writes.

### Full caching draft delivered for review (2026-10-08)

- 125 source pages mapped one-to-one; 136 browser/PDF click states reviewed.
- Typecheck and 33 tests passed. Full review/build run:
  `2026-10-08T20-43-11.938Z-EdaNgl`; PDF: `2026-10-08T20-43-14.985Z-vASjg3`.
- Native forward/reverse/rapid navigation, reduced motion, print, diagram
  presenter/click behavior and three offline production videos checked.
- Exact commands, visual fixes, comparison evidence and editorial changes are
  in `decks/caching-dark-arts/review.md`. No automatic visual approval claimed.
- Known limitation: native loading crescents can linger on paused demo captures
  despite successful playback/readiness checks. Presenter playback is separate
  from audience playback. Factual audit, original Keynote trims/notes/builds and
  venue/timed rehearsal remain unverified. No remote changes.

### Historical caching checkpoint work (2026-10-08; superseded by full draft)

Latest revision: ten slides for seven source beats. Demo title slides are 5/7/9,
full-canvas recordings are 6/8/10, using native none layout and SlidevVideo.
Original aspect ratios, assets and manual playback remain intact. The user
accepted the demo layout and requested the new diagram at slide 3. It now uses
a client/API/retry legend, icons, tinted nodes and separate dashed retry routing.
This does not authorize migration expansion yet. Latest evidence and commands
are at the top of decks/caching-dark-arts/review.md; the initial records below
remain historical evidence.

Narrated-flow update: the user supplied the exact sequence and quantities and
explicitly requested incremental emphasis. Kept ten slide routes and seven
source identities. Added 11 clicks to source 47, matching captions and notes,
conditional Effect/state refetch loop, separate retry option emphasis, and a
complete-flow final state. No shared theme or media changes. `pnpm test` passed
31/31, typecheck/build passed, browser review captured 21 states with zero
failures and 20 navigation checks. All 21 screenshots and 21 rendered PDF pages
were inspected. Targeted flow review verified forward/backward emphasis,
deep-link state, presenter notes and unique arrow markers. Exact paths and a
test-harness wake-lock correction are recorded in deck review.md.

- Read source/repository/skill instructions, approved reference images and the
  source PDF's representative code, flow and video slides. Outline approval
  is the user's actual “yes”, not inferred from a passing check.
- Seven editable slides retain source identities 1, 16, 47, 48, 50, 82, 114.
  One deck-local content layout, one editable SVG client flow and scoped CSS.
  Existing shared theme, tokens, avatar, badge and duck files are unchanged.
- Three native SlidevVideo instances use local original MP4s, manual controls,
  inline playback, auto preload, separate playback/print posters. No video
  wrapper, dependency, transcoding, trimming, new runtime or artwork.
- Extraction script refuses to overwrite modified recordings. Provenance:
  `migration/media.json`; decoded dimensions/durations/frame selections:
  `migration/posters.json`. Originals total 359,199,368 bytes. Durations are
  41.033333, 14 and 24.266667 seconds. MP4 sample-entry inspection found avc1
  video tracks and no audio sample entries. Full original audio intent unverified.
- Source 114's recording contains both demo 3 (prefetch) and demo 4 (short
  prefetch timeout), with its original ZurichJS opening intact. Not an incorrect
  video. Print frame is deliberately selected at 12 seconds for the demo 3 state.
- Initial machine-passing screenshots exposed native loading spinners on the
  media slides. Changed metadata preload to auto and added first-frame/seek and
  poster-readiness checks to the existing browser review, plus negative probes.
  Rejected/intermediate evidence is retained, not overwritten into a baseline.
- Four new migration tests cover source mapping, approval hash, byte-identical
  media/poster wiring and editable code syntax. Code helpers are absent; do not
  call this an executable application test. Existing payment tests still pass.
- Local browser/server calls initially failed under sandbox listen restrictions;
  approved escalated runs succeeded. No dependencies installed or remote writes.
- Final named browser review: `2026-10-08T17-31-31.197Z-oOJfNH`; seven screenshots,
  typecheck/build and forward/backward navigation passed. PDF run:
  `2026-10-08T17-31-33.895Z-Q9AWFC`; all seven rendered pages inspected.
- Production media run `media-2026-10-08T17-33-21.299Z` passed all three clips'
  play/seek/pause/return checks with external traffic blocked. Overview and
  presenter screenshots inspected. Presenter playback does NOT start audience
  playback; operate the audience window's controls and rehearse this setup.
- `pnpm test`: 29/29 passed. Browser negative-probe test: 1/1 passed. No full
  125-slide factual audit, original-notes recovery or timed rehearsal yet.
- Local checkpoint preview was left running at `http://127.0.0.1:55070/1`.
  Restart with `pnpm slides dev caching-dark-arts` if it is no longer available.

### Payment talk migration delivered (2026-09-30)

- 84 source slides mapped one-to-one with `sourceSlide: 1..84`; all 26 original
  notes retained exactly. Outline approval and hash recorded in deck review.
- Editable Markdown statements/tables and seven TS/TSX code examples; native
  HTML/CSS architecture flows; 19 original/converted local image assets.
- Static labeled poster placeholders at 57 and 77. Original MP4s remain in the
  supplied PPTX and are not copied into the deck. Slide 83 remains a screenshot.
- Only two deck-local layouts and two components added. Shared frame type union
  accepts the content composition; existing theme geometry/assets unchanged.
- Six migration tests added; `pnpm test` passes 25/25. Browser negative-check
  test passes, including new code/header overlap detection. Typecheck/build and
  browser/export outcomes are recorded with exact artifacts in deck review.md.
- Visual review caught code collisions on 43/44/47 missed by initial bounds
  checks. Fixed native code spacing variables, rerendered, and preserved the
  rejected evidence. Empty annotation decoration suppressed only for this deck.
- Original numeric/legal/provider claims were not silently rewritten. See the
  explicit factual backlog and illustrative-code limitations in sources.md.
- No dependency installation, generated artwork, Git initialization, commit,
  push or deployment. Existing pnpm store warning and FloatingVue warning remain.
