# Caching: migration review

## Intro copy, 2026-10-09

Removed A Pragmatic Case Study from the cover. Targeted browser screenshot
intro-copy/cover.png inspected. Preview http://127.0.0.1:59866/1.
No full review/export rerun.


## QR call to action, 2026-10-09

Added Connect With Me above the closing QR. Targeted browser screenshot
connect-cta/closing.png inspected; QR, duck and full-height photo remain clear.
Preview http://127.0.0.1:59130/109. No full review/export rerun.


## Full-height closing photo, 2026-10-09

Montage changed from contained image to a full-height right-third cover crop.
Left title, QR, duck and footer remain clear. Playwright measured y=0,
height=1080 at 1920×1080. Screenshot closing-full-height/closing.png inspected.
No full test/export pass for this CSS-only change. Preview 54418/109.


## Code travel and spotlight, 2026-10-09

Removed route 93's key chips, outcome copy and caption. Native code-object
transition from 92 to the compact server excerpt on 93 takes 1100 ms. Two
clicks move attention to client, then isolate both matching key lines. Browser
verified the transition group and exact bright line text, captured/inspected
all three states in hydration-spotlight; no page errors. 66 tests passed.
109 slides / 170 states. No full browser/export rerun. Preview 54418/92.


## Router transition and recap emphasis, 2026-10-09

All four recap headings now split white prefix/yellow solution. Replaced the
repetitive prerender illustration with a one-click Pages Router → App Router
flip before the streaming explanation. Sequence: recap 96, transition 97,
streaming 98. 109 slides / 168 states. pnpm test: 66 passed.
Six browser screenshots inspected in router-transition; capture report has no
page errors. Actual click animation and reverse restoration verified. A strict
reduced-motion duration assertion expected zero but got the theme's 1e-06s
override, effectively static. Full browser review/export not rerun.
Preview http://127.0.0.1:53621/96. Await visual feedback.


## Matching query keys, 2026-10-09

Added route 93 after the server timeout code. Native code columns show matching
keys, with fresh hydration and client-fetch fallback outcomes. Factual pass
uses TanStack's SSR guide: missing data triggers normal enabled-query fetching,
not detection of an expected server result. Notes retain existing-cache and
stale-data cases. Total 109 slides / 170 states. 66 tests passed before final
whitespace-only compaction. Targeted browser screenshot hydration-pair/final.png
inspected: earlier flex layout and caption overlap fixed. No full browser/export
rerun. Preview http://127.0.0.1:52959/93.


## Separate CDN example, 2026-10-09

51: removed CDN caption; 52: new dedicated larger-window example, measurement
and infrastructure caveat. The old source-61 takeaway remains removed. Total
108 slides / 169 states. pnpm test: 66 passed after updating the stale slide-15
emphasis expectation. Targeted Playwright: no page errors, both screenshots
inspected in artifacts/reviews/caching-dark-arts/cdn-window-split/. No full
browser review/export rerun. Preview http://127.0.0.1:50781/51.


## Duplicate takeaway removed, 2026-10-09

Removed source 61 (route 52), including its replacement critical-payload wording,
at Faris's request. The preceding 14 KB/CDN example stays intact. All subsequent
routes shift down one; total 107 slides / 168 states. No visual/export rerun.


## Initial congestion window, 2026-10-09

| Slide | Before | After |
| --- | --- | --- |
| 51 | 14 KB example only | Adds ~46 KB as a larger CDN example; windows vary |
| 52 | Send Less. Wait Less. | Keep critical payload within the initial congestion window |

Factual pass distinguishes dated provider experiments, historical CDN research
and recent independent path-specific measurements. Notes cover compression,
framing, shared traffic and connection reuse. Targeted Playwright screenshots
51.png and 52.png in artifacts/reviews/caching-dark-arts/initial-window inspected;
report has no page errors. Full review/tests/export not rerun. Preview 49930.


## Slide 15 connecting word, 2026-10-09

Split the yellow emphasis so “and” inherits white. Targeted Playwright verified
two yellow strong spans and white heading text on fresh preview 65355; screenshot
question-and-white/slide-15.png inspected. Old preview 63117 was stale. No full
test or export pass for this scoped Markdown change.


## Prefetch recap and streaming, 2026-10-09

Routes 93/94 now contain Demo 3; route 95 consolidates sources 110–112 into
six factors. Routes 96/97 extend the story with App Router streaming and a
prerendered shell. Each has three clicks; total 108 slides / 169 states.
Route 88 now says configurable backoff and custom jitter, with the possible
v6 default confined to a tentative speaker reminder.

pnpm test: 66 passed. pnpm typecheck: passed. Targeted Playwright exercised
all eight streaming states, summaries 88/95, reverse navigation and a static
reduced-motion/print state. Eleven screenshots inspected; report has no page
errors. Evidence: artifacts/reviews/caching-dark-arts/streaming-model/.
No full-deck review or export rerun. Preview http://127.0.0.1:63117/95.


## Fresh cache and 429 symptom, 2026-10-09

| Slide | Before | After |
| --- | --- | --- |
| 85 click 4 | General Query recap | Five-minute global setting, three cache-hit pulses, fading failure/retry path, explicit API-limit caveat |
| 86 click 1 | Per-query staleTime: 60_000 | Inherits five-minute global default shown on 85 |

Checked official TanStack important-defaults documentation. Assumes existing
successful data for the same key, without invalidation or explicit refetch.
Notes explain misses/other keys/other users and separate freshness from retention.
No blanket removal of 429 risk is claimed. No extra clicks or slide changes.
pnpm test: 66 passed. pnpm typecheck: passed. Targeted Playwright report and
three inspected screenshots in artifacts/reviews/caching-dark-arts/query-fresh-hits/.
Verified final failure-path opacity 0, reverse step restores opacity 1, reduced
motion produces the final readable result. No page errors. No full-deck/export
run. Preview http://127.0.0.1:61426/85?clicks=3.

## Download continuity and hosting comparison, 2026-10-09

Final targeted browser run: artifacts/reviews/caching-dark-arts/capacity-flow-final/.
All eight screenshots inspected, report.json has no page errors. Verified
1/2/3 visible hosting cards, identical client positions across Lambda/EC2,
static EC2 in reduced-motion/print, and native Wi-Fi transition group at
760 ms. Wi-Fi moves from y=454 to y=397 as 4G enters. Reverse navigation
checked. New preview: http://127.0.0.1:60390/83?clicks=0.

“Decimal Bytes · Constant Rates” becomes “Estimated Download Time At A Steady
Speed”. Calculations and real-time fill durations are unchanged. Network rows
share native object-transition names across slides: Wi-Fi moves upward, the new
4G row slides in over 760 ms; same mechanism applies to 3G and small payloads.
Identity is disabled for inactive/overview/reduced-motion/print instances.

FaaS now has two clicks: slow client first, client second, Lambda third. IaaS
retains the two client cards and replaces the server card with EC2 c5.large.
Colors, icons, borders and the API → proxy → browser strip explain the roles.
Existing rates, transfer-only qualifiers and notes retained; no new benchmark.
108 slides / 163 states. pnpm test: 66 passed. pnpm typecheck: passed after
removing an import that pulled Slidev's unconfigured internal sources into the
checker; active status now follows the deck's existing explicit-prop pattern.
No new dependencies. Full-deck, presenter sync and PDF export not rerun.

Earlier batch final browser report: summary-motion-copy-final/report.json,
no page errors, all summary final states, reduced-motion/print CSS checks,
BFF forward/reverse entrance and twelve distinct monthly bars passed.
Final summary motion screenshots inspected after clipping title/footer overlap.

## Recap motion and scoped copy, 2026-10-09

| Slide | Before | After |
| --- | --- | --- |
| 51 | Not A Universal Payload Budget | A TCP Example, Not A Target |
| 52 | No Universal Byte Threshold / Connection Reuse And Transferred Bytes Matter | Send Less. Wait Less. / Trim The Data You Don’t Use / Measure What The Browser Downloads |
| 64 | The Payload The Chart Actually Needs / Abbreviated Response | A Slimmed Payload / Slimmed Response |
| 68/69 | BFF With Payload Shaping | BFF With Optimized Payload |

Summary cards on 47/70/88 have 900 ms entrance motion with up to 200 ms
stagger. Active slide binding resets it on re-entry, excludes overview, and
CSS disables motion under reduced-motion and print. BFF step 1 now has a
700 ms upward fade instead of only the brief focus fade. Twelve monthly bars
have distinct deterministic heights; notes still say they are illustrative.

Commands: pnpm test (66 passed), pnpm typecheck (passed), pnpm slides dev
caching-dark-arts, targeted Playwright. Exact-copy assertions were updated
for the approved slide-15 emphasis and Demo-2 wording after initial failures.
Initial captures caught cards crossing the heading/footer, fixed by clipping
the card region. Initial browser runs had wake-lock permission failures and
a too-early animation assertion; not counted as clean runs. No full-deck,
presenter synchronization, overview browser run or PDF export in this pass.

## Question emphasis, 2026-10-09

Slide 15 highlights only “complex data fetching and management” with existing
yellow strong styling. Targeted Playwright confirmed the exact phrase and
rgb(244,198,58). Screenshot challenges-highlight/slide-15.png under this deck's
artifacts/reviews directory inspected, report.json saved alongside it.
Initial check on stale server 56246 timed out; fresh 56917 passed.
No full-deck/export rerun. Preview http://127.0.0.1:56917/15.

## Closing QR, 2026-10-09

Replaced the closing QR with connect-qr.png encoding https://faziz-dev.com/connect.
The image also links there. Original extracted QR preserved. Generated via
macOS Core Image, with medium error correction and four-module quiet zone.
Targeted Playwright checked image load and href on route 108. Screenshot
artifacts/reviews/caching-dark-arts/connect-qr/closing.png visually inspected
and decoded using native Vision to the exact requested URL. No full review,
export or destination availability check. Preview http://127.0.0.1:56246/108.

## Website footer, 2026-10-09

Shared theme frame now displays a lowercase faziz-dev.com link, replacing the
speaker-name footer across consuming decks. Page numbers and footer-free
layouts unchanged. Browser assertions checked label and href on route 2;
`artifacts/reviews/caching-dark-arts/footer-9w3KpG/footer.png` inspected.
No full-deck/export rerun.

## Demo autoplay, 2026-10-09

Enabled native SlidevVideo autoplay and muted on all three silent recordings.
Controls/full-slide fit/posters unchanged. No loop/reset; return resumes.
66 tests passed. Browser behavior checks passed for routes 46/69/97: autoplay,
pause on departure, resume on return; overview stayed paused. All three playback
screenshots inspected in `artifacts/reviews/caching-dark-arts/autoplay-KrrJOS/`.
The strict zero-error assertion failed because native SlidevVideo leaves a
play promise uncaught when rapid navigation interrupts it with pause. This is
a known limitation, not a clean runtime pass. No dependency mutation or error
suppression added. No new presenter/export/production-media run. Historical
media script asserts manual play and should not be used as current acceptance.
Preview http://127.0.0.1:54277/45. Stop for feedback.

## Subtle heading exit blur, 2026-10-09

Added a 280 ms fade with 0–3 px blur only on the outgoing primary heading
snapshot. Incoming text and other slide objects remain sharp. Targeted browser
check verified the blur keyframes, sharp settled heading and reduced-motion
isolation. No page errors. Motion, settled and print screenshots inspected in
`artifacts/reviews/caching-dark-arts/heading-blur-fine88/`.
No full-deck review/export rerun. Preview http://127.0.0.1:64034/7.
Stop for feedback.

## Whole-object motion, 2026-10-09

Replaced per-character heading spans with one whole h1 transition object.
Preserves semantic emphasis, native accessibility and line breaks. Existing
760 ms movement and 320 ms crossfade retained. Code token morphs unchanged.
Typecheck passed. Targeted browser review verified one heading transition
group, no character wrappers, reverse navigation and reduced-motion isolation.
Three captures (motion, settled, print) inspected; no page errors.
Evidence: `artifacts/reviews/caching-dark-arts/object-motion-Vj5hLX/`.
No full-deck browser/export pass. Natural wrapping may differ elsewhere.
Historical character review script is no longer current. Preview:
http://127.0.0.1:64034/7. Stop for feedback.

## Prefetch title, 2026-10-09

Renamed source 109/current slide 92 to the approved “Prefetch, But Don’t Wait
Forever”. Title-only edit; code and timing unchanged. No new browser/export pass.

## Prefetch code formatting, 2026-10-09

Source 109 was route 94 in the user's older preview; it is now route 92.
Kept the example's behavior, compacted the callback declaration, extracted its
URL and separated setup/fetch/dehydration with blank lines. Scoped 32 px line
height retains 23 px code type. 66 tests passed including HTTP/signal behavior.
Final targeted screen/print bounds passed with no page errors. Both images in
`artifacts/reviews/caching-dark-arts/prefetch-code-CkTB23/` inspected.
First capture caught an overlong fetch pushing the layout wide; corrected
before delivery. No full review/export or presenter rehearsal rerun.
Preview http://127.0.0.1:54360/92. Stop for feedback.

## Query current-state recap, 2026-10-09

Combined sources 102/104/105 into route 88 after the retained animated cache
explanation. Same six bordered positions as earlier summaries. Emphasizes
fresh-hit request avoidance, caching, retries and library-managed server state.
Payload/mapping stay unchanged. Notes preserve refetch and rate-limit caveats.
No new factual claims or measurements. 108 slides / 161 states.

66 tests passed before final label shortening. Final targeted Playwright
screen/print bounds passed with no page errors. Both full-size screenshots
in `artifacts/reviews/caching-dark-arts/query-summary-ay0oix/` inspected.
The first capture's request label crowded its card and was shortened to
“On A Fresh Hit”, preserving the fresh-cache qualification. No new full-deck
review/export or presenter rehearsal. Preview http://127.0.0.1:53574/88.
Stop for feedback.

## Query code transition, 2026-10-09

Route 86/source 101 now begins with the previous BFF after-snippet and morphs
into useQuery on a native 800 ms click. Same 23 px type/34 px line height as
route 66, blank operation separation and one-line fetch. Query key uses the
literal faker plus the established QUANTITY. HTTP errors and signal forwarding
remain tested. The notes explain the state handoff, sixty-second freshness and
the difference between isFetching and initial loading. 110 slides / 163 states.

65 tests passed after updating the code extraction to select the second fence
and the quantity-note assertion. Targeted Playwright forward/reverse checks
passed with no bounds or page errors. Both full-size screenshots inspected.
Evidence: `artifacts/reviews/caching-dark-arts/query-morph-F1wDf4/`.
No full review/export or presenter rehearsal. Preview:
http://127.0.0.1:52466/86?clicks=0. Stop for feedback.

## Query introduction cut, 2026-10-09

Removed requested routes 85/86 (source 98/99), the TanStack homepage and feature
screenshots. IaaS now advances directly to the Query architecture on route 85.
Retained all later Query explanations and original media files. 110 slides /
162 states. Updated source coverage assertions and website review sample routes.
`pnpm test`: 65 passed. Targeted Playwright forward/reverse navigation passed
with no page errors. New route 85 screenshot inspected, no visual change to
the retained diagram. Evidence:
`artifacts/reviews/caching-dark-arts/query-cut-Ti7vxP/`.
No full review/export rerun. Preview http://127.0.0.1:51598/84.

## Proxy capacity support, 2026-10-09

User requested numeric support for bulk transfer at the proxy and a small
browser response. The factual/editing pass uses specific AWS configurations
and separates capacity, modeled transfer time, full latency and billing.

| Before | After |
| --- | --- |
| Generic FaaS startup cautions | Lambda 625 Mbps default limit against 25/2 Mbps client examples |
| Generic IaaS capacity cautions | c5.large 750 Mbps baseline against the same examples |
| No numeric support for placement | Ideal 1.58 MB transfer estimates and explicit proxy-shaping takeaway |

Claims and official sources are recorded in sources.md. No new measurement or
universal speed/cost claim. Cold starts, upstream speed, load and ongoing proxy
costs remain in notes. Both slides retain their original positions and no
clicks are added. 112 slides / 164 states unchanged.

`pnpm test`: 65 passed. Targeted inline Playwright checked routes 83/84 in
screen/print modes with external traffic blocked. No bounds, page errors or
external requests. All four screenshots inspected at full size: aligned columns,
readable figures/captions and no clipping.
Evidence: `artifacts/reviews/caching-dark-arts/proxy-capacity-JBRcgF/`.
No full-deck review, PDF export, timed rehearsal or actual network benchmark.
Preview http://127.0.0.1:50823/83. Stop for visual feedback.

## Slide 66 code spacing, 2026-10-09

Added blank lines between after-state operations and scoped 34 px line height
to the morph slide, retaining 23 px type and the one-line fetch. Compacted the
before-state object to keep it clear of the title. No behavior changes.
`pnpm test`: 65 passed. Targeted Playwright forward/reverse checks found no
bounds or page errors. Both screenshots in
`artifacts/reviews/caching-dark-arts/code-spacing-rki1xJ/` inspected full-size.
An earlier capture revealed header overlap, corrected before final capture.
No full-deck build, export or presenter rehearsal rerun. Preview:
http://127.0.0.1:49741/66?clicks=1. Stop for feedback.

## Normal download timing, 2026-10-09

Removed acceleration from the six payload download states and removed speed
wording from the visible caption and speaker notes. The animation now waits
200 ms and transfers for the calculated duration. The presenter can advance
without waiting for completion. No changes to the model or video recordings.

`pnpm test`: 65 passed. Targeted Playwright checked timing on routes 72–74
and 76–78, early navigation, and screenshot bounds with no page errors.
Both full-size final-state screenshots inspected with no clipping.
Evidence: `artifacts/reviews/caching-dark-arts/normal-download-m69pbT/`.
No new full-deck build, export or presenter rehearsal. Preview:
http://127.0.0.1:64438/74?clicks=0. Stop for feedback.

## BFF summary, 2026-10-09

User authorized the next recap. Combined BFF factors 77–79 and payload 83
on route 70 after Demo 2, preserving the payload-shaping animation before it.
Same six positions as the client recap. ~300 Bytes, one browser request and
proxy mapping highlight improvements; state, application caching and custom
retry remain explicit. Notes distinguish client request simplification from
upstream failure isolation and preserve code-management/server responsibilities.
No new measurements or changes to recordings. Total 112 slides / 164 states.

`pnpm test`: 65 passed; `pnpm typecheck`: passed. Targeted inline Playwright
review checked title and screen/print bounds with no page errors or external
requests. Both full-size screenshots individually inspected: clear card
separation, readable content, no clipping. Evidence:
`artifacts/reviews/caching-dark-arts/bff-summary-shCt4k/`.
No new full-deck build, export or presenter rehearsal. Preview:
http://127.0.0.1:63738/70. Stop for feedback; later recaps unchanged.

## BFF after-title wording, 2026-10-09

Changed the after-state title to the user's exact wording: “After: One Request
to Proxy”, retaining emphasis on Proxy. No code or animation changes. No new
browser/export pass for this wording-only edit.

## BFF code formatting and Magic Move, 2026-10-09

User requested the fetch stretch across one line and the related before/after
code animate. Sources 75/76 now share route 66 with one native click and an
800 ms Shiki Magic Move transition. Same hook wrapper, changed middle; HTTP
failure handling and cancellation retained. New count 115 slides / 167 states,
with no change to the number of advances. `summarizesSources` keeps provenance.
Official feature syntax checked at https://sli.dev/features/shiki-magic-move
and installed Slidev 53 ShikiMagicMove.vue. No dependency added.

64 tests and typecheck passed. Executable code tests select the after block
and still check success, HTTP failure and cancellation. Targeted Playwright
`artifacts/reviews/caching-dark-arts/code-move-u28HFD/` detected live token
animations, exercised forward/reverse navigation and checked final bounds.
Before, after, reduced-motion and print screenshots individually inspected;
syntax legible and the full fetch fits on one line. No page errors.
Reduced-motion CSS disables token transitions; native print uses static code.
No full-deck build, PDF export or paired-presenter rehearsal this pass.
Preview http://127.0.0.1:62559/66?clicks=0. Advance once to morph. Stop for feedback.

## Slide 21 second-click title, 2026-10-09

User clarified the target as route 21?clicks=2. That state now reads “Greater
Than 1 Sec” with 1 Sec highlighted. Earlier states retain “1 Second”. Native
Vue conditions change only the title; animation and click count unchanged.
Targeted Playwright verified both rendered titles and bounds; both screenshots
individually inspected. Evidence: `artifacts/reviews/caching-dark-arts/title21-eojTAy/`.
No full build/export rerun. Preview http://127.0.0.1:60860/21?clicks=2.

## Current-state title and bordered facts, 2026-10-09

Route 47 now reads “Current State: Client-Side Fetching.” Added subtle 2 px
rounded borders and internal padding to distinguish the six facts. Adjusted
spacing while retaining payload dominance, content and semantic emphasis.
`pnpm test`: 64 passed. Targeted inline Playwright check verified title, six
cards, screen/print bounds, no page errors or external requests. Both full-size
screenshots inspected: clear separation, readable type, no overlaps.
Evidence: `artifacts/reviews/caching-dark-arts/summary-bordered-bdB6s9/`.
No full-deck build/export rerun. Preview http://127.0.0.1:60252/47.
Stop for feedback before applying the composition to later summaries.

## 14 KB question-first reveal, 2026-10-09

User asks the significance before explaining it. Source 57 / route 48 now
shows only 14 KB, 180 px, centered on the complete canvas with footer hidden.
Speaker notes prompt the question. Explanation moved to the existing next
slide, retaining its diagram and scoped transport caveat. Notes retain the
14,600-byte example and limitations. No slide count or click change.

`pnpm test`: 64 passed. Targeted inline Playwright review checked routes 48/49,
fonts/images, bounds, exact visible question-slide text and geometric centering
within two rendered pixels. No page errors or blocked external requests.
Evidence: `artifacts/reviews/caching-dark-arts/14kb-EBax7j/`.
Both screenshots individually inspected: number centered, explanation and image
readable, no overlaps. No new full-deck build, export or presenter rehearsal.
Preview http://127.0.0.1:59660/48. Stop for feedback.

## Faster search lead-in and pointer cursor, 2026-10-09

Route 22 now starts searching at 400 ms (was 2.2 seconds). Results still take
ten seconds after search begins. The authored cursor shows a pointing hand
over Search, then switches to an arrow at departure (520 ms). Real mouse hover
uses cursor:pointer; the decorative cursor does not intercept mouse events.
No content, click-count or other animation changes.

`pnpm test`: 64 passed. `pnpm typecheck`: passed.
`node scripts/review-caching-search.mjs http://127.0.0.1:58286`: passed with no
page/HTTP/external failures. Evidence: `artifacts/reviews/caching-dark-arts/search-9KYipL/`.
Checks assert native hover cursor, hand/arrow switching, 400 ms start, ten-second
wait, reversible navigation, immediate departure and static fallbacks. Six
new screenshots individually inspected; reduced and print screenshots exactly
match the previously inspected `search-2MK7QN` images. No new production build,
PDF export or presenter rehearsal. Preview http://127.0.0.1:58286/22?clicks=0.

## Demo 1 consolidated recap, 2026-10-09

Faris approved the proposed first-summary visual checkpoint. Sources 51–56
are now one slide on route 47, with six distributed facts and a dominant
~1.58 MB figure. Existing facts are preserved: around 80% unused demo data,
custom retry and maintenance, no built-in application cache, shared state and
staleness, client mapping and possible memoization, and unoptimized payload
shape. Five parallel requests recap the already-established scenario. Caching
is scoped to this implementation, not a claim that browsers lack HTTP caching.
Notes hold the caveats; visible text uses short phrases and semantic emphasis.
Other summaries remain unchanged until visual approval.

This explicit scoped user approval amends the prior outline for sources 51–56
only. `summarizesSources` retains provenance. Total: 116 slides / 167 states.
Later routes move back five; original source IDs stay unchanged.

Validation: `pnpm test` passed 64 tests; `pnpm typecheck` passed. Targeted inline
Playwright review against the fresh preview checked six fact regions, local
assets, screen and print bounds, forward to source 57 and back, with no page
errors, HTTP failures or external requests. Evidence:
`artifacts/reviews/caching-dark-arts/summary-2vKm2U/report.json`.
Both `screen.png` and `print.png` inspected individually: readable facts,
clear payload emphasis, good separation, no clipping. No full-deck review,
production build, PDF or presenter rehearsal rerun. Existing pnpm warning
remains. Preview: http://127.0.0.1:58286/47. Stop for visual feedback.

## Search, wait, reorient, 2026-10-09

Faris explicitly approved this replacement for the ten-second example on
route 22. SearchWaitDemo uses a failed-payments query, ten seconds of loading,
a drifting pointer, then a pause, rereading the query and scanning results.
The last selected row and “What Was I Looking For?” convey reorientation.
Key words use existing theme emphasis. No real request or measured behavior
is implied. One existing click starts it; navigation remains immediate.
Routes 20/21, sprites, media and the rest of the deck are unchanged.

`pnpm test` passed 63 tests and `pnpm typecheck` passed. The first test run
caught the Start Case rule conflicting with the previously requested exact
sentence on slide 15. That slide now has an exact-wording assertion instead.
`node scripts/review-caching-search.mjs http://127.0.0.1:56481` passed:
`artifacts/reviews/caching-dark-arts/search-2MK7QN/report.json`.
Browser animation timelines were sampled before completion, during waiting,
on result arrival, during rereading and after reorientation. The declared
search-to-results interval is 10,000 ms. Reverse resets and early navigation
stops playback. Reduced-motion/deep-link/print snapshots contain results and
no running animations. All seven full-size screenshots individually inspected;
readable text, clear emphasis, no clipping. No page errors, failed HTTP or
external requests. The first browser run lacked wake-lock permission; granting
the local origin permission fixed the test setup, not presentation code.

No new production build, PDF or paired-presenter rehearsal for this scoped
change. Use http://127.0.0.1:56481/22?clicks=0 and advance once to play.
Stop for user visual approval. “Longer Than 1 Sec” remains pending clarification
between routes 16 and 21; no change to those headings in this pass.

## Slide 15 restored wording, 2026-10-09

Restored the exact user-provided question and sentence case, replacing the
shortened heading and subtitle. Styling and other slides unchanged.
Targeted Playwright screenshot individually inspected, with exact rendered
text and no bounds failures: `artifacts/reviews/caching-dark-arts/slide15-Cxg5of/`.
The first capture (`slide15-M3NHPY`) showed stale Markdown on the older server;
a fresh `pnpm slides dev caching-dark-arts` loaded the change correctly.
Preview: http://127.0.0.1:55174/15. No full-deck test/build/export rerun.

## Dark-first presentation, 2026-10-09

The deck now forces native Slidev dark mode, uses a dark theme default, and
contains no explicit light slide overrides. Inherited media slides are dark
too. Architecture role colors and selected-node surfaces, response labels,
egress, cache-hit and interruption highlights now have dark-specific styling.
Light styling remains available in the shared theme. Content, click counts,
animation timing, media, sprite identity, logos and full-height bands are
unchanged. No dependency or artwork changes.

Validation:

- `pnpm test`: 63 tests passed, including dark-mode consistency and role-color
  contrast checks. Native `colorSchema` support checked against the installed
  Slidev 53 type definitions.
- `pnpm slides review caching-dark-arts`: typecheck and production build passed;
  121 slides, 172 states and 171 navigation checks passed.
  Evidence: `artifacts/reviews/caching-dark-arts/2026-10-09T12-31-48.391Z-d7RQGB/report.json`.
- Full visual coverage: 136 changed screenshots individually inspected at
  full size; 36 images are exact byte matches to the previously inspected
  `2026-10-09T12-20-57.854Z-tFxEGB` run. Text, code, role colors and focused nodes
  are readable, with no new clipping or sprite/band overlap.
- `node scripts/review-caching-website.mjs http://127.0.0.1:49833`: all eight
  targeted routes passed font/image readiness, screen/print bounds, no mirrored
  sprites, full-height bands and at least 24 rendered pixels of character
  separation. Adjacent-slide typography and the missing-font negative test
  passed. Evidence: `artifacts/reviews/caching-dark-arts/website-plyjCt/report.json`.
- No runtime errors, HTTP failures or unexpected external requests. The full
  review retains 122 known FloatingVue warnings; the existing pnpm virtual-store
  warning also remains.

No new PDF export, physical projector test or paired presenter rehearsal in
this pass. Browser evidence is not user visual approval. Preview is running at
http://127.0.0.1:49833/1. Stop for visual feedback.

## Continuous diagonal band, 2026-10-09

Faris rejected the short corner accent and requested the band pass through the
whole slide without characters overlapping it. Restored 100% slide height,
reserved the right-hand strip, moved avatars/ducks inward and narrowed the text
column. The cover uses a separate inset character column. No content, assets,
clicks or unrelated slide changes. DESIGN.md records the superseding rule.

`node scripts/review-caching-website.mjs http://127.0.0.1:60089` passed:
`artifacts/reviews/caching-dark-arts/website-DixuWO/report.json`.
The checker now asserts both top-to-bottom coverage and 24 rendered pixels of
horizontal separation from every full image box. All eight screenshots were
individually inspected: full bands, clear text/character spacing, visible
ZurichJS logos, no clipping. Closing remains unchanged and has no band.
Local font/image readiness, print bounds, no mirroring, unchanged adjacent
typography and missing-font detection passed. No runtime/HTTP failures or
unexpected external requests. `pnpm test` passed all 61 tests; the existing
virtual-store configuration warning remains. No new full-deck review, production build, PDF
or physical-display rehearsal for this CSS-only correction. Previous evidence
below is historical. Stop for visual feedback; preview http://127.0.0.1:60089/1.

## Website design and approved sprites, 2026-10-09

Faris requested drawing from faziz-dev.com and using the duck/avatar across
the slides. Slides-write keeps the argument and current approved outline
unchanged, SHA-256:
`6148e387df53859c7464c82efb516c392bdcc830fcb69962f54378e3f71926c1`.
Slides-review limits this to an eight-slide visual checkpoint before rollout.
Routes 1, 3, 6, 42, 45, 77, 109 and 121 use an opt-in website treatment:
bundled Figtree, yellow emphasis, blue-edged yellow bands and existing static
character poses. Other slides retain their typography, code, diagrams and
full-screen demos. Counts remain 121 slides / 172 states. Closing QR and photo
remain. No new artwork, dependency or animated sprite sheet.

The first targeted run `website-C1Jhck` captured all eight slides and passed
layout checks but failed because the new harness omitted wake-lock permission.
The harness now grants the same local permission as the existing review scripts.
Direct screenshot inspection also found that MagicHeading's inline-block
characters interrupted underlining; the opt-in CSS now decorates characters.
`pnpm test` passed all 61 tests. Targeted browser review:
`node scripts/review-caching-website.mjs http://127.0.0.1:60089`.
Final evidence: `artifacts/reviews/caching-dark-arts/website-oc8RbW/`.
Eight routes passed asset/font readiness, no mirrored images, screen/print
bounds and external-request blocking. The adjacent unchanged slide retains
Inter. A deliberate font-file block proves the checker rejects fallback text.
The first negative-test attempt (`website-aMTY75`) could not remove CSS-owned
FontFace entries; blocking the file on a fresh document fixed the test setup.
All eight final screenshots exactly match the individually inspected images
in `website-moCRIn`. Text, sprite silhouettes and visible chest marks were
checked in light/dark compositions; no overlap or clipping observed.
Preview: http://127.0.0.1:60089/1.

During review, Faris requested no sprite overlap with the diagonal band.
Repositioned the bands into short top-right corner accents on all seven banded
slides. The closing has no band. The targeted browser test now requires at
least 24 rendered pixels between the complete image box and the accent box.
This supersedes the original behind-character treatment and its screenshots.

Final targeted run `website-8dDoAb` passed all eight slides including the new
separation assertion. All eight final PNGs were individually inspected; no
band overlaps, text collisions or clipped sprites. ZurichJS marks stay visible.
`node --check scripts/review-caching-website.mjs` also passed.

`pnpm slides review caching-dark-arts` passed typecheck, production build,
172 states and 171 navigation checks. Exact report:
`artifacts/reviews/caching-dark-arts/2026-10-09T12-20-57.854Z-tFxEGB/report.json`.
This run spans the band-position follow-up: the production build and first
six styled screenshots show the earlier band position. Current evidence for
all eight styled routes is the final targeted run above. Full screenshot
coverage: 163 exact matches to inspected `2026-10-09T12-06-03.822Z-5GZOSi`,
six exact matches to inspected `website-oc8RbW`, two exact matches to inspected
`website-8dDoAb`, and demo route 46 inspected directly (native control display
differs). No baselines replaced. Report has zero runtime errors, HTTP failures
or unexpected blocked requests; 122 known FloatingVue warnings remain, as does
the existing pnpm virtual-store warning.

No PDF export, production rebuild after the band-only correction, physical
projector check, paired presenter synchronization or new motion-timing rehearsal
this pass. Stop for visual feedback under slides-review before broader rollout.

## Typing and interrupted thought, 2026-10-09

Faris explicitly requested replacing the flow-of-thought animation with typing
that falls behind, causes confusion and leads to backspacing. This scoped
request approves the current outline, SHA-256:
`6148e387df53859c7464c82efb516c392bdcc830fcb69962f54378e3f71926c1`.
Slides-write/edit preserve route 21 and its two clicks, with no new slide.

| Before | After |
| --- | --- |
| Dragging a task and saving | Typing shown beside its visible output |
| Three-second save interrupts work | Text falls three seconds behind, extra letters appear, then backspace corrects them |
| One-second response in the demo | Notes distinguish the general guideline from the much faster feedback typing needs |

The first click types with 70 ms feedback; the second starts the same way,
then delays output by three seconds. The typist repeats the final letter twice,
sees the queued letters arrive, and corrects them with two backspaces after
feedback recovers. CSS snapshots finish after 8.2 seconds, with no runtime
timers, loops, real keyboard capture or blocked navigation. Reduced motion,
deep links, reverse navigation and print show a readable correction snapshot.
All dialogue and timings are illustrative, not measured human behavior.

Initial unit run passed 60/61: the outline hash had not yet been recorded
here; rerun passed all 61 tests. Initial full review
`2026-10-09T12-05-15.085Z-VKhNG0` passed typecheck/build but sandbox denied the
local server; direct browser launch was also denied. Retried with local-browser
permission. The first targeted run, `response-DL3P6k`, passed animation checks
but found stale Markdown/notes in the old dev server. A fresh named-deck preview
resolved that, without weakening the notes assertion.

`node --check scripts/review-caching-response.mjs` passed.
`node scripts/review-caching-response.mjs http://127.0.0.1:55806` passed:
`artifacts/reviews/caching-dark-arts/response-fXyXnH/`.
Checks cover all seven response-example states, ten sampled typing moments,
real completion after 8.2 seconds, early interruption, reverse/deep links,
reduced motion, print and presenter notes. The unchanged 100 ms and ten-second
examples also passed, including real ten-second playback. No unexpected runtime
errors or external requests. All 26 targeted images are visually covered:
ten exact matches to inspected `response-LrrcRv` evidence, three exact matches
to newly inspected full-deck route-21 captures, and 13 directly inspected images.
No text overlap or clipping observed. No baselines changed.

`pnpm slides review caching-dark-arts` passed typecheck, production build,
172 states and 171 navigation checks. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-09T12-06-03.822Z-5GZOSi/`.
Source hash matches current Markdown. All 172 captures are visually covered:
169 exact SHA-256 matches to inspected `2026-10-09T11-55-49.228Z-g1pG9L`
evidence and three directly inspected route-21 states. No runtime errors,
HTTP failures or blocked requests. The 122 known FloatingVue warnings and
existing pnpm configuration warning remain.

No new PDF, physical projector check, paired presenter synchronization or
offline production rehearsal this pass. Preview:
http://127.0.0.1:55806/21?clicks=0. Stop for visual feedback under slides-review.

## Ethernet motion for a large screen, 2026-10-09

User requested slowing the Ethernet connection animation because its movement
was too brief to follow on a large, low-refresh-rate display. It previously
took only 60 ms. Playback now uses a shared 1,200 ms allowance plus 20 times
the range midpoint, making Ethernet 1,260 ms and each direction about 630 ms.
The allowance applies to all latency lanes so Ethernet does not appear slower
than broadband. The slowest example finishes in 4,000 ms. No extra clicks or
loops, no blocked navigation. The shared chart scale and numeric times stay
unchanged. The visible key says “Motion Slowed For Visibility”; speaker notes
clarify that motion preserves order rather than exact timing ratios.

`pnpm test` passed all 58 tests, including minimum duration, speed order and
maximum duration regression. `pnpm typecheck` and
`node --check scripts/review-caching-performance.mjs` passed.
`node scripts/review-caching-performance.mjs http://127.0.0.1:51134 latency`
passed nine states, four finite-motion cases, reverse/deep links, rapid
navigation, reduced motion, print and presenter checks. Evidence:
`artifacts/reviews/caching-dark-arts/performance-Npy84I/`.
All 19 targeted images were inspected, including Ethernet outbound and return
at 315 ms and 945 ms. The browser confirms the actual 1,260 ms duration.
No unexpected runtime errors or external requests.

`pnpm slides review caching-dark-arts` passed typecheck, production build,
172 states and 171 navigation checks. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-09T11-55-49.228Z-g1pG9L/`.
The source hash matches the current Markdown. No runtime errors, HTTP failures
or blocked requests; 122 known FloatingVue warnings and the existing pnpm
configuration warning remain. SHA-256 comparison against inspected
`2026-10-09T11-47-54.215Z-hyWS6b` captures gives 161 exact matches.
All nine changed latency states exactly match inspected targeted captures.
Demo frames 46 and 110 were inspected directly; their media controls differ
with loading progress, with no layout regression. All 172 full screenshots
are visually covered; no baseline changed.

This does not claim validation on the actual projector or low-refresh-rate
screen. No new PDF, paired presenter synchronization or offline production
rehearsal this pass. Preview: http://127.0.0.1:51134/61?clicks=0.
Stop for user visual feedback under slides-review.

## Duplicate request sequence removed, 2026-10-09

The user requested explaining the five requests within the client diagram
instead of repeating the explanation on separate request-status builds.
Approved outline SHA-256:
`2557c402c427b04056db4319e2496cba4b64bbee7fa8c1c71ad1f5183716913b`.

| Pass | Before | After |
| --- | --- | --- |
| Talk shape | Source 46 plus four request/retry clicks before the diagram | Source 45 leads directly to source 47, now route 43 |
| Notes | Upstream constraint and selective-retry bookkeeping on duplicate slide | Details retained in existing diagram notes, without extra clicks |

121 slides / 172 states. The diagram retains eleven clicks and unchanged
geometry, captions and animation. Code, media, shared theme and other content
stay unchanged. Removed only the slide entry, leaving its component and source
provenance recoverable. No new factual claims, so no new source research.
Slides-edit guided the duplicate cut. `pnpm test` passed all 57 tests twice.
`pnpm slides review caching-dark-arts` passed typecheck, production build,
172 states and 171 navigation checks. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-09T11-47-54.215Z-hyWS6b/`.
Source hash matches the current Markdown. No runtime errors, HTTP failures or
blocked requests. The report records 122 known FloatingVue warnings; the
existing pnpm configuration warning remains.

`node scripts/review-caching-architecture.mjs http://127.0.0.1:64190` passed
all 29 diagram states, forward/reverse/deep links, finite connector/mapping
motion, rapid navigation, print and presenter notes. Evidence:
`artifacts/reviews/caching-dark-arts/architecture-cbARcR/`.
The architecture, performance, technical, traffic and character-transition
review scripts now use the shifted routes. Only the architecture browser pass
was rerun here; the other four changed scripts passed `node --check`.
Older migration-era flow/motion/media helpers remain historical and need their
own route/selector audit before reuse.

Ran `node scripts/review-caching-cut.mjs` with the full and targeted evidence
directories above. `cut-visual-comparison.json` records pixel equality against
the inspected `2026-10-09T11-40-13.358Z-ob36qu` screenshots, excluding only the
60 × 40 px footer number region. All 172 full captures and 29 targeted states
match outside that region. Directly inspected the new 42/43/44 junction,
client steps 1/8/9, both motion captures, presenter view and all four print
captures. The print captures have 8–40 differing pixels and no visible layout
regression. All 172 full and 36 targeted images are visually covered. No
baseline was changed. The dependency-runtime lookup did not return promptly
and was stopped; pixel comparison uses the already installed browser instead.

No new PDF, physical projector rehearsal, paired presenter synchronization or
offline production playback rehearsal. Fresh preview:
http://127.0.0.1:64190/42. The diagram is now route 43. Stop for user visual
feedback per slides-review; do not expand scope.

## Response-time interactions, 2026-10-09

User authorized animations for 0.1, 1 and 10 seconds and a smooth workflow
interrupted by a longer pause. The recorded scoped outline SHA-256 is
`bfff31b7c4f9cd9eabbe33542486f789a34bc3ca09091aa2ef0b3a991b84d735`.
Slides-write/edit/review passes preserve the three source positions. Native
clicks 1/2/1 give 122 slides / 177 states. No artwork, package or media changes.

| Pass | Before | After |
| --- | --- | --- |
| Explanation | Three text-only response-time slides | Checkbox reaction; drag/save workflow; interrupted wait |
| Contrast | One-second claim only | One-second save, then three seconds on another click |
| Wording | Keep The User’s Flow Of Thought | A Short Wait. Keep Going. |

Delays are real 100/1,000/3,000/10,000 ms after the simulated action. The cursor
movement is an authored illustration, not a measured attention curve. Checked
Nielsen's primary response-time guidance; qualifications stay in spoken notes
and sources.md. The user may skip at any time. Static snapshots cover reverse
clicks, deep links, overview, reduced motion and print.

Initial 57 tests passed. Initial typecheck exposed that importing the Slidev
client entry point pulled its unconfigured internal sources into this repo's
typecheck. Switched to native Markdown context props, without weakening type
checks or adding declarations/dependencies. Typecheck then passed.
Targeted `response-Vdknza` passed timing seeks and static checks but failed the
long live wait. `response-9s58nH` caught an incorrect native active-page prop.
Changed to the installed Slidev 53 `$nav`/`$renderContext` template API.
`response-laTsdA` still saw old markup; inspecting the served Vue render
function confirmed the missing prop, so restarted the dev server at 59113.
`response-qqhZWa` isolated a live CSS completion bug: a one-millisecond
step-end effect could finish just short of its final value due to timing
precision. Changed those near-instant opacity updates to linear interpolation.
Stopped full run `2026-10-09T11-36-43.457Z-Sr5bu1` before this component edit;
it is interrupted evidence, not a successful review.

`response-LsorQb` passed the machine checks, but visual inspection found two
cursors during the interrupted drag. Corrected CSS selector specificity and
added a regression assertion that the distracted cursor stays hidden during
dragging. Stopped full run `2026-10-09T11-37-46.945Z-6zk1CV` before this edit;
it is also interrupted evidence, not a successful review.

Final targeted command:
`node scripts/review-caching-response.mjs http://127.0.0.1:59113`.
Evidence: `artifacts/reviews/caching-dark-arts/response-LrrcRv/`.
Passed all seven click states, real CSS delays, finite motion, complete live
ten-second playback, early navigation, reverse/deep links, reduced motion,
print emulation and presenter notes. No unexpected runtime/HTTP errors or
external requests. All 20 PNGs are visually covered: 16 exact SHA-256 matches
to individually inspected `response-LsorQb` images, plus direct inspection of
the four changed drag/wait captures. No clipping, overlap or duplicate cursor.
`pnpm test` passed 57/57 tests, including a final rerun after the cursor fix.

`pnpm slides review caching-dark-arts` passed typecheck, production build,
all 177 states and 176 navigation checks. Final full evidence:
`artifacts/reviews/caching-dark-arts/2026-10-09T11-40-13.358Z-ob36qu/`.
Reviewed Markdown SHA-256 matches the current source. All 177 screenshots are
visually covered: 170 match individually inspected evidence from
`2026-10-09T11-22-10.501Z-wgbzfb` exactly, and the seven changed 20–22 states
match the inspected targeted `response-LrrcRv` captures exactly. No runtime
errors, HTTP failures or blocked external requests. The report records 123
known FloatingVue warnings; the existing pnpm configuration warning remains.
No PDF, physical projector rehearsal, paired presenter synchronization,
separate overview interaction test or offline production rehearsal this pass.
Preview remains http://127.0.0.1:59113/20?clicks=0. Press Right Arrow to play;
route 21 has a second click for the slower save. Native navigation may skip any
wait. Per slides-review, stop for user visual feedback before expanding scope.

## Ethernet and simple network wording, 2026-10-09

User clarified that LAN meant an Ethernet connection, not a local server.
Scoped `slides-edit` / `humanize-writing` pass on routes 62–64 only. Preserved
the established layout, icons, ranges, finite animations and 122 / 173 totals.
AGENTS.md now records the preference for plain audience wording rather than
instructions about constructing the visual. No new measurements or claims of
typical Ethernet RTT. Notes explain Ethernet and broadband can overlap.

| Pass | Before | After |
| --- | --- | --- |
| Meaning | Local Network / LAN | Ethernet / Wired Connection Example |
| Titles | The Network Label Is Not The Whole Story | What About 4G And 5G? |
| Captions | Keep The Same Time Axis. Now Add Mobile Networks | Mobile Connections; then each revealed range, overlapping times, slow example |
| Labels | Distant / Congested Path; Midpoint Timing | Slow Connection Example; Animation Slowed 20× |

`pnpm test` passed all 55 tests. Targeted check:
`node scripts/review-caching-performance.mjs http://127.0.0.1:53652 latency`.
Evidence `artifacts/reviews/caching-dark-arts/performance-ni0CsN/` passed all
nine states, reverse/deep links, reduced motion, print, finite motion on 63/64,
rapid reverse navigation and presenter notes. All 15 PNGs individually inspected:
nine click states, three print states, two motion captures and presenter view.
No clipping/overlap or unexpected browser/network errors. Existing caught
FloatingVue warnings remain.

`pnpm slides review caching-dark-arts` passed typecheck, production build,
all 173 states and 172 navigation checks. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-09T11-22-10.501Z-wgbzfb/`.
Reviewed source hash matches the current Markdown. No runtime errors, HTTP
failures or blocked external requests; 123 known warnings are recorded.
Visual coverage: 163 PNGs match inspected `2026-10-09T10-18-42.253Z-8veJER`
evidence byte for byte. All nine changed 62–64 captures exactly match the
individually inspected targeted captures. Demo `111-000.png` was inspected
directly; its native video buffering bar differs, not the source recording.
No new PDF or physical presentation rehearsal requested. Stop for user feedback.

## Vocabulary preference, 2026-10-09

User requested concrete wording on the ingress/egress slides. `humanize-writing`
and `slides-edit` kept the edit to labels, accessible descriptions and notes.
Recorded the ongoing vocabulary/punctuation preference in AGENTS.md. Internal
component/CSS identifiers and historical artifact paths remain intact.

### Changes

| Pass | What changed | Examples |
| --- | --- | --- |
| Vocabulary | Direct server wording | Diagram heading now “Our Server”; notes say “Data entering the BFF is ingress” and “Data leaving the BFF is egress” |

Routes 90/91 only; layout, finite animations and 122 slides / 173 states unchanged.
An existing unit test asserted the old wording; updated it to assert the same
BFF perspective using the requested phrasing. Added a regression for visible
labels, accessible descriptions and notes. Browser checks now assert the new
label and presenter wording.

`pnpm test` passed all 55 tests. The first targeted browser run `boundary-1T1oPd`
failed because the new accessibility selector matched nested icon SVGs as well
as the main diagram. Narrowed it to the direct-child SVG and reran
`node scripts/review-caching-boundary.mjs http://127.0.0.1:65525`.
Final targeted evidence `boundary-0CZdep` passed all four click states,
forward/reverse/deep-link navigation, finite motion, print, reduced motion and
presenter notes. All 11 PNGs individually inspected, including both motion
captures and neighboring slides. No overlap/clipping or unexpected errors;
existing caught FloatingVue warnings remain.

`pnpm slides review caching-dark-arts` passed. Full evidence:
`artifacts/reviews/caching-dark-arts/2026-10-09T10-18-42.253Z-8veJER/`.
Typecheck, production build, all 173 states and 172 navigation checks passed;
the final source hash matches the reviewed source. No runtime errors, HTTP
failures or blocked external requests. The report records 123 known warnings.
All 173 PNGs visually covered: 168 are byte-identical to previously inspected
`2026-10-09T10-11-14.436Z-jjHnb4` evidence. Individually inspected the remaining
five: `047-000`, `090-000`, `090-001`, `091-000`, `091-001`. The demo capture
differs only in native video loading/buffering state; all four diagram states
show the new label with clean spacing and no overlap or clipping.
No PDF or physical presentation rehearsal this pass. Stop for user feedback.

## Approved refinements 1–4 and punctuation, 2026-10-09

This uses the numbering in the conversational review, not the differently
numbered internal priority list below. User approval covers upstream constraints,
HTTP errors, prefetch and infrastructure/initial-window claims. Measurement
critique 5 remains deferred. Approved outline SHA-256:
`65948688e1c44547e6c352c463141b4ade7aa21506d1e17e22677752afb34b96`.

| Routes | Before | Applied |
| --- | --- | --- |
| 2, 42 | Em-dash separators | Colons or natural sentence joins; scan all editable slides/notes/components |
| 43, 117 | No new endpoint; dismissive closing answer | Cannot change the upstream API; yes, if we can change it |
| 73, 98, 106 | JSON consumed for any HTTP status | Throw on non-OK responses before JSON; pass AbortSignal to fetch |
| 98, notes | QUANTITY unit unclear | Five upstream requests, confirmed by Faris |
| 104 | Fetch before point of need | Same navigation origin, server work, first byte, HTML, hydration, chart |
| 105–108 | Generic server cache, implicit cancellation, load balancing | Per-request Query state, explicit race/abort, fresh hydration avoids immediate refetch |
| 93–94 | Broad provider throughput/startup/lifetime ranges | Deployment placement, runtime variation and measured request latency |
| 54–60 | Universal 14/46 KB and exact stall language | Scoped TCP example, no universal byte threshold, conditional extra RTT |

Faris confirms createPrefetch uses Promise.race and cancellation. The deck now
shows an explicit callback AbortSignal contract. The real helper source is still
absent, so that revised example interface is not a claim of recovered original
code. The 2,500 ms value stays the code example, not a universal recommendation.
Configured BIRTHDAYS_API_URL replaces development-only localhost; notes explain
the shared server function alternative. No deployment or benchmark is invented.
Original recordings and raster media remain byte-identical; embedded text inside
those assets is not rewritten by the editable-text punctuation sweep.

Validation:

- `pnpm typecheck` passed; `pnpm test` passed all 54 tests, including rerun after
  the final contrast edit. Three tests execute the actual displayed fetch
  callbacks for success, HTTP 429/500, signal forwarding and rejection
  propagation. They stub the absent custom helpers and are not integration tests.
- `node scripts/review-caching-technical.mjs http://127.0.0.1:62293` passed
  bounds, visible punctuation, static print, finite animation and reverse clicks.
  Final evidence: `artifacts/reviews/caching-dark-arts/technical-dLDP7l/`.
  All 17 images visually covered: six screen captures match the inspected first
  run, the final 107 screen and three in-motion captures were inspected directly,
  and all seven print captures are byte-identical to their covered screen images.
- The first targeted run `technical-ZwG8C5` passed automated checks but visual
  inspection caught low-contrast inline code on 107. Replaced that styling with
  blue bold emphasis. `technical-5WbuLj` exposed a stale dev-server render of
  that change; restarted preview before the final successful targeted run.
- First full run `2026-10-09T10-05-39.330Z-kEVL2F` completed 173 states and 172
  navigation checks without state/runtime/HTTP/external-request failures, but
  correctly failed its stable-source guard because the contrast edit happened
  during the run. The next run `2026-10-09T10-09-50.791Z-PLzQ0w` passed build
  and typecheck but could not bind loopback inside the sandbox. Reran with the
  required local-browser permission.
- Final `pnpm slides review caching-dark-arts` passed: typecheck, production
  build, all 173 states and 172 navigation checks across 122 slides. Evidence:
  `artifacts/reviews/caching-dark-arts/2026-10-09T10-11-14.436Z-jjHnb4/report.json`.
  Source hash matches the final Markdown. No state/runtime/HTTP/external-request
  failures; 123 known caught FloatingVue warnings recorded separately.
  All 173 screenshots visually covered: 172 match the first run byte-for-byte;
  final 107 was directly inspected. First-run coverage used byte-identical
  matches to the previously reviewed `2026-10-09T09-38-14.959Z-yTN76g`,
  `boundary-yHHA0i` and inspected technical captures, plus individual inspection
  of 2, 42, 43/0–4, 54–58, 60, 73, 93–94, 104/0–2, 105/1–5 and 117.
  No new overlap, clipping or unreadable text remains in this scoped revision.

No PDF export, physical projector rehearsal or presenter/audience synchronization
test this pass. Original helper integration and measured deployment behavior
remain unverified. Known caught FloatingVue and pnpm configuration warnings are
unchanged. Stop for visual feedback per `slides-review`, not further critique
implementation. Final preview: `http://127.0.0.1:62293/104?clicks=0`.

## Softer character motion — 2026-10-09

The user found character Magic Move too fast/aggressive. Scoped adjustment in
`MagicHeading.vue`: 760 ms `cubic-bezier(.45,0,.25,1)` movement, replacing
420 ms `cubic-bezier(.22,.61,.36,1)`. Snapshot opacity uses 320 ms ease-in-out;
root group remains 320 ms. No new delay, stagger, bounce or navigation gate.
Character matching, content, 122 slides/173 states and diagram motion unchanged.

Commands run: `pnpm typecheck`, `pnpm test` (49 passed),
`pnpm exec slidev build decks/caching-dark-arts/slides.md --out dist/caching-dark-arts`,
and `node scripts/review-caching-magic.mjs http://127.0.0.1:55873`.
Typecheck/build passed. First targeted run `magic-UscXdK` failed a new easing
assertion because CSS animation easing resides on the keyframe, not the effect's
overall timing. Corrected the checker to inspect the actual keyframe easing,
without relaxing the expected curve or duration. Final run `magic-MZQwRO`
passed with errors/blocked requests empty. Existing caught FloatingVue errors
remain filtered; pnpm still warns about global-store configuration.

Read `artifacts/reviews/caching-dark-arts/magic-MZQwRO/report.json` and inspected
all 14 PNGs individually: six mid-motion/settled pairs plus presenter and print.
Pairs: 7↔8, 62↔63, 63↔64, 82↔83, 103↔104, 46↔47. Five text pairs assert the
actual 760 ms duration and exact easing. Rapid consecutive navigation/reversal,
presenter, overview isolation, reduced motion, print and unsupported-API fallback
passed. Character crossings remain inherent in the existing per-letter matching,
including large layout changes; this is a timing refinement, not a new matcher.
Settled text is intact and unclipped. No full 173-state review, new PDF or
projector/live-performance rehearsal this pass. `slides-review` keeps this at a
human visual checkpoint. Preview: `http://127.0.0.1:55873/7`.

## Ingress and egress animation — 2026-10-09

User-authorized scope: animate the existing ingress/egress definitions, routes
90/91 (source 93/94). Outline SHA-256:
`573962545ca05f6bdcb2485e639dfcc959de70facc6a9250fe26f9bb179139ba`.
Two one-click builds use deck-local `BoundaryTraffic.vue`, existing icons and
the existing content layout. The BFF is the explicit reference boundary.
Incoming response data remains visible on the egress slide; only the outgoing
leg animates there. Packet dots are schematic, not a size/rate/billing claim.
The 122 routes remain unchanged, now with 173 native states. No unrelated
technical/editorial recommendations below have been applied.

Commands actually run:

- `pnpm typecheck` — passed.
- `pnpm test` — 49 tests passed, including source order, click/notes and boundary regression.
- `pnpm exec slidev build decks/caching-dark-arts/slides.md --out dist/caching-dark-arts` — passed.
- `node scripts/review-caching-boundary.mjs http://127.0.0.1:64668` — failed waiting for the new component; that existing preview still served old content. Evidence retained in `boundary-cbbssi`.
- `pnpm slides dev caching-dark-arts` — fresh preview at `http://127.0.0.1:55873` (session 23055).
- `node scripts/review-caching-boundary.mjs http://127.0.0.1:55873` — passed.

Evidence: `artifacts/reviews/caching-dark-arts/boundary-yHHA0i/report.json`.
All 11 PNGs individually inspected at full size: four click states, two print
states, two in-motion captures, two neighboring section slides and presenter.
No clipping or overlaps. Checks cover forward/reverse/deep links, retained
ingress, stable anchors, finite motion, rapid reversal, reduced motion, print
emulation, and visible presenter notes. Unexpected runtime/HTTP errors and
blocked external requests: zero. Ten instances of the existing caught
FloatingVue warning are recorded separately. Existing pnpm global-store warning
remains; no dependency changes made. No PDF regenerated, full 173-state browser
rerun, projector test or presenter/audience synchronization rehearsal this pass.

The `slides-write` pass kept the change to two existing source beats; the
`slides-review` pass requires human visual feedback before further expansion.
The previous full-deck evidence below is historical, not a claim that the new
173-state deck has received another whole-deck run. Stop for user visual review.

## End-to-end editorial and technical critique — 2026-10-09

Review-only pass requested by the user. No slide, component, media or theme
changes. The user reports presenting roughly 128 slides in 23 minutes; do not
recommend reducing the count merely to satisfy a generic slides-per-minute
rule. Rehearse explanation density and new click builds at that delivery pace.
Current browser route numbers are used below (source IDs after 24 are +3).

Read all slide Markdown/notes, brief, outline, provenance and validation record.
Reused the complete visual evidence from the preceding implementation pass;
reopened 14 full-size captures for the detailed content critique: 44/11, 71/5,
97/4, 105/5, 64/3, 93/0, 98/0, 104/3, 48/0, 70/0, 96/0, 115/0, 117/0, 122/0.
Verified the Markdown SHA-256 still matches the successful 171-state report
`2026-10-09T09-38-14.959Z-yTN76g/report.json`. Did not rerun the unchanged
whole-deck browser suite, export a PDF, conduct an audience comprehension test,
watch a timed live delivery, or validate the original demo application's logic.
The presentation/edit/review guidance separated visual readiness from factual
approval; the writing pass preserved intentional fragments, emphasis and Start Case.

### Overall assessment

Keep the central progression: fixed API constraints, client fetching, server
aggregation, client cache, earlier server fetching, and the airplane callback.
The cumulative architecture is the strongest teaching device. Editable, legible
code and native full-canvas demos support it. Biggest remaining improvements:
make constraints explicit, align code with the resilience story, distinguish
measured results from models, and give the ending a concrete engineering rule.

| Routes | Assessment and proposed refinement |
| --- | --- |
| 1–16 | Strong personal setup and localhost/real-world contrast. Explain the referent and time period of 620,000 Miles verbally. Seed the chart problem early so the setup has a destination. |
| 17–24 | Nielsen thresholds are supportable guidelines; 0–2 seconds as a universal golden window is not established. Google bounce figures have a 2017 mobile-site context, not a dashboard-specific causal guarantee. |
| 25–38 | API ownership is relevant; public/internal/product categories are not mutually exclusive quality guarantees. Present auth/versioning anecdotes as examples, not definitions. |
| 39–53 | Strong, concrete problem. Route 43's “No New Endpoint” conflicts with adding a BFF unless it explicitly means no change to the upstream API. Five parallel requests assumes independently addressable pages/batches. |
| 54–65 | Useful latency intuition. Initial-window claims need transport, connection and byte scope. Measured mobile medians and selected LAN/WAN scenarios are labeled but a shared axis can still imply a matched experiment. |
| 66–80 | Strongest solution segment. Retain the mapping-node move and shaped-response reveal. “Failure Isolation” overclaims what a single browser request achieves. Measure payloads on the same basis. |
| 81–94 | Transfer arithmetic is coherent as a model, not observed end-to-end timing. FaaS/IaaS numerical comparisons require major qualification or replacement with actual deployment evidence. |
| 95–111 | Cache semantics are mostly carefully framed; code and prefetch timeline need tightening. Library feature screenshot is too small to teach from at speed. Hydration is not load balancing. |
| 112–122 | Photos are memorable and should stay full-bleed as requested. They establish conditions, not a controlled improvement. Answer the backend objection directly, then close with a practical decision rule before the personality-led ending. |

### Highest-priority corrections to propose (not applied)

1. **HTTP errors, routes 73/98/106.** `fetch` followed by `res.json()` can
   resolve successfully for a 429/500 JSON response. A local read-only Node
   experiment using `new Response(..., { status: 500 })` confirmed this exact
   response-handling behavior. Add an `ok` check that throws. The Query example
   should consume its AbortSignal if cancellation is part of the explanation.
   https://tanstack.com/query/latest/docs/framework/react/guides/query-functions
   https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
2. **Prefetch, routes 104–109.** The timeline resembles work before user intent,
   while the code runs at request time in `getServerSideProps`. Show navigation,
   server wait/TTFB, HTML, hydration and usable chart on a common clock. “Server
   Cache” should mean request-scoped Query state, not an implied persistent
   cross-request cache. The current `new QueryClient()` per request is appropriate.
   `createPrefetch`/`optionalQuery` are omitted custom helpers, so the 2,500 ms
   wait, abort behavior and fallback cannot be validated from this repository.
   `localhost:3000` is a development assumption; a shared server data function
   can avoid a self-HTTP call. “Load Balancing” (108) should describe hydration
   avoiding a separate client fetch, not claim reduced total bytes or backend work.
   https://tanstack.com/query/latest/docs/framework/react/guides/ssr
   https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props
3. **Infrastructure, routes 93–94.** Do not imply 1–5/2–25 Gbps are guaranteed
   per-request API rates, 100 ms–2 s applies to all named runtimes, or a 5–60
   minute warm lifetime is a contract. Cloudflare isolates differ from the VM
   model; AWS does not guarantee environment retention; Vercel's standalone
   Edge Functions naming is deprecated. Instance bandwidth also differs from
   single-flow and internet-path throughput. Prefer one measured deployment
   and discuss placement, upstream latency and startup variability.
   https://developers.cloudflare.com/workers/reference/how-workers-works/
   https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html
   https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html
   https://vercel.com/changelog/edge-middleware-and-edge-functions-are-now-powered-by-vercel-functions
4. **Initial window, routes 54–65.** RFC 6928 supports the ten-segment TCP
   example, not a universal 46 KB CDN rule. QUIC has separately specified initial
   limits. Clarify new versus reused connection, compressed/transferred bytes,
   shared connection traffic and startup overhead. “Stall Cost = 1 RTT” is a
   simplified example, not an invariant. The useful conclusion is reducing
   critical transfer and round trips, not chasing an unverified byte threshold.
   https://datatracker.ietf.org/doc/rfc6928/
   https://www.rfc-editor.org/rfc/rfc9002.html#section-7.2
5. **Claims versus measurements, routes 48/80/81–88/112–115.** Verify 1.58 MB,
   300 bytes and “80% unused” from comparable bodies/HARs: compression, headers,
   all five responses, same records and same output. Field removal and aggregation
   are different savings; 80% unused must not be presented as the total reduction
   to 300 bytes. Flight photos/speed test establish a poor path, not application
   before/after timing. Preserve them and add measured evidence only if available;
   otherwise frame this section as a field experience rather than benchmark proof.

### Supported claims and important limits

- Routes 20–22 accurately paraphrase Nielsen's approximate 0.1/1/10 second
  guidelines. They are not hard universal thresholds.
  https://www.nngroup.com/articles/response-times-3-important-limits/
- Routes 23–24's 32% and 123% are traceable to Google/SOASTA's 2017 mobile
  research. They are relative increases, not percentage-point changes or a
  prediction for this dashboard. Keep historical context in supporting notes.
  https://www.thinkwithgoogle.com/_qs/documents/1632/au-mobile-page-speed-new-industry-benchmarks.pdf
- Route 64's 18–23 ms 4G and 15–21 ms 5G ranges match Ofcom's 2025 ranges
  across UK operator medians. LAN/broadband examples are not from that study.
  https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/telecoms-research/mobile-matters/2025/mobile-matters-2025.pdf
- The transfer totals match the declared decimal-byte rates plus assumed 200 ms.
  This does not establish real network latency, TLS cost, server work or p95.
- Query freshness, configurable retries and background refetch are sound concepts.
  `staleTime` is not cache retention; expiry alone does not force an immediate
  refetch. `isFetching` includes background fetching. BFF and Query are independent
  options; Query can also manage direct upstream requests without a BFF.
  https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

### Specific editorial/visual suggestions

- 43: “No New Endpoint” → “We Cannot Change The Upstream API”.
- 74: “Failure Isolation” → “One Client Request”; upstream failures still exist.
- 77: “Minimum Viable Values” → “The Twelve Counts The Chart Needs”.
- 101: “Rerenders” → “Refetching And Freshness”.
- 108: “Load Balancing” → “Hydrate Instead Of Refetching”.
- 117: “That’s Not The Point” → “Yes—If We Can Change It”, followed by the
  actual constraint. This answers a valid simpler-solution objection directly.
- 118–121: retain the short personality-led closing; give “Be Pragmatic” a
  concrete rule such as “Change The API If You Can. Shape Its Response If You Can’t.”
- 71: ALL/ONLY FAILED labels remain in the BFF diagram; visibly label selective
  upstream retry as requiring a BFF contract, rather than relying only on notes.
- 105: keep familiar nodes but dim/label the client request as the fallback when
  server hydration succeeds. The final combined graph currently exposes both paths.
- 96: replace the small feature-list screenshot with only the capabilities used
  in this case study if refinement is approved; preserve the original as provenance.
- Character transitions match repeated characters, not semantic words. Test them
  at the speaker's actual pace; shorten or selectively simplify if unrelated
  headings feel busy. No automatic motion removal recommended.

### Further validation before public delivery

Request the demo application source or traces for the next technical pass.
Verify `QUANTITY = 5` means five batches, not five users; five requests fetch
distinct records; the twelve buckets total 5,000; HTTP 429/500 produces the
intended error/retry behavior; cache keys include relevant parameters; fresh,
stale, missing and invalidated paths work; SSR uses isolated per-request state;
timeout cancels or otherwise accounts for outstanding upstream work; hydration
does not cause an unintended duplicate fetch. Compare time-to-usable-chart,
TTFB, transferred bytes and request counts across the same dataset and conditions,
including cold/warm runs. Do not invent a precise original timeout to resolve
the source's historical 1,000/2,500 ms discrepancy.

Operational gates still open: rehearsal using the audience video's controls
(presenter playback is independent), full offline production rehearsal, projector
legibility, QR destination and scan check, current speaker-role wording, and a
fresh static export after approved content refinements. Rendering tests and
TypeScript syntax checks are not application correctness tests.

## Character transitions — 2026-10-09

The user's request for character-level Keynote Magic Move, followed by “go on”,
approves the deck-local transition enhancement. Current approved outline SHA-256:
`76dcc01a3cf54ed347dd15121c2c35beebd65acd3992e89029e0e14379bd0d25`.
Slidev 53's documented `view-transition` handles navigation. A Markdown renderer
hook decorates H1s without changing the authoring syntax; a Vue component keeps
emphasis and adds stable grapheme/occurrence identities. Photos, videos, code and
body text fade. This approximates Keynote rather than importing its matching
algorithm. No runtime dependency or shared-theme changes. Targeted and whole-deck
review passed. Awaiting user visual approval.

Official extension points checked against documentation and installed source:
- https://sli.dev/guide/animations#view-transition-api
- https://sli.dev/custom/config-vite
- https://sli.dev/custom/config-vue

Initial integration failures are retained as evidence: the two-script Vue
renderer needed a setup-compatible wrapper; the first transition assertion
compared an array instead of its length. Rapid navigation then exposed Slidev's
unobserved `ViewTransition.ready` AbortError. The deck setup now observes that
promise, tolerating only the exact expected cancellation and reporting other
errors. This does not replace routing or suppress general runtime errors.

## Explanatory performance motion — 2026-10-09

The user's “do all” authorizes the six proposed visual types. Updated approved
outline SHA-256: `9520a0f5ee842113041900bc7a45bb3d9dec71dc82dbd83a81ffb8489c44911d`.
122 slides remain; thirteen existing slides gain 24 native clicks. Existing
architectures, demos, theme and art are untouched. New components are local to
the deck. Targeted browser review passed; no user visual approval claimed.

| Before | After |
| --- | --- |
| Constraint as prose | Five simultaneous lanes, failures, ALL vs ONLY FAILED |
| Separate LAN/broadband/mobile figures | Cumulative icons, RTT bands and round-trip pulses |
| 80–200 ms presented broadly as mobile latency | Explicit poor-path scenario, separately scoped measured operator medians |
| Payload statement | Records, server aggregation, small response |
| Download totals without arithmetic | Same-payload fills with an explicit 200 ms fixed-cost model |
| Caching statement | Miss, fresh hit, stale-data refetch paths |
| Prefetch statement | Relative on-demand and earlier-start timelines |

The slides-edit factual pass keeps measurements, chosen scenario rates and
schematic timing distinct. No invented birthday distribution or measured
prefetch savings. The supplied payload/timing magnitudes remain, now explained
as an explicit model rather than verified performance. Sources and limits are
in sources.md. Typography and visible copy retain the user's Start Case rule.

### Motion validation and handoff — 2026-10-09

Commands actually run:

- `pnpm typecheck`, `pnpm test`, and `pnpm exec slidev build
  decks/caching-dark-arts/slides.md --out dist/caching-dark-arts`: passed;
  48 tests passed, including another test run after the media-readiness fix.
- `node --experimental-strip-types scripts/review-caching-performance.mjs`:
  final evidence `performance-gRGBN3/`. All 37 states, reverse/deep links,
  bounded motion, rapid reverse, reduced motion, print and presenter checks
  passed. All 57 PNGs individually inspected.
- `node --experimental-strip-types scripts/review-caching-magic.mjs`:
  final evidence `magic-FbPfm2/`. Six transition pairs, reverse/rapid navigation,
  presenter/overview isolation, reduced motion, print and unsupported-API
  fallback passed. All 14 PNGs individually inspected.
- `node --experimental-strip-types scripts/review-caching-final.mjs
  http://127.0.0.1:64668`: final evidence `final-ZnEmp5/`. Actual playback
  advances and pause works on all three local videos (47/79/111). Corrected
  “Fewer Bytes Help” grammar and “Stale Result Available” label checked in
  screen/print states. All 11 PNGs individually inspected. No page errors or
  blocked traffic. An earlier copy assertion exposed stale Vite preview output;
  a fresh preview and this passing rerun verify the current files.

All evidence folders above are under `artifacts/reviews/caching-dark-arts/`.
The first full run, `2026-10-09T09-28-42.281Z-ctfMBP/`, captured 171 states.
134 were individually inspected; 37 match the already individually reviewed
performance captures byte-for-byte. No new clipping/overlap found. That run
failed one video-readiness check on route 47, with no runtime, HTTP or external
traffic failures. The review harness could query an empty video list before
the async slide mounted; it now waits for the visible layout before checking
media. Readiness requirements have not been relaxed. Failed runs remain saved.

Final `pnpm slides review caching-dark-arts` rerun passed typecheck, production
build, all 171 states across 122 slides and 170 navigation checks. Evidence:
`2026-10-09T09-38-14.959Z-yTN76g/`. No state, runtime, HTTP or blocked-request
failures. 166 screenshots match the visually covered preceding run byte-for-byte;
the five changed captures (47/0, 88/0, 88/1, 100/3, 111/0) were individually
opened and inspected. Differences are corrected copy and native video controls.
No new clipping or overlap; no baselines replaced. All 171 states are visually
covered, but the report correctly leaves human visual approval pending.
Known caught FloatingVue and pnpm store-setting warnings remain. No new PDF
export was made in this pass; print screenshots are not a PDF export. Full
offline production rehearsal, factual approval and timed rehearsal remain
pending. Live preview: http://127.0.0.1:64668/62?clicks=0.
The slides-review visual checkpoint requires stopping for the user's feedback
after this review; no additional scope is authorized by a passing report.

## Cumulative animated architecture — 2026-10-08

User requested skill research and an animated, cumulative redesign of all four
architectures. Source 47/74/100/108 (routes 44/71/97/105) now share one renderer
and pure snapshot model. Each successor opens on the preceding final state;
familiar blocks do not replay. Mapping moves to the server, then payload,
Query state, and prefetch/hydration are added on native clicks. Counts are
11/5/4/5. No slide-count change, installed dependencies or generated artwork.
Approved amended outline SHA-256:
`34ceb28549e9ec6086f9900754b1a5ace2280376197ec38024bfffe0c52a5460`.

Skill discovery used the skills.sh leaderboard and inspected source guidance.
Anthropic frontend-design (964.5K installs, directory lists 180K repo stars)
and antfu's Slidev skill (13.8K installs, 5.9K repo stars) are established options.
The upstream Slidev skill/docs supply the native click approach; frontend-design
informs restrained, subject-specific motion and review. Existing Faris branding
overrides their generic defaults. The specialist architecture-diagram skill
from proyecto26 has only 284 installs/83 repo stars and was not adopted.
No skill was installed globally or in protected project directories.
Research references (counts are the directory snapshot, not quality guarantees):
- https://skills.sh/anthropics/skills/frontend-design
- https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- https://skills.sh/antfu/skills/slidev
- https://github.com/slidevjs/slidev/blob/main/skills/slidev/SKILL.md
- https://skills.sh/proyecto26/system-design-skills/architecture-diagram
- https://sli.dev/guide/animations
- https://tanstack.com/query/latest/docs/framework/react/guides/ssr
- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

Semantic limits: browser retry of a BFF does not automatically retry only failed
upstream calls. Query persistence needs setup. Freshness/refetch depend on
configuration. Prefetch timeout is an alternative to successful hydration,
not a subsequent stage of it. Existing uncertain timeout duration is not guessed.
Visual review shortened two tight node labels and moved connector labels away
from recovery lines. Earlier entries remain historical.

Validation actually run:

- `pnpm test`: 42 tests passed (including exact inherited snapshots, stable
  anchors, build order and deterministic reverse steps).
- `pnpm slides review caching-dark-arts`: typecheck, production build and all
  147 browser states passed; no runtime, HTTP or blocked-request failures.
  Evidence: `artifacts/reviews/caching-dark-arts/2026-10-08T21-38-13.749Z-beREZG/`.
  This full run precedes the final connector-label position adjustments only.
- `pnpm typecheck`: passed again after the first label-position adjustment.
- `node --experimental-strip-types scripts/review-caching-architecture.mjs
  http://127.0.0.1:65002`: final run passed all 29 architecture states, forward
  and reverse clicks, deep links, node text fit, reduced motion, print-media
  states, bounded line draw, mapping translation, rapid navigation and native
  presenter notes/unique marker IDs. No blocked traffic or page errors.
  Final evidence: `artifacts/reviews/caching-dark-arts/architecture-Eo2CqI/`.

Individually inspected all 29 states across the review iterations, four print
captures, two in-motion captures and presenter view. Rechecked all four diagrams'
recovery states and presenter view after the final label adjustments. Of the
118 non-architecture slide captures, 117 are byte-identical to the previous
reviewed full run. The remaining demo-3 capture was opened and inspected; its
difference is the native paused-video loading indicator. Comparison is saved
in `unchanged-slide-comparison.json` inside the full-review directory.
No screenshot baselines were replaced. The earlier `architecture-ld8zcn` and
`architecture-2JvaTG` failures were test-harness assumptions about Vue-scoped
animation names and CSS numeric units, corrected before the passing runs.
A sandbox Chromium launch failed; the authorized browser rerun succeeded.

Known caught FloatingVue and pnpm store-setting warnings remain. Print-media
screenshots are not PDF export; no new PDF was generated for this diagram pass.
Factual approval and timed rehearsal remain pending. The older
`review-caching-flow.mjs` is historical; use the new architecture review script
for the replacement renderer. DESIGN.md and PLAN.md record the current contract.
Live preview: http://127.0.0.1:65002/44?clicks=0. The slides-review skill's visual
checkpoint now applies: stop for user feedback before further refinement.

## Technology introductions removed — 2026-10-08

The user explicitly requested this cut, assuming audience familiarity. The
editing pass removes only the three introductory slides, not the later Query
examples. Updated approved outline SHA-256:
`04de3993f57bf1c9af64e4a091f53c3696218d42a7d3b9e643b4d1df71537e99`.

| Original source | Before | After |
| --- | --- | --- |
| 25 | Technologies | Removed |
| 26 | Next.js / The React Framework | Removed |
| 27 | TanStack Query / Asynchronous State Management | Removed |

122 slides remain. Source 24 leads directly into API Types (source 28, route
25). Later routes shift down by three; original sourceSlide identifiers and
media manifest references stay intact. The flow is route 44, demos are
47/79/111, and the three full-canvas results images are 113–115. Regression
checks now use original source identifiers rather than positional assumptions.
Validation: `pnpm test` passed 38 tests; `pnpm slides review caching-dark-arts`
passed typecheck, production build and all 133 browser states, with no runtime,
HTTP or blocked-request failures. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-08T21-20-54.226Z-xO90Ml/`.
Inspected the new junction (24–26) and three video screenshots at full size.
Pixel comparison against previously inspected captures confirms the other 130
states are identical outside the bottom-right slide-number region (x >= 1750,
y >= 1000); the three video differences are native controls/loading animation.
The photo comparison uses the newer full-canvas photo captures. Comparison
details are saved in mapped-pixel-comparison.json; no baselines were replaced.
The known caught FloatingVue and pnpm setting warnings persist. No PDF export
was requested or generated for this cut. Factual review and rehearsal remain
pending. Current live preview: http://127.0.0.1:60828/24.
Historical review entries below describe earlier revisions. Stop for feedback.

## Full-slide real-world results photographs — 2026-10-08

User requested image-only slides after “What About Real-World Results?”. Slides
116/117/118 now reuse the existing native none layout and caching-photo class:
full-canvas cover fit, no heading, caption, footer or slide number. Slide 115
is unchanged. The in-flight photo, flight map and speed-test source pixels and
accessible alt text are unchanged. Text within the original images remains.
The central crops preserve Faris's face/laptop, the map and all speed-test
figures. The dated caption on 118 is removed, not the date in its screenshot.

`pnpm test` passed 38 tests and `pnpm typecheck` passed. Targeted Playwright
checks passed for 116–118: exact 1920 × 1080 image bounds at x=0/y=0, empty
visible DOM text, no headings/footers, decoded images, no layout failures,
and forward/backward navigation. External traffic was blocked; none attempted.
All six screen/print-media captures were opened and inspected at full size.
Evidence: `artifacts/reviews/caching-dark-arts/results-photos-2026-10-08-dtiYHG/`.
An initial check encountered a headless wake-lock permission denial; rerunning
with Slidev's required screen-wake-lock permission passed with no page errors.
Print-media capture is not PDF export. Full-deck build, PDF export and rehearsal
were not repeated for this isolated layout change. Earlier evidence remains
historical, not proof of this revision's export. No shared styles changed.

Current live preview: http://127.0.0.1:59060/115. Stop for visual feedback.

## Citation and verification-label cleanup — 2026-10-08

User requested removal of sources, citations and verification material from
the slides. The slides-edit pass keeps this scoped to audience copy, not deletion
of provenance or validation records. Underlying claims and assets are unchanged.

| Slides | Before | After |
| --- | --- | --- |
| 19 | Nielsen/book/chapter attribution | Heading only |
| 20–22 | Response-Time Limits · Jakob Nielsen (Paraphrased) | Response-Time Limits |
| 58–59 | Source URL · Simplified Illustration | No caption |
| 48/75/76/101/109 | Illustrative Code | No caption |
| 84–91 | Illustrative Comparison | No kicker |
| 98 | tanstack.com/query | No caption |

Credits and example limitations remain in sources.md. Technical qualifications
about configuration-dependent ranges remain visible; they explain the content
rather than the review process. “The Data Source” and “Open Source” are actual
talk subjects and are not removed by a blanket word replacement. SourceSlide
metadata, speaker notes, code, recordings and art are untouched. No PDF export
requested for this copy-only update; previous PDFs are historical.

Validation: `pnpm test` passed 37 tests. `pnpm slides review caching-dark-arts`
passed typecheck, production build and all 136 browser states with no runtime,
HTTP or blocked-request failures. Evidence:
`artifacts/reviews/caching-dark-arts/2026-10-08T21-11-39.026Z-0Xx8MZ/`.
All 22 changed screenshots were opened at full size and inspected, including
two native-video control variations. The other 114 screenshots are byte-identical
to the individually inspected previous run (2026-10-08T21-03-45.435Z-gSvQC2).
No new clipping, collisions or missing assets. No baselines replaced. The known
caught FloatingVue warning and pnpm store-setting warning persist. A targeted
Playwright check of the new live server confirmed visible headings and absence
of the removed labels on 19/20/24/58/98 after transitions settled.
Current live preview: http://127.0.0.1:57110/24. Earlier preview URLs below are
historical. Factual review and rehearsal remain pending.
Stop here for visual feedback under the slides-review checkpoint.

## Start Case and mileage correction — 2026-10-08

The user supplied the intended mileage and requested a deck-wide typo/casing
pass. `620,0000 miles` is now **620,000 Miles**; slide 5 contains no source-figure,
apparent-typo or confirmation note. The source discrepancy is resolved in
sources.md using the user's value, not an inferred factual correction.

The slides-write/edit passes standardized editable headings, body copy,
captions, demo topics and diagram labels to Start Case. For example, “Map data”
became “Map Data” and “Set state” became “Set State”. Code, identifiers, official
names (Next.js, TanStack Query), units (ms, s, Mbps), URLs and handles are
unchanged. Raster screenshots and embedded recordings retain their original
text. No other clear misspellings were found; this was not a new factual audit.
DESIGN.md records these casing exceptions. Layouts, motion, slide sequence and
media are unchanged.

Validation actually run: `pnpm test` (36 passed), `pnpm slides review
caching-dark-arts` (typecheck, production build and 136 browser states passed).
All 136 full-size screenshots were individually inspected, including every
client-flow click state and all server diagrams: no new clipping or collisions.
Evidence: `artifacts/reviews/caching-dark-arts/2026-10-08T21-03-45.435Z-gSvQC2/`.
No screenshot baselines changed. The known caught FloatingVue warning remains;
the report has no runtime errors, blocked requests or HTTP failures.

The restarted live preview is http://127.0.0.1:53372/5; a targeted Playwright
check confirmed the new heading and absence of review commentary. Earlier
preview URLs below are historical. No new PDF was generated; existing PDFs
predate this revision. Other factual verification, full recording review and
timed rehearsal remain outstanding. Following slides-review, stop for feedback.

## Full-canvas traffic photograph — 2026-10-08

User requested the real-world photo take the whole slide. Source slide 4 now
uses native none layout and scoped caching-photo CSS, without a visible title,
caption or footer. The same local traffic image and alt text remain; no asset
generation or source-byte changes. Image softness at full size reflects the
existing raster resolution.

`pnpm test` passed 35 tests; `pnpm typecheck` passed. A targeted Playwright
check against the restarted live server passed with external traffic blocked,
zero page errors, exact 1920 × 1080 image bounds at x=0/y=0, no heading/footer,
and forward/backward navigation. Both full-size screen and print-media PNGs
were inspected: edge-to-edge photograph with no margins or distortion.
Evidence: `artifacts/reviews/caching-dark-arts/full-photo-2026-10-08-a5EUy2/`.
Print-media capture is not PDF export. Full-deck build/export were not repeated
for this isolated change; earlier PDFs are historical. All previous factual
and media limitations remain unchanged. No shared styles or other slides changed.

Current live preview: http://127.0.0.1:51454/4. Stop for user feedback under the
slides-review visual checkpoint.

## Audience-copy and biography revision — 2026-10-08

Authorized by the user's latest feedback: remove visible migration/review
commentary and make the biography easier to scan, with a full-height photograph
covering the right third. The outline, technical argument and slide count stay
unchanged. The slides-write/edit passes kept useful attribution and technical
qualifications, while moving provenance and unresolved source issues into
sources.md rather than displaying them to the audience.

The biography now has six separate experience items in two columns and a
distinct community/open-source section. Its existing montage fills the right
third edge-to-edge using a centered cover crop; no image bytes were changed.
The source discrepancy in the prefetch diagram footer is now a direct
explanation of timeout/recovery; the discrepancy remains in sources.md.

Validation actually run: `pnpm test` (34 passed), `pnpm slides review
caching-dark-arts` (typecheck, production build and all 136 browser states
passed), and a targeted Playwright check of the restarted live preview.
At 1920 × 1080, the biography image measures approximately x=1280, y=0,
width=640, height=1080. The new regression test guards against visible
migration commentary and loss of the separated biography items.

Current browser report and screenshots:
`artifacts/reviews/caching-dark-arts/2026-10-08T20-52-37.372Z-QvSHwH/`.
All 39 screenshots differing from the preceding reviewed run were opened and
visually inspected; the other 97 are byte-identical. No new text overflow,
overlap or broken images found. Known paused-video loading crescents remain on
82/114; media behavior was not changed. No screenshot baselines were replaced.
The known caught FloatingVue warning persists.

No PDF was regenerated for this scoped browser-preview revision; PDFs listed
below predate these copy/layout changes. Factual verification, full recording
review and timed rehearsal remain outstanding, not silently approved.

Live preview: http://127.0.0.1:49384/2. The prior preview was serving stale
content and was restarted. Following slides-review, stop here for visual feedback.

## Full-deck expansion authorized — 2026-10-08

User request: generate the full slide deck for end-to-end analysis, then refine;
label all demos by topic. This clears the earlier checkpoint. Approved amended
outline SHA-256: `f1622198e3788612f9ab08686a2ed3ed501803f1aa51ff4546e6022403261688`.
Recorded before full-deck drafting. Scope: 125 source pages, including original
demo intros 49/81/113, three full-canvas recordings, and the existing 11-click
client flow. This is authorization to draft, not factual or visual approval.

## Full-deck review handoff — 2026-10-08

125 routes preserve sourceSlide 1..125 in order. The existing source intro pages
49/81/113 now name the demo topics; recordings remain full-canvas at 50/82/114.
The user's later requests also authorize source-inspired important-word
highlighting and smooth non-interrupting motion. Outline sequence is unchanged.
The slides-write/edit/review passes retained the argument, separated unverified
claims from visual direction and required actual browser/export evidence.

| Editorial/visual input | Implemented treatment |
| --- | --- |
| Source 15's long rhetorical sentence | Condensed without changing its point |
| Nielsen text on 19–22 | Explicit paraphrases, not fabricated verbatim quotations |
| Typos on 34/72/96 | Designed / performance / Lambda |
| Code screenshots | Five editable TypeScript examples plus JSONC response; syntax only tested |
| Number-only demo titles | Number and topic using original intro pages |
| Colored key phrases in PDF | Semantic strong spans, blue on cream / yellow on dark |
| Smooth motion request | 220 ms native transitions, gentle entrances, short diagram stagger; no additional clicks or waits |

Final browser/build report and 136 screenshots:
`artifacts/reviews/caching-dark-arts/2026-10-08T20-43-11.938Z-EdaNgl/`.
Final click-expanded PDF (136 pages) and rendered pages:
`artifacts/reviews/caching-dark-arts/2026-10-08T20-43-14.985Z-vASjg3/`.

Visual review covered every full-size browser state from the preceding complete
run `2026-10-08T20-37-03.725Z-BUE11x`. The final run differs only on diagrams
74/100/108 and paused-video captures 82/114; all five were re-opened at full size.
All 136 PDF pages were inspected as contact sheets, with dense code/diagrams
also inspected full-size. Final PDF raster comparison found only pages
85/111/119 changed; all three were inspected again after the label fix.
Highlights, all twelve client-flow states and static demo posters are preserved.

Visual findings were not hidden by baseline updates: the first full run's
oversized legend was rejected, then scoped typography fixed it. Later review
found refetch labels crossing arrows on 100/108; labels now sit beside arrows.
All intermediate evidence is retained. Native browser loading crescents can
still linger on paused video captures (82/114 in the final run), despite loaded
buffers and successful offline playback tests. This cosmetic/browser-readiness
issue remains a known limitation, not a claimed clean visual pass for media.

Targeted evidence under `artifacts/reviews/caching-dark-arts/`:

- `motion-2026-10-08T20-37-58.410Z-SwKe8m/`: forward/reverse transitions on
  8/49/74/100/108, 220 ms timing, rapid 8→11 navigation, zero settled animations,
  eleven native diagram clicks, reduced-motion and print checks passed. All ten
  captured PNGs inspected; a WebM was recorded but not reviewed end-to-end.
- `flow-2026-10-08T20-41-50.641Z-X8x5cF/`: twelve forward states, eleven backward,
  direct click-9 link, presenter click-6 notes and unique SVG markers passed.
  Presenter screenshot inspected.
- `2026-10-08T20-37-03.725Z-BUE11x/media-2026-10-08T20-41-48.222Z/`: all three
  production videos passed offline play/seek/pause/leave/return checks and
  full-canvas geometry. Overview/presenter checks passed; all five PNGs inspected.
  Presenter playback is independent: use the audience window's controls.

These targeted tests precede only the final SVG label-position fix; motion,
client-flow and media behavior were unchanged. Final full browser/export runs
include the label fix. Typecheck and all 33 unit/migration tests passed.

Commands actually run: `pnpm typecheck`, `pnpm test`, `pnpm slides review
caching-dark-arts`, `pnpm slides export caching-dark-arts`, `node
scripts/review-caching-motion.mjs`, `node scripts/review-caching-flow.mjs`,
`node scripts/review-caching-media.mjs <successful-review-directory>`, `pdfinfo`,
and `pdftoppm -scale-to 1280 -png`. Extraction/preparation scripts recovered
individual images with recorded hashes. No installs, generated artwork, commits,
remote changes or changes to the payment deck/shared brand assets.

Known caught FloatingVue/pnpm-store warnings and Poppler Type3 warnings persist;
the prior cover-arc PDF hairline remains. Source factual backlog, original notes,
trim/build fidelity, full recording review, venue setup and timed rehearsal are
not complete. The third recording includes Demo 3 and Demo 4 and remains intact.

Live review: http://127.0.0.1:58275/1. Migration coverage is complete. Following
slides-review, stop for the user's end-to-end visual feedback, not another pilot
approval. Historical gates below are superseded, not current instructions.

## Historical narrated diagram amendment (2026-10-08)

The user explicitly supplied the UI/request/loading/success/refetch/failure/retry
sequence and requested one-part-at-a-time click highlighting. Approved amended
outline SHA-256, recorded before drafting:
e82153d8c094e76817847a34d65bbce95d0839e58225d95ddfeea571712d2811.
This authorizes the diagram sequence only, not the remaining migration pages.
Implemented as eleven native clicks on slide 3, with twelve visible states.
The deck still has ten routes covering seven source beats. The writing/editing
passes kept the user's ordering, added the case-study quantities, and qualified
the refetch loop against official React guidance (see sources.md). Notes follow
all eleven clicks. No change to the code slide, demos, theme or approved art.

| Before | After |
| --- | --- |
| Entire flow visible at once | Anchored progressive reveal, current-part emphasis, full-flow recap |
| No render-to-requests route | Dotted upper loop labeled as a conditional Effect/state bug |
| One retry sentence | Separate ALL and ONLY FAILED choices with individual yellow/underline emphasis |
| Generic caption | Per-click captions and speaker cues following Faris's narration |

Fresh browser evidence: `artifacts/reviews/caching-dark-arts/2026-10-08T20-13-12.882Z-wWaf54/`.
Report passed typecheck/build and all 21 slide/click states, with zero bounds,
runtime, HTTP or blocked-request failures. Twenty navigation checks passed.
All 21 full-size screenshots were individually inspected. Active parts remain
legible, upcoming parts hidden, prior parts dimmed, arrows clear of labels and
the final diagram complete. ALL and ONLY FAILED highlights are distinct.

Expanded PDF: `artifacts/reviews/caching-dark-arts/2026-10-08T20-13-16.354Z-B72FRp/caching-dark-arts.pdf`.
Export report passed with clickPolicy all. Rendered and individually inspected
all 21 pages in pdf-review/: twelve diagram states in order, unchanged source
slides and full-canvas video posters. No new clipping, collisions or missing
glyphs. Existing cover-arc PDF hairline and Poppler Type3 warnings remain.

Targeted behavior evidence: `artifacts/reviews/caching-dark-arts/flow-2026-10-08T20-15-15.164Z-zAcgoF/`.
Passed all twelve forward states, eleven reverse states, a direct link to click
9, presenter click 6 with its narration and next-click preview, and unique SVG
markers across instances. Presenter screenshot inspected. Zero page errors or
external requests. The first targeted run lacked the browser wake-lock grant
used by the existing review and failed on that permission, not diagram state.
Its evidence is preserved at flow-2026-10-08T20-14-41.118Z-JIDb4Y; the rerun
grants the same local browser permission as the standard review.

Commands run: pnpm typecheck; pnpm test (31/31); pnpm slides review
caching-dark-arts; pnpm slides export caching-dark-arts; node
scripts/review-caching-flow.mjs; pdfinfo; pdftoppm -scale-to 1280 -png.
Known pnpm store mismatch and caught FloatingVue warnings remain. No dependency
installation, generated art, commits or remote changes. Full-motion, venue and
timed rehearsal remain unverified. Video playback was not rerun after this
diagram-only change; earlier production media evidence below remains applicable
to the unchanged media/layout, and fresh browser/export captures checked them.

Live preview: http://127.0.0.1:50109/3?clicks=0. The owned 59463 server retained
the old Markdown and was stopped/restarted. Diagram visual approval is pending.
Stop here, as required by slides-review, before expanding the full migration.

Outline revision: 2026-10-08-01. User approval: “yes” on 2026-10-08 to the migration plan and its representative visual checkpoint. Approved outline SHA-256: f690c063702a9b77b425f673317d77a6092b17cd353a658abecca3d98ec8f524 (recorded before drafting).

Current scope: seven source beats, now ten rendered slides with separate demo
intros. User-requested full-canvas revision on 2026-10-08, authorized explicitly
in conversation. Amended outline SHA-256 recorded before slide edits:
cc120b587876af0f8a5734be99e91334ac0ad79fdd327c820836022d0e767165.
The user accepted the full-slide demo direction (“This looks good now”) and
requested clearer diagram roles, a legend and icons. This approves that scoped
visual revision, not an argument change or expansion of the remaining pages.

## Previous revision: full-slide demos and clearer fetching flow

- Ten rendered slides, with numbered demo intros at 5/7/9 and full-canvas
  recordings at 6/8/10. Source page metadata stays on the original seven beats.
- Native none layout removes all title/caption/footer padding from recordings.
  Three production geometry checks measured video bounds exactly 1920 × 1080,
  with no slide headings/footers and object-fit contain. Narrow recordings keep
  side bars; no captured UI is cropped or stretched.
- Slide 3: blue client-work nodes, yellow API requests, orange risk/retry.
  Labeled legend and semantic icons distinguish components; solid arrows show
  the normal flow and the dashed retry route stays below it. The same source
  flow, 429 warning, retry options and loading behavior remain intact.
- Shared theme, brand assets, original recordings and poster frames unchanged.

| Before | After |
| --- | --- |
| Demo title, caption and footer surrounding a small video | Separate numbered title, followed by an unframed full-canvas video |
| Text labels connected with one blue line style | Labeled component nodes/icons, role colors and legend |
| Similar-looking success and retry routes | Straight success path plus an orange dashed retry loop |

Final browser review: artifacts/reviews/caching-dark-arts/2026-10-08T20-02-35.361Z-xiHgl9/

Final PDF: artifacts/reviews/caching-dark-arts/2026-10-08T20-02-38.453Z-EgU6lJ/caching-dark-arts.pdf

Production media behavior/geometry: artifacts/reviews/caching-dark-arts/2026-10-08T19-56-19.857Z-MUk7SL/media-2026-10-08T19-56-52.987Z/

The production media pass used the same final video layout/Markdown/assets,
before the independent diagram-only edit. All three playback, seek, leave and
return checks passed, along with intro order, full-canvas geometry, overview and
presenter controls. No external traffic/errors. All five media screenshots
were inspected. Presenter playback remains independent from audience playback.

Validation commands this revision: pnpm test (30/30), node --test
scripts/slides-review.browser.mjs (1/1), pnpm slides review caching-dark-arts,
pnpm slides export caching-dark-arts, the production media script with the run
above, pdfinfo, and pdftoppm. The final browser review passed all ten states
and nine navigation checks, with zero failures, runtime errors, HTTP failures
or blocked requests. Type checking and production build passed. Final browser
screenshots 3/6/8/10 were inspected directly; the other six were byte-identical
to the already inspected 19:56 run. All ten pages of the final PDF were rendered
and individually inspected: text, icons, arrows and video posters are readable,
with no overlaps or cropped recording UI. The existing cover-arc hairline in
PDF remains unchanged. Known FloatingVue and Poppler Type3 warnings remain;
neither prevented inspection. A final pnpm test rerun passed 30/30, with the
existing virtual-store/lockfile configuration warning and no dependency changes.

Review harness repairs: the first revised run timed out on networkidle while
loading a large recording. DOM load plus explicit readiness replaces that wait.
The next run correctly identified that text-font assumptions did not fit a
video-only slide; visible-text detection now scopes that requirement, with a
negative probe preserving missing-font checks on text. Captures also showed
the browser loading-indicator animation briefly after readyState changed. The
capture now waits for readyState 4 plus two seconds of native-control settling,
without playing media, hiding its loading state or changing screenshot baselines.
All failed/intermediate directories remain preserved.

Live preview restarted at http://127.0.0.1:59463/3 after the older server retained
the old Markdown sequence. The old owned server on port 55070 was stopped.
Use pnpm slides dev caching-dark-arts to restart later.

Full-slide demo direction: approved. New diagram: awaiting visual approval.
Stop here before full migration expansion.

## Historical initial checkpoint and stop condition

Seven slides are ready for visual approval: source pages 1, 16, 47, 48, 50, 82
and 114, in that order. The complete 125-slide migration is NOT delivered yet.
Stop here under the slides-review gate. After approval, expand the remaining
118 source pages in original order and complete the factual/media/notes audit.

The payment deck, shared theme and approved avatar/duck artwork are unchanged.
No dependencies installed, artwork generated, source files altered, Git actions,
remote writes or deployment performed.

## Editorial and source pass

| Source | Treatment | Review |
| --- | --- | --- |
| 1 | Title/subtitle hierarchy and sentence case | Preserved talk meaning and source speaker role; role not independently checked as current employment. |
| 16 | Sentence case and emphasis on optimal/suboptimal | Preserved the original question; no padded framing. |
| 47 | Editable SVG replaces source diagram | Preserved parallel requests, mapping/state/render, custom retry and 429 risk. |
| 48 | Editable TypeScript replaces screenshot | Wrapped callback arguments for legibility; omitted source helpers remain explicitly illustrative. |
| 50/82/114 | Original recordings with concise headings | Content correspondence inspected; Demo 2 heading describes the visible BFF/payload-shaping recording. No performance claims added. |

No fabricated quotes, new statistics, generic transition copy or invented
original speaker notes. Code syntax was checked, not execution of the missing
application helpers. Full factual review remains pending; see sources.md.

## Media integrity and behavior

- Three MP4s extracted byte-for-byte; source/output SHA-256 and sizes are saved
  in migration/media.json and checked by the migration tests.
- Total 359,199,368 bytes; durations 41.033333, 14 and 24.266667 seconds.
- Decoded dimensions: 3734 × 2160, 3734 × 2160 and 3124 × 2160.
- Read-only MP4 sample-entry inspection found avc1 video and no audio sample
  entries. These extracted recordings are silent; original audio intent unknown.
- Playback posters use one-second frames. PDF posters use reviewed result
  frames at 15, 7 and 12 seconds. Timestamps are in migration/posters.json.
- Third recording includes both Demo 3 and Demo 4, following its ZurichJS
  opening. No trimming, transcoding, cropping or replacement recording.
- Native controls, manual playback, no autoplay/loop. Leaving a slide pauses
  it; returning leaves it paused and can retain its previous playback position.
- Presenter and audience playback are independent. Confirmed by starting the
  presenter video while the audience video remained paused. Use the audience
  controls and rehearse the actual setup. No custom synchronization added.
- Recovery notes are newly written instructions, not recovered Keynote notes.

## Historical initial evidence

All paths below are relative to the repository root.

Browser review: artifacts/reviews/caching-dark-arts/2026-10-08T17-31-31.197Z-oOJfNH/

- report.json: passed; typecheck and production build passed.
- Seven 1920 × 1080 screenshots under screenshots/, all individually inspected.
- Six forward/backward slide-navigation checks passed; no additional reveal
  states in this checkpoint.
- No unexpected runtime errors, blocked external requests or HTTP failures.

Production media review: artifacts/reviews/caching-dark-arts/2026-10-08T17-31-31.197Z-oOJfNH/media-2026-10-08T17-33-21.299Z/

- report.json: passed. All three clips decoded, played, paused, sought to their
  midpoint, paused on leave and returned paused.
- External HTTP/WebSocket traffic blocked; no attempted external requests.
- Overview videos paused without controls. Presenter controls and recovery
  notes visible. Presenter/audience independence explicitly tested.
- All three midpoint screenshots, overview and presenter screenshots inspected.

PDF: artifacts/reviews/caching-dark-arts/2026-10-08T17-31-33.895Z-Q9AWFC/caching-dark-arts.pdf

- Seven pages exported. Each page rendered into pdf-review/ and inspected.
- Video slides contain chosen still results, not playable movies.
- No visible missing glyphs, overlapping text or clipped content in final
  browser screenshots or rendered PDF pages. Video aspect ratios are preserved;
  black letterboxing is intentional. Small demo UI remains recording content.
- Existing cover-arc hairline/placement difference between browser/PDF remains;
  no shared brand geometry changed for this checkpoint.

## Historical initial commands

```sh
node scripts/prepare-caching-media.mjs
node scripts/prepare-caching-posters.mjs
pnpm test
node --test scripts/slides-review.browser.mjs
pnpm slides review caching-dark-arts
pnpm slides export caching-dark-arts
node scripts/review-caching-media.mjs artifacts/reviews/caching-dark-arts/2026-10-08T17-31-31.197Z-oOJfNH
pnpm slides dev caching-dark-arts
```

Also used pdfinfo and pdftoppm to inspect/render the exported PDF. Unit tests:
29/29 passed. Browser negative-probe test: 1/1 passed, including unloaded video
and missing poster detection. Runtime: Node 24.18.0, pnpm 11.15.1, Slidev 53.0.0,
Playwright Chromium 151.0.7922.34.

Live preview was left running at http://127.0.0.1:55070/1; demos are slides 5–7.
Restart the dev command if that temporary server is unavailable.

## Iterations and known limitations

- First local review encountered sandbox listen restrictions; approved local
  server/browser runs succeeded. The failed report is preserved.
- Initial machine-passing captures exposed browser video loading spinners.
  Changed metadata-only preload to auto and added video/poster readiness checks.
  Final screenshots no longer contain browser loading spinners. Loading states
  recorded inside the source demo app are legitimate content.
- Intermediate end-frame print posters were rejected in favor of the specific
  result frames above. All earlier review directories remain as evidence, not
  silently updated screenshot baselines.
- Existing pnpm store-configuration warning and caught FloatingVue compatibility
  warning remain. Known FloatingVue warnings are recorded separately; unexpected
  errors fail review. Poppler Type 3 bounding-box warnings did not correspond to
  visible glyph damage in the inspected pages.
- Original Keynote notes, object/build timings and movie trim settings have not
  been recovered. Do not claim complete fidelity from the PDF plus MP4 files.
- Other browsers/codecs, venue/projector behavior, full timed rehearsal and the
  full 125-page factual audit are unverified. Local production playback with
  external traffic blocked is tested; that is not a full conference rehearsal.
- Original recordings are large (~359 MB); no optimized derivatives yet.

Human visual approval: pending. Automated checks do not grant it.
