# Caching: sources and migration limits

## Proxy network capacity, 2026-10-09

User requested numeric support for downloading the large payload at the BFF
and returning only chart data to the bandwidth-limited browser. Sources 96/97
(routes 83/84) now use named AWS examples, not generic FaaS/IaaS ranges.

- https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
  Default network quota: 625 Mbps per execution environment. This is a limit,
  not guaranteed throughput for a request. The optional higher quota is not
  used in the slides.
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html
  c5.large baseline: 0.75 Gbps. Applies to inbound/outbound networking, with
  further path/flow constraints. Do not substitute the 10 Gbps burst headline.
- https://aws.amazon.com/blogs/compute/improving-lambda-function-latency-with-scalable-network-bandwidth/
  Clarifies that execution-environment networking covers data entering and
  leaving the function. Checked against the quota reference above.
- https://aws.amazon.com/ec2/pricing/on-demand/
  Transfer billing depends on direction and path. Lower browser bytes alone
  cannot establish a lower total bill; compute, upstream and network services
  remain relevant. No dollar savings estimate is presented.

Arithmetic: 1,580,000 * 8 / (Mbps * 1000), in milliseconds. Results are
20.224 at 625, 16.8533 at 750, 505.6 at 25 and 6,320 at 2. All are ideal
transfer-only calculations, excluding the earlier 200 ms assumption, startup,
RTT, API processing and mapping. Client rates remain illustrative. Actual BFF
throughput and comparable on-wire demo payload sizes remain unmeasured.
The inference is conditional: when the upstream-to-proxy path is faster,
shaping at the proxy keeps bulk transfer off the slower client connection.

## Website design reference, 2026-10-09

Faris requested using his website design and existing character sprites.
Inspected the live https://www.faziz-dev.com/ homepage in light/dark modes,
including its featured section, DOM typography, tokens and font declaration.
Observed Figtree Variable, bold tightly tracked headings, cream/ink surfaces,
blue/yellow accents, yellow underlines and angled bands. This is a design
reference, not a new technical claim or a request to copy website navigation.

Downloaded the unchanged Latin variable font from
https://www.faziz-dev.com/_astro/figtree-latin-wght-normal.D_ZTVpCC.woff2
to `packages/slidev-theme-faris/assets/fonts/figtree-latin-variable.woff2`.
SHA-256: `4ba7d3d096695818fe0686be4f1e82c6b05134e18a22260336130335027462dd`.
License from https://raw.githubusercontent.com/google/fonts/main/ofl/figtree/OFL.txt
is saved alongside it as `Figtree-OFL.txt`, SIL Open Font License 1.1,
copyright 2022 The Figtree Project Authors. License SHA-256:
`140d37233e7f3ce7313798befa9600893bcceaf41a55fa0fa5ad52f7f657a268`.
The runtime uses local files only. No font dependency was installed.

The four character assets come from the approved theme registry, not the
website or raw generated intermediates. Their existing preparation and logo
audit are documented in `media/sprites/PREPARATION.md`. No artwork changed.

## Typing illustration, 2026-10-09

Faris requested route 21's typing/lag/backspace sequence. The smooth feedback
delay is 70 ms; the delayed segment uses three seconds before queued output
appears. Repeated letters and backspacing are an authored scenario, not an
observed experiment or a universal reaction. The one-second heading retains
the existing general guideline; notes explicitly say typing needs faster
feedback. The older task-board description below remains historical for route
21. Routes 20 and 22 are unchanged. No new empirical claims added.

## Large-screen latency playback, 2026-10-09

Faris requested slower Ethernet motion for low-refresh-rate large screens.
Only presentation timing changed: every round trip takes 1,200 ms plus 20
times its range midpoint. Ethernet is 1,260 ms instead of 60 ms. The shared
offset preserves speed ordering but not exact ratios. The visible key and
speaker notes now say the motion is slowed for visibility. Numeric ranges,
chart scale, example/measurement qualifications and underlying sources stay
unchanged. The earlier 20×-only playback description below is historical.

## Duplicate request sequence cut, 2026-10-09

Source 46 is omitted at Faris's request. The client diagram on source 47 now
carries the explanation, including the fixed upstream API and retaining
successful results when retrying only failures. Its eleven clicks are unchanged.
The older source-46 failure-lane example below is historical, not a current
slide. No source file, original recording or migration provenance was deleted.

## Response-time interactions, 2026-10-09

Faris requested simulated clicking/dragging to make the 0.1 / 1 / 10 second
examples tangible, including a longer pause after a smooth workflow.
Checked https://www.nngroup.com/articles/response-times-3-important-limits/
on 2026-10-09. The guidance distinguishes perceived immediate response,
continuing thought despite a noticeable delay, and keeping attention around
ten seconds. Treat these as approximate guidelines, not universal cutoffs.
The three-second contrast is an authored example chosen to exceed one second.
Cursor drift illustrates interrupted attention, not a measured reaction time.
All waiting periods run at real speed after the simulated action. A forward
click can always skip the wait; the presenter never has to spend ten seconds.
The source 19–22 response-time reference gap below is closed for this scoped
explanation, not for unrelated bounce statistics or the golden-window claim.

## Technical refinement decisions, 2026-10-09

Supersedes the older unresolved quantity/error-handling/provider-text records
below for the current editable deck. Faris confirms QUANTITY = 5 is the number
of requests, and createPrefetch races fetch completion against a timeout then
explicitly cancels the request. Original application code is not available here.
The revised callback accepts an AbortSignal; its exact original signature and
cancellation propagation inside the BFF still need application-level validation.
The 2,500 ms code example is retained without asserting it matches every demo.

Primary references checked for this scoped edit:

- https://tanstack.com/query/latest/docs/framework/react/guides/query-functions
  Non-OK fetch responses need an explicit throw for Query error handling.
- https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
  The signal must be consumed by the actual fetch.
- https://tanstack.com/query/latest/docs/framework/react/guides/ssr
  Query state is isolated per request; matching keys and positive staleTime
  support fresh hydration without an immediate client refetch. Data still travels.
- https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props
  Pages Router SSR runs at request time and may call data functions directly.
  The timeline depicts a full-page navigation, not every client-side route change.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
  First settlement wins; losing work is not automatically cancelled.
- https://developers.cloudflare.com/workers/reference/how-workers-works/
  Isolates differ from a process/VM startup model.
- https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html
  Reuse is not a fixed warm-retention contract.
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html
  Instance, single-flow and external-path limits differ from API throughput.
- https://datatracker.ietf.org/doc/rfc6928/
  Optional initial-window upper bound depends on MSS; ten 1,460-byte segments
  give 14,600 bytes. This does not establish a universal CDN or JSON threshold.

No actual deployment measurement was supplied, so the broad provider ranges and
46 KB claim were removed, not replaced by invented benchmarks. The comparative
payload measurement critique remains open. All editable audience text and notes
are required to be em-dash-free; original raster/video bytes stay unchanged.

## Explanatory motion evidence — 2026-10-09

The user approved all six proposed animated explanations. The scope includes
clarifying their assumptions; it is not a full-deck factual approval.

- Source 65/66 retain 1–5 ms and 30–70 ms as example request times, not
  universal verified ranges or a matched comparison. On 2026-10-09 Faris
  clarified LAN means Ethernet, not a local server. The first row now says
  Ethernet and notes distinguish the device cable from the server's location.
  Ethernet can also carry broadband traffic. No new latency measurement is
  claimed, and the fast example does not promise Ethernet internet RTT.
- Source 67 uses Ofcom, Mobile Matters 2025, page 16 (PDF page index 15):
  ranges across UK operator median response times are 18–23 ms for 4G and
  15–21 ms for 5G. Data collected October 2024–March 2025 on Android devices
  with network coverage. These are NOT min/max values for every connection.
  URL: https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/telecoms-research/mobile-matters/2025/mobile-matters-2025.pdf
  The source's original 80–200 ms figure remains only as a labelled poor-path
  stress assumption. Both mobile lanes use that same assumption; no universal
  claim that 5G beats 4G or that mobile is slower than broadband.
- Latency bands use a linear 0–200 ms axis; pulses use each midpoint at 20×
  slower playback, labelled on canvas. Equal drawn paths are schematic, not
  physical distances. RTT is distinct from throughput and application time:
  https://www.cloudflare.com/learning/performance/glossary/what-is-latency/
- Sources 85–91 use the original chosen rates (90/25/2 Mbps), decimal bytes,
  and an explicit assumed 200 ms fixed cost. 1.58 MB takes 140.44/505.6/6320 ms
  of transfer; totals are 340.44/705.6/6520 ms, shown approximately as in the
  source. 300 bytes take .0267/.096/1.2 ms, giving totals within 200–210 ms.
  Animation runs 2.5× faster with the same scale for all lanes/payloads.
  This is constant-rate arithmetic, not a benchmark, transport simulation,
  current cellular availability claim or evidence of a measured 200 ms RTT.
- Source 46's two failures (requests 2 and 5) are chosen teaching examples.
  Retrying only those requires keeping successful results separately.
- Source 80's repeated record/month blocks are schematic, not a byte-scale
  chart or measured birthday distribution. No new payload measurement is added.
- Sources 103/107 preserve Query semantics: fresh keyed data can be reused;
  stale data may remain visible during a triggered background fetch. Prefetch
  can move waiting earlier, but server-side waiting/TTFB still matters. No
  zero-latency promise, exact saved time or default persistence is implied.
  https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
  https://tanstack.com/query/latest/docs/framework/react/guides/ssr
- Native click animation support: https://sli.dev/guide/animations (v53).
  This revision adds no library, raster artwork or remote asset dependency.

## Supplied originals (unchanged)

- Keynote: /Users/farisaziz/Library/Mobile Documents/com~apple~Keynote/Documents/caching-payloads-and-other-dark-arts short.key
- PDF: /Users/farisaziz/Downloads/caching-payloads-and-other-dark-arts short.pdf (125 pages, 1920 × 1080).
- Keynote archive contains Data/demo1-9822.mp4, Data/demo2-9886.mp4, Data/demo-3-4-9901.mp4. ZIP CRC checks passed during planning.
- migration/media.json records source/output hashes and byte counts after extraction. migration/posters.json records decoded video metadata and frame timestamps after preparation.

The PDF supplies the visible sequence. It is not proof of Keynote notes, build timing, movie trim settings, loops or audio intent. Those properties are not yet recovered. Browser autoplay is intentionally off; manual playback is the checkpoint default. Do not label newly written provenance notes as original speaker notes.

## Full-deck provenance and editorial limits

Audience-copy revision, 2026-10-08: the user requested removal of all visible
migration/review commentary. Those details remain here and in review.md, not on
the presentation canvas. This does not close the factual backlog. Slide 5's
number is now 620,000 Miles, as explicitly supplied by the user in the subsequent
typo/Start Case request; 18's framing, 23/24's statistics, 61's CDN claim,
84–91's latency assumptions, provider ranges and QR destination still require
verification before a final public talk. Do not infer approval from clean slides.
Code captions no longer show “Illustrative code”; the omitted application helpers,
error handling and quantity-unit limitations below are unchanged. Slide 108's
timeout discrepancy is tracked here rather than in the audience-facing diagram.
Photo captions without attribution were removed. The user's later citation
cleanup moves the Angus illustration credit and Nielsen attribution entirely
into this document; supplied images/recordings are unchanged.
Slides 19–22 paraphrase Jakob Nielsen, Usability Engineering, chapter 5, rather
than quoting him. Illustrations 58–59 originate from https://angusjf.com/14kb/.
Slide 98 shows https://tanstack.com/query. These credits are background records,
not visible captions. Removing editorial labels does not verify code or turn
the illustrative bandwidth comparisons into controlled benchmark results.

The speaker biography now separates each experience area and groups community
roles. No experience was invented or removed. Its existing montage fills the
right third using a centered presentation crop, without rewriting image pixels.

122 PDF pages remain in source order after the approved cut of introductory
technology pages 25–27. Original sourceSlide identifiers remain unchanged.
migration/source.json continues to record all 125 original pages and stores
source hashes, extracted text, 35 image instances and the ten decoded/served
image hashes. Flat PDF backgrounds were not copied as slide screenshots.
Source images at 2/4/58/59/98/99/116/117/118/125 remain source material, not new
illustrations. Their visible colored text emphasis guided Markdown strong spans.

Five editable TypeScript examples at 48/75/76/101/109 pass syntax checks, not
application tests; omitted helpers, quantity units and HTTP error handling are
documented here. Slide 73 uses JSONC for an abbreviated response. Source 108 says
1,000 ms while code 109 uses 2,500 ms; the discrepancy is unresolved, not guessed.
Cache persistence requires setup; the deck does not promise automatic offline
persistence. The golden-window framing on 18 is not a universal performance law.

Source 15 is condensed; Nielsen statements 19–22 are paraphrases, not
verbatim quotations; 119 is a rhetorical question, not an attributed quote.
The typo on 5 is corrected using the user's supplied value. Statistics, provider claims, speaker roles and
QR destination remain unverified. This is a migration draft, not a full factual
audit. Original Keynote notes/build timings/movie trims remain unrecovered.

Motion extension points were checked against https://sli.dev/guide/animations,
https://sli.dev/features/direction-variant and installed Slidev 53 transition
styles. Native CSS transitions only; no additional runtime or dependency.

## Original representative selection (historical)

- Source 1: preserve title, subtitle and speaker role from the source, not independently verified as current employment. Use the approved intact theme badge.
- Source 16: preserve the core question; sentence case and emphasis only.
- Source 47: rebuild its client-side flow with labeled happy/unhappy paths, custom retry options and 429 risk. This is an explanatory diagram, not executable architecture.
- Source 48: transcribe the code screenshot as editable TypeScript. useFetchData, getFakeData, getBirthdaysByMonth, mapChartData, and QUANTITY are omitted application interfaces. The example is illustrative, not a tested implementation.
- Source 50/82/114: the PDF shows frames for Demo 1, Demo 2 and Demo 3. Decoded recording frames confirm the content mapping to the three extracted MP4s. The third starts with ZurichJS, then shows both Demo 3 (prefetch) and Demo 4 (short prefetch timeout); the full recording is retained. This verifies content correspondence, not unparsed Keynote movie-object relationships or trim settings.

## Factual backlog for full migration

- Source 5: original typo “620,0000 miles” corrected to “620,000 Miles” on
  2026-10-08 using the user's explicit value, not an inferred fact correction.
- Sources 19–24: Nielsen response-time thresholds and bounce-rate statistics need primary citations and their original context.
- Sources 51/83–91: payload sizes and timings are source demonstration claims, not universal benchmarks.
- Sources 57–68: 14 KB/46 KB congestion windows and RTT ranges depend on transport/server/network conditions; verify and qualify without silently replacing the argument.
- Sources 58–59 use illustrations from https://angusjf.com/14kb/; the user requested removing visible citations, but do not recast these as new original art.
- Sources 96–97: provider throughput/cold-start ranges need dated official evidence.
- Source code and cache/offline semantics need a separate technical review; do not modernize API syntax without recording substantive changes.

## Runtime references

Narrated flow amendment, 2026-10-08: Faris supplied the 5,000 records, 1,000 per
request limit, five parallel requests, conditional refetch loop and retry
explanation directly in conversation. These are this case study's inputs, not
universal API constraints. The 429 warning remains a risk, not a prediction.
The added speaker notes are newly authored from that narration.

React caveat checked against the official useEffect troubleshooting guidance:
https://react.dev/reference/react/useEffect#my-effect-keeps-re-running-in-an-infinite-cycle
A state update can change a fetching Effect's dependencies and rerun it. A
normal render alone does not inherently send another request. The diagram
labels the upper loop as an Effect/state bug to preserve that distinction.

Native click totals and state-driven rendering checked against Slidev 53's
https://sli.dev/guide/animations and installed client/context.ts and
composables/useClicks.ts. Speaker cues use native `[click]` notes, confirmed
in the actual presenter route. No navigation replacement or animation package.

Native component contract checked against installed Slidev 53.0.0 builtin/SlidevVideo.vue and https://sli.dev/builtin/components#slidevvideo. Supports controls, poster, printPoster and route-based pause. Production browser testing confirmed independent playback: starting the presenter video leaves the audience video paused. Operate the audience controls; no synchronized controller is added.

No generated artwork, new personal reference photos, external services or remote media dependencies are introduced. Approved brand assets stay in the shared theme.
## Initial-window examples, checked 2026-10-09

- RFC 6928 https://www.rfc-editor.org/rfc/rfc6928 describes IW10. With
  1,460-byte MSS, ten segments equal 14,600 bytes. Thirty-two equal 46,720 bytes;
  the slide's ~46 KB is a rough example, not a guaranteed application budget.
- Cloudflare's 2021 experiment explicitly used 30 packets:
  https://blog.cloudflare.com/sizing-up-post-quantum-signatures/ . This is
  historical provider evidence, not verification of today's fleet settings.
- Original CDN research presented at IETF 101 (2018) includes 32-segment
  configurations and customer-specific variation:
  https://datatracker.ietf.org/meeting/101/materials/slides-101-maprg-on-the-use-of-tcps-initial-congestion-window-in-ipv4-and-by-content-delivery-networks-00.pdf
- Cloudflare's 2025 analysis describes heterogeneous paths and experiments:
  https://blog.cloudflare.com/measuring-network-connections-at-scale/ . Its
  roughly 464 KB median at slow-start exit is NOT an initial-window value.
- An independent author's August 2026 first-hand tests report about 10–78
  segments across sampled CDN endpoints, including about 48 at Cloudflare:
  https://blog.gabrielng.com.br/en/posts/2026-08-10-guia-otimizacao-performance-web/ .
  These are single-study observations, not fleet defaults or independently
  reproduced measurements. Keep them in notes, not a promised size range.

The restored takeaway targets critical compressed data on a new connection.
Other traffic and protocol overhead consume capacity. Reused connections need
not be at their initial window; TCP figures do not specify QUIC settings.

## Streaming and jitter checks, 2026-10-09

Matching-key follow-up: https://tanstack.com/query/latest/docs/framework/react/guides/ssr
documents successful-query dehydration by default, failed server queries falling
back to client fetching, and freshness to prevent immediate refetch. The added
side-by-side code is illustrative; custom helper and fetch functions are not
implemented here. Missing server data does not imply a hydration mismatch.

- https://nextjs.org/docs/app/getting-started/fetching-data documents starting
  a promise in a Server Component and reading it with use in a Client Component
  inside Suspense. The illustration separates ready UI from waiting sections.
- https://nextjs.org/docs/app/getting-started/caching describes the prerendered
  shell and request-time streaming with Cache Components. Current recommended
  new-app defaults enable it; existing apps need configuration. Check the target
  version rather than treating all App Router apps as identical.
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
  covers pending-query dehydration for streaming. This requires explicit setup;
  the existing Pages Router demo is not silently upgraded by these slides.
- https://raw.githubusercontent.com/TanStack/query/main/packages/query-core/src/retryer.ts
  currently uses capped exponential default retry delay without jitter. The
  possible v6 change is Faris's recollection, not a verified roadmap promise.

## Five-minute cache-hit illustration, 2026-10-09

https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

Longer staleTime keeps successful cached data fresh for that duration and reduces
automatic refetches. The illustrated same-key fresh hit sends no new request;
therefore it cannot itself receive a new 429. This is an inference about the
request avoided, not removal of upstream rate limits. Misses, invalidation,
explicit refetches and other users still matter. Five minutes is an example
global choice, not TanStack's default and not a universal recommendation.

## Keynote presenter notes, 2026-10-09

Notes come from the Keynote PDF export of the original talk (125 pages, notes
printed below each slide). Unverified claims carried over as Faris's spoken
material: Amazon 100 ms = 1% sales (Greg Linden, 2006; 2006 revenue about
$10.7B), the Corolla durability points, the golden-window conversion claim.
The original "$3.8B today" was replaced with 1% of 2024 net sales ($638B,
about $6.4B). The original "approximately 150 ms" overhead was corrected to
200 ms (100 + 100) to match the deck model.
