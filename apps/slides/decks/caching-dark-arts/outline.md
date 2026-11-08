# Caching: approved migration outline

## Approved typing example, 2026-10-09

Faris requested typing that initially keeps up, then falls behind the input,
causing confusion and backspacing. Replace only source/route 21's task-board
example. Retain two clicks: smooth typing, then the same start with a
three-second delay, repeated letters and correction. Keep routes 20 and 22,
all other content and totals (121 slides / 172 states) unchanged. This explicit
request approves the scoped replacement. Typing feedback is faster than one
second; the heading names the general response-time guideline, not a claim
that one-second keyboard feedback feels good.

## Approved duplicate-request cut, 2026-10-09

Remove source 46, “Five Requests. One Result.”, and its four clicks at the
user's request. Source 45 now leads straight to the client-side diagram on
source 47 (route 43). Keep its eleven clicks. Explain the fixed upstream API,
five requests, loading, success and retry-all versus failed-only within that
existing sequence. No replacement slide or extra build. New total: 121 slides
and 172 states. Original source identifiers and all recordings remain intact.
This explicit cut supersedes the older source-46 motion approval below.

## Approved response-time interactions, 2026-10-09

The user requested an instant 0.1-second interaction, a smooth one-second
workflow with a longer interrupting pause, and a ten-second interrupted
workflow. Keep source/routes 20–22 in place, using one, two and one native
clicks respectively. The second click on 21 contrasts a three-second wait.
Preserve all other beats. New total: 122 slides / 177 states. This explicit
request approves this scoped extension, not unrelated editorial changes.

## Approved technical refinements 1–4 (conversation numbering), 2026-10-09

The user approved upstream-constraint/closing clarification, HTTP failure
handling, request-time prefetch explanation, and replacing broad infrastructure
ranges plus the unsupported universal CDN threshold. The user confirmed
QUANTITY = 5 means five requests, and createPrefetch races fetch against a
timeout then explicitly cancels on timeout. Keep all 122 routes and existing
click totals. Use the same shared-clock full-navigation SSR sequence, label
server Query state per request, and distinguish client fallback from hydration.
Remove em dashes from all editable presentation text and notes. Preserve
original recordings/images and record any baked-in text limitations separately.
Measurement critique 5 and unrelated smaller edits remain deferred.

## Approved ingress and egress motion — 2026-10-09

The user requested animated ingress and egress explanations. Replace only
source 93/94 (routes 90/91) with one shared API/BFF/browser diagram. Keep the
BFF boundary explicit, animate response data entering it, then retain that
incoming leg while animating the shaped response leaving for the browser.
One native click per slide, fixed node positions, finite interruptible motion,
deterministic reverse/deep-link states and static reduced-motion/print output.
No extra routes, measurements, dependencies or unrelated critique fixes.

## Approved character transitions — 2026-10-09

The user requested Keynote-like character Magic Move between slides, then
approved continuation. Apply native Slidev view transitions across the deck,
matching heading graphemes and fading other content. Keep Markdown headings,
native clicks, source order and media. This is an approximation, not imported
Keynote transition data. Reduced motion and static export must remain stable.

## Approved explanatory motion — 2026-10-08

The user approved all proposed latency, throughput, payload, cache, parallel
request and prefetch visuals with “do all”. Replace the relevant statement
compositions in place, retaining 122 routes and source identifiers. Source 46
gets five-request/retry lanes (4 clicks); 65–67 accumulate LAN, broadband, 4G
and 5G comparisons (1/1/4 clicks), with a final poor-path stress scenario.
Source 80 shapes records into monthly counts (2 clicks). Sources 85–87 and
89–91 compare the same large/small payload at the original assumed rates
(1 click each). Source 103 illustrates miss, fresh hit and stale refetch
(3 clicks); source 107 shows on-demand versus earlier prefetch (3 clicks).
The previous four architecture diagrams stay intact. No new runtime, package,
artwork or media edits. All animations terminate, remain interruptible, and
have deterministic reverse/reduced-motion/print states. Primary evidence does
not support treating 80–200 ms as universal 4G/5G latency: retain it as the
explicit stress case, with separately scoped UK operator-median comparisons.
The existing bandwidth numbers become an explicit constant-rate plus 200 ms
fixed-cost model; do not present that arithmetic as a measured benchmark.

## Approved architecture evolution — 2026-10-08

The user requested a more polished animated architecture sequence in which
each version builds on the preceding diagram and already-explained blocks do
not need revealing again. Retain the four source identities and deck order.
Source 47 keeps 11 clicks. Source 74 opens on its completed client flow, then
adds BFF, moves mapping, returns a small payload, revisits recovery, and recaps
(5 clicks). Source 100 opens on that BFF, adds Query cache, fresh reuse/refetch,
Query-managed recovery, then recaps (4 clicks). Source 108 opens on that Query
architecture, adds server prefetch, dehydration, hydration, timeout fallback,
then recaps (5 clicks). This is an explicit user-authorized refinement, not a
new talk outline requiring another approval. No extra slides or dependencies.

## Approved cut — 2026-10-08

The user requested skipping the Technologies, Next.js and TanStack Query
introductions, assuming audience familiarity. Remove only source pages 25–27.
The current deck has 122 slides, retaining original sourceSlide identifiers
and relative order. Source 24 now leads directly into source 28 (API Types).
Later TanStack Query solution examples remain. This explicit cut supersedes
the historical all-125-pages requirement below; no new approval gate is needed.

## Full-deck authorization — 2026-10-08

The user now explicitly requests the complete deck for end-to-end analysis and
later refinement. This supersedes the representative-checkpoint stop below.
Migrate all 125 source pages in their original order, one source page per slide.
Reuse source 49, 81 and 113 as the demo intros, respectively: “Demo 1 —
Client-side fetching”, “Demo 2 — BFF with payload shaping” and “Demo 3 — Server
prefetching with TanStack Query”. Retain the three complete original recordings
on 50, 82 and 114, full canvas. Retain source 47's eleven native clicks.

Rebuild source code and explanatory diagrams as editable content; preserve
original photographs, product screenshots and attributed third-party figures
as individual raster assets, not screenshots of whole slides. Preserve the
argument and quantitative claims, flagging uncertain claims for refinement.
Correct obvious spelling only with an explicit editorial record. Do not invent
original notes, animation timing, benchmarks or missing application interfaces.
Deliver the whole review draft, browser evidence and PDF; then wait for the
user's end-to-end feedback. Historical checkpoints below remain provenance,
not a restriction on this authorized expansion.

Revision: 2026-10-08-01. The user replied “yes” to the full migration plan in this conversation on 2026-10-08, including the representative visual checkpoint before full expansion. This file records that approved plan, not a new argument.

| Source pages | Beats to preserve | Layout/media |
| --- | --- | --- |
| 1–24 | Introduction, real-world constraints, UX stakes | Cover, statements, existing photographs and citations |
| 25–41 | Technologies and API constraints | Statements and original logos |
| 42–56 | Client-side fetching case study and Demo 1 | Scenario, editable flow/code, local recording |
| 57–68 | Payload size, congestion windows, latency | Statements, attributed source illustrations |
| 69–97 | BFF, Demo 2, bandwidth and infrastructure trade-offs | Editable flow/code, recording, comparisons |
| 98–114 | TanStack Query, server prefetching, hydration, Demo 3 | Source screenshots, editable flow/code, recording |
| 115–125 | Real-world results and closing | Original photos/evidence and closing |

Keep all 125 source beats in order in the final deck. Preserve sourceSlide metadata. Preserve original factual claims pending a separate flagged source audit, not silent corrections. No new talk-length assumption or invented speaker anecdotes. Original timing, notes, transition/build and media trim recovery remain to inspect; time the final deck in rehearsal.

## First visual checkpoint

Seven representative source beats in source order, now ten rendered slides.
Amendment approved by the user's 2026-10-08 request: demos occupy the whole
slide, with a separate numbered title slide immediately before each recording.

1. Source 1: title, approved badge cover, light.
2. Source 16: core question, statement, dark.
3. Source 47: client request/failure flow, editable diagram, light. The user's
   narrated amendment on 2026-10-08 authorizes native click steps: UI; five
   parallel requests for 5,000 records at 1,000 per request; loading; successful
   client mapping; set state; render; a conditional render-to-requests loop
   caused by an Effect/state bug; failure and custom retry; highlight ALL;
   highlight ONLY FAILED; retry while keeping loading; complete-flow recap.
   Keep nodes anchored and emphasize one narrated part at a time. This is one
   slide with twelve visible states, not twelve new source pages.
4. Source 48: client fetching, editable code, dark.
5. Added Demo 1 title, dark; `demoIntroFor: 50`.
6. Source 50: Demo 1 video, full canvas.
7. Added Demo 2 title, light; `demoIntroFor: 82`.
8. Source 82: Demo 2 video, full canvas.
9. Added Demo 3 title, dark; `demoIntroFor: 114`.
10. Source 114: Demo 3 video, full canvas.

The video canvas has no title, caption, footer or safe-margin padding. Preserve
recording aspect ratios without cropping. Added title slides do not claim to
be original source pages. In the full migration retain all 125 source beats;
reuse an immediately preceding original demo title if equivalent, otherwise
retain the added intro. Final rendered slide count may therefore exceed 125.

Review typography, code density, diagram semantics and video playback before expanding to the remaining 118 pages. Videos use native SlidevVideo, manual controls, local sources, poster and printPoster. Source recordings stay byte-identical unless a separately documented browser-compatible derivative is necessary. No custom playback runtime.

## Evidence and later gates

- Extract recordings with provenance hashes, inspect decoded frames, confirm mapping and test playback/seek/pause/navigation offline.
- Save screenshots, native PDF and deck review. Human visual approval is separate from automated success.
- After approval: complete all pages, recover notes where possible, review code/claims and spoken voice, inspect every screenshot/export page, rehearse presenter behavior.
- Networking statistics, congestion-window claims, cloud-provider figures and apparent source typos remain explicit factual-review items. No unsupported rewrites.
