# Faris Slides design contract

This file is the implementation-facing design contract for the presentation
system. The source brief remains in `docs/PROJECT_BRIEF.md`; visual rules and
acceptance detail remain in `docs/DESIGN_SPEC.md` and `docs/ACCEPTANCE.md`.

## Product scope

The caching cover metadata contains only the speaker name and role; omit
“A Pragmatic Case Study”.

Closing slide montage fills the right third edge-to-edge vertically with a
centered cover crop. QR, duck, title and footer remain within the left two thirds.
The yellow “Connect With Me” call to action sits directly above the QR code.


### Router transition and recap emphasis (current)

All four Current State prefixes remain white; only the solution name is yellow.
After the server-prefetch recap on 96, RouterTransition on 97 flips a blue
Pages Router card to a yellow App Router card over 1100 ms on one native click.
The existing streaming illustration follows on 98. The repetitive prerendered
shell slide is removed; unused prerender component support is retained but is
not shown. This supersedes the two-illustration sequence documented below.
Reverse clicks reverse the flip; reduced motion/print remove perceptible motion.


### Matching server/client query keys

Route 93 pairs native highlighted code for getServerSideProps and useQuery.
The server code object travels from 92 into the compact left panel over 1100 ms.
Step 0 spotlights server; step 1 spotlights client; step 2 isolates matching
key lines. Opacity changes take 650 ms. No key chips, outcome text or caption.
Hydration/provider setup and extracted fetch functions are explained in notes.
The subsequent prefetch recap and streaming illustrations shift to 96–98.


### Prefetch recap and server streaming

Route 95 reuses the six-card current-state summary after Demo 3. Its Pages
Router trade-off is explicit: prefetch delays the initial response. Routes
96–97 use StreamingShell with three presenter-controlled steps: shell,
chart, activity. Yellow identifies server work; blue marks ready content.
Sections fade/slide in over 650–700 ms, with static reduced-motion/print states.
The second illustration retains the same page but prepares its shell before
the request. These illustrate App Router options, not the recorded demo.
Ready Client Components can hydrate once their code is available; slow data
does not hold up independent ready sections. Cache Components setup is required
for the depicted partial prerendering model. Details and sources stay in notes.


### Five-minute fresh-cache demonstration

Query architecture route 85, click 4 shows a global five-minute staleTime,
three finite pulses through the cache route and a fade-out of the 429/retry
path. This depicts successful fresh hits for the same cached query only,
not elimination of API limits. The caption keeps that distinction visible.
Reverse clicks restore the failure path; reduced motion/print show the final
snapshot. Prefetch retains the complete request architecture for misses.
Route 86 inherits the global default, removing its old one-minute override.

### Download continuity and hosting comparison

TransferRace gives each network row a stable, slide-scoped native view-transition
identity, so Wi-Fi shifts upward as 4G slots in over 760 ms. The same applies to
the third row and small-payload sequence. Transfer playback timing is unchanged.
The visible qualifier is “Estimated Download Time At A Steady Speed”.

ProxyCapacity shows the slow client at step 0, adds the client at step 1, then
Lambda at step 2. Distinct orange/blue/yellow bordered cards use device icons,
rates and estimated transfer times. The EC2 slide retains both client cards in
exactly the same positions and replaces only the server card. Existing sourced
625/750 Mbps assumptions and notes remain, not new benchmarks or billing claims.
Two new clicks bring the deck to 108 slides / 163 states.

### Summary and BFF entrances

The three current-state summaries (47/70/88) keep their six-card grid. Cards
enter from left/right/top/bottom using a 900 ms ease-out and 0–200 ms stagger,
only on the active audience/presenter slide. No extra clicks, loop or navigation
lock. Clip moving cards away from headings, captions and footers. Overview,
reduced motion and print show static cards. BFF step 1 uses a 700 ms fade/upward
entrance for the newly added Next.js block; existing nodes retain their anchors.
Monthly payload bars have deterministic illustrative variation, not measured
frequencies. Slide 51 says “A TCP Example, Not A Target”. A separate slide 52
says modern CDNs can start much larger, with ~46 KB as an example and the
reminder to measure because windows depend on infrastructure. The standalone
takeaway (source 61) is removed because the advice appears later in the talk.
Demo 2 is named “BFF With Optimized Payload”.

Slide 15 keeps the restored question verbatim, with “complex data fetching”
and “management” emphasized in yellow. The connecting “and” stays white.

### Closing QR destination

Caching's closing QR encodes https://faziz-dev.com/connect and is clickable
to that same address. Use local connect-qr.png with a four-module white quiet
zone. Preserve the original contact-qr.png as source material.

### Shared footer

The shared frame footer displays lowercase faziz-dev.com as a link to
https://faziz-dev.com instead of the speaker name. Page numbering remains.
Cover and intentionally footer-free photo/video slides stay footer-free.

### Demo autoplay

All three caching recordings use native SlidevVideo autoplay with muted,
playsinline and controls. Active slides start automatically, leaving pauses,
and returning resumes the retained position. No autoreset or loop. Recordings
are already silent; muted allows browser autoplay. Overview remains paused and
native exports keep print posters. Native presenter playback remains independent.
This supersedes historical manual-play requirements for this deck only.

### Whole-object heading motion

The outgoing primary heading softly blurs from 0 to 3 px while fading over
280 ms. Incoming text remains sharp. This targets only its view-transition
snapshot, never code, diagrams, videos or the whole canvas. Reduced motion
and print retain the existing zero-duration/static behavior.

MagicHeading now renders one natural h1 with a single transition identity per
heading group. It no longer splits words or characters. Entire headings move
with the existing 760 ms easing and 320 ms crossfade; overview, reduced motion
and print disable the identity. Native code Magic Move remains unchanged.
Earlier character-motion descriptions are historical. Native text accessibility
replaces the duplicate aria-hidden character representation.

### Prefetch code readability

Source 109 (current route 92, previously 94) uses 23 px code with a scoped
32 px line height. Separate setup, fetch and dehydration with blank lines.
Keep the URL in a local variable to fit the callback without smaller type.
No behavior or click-count change.

### Query current-state summary

Sources 102/104/105 combine into route 88, after the retained cache animation
on route 87. Six bordered cards preserve the client/BFF category positions.
Highlight fresh-hit request avoidance, caching, retries and Query-managed
server state; payload and proxy mapping remain unchanged. Zero requests is
conditional on a fresh cache hit, never a blanket promise. Notes retain
refetch, upstream rate-limit, persistence and demo-byte qualifications.
Current count: 108 slides / 161 states. Source 106 onward maps to source minus
seventeen. Website sample routes: 1,3,6,42,45,68,96,108. Prefetch recap pending.

### Query code morph

Route 86 (source 101) begins with the exact after-state BFF snippet from route
66, then uses one native 800 ms Magic Move click to introduce useQuery, its
key and staleTime. Fetch/error/signal handling remain, while returning JSON
replaces setData. Use the existing 23 px type and 34 px line height with blank
lines between operations. QUANTITY stays the previously established five.
Current count: 110 slides / 163 states. No diagram changes in this checkpoint.

### Query introduction cut

Removed source 98/99 (previous routes 85/86) at Faris's request. IaaS now
leads directly into the retained Query architecture on route 85. All Query
code, diagrams and demos remain. Current total: 110 slides / 162 states.
Source 100 onward maps to source minus fifteen. Website sample routes are
1,3,6,42,45,68,98,110. Older counts below are historical.

### Proxy capacity examples

Sources 96/97 (routes 83/84) compare named Lambda/EC2 capacity with the talk's
25 and 2 Mbps client examples. Keep the same three-column positions and show
transfer-only calculations for 1.58 MB. Label Lambda's 625 Mbps as a default
limit and c5.large's 750 Mbps as baseline capacity. These are not measured API
rates or guaranteed per-request speeds. The conclusion is to fetch and shape
at the proxy, sending only the small result to the browser. Preserve latency,
contention and billing qualifications in notes and sources, with a short
transfer-model caption on canvas. No visible citations or new click states.

### BFF current-state summary

The approved bordered summary now covers BFF too, immediately after Demo 2.
Sources 77–79 and 83 combine on route 70; the earlier three factor slides are
removed, while the payload-shaping animation remains before the demo. Same six
positions as the client recap: payload, requests, caching, recovery, state,
mapping. Improved payload/request count/proxy mapping receive accent emphasis;
unchanged cache/state/retry stay neutral. Notes preserve upstream-failure and
HTTP-cache caveats. Current total: 112 slides / 164 states. Source 80 onward
maps to source minus thirteen. Website sample routes: 1,3,6,42,45,68,100,112.
Later Query/prefetch recaps are not consolidated yet.

### BFF code morph

Route 66 uses a scoped 34 px code line height at the existing 23 px font size.
Blank lines separate fetch, error handling, JSON parsing and state assignment.
The before-state object stays on one line so both states fit without smaller
type. Preserve the single-line fetch and native 800 ms morph.

Sources 75/76 are two native Shiki Magic Move steps on route 66, using an
800 ms transition. The wrapper remains shared while client mapping becomes
one BFF fetch and setData. Fetch fits on one line at 23 px. The title follows
the click state. Reduced-motion CSS suppresses token transitions; native print
is static. Current totals: 115 slides / 167 states. Source 77 onward maps to
source minus ten; website sample routes after the merge are 71, 103 and 115.
Earlier route counts below are historical. No new animation dependency.

### 14 KB audience question

Source 57 (route 48) shows only 14 KB, centered on the full canvas at 180 px,
with no footer or caption. The question is spoken, not printed. Source 58
(route 49) supplies the initial congestion window explanation alongside the
existing illustration and transport/server caveat. No additional slide or click.

### Post-demo solution summary checkpoint

The first recap combines sources 51–56 on route 47. Six distributed facts use
an explicitly titled “Current State” three-column composition with subtle
2 px rounded card borders, requested after the initial open layout: payload, requests and cache
above recovery, state and mapping. Payload is the dominant figure; existing
blue/yellow semantic emphasis highlights the key words. Markdown owns the
content and deck-local `.solution-summary` CSS owns the layout. No new runtime,
assets or click steps. Nuanced caveats remain in notes.

Only Demo 1 is consolidated pending visual approval. Later summaries should
reuse these category positions and emphasize improvements, not shuffle facts.
The deck now has 116 slides / 167 states. Source 51 represents sources 51–56
via `summarizesSources`; source 57 onward maps to source minus nine. Earlier
route counts and references below are historical. Website sample routes are
now 1, 3, 6, 42, 45, 72, 104 and 116.

### Website-inspired slides and character placement

The 2026-10-09 visual checkpoint draws from https://www.faziz-dev.com/:
local Figtree Variable, 800-weight headings, yellow emphasis underlines and
blue-edged yellow bands angled 14 degrees. Existing cream/ink and blue/yellow
tokens remain authoritative, including accessible text variants. Website
navigation and card layouts do not belong on the slide canvas.
Faris explicitly requires a continuous top-to-bottom diagonal band with no
avatar or duck overlay. Reserve the right-hand strip for the full-height band;
move characters inward and constrain text to a separate left column. Keep at
least 24 rendered pixels between the band and the full illustration box.
The short corner-band experiment is rejected. Bands are not character backdrops.

`styles/website.css` is opt-in through `class: website-skin`. Add
`website-cover` for the cover composition or `website-illustrated` for a
statement with a right-hand character. This does not change other decks or
untouched slides. Figtree is bundled locally under SIL OFL 1.1; there is no
Google Fonts or website request during presentation. Underlines also decorate
the individual MagicHeading character spans so emphasis survives that renderer.

The first checkpoint uses routes 1, 3, 6, 42, 45, 77, 109 and 121 in the caching
deck. Speaking Faris introduces the talk/demos, thinking Faris accompanies
questions, curious duck marks transitions, and celebrating duck closes.
Code, architectural diagrams, full-screen recordings and source photos remain
uncluttered. Review this sample before expanding the treatment.

Use only the four approved static PNG poses through `FarisIllustration`.
No reflection, redraw, sprite-sheet animation or missing ZurichJS shirt mark.
Decorative repeats use `decorative`; the existing QR and closing photo remain.
Example inside an existing statement layout:

```md
---
layout: statement
class: website-skin website-illustrated
---

# A Clear Question

<div class="website-character website-character--duck">
  <FarisIllustration name="duck-curious" decorative />
</div>
```

### Request explanation consolidation

Source 46's separate five-request/retry sequence is removed at the user's
request. The existing client diagram (source 47, now route 43) owns that
explanation with the same eleven clicks. Its notes retain the fixed upstream
API constraint and successful-result bookkeeping for selective retries.
No extra slide, click or diagram redesign. Current total: 121 slides / 172 states.
Source identifiers remain stable. Source 28–45 maps to source minus three;
source 47 onward maps to source minus four. Older dated route references are
historical. The unused ParallelRequests component remains recoverable in code.

### Response-time interactions

Route 21 uses “1 Second” at clicks 0/1 and “Greater Than 1 Sec” at click 2,
with the duration highlighted. This is Faris's clarified title request.

Routes 20–22 use deck-local ResponseTimeDemo with native click counts 1/2/1.
The 100 ms example clicks a checkbox. Route 21 now shows typing, with separate
“Typed” and “On Screen” lines. Click one has 70 ms feedback. Click two begins
the same way, then output falls three seconds behind, repeated letters arrive,
and backspace corrects them after feedback recovers. The sequence ends after
8.2 seconds. The one-second heading names a general guideline, not acceptable
keyboard latency. Static views show the correction moment. The ten-second
example now uses SearchWaitDemo: search for failed payments, wait ten seconds
as the pointer drifts away, then reread the query and scan the results. The
search starts at 0.4 seconds; results arrive at 10.4 seconds; reorientation
finishes 3.5 seconds later. A pointing hand sits over Search, switching to an
arrow as it drifts away; native mouse hover also uses `cursor: pointer`.
Native navigation never waits for it. One existing
click starts the scene; reduced motion, reverse navigation and print use static
states. Key words retain theme emphasis. These are authored illustrations, not measurements or exact
attention cutoffs. Simple captions stay audience-facing.

CSS animations run once on forward clicks in the active audience/presenter
slide. Native navigation can interrupt them. Reverse/deep-link/overview views,
reduced motion and print use static readable snapshots. No timers, dependency,
new runtime or real app requests. A pure response-time.ts owns durations and
ordered typing snapshots; CSS displays each snapshot once. Typed characters
and displayed characters remain separate, including queued output and deletion.

### Caching technical explanation contract

The caching talk distinguishes an unchangeable upstream API from the BFF we
can add ourselves. `QUANTITY = 5` means five upstream requests, confirmed by
Faris. Fetch examples throw on non-OK HTTP responses before consuming JSON
and pass the cancellation signal through to fetch.

The prefetch timeline starts both approaches at navigation. Request-time SSR
can delay the first byte; hydration avoids an extra client fetch only while
the matching query is fresh. Its bars are schematic, not measured durations.
The architecture keeps existing anchors, labels server Query state per request,
and distinguishes initial hydration from the client fallback/refetch paths.
`Promise.race` selects the first settlement; explicit helper cancellation is
what aborts a timed-out request. Faris confirmed that behavior, but the actual
helper source is not present. The revised callback signal contract must not be
described as a verified reconstruction of its original API.

Infrastructure and initial-window slides use scoped examples, not universal
provider bandwidth, startup, warm-lifetime or byte-threshold guarantees. Keep
references and validation limitations in the handoff documents, not slide
citations. Editable caching slide text and speaker notes contain no em dashes.
Original embedded recordings and raster assets retain their original pixels.

### Caching ingress/egress explanation

Routes 89/90 share deck-local `BoundaryTraffic.vue`: stable upstream API, BFF
and browser anchors, with a dashed box labelled “Our Server.” The diagram follows
response data, not the request leg. Blue marks ingress; dark ochre marks egress
for readable yellow-family emphasis on cream. Each slide has one native click.
Egress retains completed ingress without replaying it. Connector draws and
schematic packet dots finish within 980 ms, never gate navigation, and become
static arrows for reduced motion/print. Labels and arrows carry meaning without
color or motion. Dot counts and timing are not measurements or billing claims.
This stays a local explanatory component, not another diagramming runtime.

Use concrete wording for the ingress/egress explanation: data enters or leaves
the BFF. Apply Faris's vocabulary and punctuation preferences from AGENTS.md to
slide prose, accessibility descriptions, notes and agent explanations.

### Runtime ownership

Faris Slides is a thin local theme on top of Slidev 53. Slidev owns Markdown
parsing, routing, click animations, presenter mode, code highlighting, and
export. The theme owns the visual frame, token system, layouts, and small
brand-specific components. Decks own content and native Slidev interactions.

The system optimizes for real talks written mostly in Markdown. It is not a
general-purpose slide editor and it must not grow package seams ahead of proven
needs.

## Authoring experience

The shortest useful path is:

```text
brief → plan → Markdown draft → editorial pass → browser pass → rehearse/export
```

The author should be able to give an agent a talk goal, audience, duration, and
source material, then review concrete artifacts at each gate. Planning and
writing are separate. Writing and visual design are separate. This keeps an
agent from polishing weak claims into attractive slides.

Playwright drives the real Slidev deck during visual review. It checks the
rendered DOM and click states, captures full-size screenshots, and records
errors. The review output must say which slide and click state failed. An agent
can then fix the deck and rerun the same pass without reverse-engineering the
theme.

The anti-slop pass is editorial, not cosmetic. It removes generic openings,
significance inflation, vague attribution, padded groups of three, repetitive
sentence shapes, chatbot phrases, and claims that cannot be sourced. It keeps
specific technical language, short blunt sentences, and Faris's opinions.

## Approved visual direction

- Editorial composition with large type and intentional empty space.
- Warm cream and near-black surfaces.
- Blue and yellow are restrained accents. Orange is reserved for later use.
- Occasional handwritten-feeling notes, implemented as typographic annotations
  rather than a second decorative system.
- No purple gradients, glass cards, dashboard framing, or mandatory
  illustration on every slide.
- All visible titles and code remain real DOM content.

The approved avatar and blue duck in `references/avatar-approved.png` are
reference-only until clean standalone assets exist. Do not crop them out of the
contact sheet or wrap raster crops in SVG and call them vector artwork.

The original badge may be used intact. Its historical shirt detail is not a
source for future avatar artwork. The official ZurichJS mark remains the source
of truth for future logo geometry and placement.

## Architecture

```text
decks/showcase/slides.md
        │ Markdown, frontmatter, clicks, code
        ▼
packages/slidev-theme-faris
  layouts/        composition only
  components/     frame and approved asset wrappers
  lib/            typed config resolution
  setup/          Slidev-supported integration points
  styles/         tokens, base frame, layouts, code, motion
  assets/brand/   production-safe local copies only
  assets/illustrations/  cleaned static PNG poses and provenance manifest
```

There is one workspace theme package. Do not split core, motion, diagrams,
assets, or scenes into separate packages without a concrete reuse pressure.

### Code reading and change map

Start with `decks/showcase/slides.md` to see the public authoring API. Follow a
layout into `layouts/<name>.vue`, then `components/FarisSlideFrame.vue` for the
shared frame. `lib/config.ts` resolves overrides; `styles/tokens.css` owns
values, and the remaining stylesheets own composition, code, and motion.
`setup/shiki.ts` selects native syntax-highlighting themes.

- Change words, code, notes, or click steps in the deck Markdown.
- Change shared color/type/spacing in tokens; do not copy CSS into each deck.
- Change one layout's composition in its Vue file and layout stylesheet.
- Change override behavior in the typed resolver, not in individual layouts.
- Reproduce P1 with the root package scripts; `scripts/capture-p1.mjs` owns
  browser evidence, not presentation behavior.

The showcase is a visual fixture, not a researched conference talk. Its cache
example is illustrative and assumes external `productCache` and `catalog`
interfaces; it is not a standalone executable example.

The intended repository grows into a monorepo of talks, not a monorepo of tiny
framework packages:

```text
packages/
  slidev-theme-faris/      current shared visual system
scripts/
  slides/                  four-command authoring/review module
skills/
  slides-{plan,write,edit,review}/  explicit agent pass instructions
decks/
  <talk>/
    brief.md               audience, duration, outcome, constraints
    outline.md             timed beats and human approval gate
    slides.md              source of truth
    sources.md             claims, links, asset provenance
    review.md              latest editorial and visual findings
    components/            exceptional slide-only Vue code
    public/media/          local video, posters, demo captures
media/
  remotion/                future shared compositions and render entry
  sprites/                 approved source, atlas, metadata, preview
artifacts/
  reviews/<talk>/          screenshots, reports, exports
```

`scripts/slides/` is the shared authoring module, proven with showcase and
authoring-example. Its four commands create, run, review, and export a named
deck. `contracts.ts` owns validated inputs; `workspace.mjs` owns safe paths,
templates and reports; `slidev.mjs` isolates pinned Slidev/process integration;
`review.mjs` owns browser evidence; `cli.mjs` wires them together. A separate
package adds no current value. Review artifacts never overwrite approved P1
captures. Human outline and visual approval remain explicit agent/user gates.

## Authoring contract

Global defaults use flat scalar keys because Slidev types `themeConfig` as a
record of strings and numbers:

```yaml
themeConfig:
  farisMode: auto # auto | light | dark
  farisBackground: none # none | arc
```

Slides may override those defaults with custom frontmatter:

```yaml
---
layout: statement
faris:
  mode: dark
  background: arc
---
```

Resolution order is slide override, deck default, then theme fallback. Invalid
values warn once and fall back safely. Mode and background are scoped
on each `.slidev-layout.faris-slide` so adjacent previews and exports cannot
leak state.

### Initial layouts

- `cover`: default content plus `meta` and `visual` named slots.
- `statement`: default content plus `kicker` and `annotation` named slots.
- `code`: default code content plus `kicker`, `title`, and `annotation` slots.

### Initial component

- `FarisBadge`: renders the approved original badge intact from a local asset.

### P2a review additions

P1's direction is accepted. The variant gallery adds `section` with default,
`kicker`, and `visual` slots. Covers accept a per-slide `faris.coverVariant`:
`badge` preserves P1, `editorial` reserves a small companion illustration,
and `speaker` allocates a wider character region. Invalid values warn once and
fall back to `badge`. No conference palette changes are part of this review.

```md
---
layout: cover
faris:
  mode: dark
  coverVariant: speaker
---

# Modern frontend architecture

Patterns that survive production.

::visual::
<FarisIllustration name="faris-speaking" />
```

### Shared illustrations

The user approved the four likenesses and deterministic cleanup on 2026-09-26.
`FarisIllustration` is the shared theme module. Its interface is a `name`, an
optional contextual `alt`, and optional `decorative` boolean. Available names:
`faris-speaking`, `faris-thinking`, `duck-curious`, and `duck-celebrating`.
Authors do not need asset paths, image dimensions, mirroring, or logo placement.
Use it in a layout's `visual` slot; the layout controls size and position.

```md
::visual::
<FarisIllustration name="faris-thinking" />

<!-- For a purely decorative companion with no narrative meaning: -->
<FarisIllustration name="duck-curious" decorative />
```

`lib/illustrations.ts` owns typed names, local asset URLs, intrinsic dimensions,
and default descriptions. Unknown names and failed image loads produce a
visible unavailable-illustration placeholder. The browser review fails on that
placeholder. Decorative images have empty alt text; meaningful images can
override the default description. Never flip a finished avatar with CSS:
that would mirror its shirt lettering.

The four RGBA PNGs in `assets/illustrations` retain their source dimensions.
Both avatars have the official chest mark baked into the PNG, so standalone
use is branded too. The thinking pose retains the approved reflected direction;
its mark is unmirrored. The official source supplies white, blue and black JS;
its yellow field is masked away to reveal the garment, without a yellow patch.
This is raster compositing, not vector artwork. There is no runtime SVG mask.

`scripts/prepare-sprites.mjs` clears pixels below alpha 16/255 and composites
the official mark, without regenerating, cropping, or resizing the artwork.
`scripts/verify-sprites.mjs` verifies every non-logo pixel against that rule.
The manifest records source/output hashes, cleanup counts, logo pixel bounds,
reflection, and the rendering browser version. Preparation uses asset-only
`pngjs` via `NODE_PATH` and the existing Playwright dependency; it is not needed
to author or present a deck. See `media/sprites/PREPARATION.md` for reproduction.

Original generated files and prompts remain in `media/sprites/review-v1` as
unbranded source intermediates, not distributable avatars. The approved contact
sheet remains the identity reference. The sprites are four static raster poses,
not an animation atlas or an arbitrary-resolution illustration library.

Prefer native Markdown, `<v-click>`, code fences, line highlighting, notes,
presenter mode, and Slidev export before adding theme components.

## Agent workflow contract

Repository-local skill sources in `skills/` now expose these passes through
explicit AGENTS.md routing (not automatic app installation):

- `slides-plan`: produce a claim outline, source list, slide beats, and media
  needs. It changes no slide code.
- `slides-write`: turn an approved outline into concise Markdown and presenter
  notes.
- `slides-edit`: run the anti-slop pass, then check voice, density, factual
  support, and transitions.
- `slides-review`: run type/build checks, drive the deck with Playwright,
  inspect screenshots, and write `review.md`.
- Future `slides-media`: prepare an approved sprite, recorded demo, or Remotion render
  together with its poster and export fallback.

These are workflow passes, not reasons to expose theme internals. One agent may
run several passes in sequence. A pass must say what it read, what it changed,
what it checked, and where its evidence lives.

The detailed repeatable flow is in `docs/AGENT_WORKFLOW.md`.

## Portable website handoff

`artifacts/website-handoff/faris-brand-kit/` is a standalone export for Faris's
website agent, with a sibling ZIP for AirDrop. It copies the four final PNGs
and intact badge, a licensed local Inter Latin font, scoped semantic CSS, a
responsive light/dark preview, provenance hashes, and integration instructions.
Presentation assets remain the source of truth. No raw generated intermediates,
personal photos, or Slidev runtime are distributed. Website type uses responsive
rem/clamp values. This is not approval of a new homepage or an avatar redesign;
the recipient must inspect the destination repository and propose placement.

## Tokens and modes

The caching-dark-arts deck is dark-first: native Slidev `colorSchema: dark`,
`themeConfig.farisMode: dark`, and all explicit slide mode overrides are dark.
Slides without an override inherit that default. Other decks and the reusable
theme's explicit light mode remain unchanged.

Dark-scoped architecture styling uses bright client/server/API/risk colors
with dark focus surfaces and semantic foreground text. Response, egress,
cache-hit and interruption highlights remain legible on ink. Do not invert
photos, videos, logos or approved sprites with filters. Full-height diagonal
bands and the existing character separation apply equally in dark mode.

The logical canvas is 1280 × 720 with a 64 px safe margin and an 8 px spacing
rhythm. Initial typography uses local variable Inter and JetBrains Mono files.
No presentation-time network request is required for fonts.

Core brand primitives:

| Token | Value |
| --- | --- |
| Ink | `#0f0f10` |
| Cream | `#f8f4eb` |
| Blue | `#2e88b8` |
| Yellow | `#f4c63a` |
| Orange | `#ff9f00` |

Semantic foreground, background, muted, surface, border, text-blue, code, and
shadow tokens change per slide mode. Conference accents are not implemented in
the first milestone. A later scalar `themeConfig` contract may map
conference-specific CSS variables on the slide root without changing layouts.

## First visual checkpoint

The first checkpoint is intentionally limited to six slides:

1. Cover in light mode.
2. Cover in dark mode.
3. Statement in light mode.
4. Statement in dark mode.
5. Code in light mode.
6. Code in dark mode.

Each pair uses the same content so review isolates mode behavior. The statement
uses a native click reveal. The code slide uses native stepped line highlights.
Review artifacts are 1920 × 1080 PNGs plus a PDF export with click steps.

Do not add further layouts or asset production until this checkpoint is
approved. The user approved advancing to the P2a review on 2026-09-25.

## Quality rules

- Visual review is required after any design change.
- Capture waits for local fonts and images and fails on page errors, broken
  images, or layout overflow.
- The deck must build and export without an internet connection after install.
- Reduced motion must preserve all content and layout.
- Presenter notes and navigation remain Slidev-native.
- PDF is the review/export baseline. Editable PowerPoint is not promised by
  this architecture.

## Deferred Three.js path

Three.js is not part of the current dependency graph. If a future talk proves a
need, add one lazy-loaded slide component behind a client-only boundary with a
static poster fallback for reduced motion and export. It must not modify the
frame, authoring schema, or presenter controls. Keep it inside the theme until
at least two independent talks justify a deeper abstraction.

## Deferred media paths

### First real talk: payment orchestration

`decks/orchestrating-payments/slides.md` is the editable source for the migrated
84-slide talk. Preserve `sourceSlide` metadata and the original notes when making
visual edits. The original PPTX/PDF and `migration/source.json` are provenance,
not a regeneration pipeline. Do not overwrite later editorial work by extracting
again. Historical claims remain pending the review listed in `sources.md`.

This talk adds only deck-local `content` and `wide-code` layouts using the shared
FarisSlideFrame, plus `PaymentFlow` and static `DemoPlaceholder` components.
Promote these into the theme only after another talk establishes actual reuse.
Markdown owns headings, statements, tables and code; screenshots remain local
images. No whole-slide rasterization, new framework package or new dependency.

The seven code slides contain editable illustrative TS/TSX, not runnable payment
integration code. Two-column configurations read down the left then the right.
Dense code stays at least 20 logical pixels; use Slidev's code line-height and
padding variables to fit it, not clipping. Review checks code/header/footer
collisions in addition to canvas bounds.

Demo positions 57 and 77 intentionally contain original poster images and the
visible label “Video demo placeholder”. They have no playback controls, video
files or remote requests. Actual playback is a separate approved media slice.
Original morph transitions are not reproduced: discrete source beats remain
separate slides with a simple fade. The approved sprites and ZurichJS shirt
marks are unchanged; the intact badge remains on the cover and closing.

### Recorded demos

Use Slidev's native `SlidevVideo` with local MP4/WebM sources, controls, a
poster, and a print poster. Recorded demos are the dependable default for
conference Wi-Fi and PDF export. Codec support must be tested in the actual
presentation and export browser.

### Caching full-deck migration

`decks/caching-dark-arts/` contains 121 slides after the user removed the
Technologies, Next.js and TanStack Query introductions (source pages 25–27)
and the duplicate five-request sequence (source 46).
Retained `sourceSlide` values still identify the original PDF pages; do not
renumber them to match routes. See the current route mapping above.
The later TanStack Query solution examples remain. It is a review draft, not a
fact-approved or rehearsed talk. One deck-local `content` layout handles
flow/code/images with title and caption slots. Do not promote it or the payment
layout merely to merge their names.

PDF emphasis becomes semantic Markdown strong text: blue on cream and yellow
on near-black. Selected numbers, contrasts and takeaways carry the emphasis;
do not indiscriminately highlight every sentence. Ten decoded source images
are local PNGs with provenance and hashes in migration/source.json.

Audience copy must not include migration/review commentary such as “preserved
from the source”, “original source photograph”, or “needs verification”. Keep
provenance and unresolved checks in sources.md/review.md, not slide captions.
Per the user's follow-up, visible slides also omit citation/attribution lines,
source URLs and editorial labels such as “Illustrative Code/Comparison” or
“Paraphrased”. Keep credit, provenance and verification status in sources.md
and review.md. Substantive qualifications (configuration-dependent ranges,
conditional behavior) remain part of the explanation, not verification notes.
Per the user's casing preference, authored visible prose, headings, captions,
demo topics and diagram labels use Start Case (every word starts uppercase).
Preserve technical identifiers, official mixed-case names, URLs, handles and
case-sensitive units such as ms, s and Mbps. Code, hidden notes, source metadata
and text baked into original images/recordings are not mechanically recased.
The biography uses a full-height, edge-to-edge right-third photo montage with
object-fit cover, unchanged source bytes, and a left two-thirds text area.
Experience is six distinct items in two columns; community/open-source roles
are a separate group. The footer remains within the left text area.
The traffic photograph on source slide 4 and real-world-result images on
116–118 use native `layout: none` and
deck-local `caching-photo` styling: edge-to-edge cover fit, no visible title,
caption, footer or page number. The local image bytes remain unchanged.

Deck-local headmatter selects Slidev's native `view-transition`. The local
`vite.config.mjs` decorates rendered Markdown H1s with `MagicHeading`; ordinary
`# Heading` and strong emphasis remain the authoring API. Matching graphemes use
stable character/occurrence IDs. Following the user's smoother-motion request,
movement lasts 760 ms with `cubic-bezier(.45,0,.25,1)` for a gentle start and
landing, replacing the abrupt 420 ms ease-out. Snapshot crossfades use 320 ms
ease-in-out; the root group also stays at 320 ms so the background does not
linger for the full character movement. No stagger, bounce or navigation lock.
Word wrappers preserve normal space-based wrapping; the accessible H1 label
contains the complete heading. Body text, code and media use a short fade.
This is Keynote-like, not Apple's algorithm or an import of original effects.
The browser owns snapshots; there is no global overlay, custom router, animation
library, extra click or navigation lock. Slidev isolates overview/next previews.
Reduced motion and print disable character snapshots; unsupported browsers use
the native CSS fade. A small setup hook observes ViewTransition.ready because
Slidev 53 leaves expected rapid-navigation AbortErrors unhandled. Only the exact
“Transition was skipped” AbortError is tolerated; other errors are reported.
Diagram click motion remains independent and explanatory.

### Explanatory performance motion (2026-10-08)

Six deck-local compositions augment, not replace, the cumulative architecture:
LatencyRace (range chart and request/response pulses), TransferRace (same-byte
delivery), PayloadShape (records to aggregates), ParallelRequests (five lanes
and retry alternatives), CacheJourney (miss/fresh-hit/stale paths), and
PrefetchTimeline (relative overlap). NetworkIcon provides editable line symbols;
performance.ts owns example ranges, exact transfer arithmetic and pure states.
All are driven by native `$clicks`, with bounded CSS motion, no timers, external
requests, dependency additions or navigation locks. Readable static click states
remain in reduced motion and print. No shared theme/artwork changes.

Latency playback uses 1,200 ms plus 20 times each band midpoint. Ethernet now
takes 1,260 ms, giving each leg about 630 ms for large-screen visibility.
The same offset keeps connection ordering intact, with a four-second maximum
for the slow example. Playback does not preserve exact latency ratios; the
key says “Motion Slowed For Visibility.” The numeric axis/ranges are unchanged.
Ethernet means the device's wired connection, without implying a local server.
The retained 1–5 ms and broadband 30–70 ms values are example request times,
not matched measurements or connection guarantees. Ethernet can carry a
broadband connection too; these rows are not mutually exclusive network types.
Use short audience captions, with fuller qualifications in spoken notes.
4G/5G bands are ranges across UK operator medians in the six months to March
2025, not population ranges or universal guarantees. The final 80–200 ms mobile
stress state preserves the original poor-network argument as an assumption.
The plot uses one linear 0–200 ms axis; icons and labels supplement color.
Throughput uses decimal bytes, constant chosen Mbps and an explicit 200 ms fixed
cost. Download animations use the modeled milliseconds without acceleration:
200 ms wait, followed by the calculated transfer duration. Do not add playback
speed wording to slides or speaker notes. Navigation can skip an unfinished
download. Do not confuse the fixed cost with measured RTT.
Payload aggregates and prefetch timelines are schematic, not benchmark
data. Fresh cached data can avoid a fetch; stale data may remain visible during
configured refetch. The prefetch diagram does not promise zero end-to-end wait.

### Cumulative architecture contract

The user requested all four architecture diagrams as one evolving visual
system. This supersedes the separate geometry and client-only click contract
in the historical paragraphs below. `ArchitectureFlow.vue` renders one editable
SVG vocabulary, with `architecture.ts` as a pure snapshot model. Existing
ClientRequestFlow/ServerRequestFlow names remain small authoring adapters.
Every successor's step zero equals the preceding complete snapshot exactly.
Browser UI, loading, state/cache, rendered UI, API and recovery nodes retain
their anchors. The mapping node moves from browser to server on the BFF's
second click. Stable node IDs preserve identity during that movement.

Source 47/74/100/108 (routes 43/70/96/104) have 11/5/4/5 native clicks. Add only
new/change-specific highlights, not another replay of familiar blocks. Steps
are derived from `$clicks`; no timers, shared counters or custom navigation.
The brief connector draw lasts 600 ms, mapping translation 480 ms, and focus
fade 220 ms. There are no loops, forced waits or baseline entrance sequences.
Backward/deep-link state is deterministic. Reduced motion and print disable
movement while retaining the selected explanatory state.

Cream surfaces and Inter are unchanged. Blue means browser, ochre server,
green upstream API and orange recovery. A text legend, outline icons, node
labels and dashed alternative paths supplement color. Current nodes use tint;
familiar nodes stay readable and quiet. The diagrams are local to this deck,
not a new theme package or general diagram engine. Small server/query variants
are adaptations of the existing case study, not executable network models.
Query retries call the BFF; selective upstream retry still needs custom policy.
Prefetch success hydrates the client cache; timeout uses the existing client
fetch/retry path. Persistence and freshness remain configuration-dependent.

Historical pre-revision contract:

`ServerRequestFlow.vue` provided BFF/query/prefetch variants for 74/100/108.
Blue client, yellow server, green upstream API and orange failure/recovery roles
have a labeled legend. Retry routes use gutters and dashed strokes; labels stay
clear of arrows. These are editable explanatory SVGs, not executable systems.

Text and TypeScript remain Markdown. `ClientRequestFlow.vue` is an editable
SVG diagram with labeled success/failure/retry routes and the source 429 risk.
The user requested clearer component separation: pale blue nodes identify client
UI/data work, yellow identifies API requests, and orange identifies risk/retry.
A labeled legend, semantic outline icons and dashed failure routing carry meaning
without color alone. Keep the success path left-to-right and the retry loop below
it, returning to the requests. Vue useId gives each rendered instance unique
arrow markers. The tinted surfaces/darker outlines are local diagram roles, not
a new global palette or icon dependency.
The narrated revision keeps this as one source slide with `clicks: 11` and
`<ClientRequestFlow :step="$clicks" />`. Markdown owns the per-step captions
and eleven `[click]` speaker cues. The component derives visibility/emphasis
only from that prop: upcoming parts are hidden, earlier parts are dimmed, the
current part has a thicker outline, and step 11 restores the complete diagram.
Steps 0–5 build UI, parallel requests, loading, mapping, state and render.
Step 6 adds a conditional Effect/state-bug loop above the main path, returning
from Render UI to API requests. Step 7 introduces failure/custom retry; 8 and 9
highlight ALL and ONLY FAILED separately; 10 returns to requests while loading.
Both retry options remain visible and distinguishable without color alone.
No custom click listeners, timers or shared counters. Reduced motion removes
the opacity transition, not explanatory steps. Expanded PDF preserves all twelve
states; final-state export ends on the complete diagram. Do not suggest that
every React render refetches: the loop requires erroneous fetching/state/Effect
logic. The 5,000/1,000 quantities are Faris's supplied case-study constraints.
This uses the existing scoped frame and semantic colors, not a new diagram
package. No shared brand or sprite artwork changed.

The user's full-canvas revision puts each recording on native `layout: none`,
with `class: slidev-layout faris-slide caching-video`. Deck CSS removes padding
and gives the video the complete canvas, including PDF posters. There is no
heading, caption, decoration, footer or page number on a recording slide.
`object-fit: contain` preserves all recorded UI, with aspect-ratio side bars
where necessary. Do not crop or stretch demo evidence to eliminate those bars.
Each recording follows its original source intro (49/81/113), now labeled with
number and topic: client-side fetching; BFF with payload shaping; server
prefetching with TanStack Query. `demoIntroFor` also identifies the following
recording. No additional routes or invented source identities are needed.

Videos are ordinary native `SlidevVideo` directly in Markdown, with controls,
playsinline, preload="auto", local MP4 source, poster and printPoster. They do
not autoplay or loop; native route changes pause playback. Auto preload avoids
a persistent native loading indicator observed with metadata-only loading.
Large source files remain byte-identical (~359 MB total), so local-server use
is the supported checkpoint workflow; optimize derivatives only if needed.

Playback posters are decoded source frames at one second. Print posters use
visually reviewed chart results at 15, 7 and 12 seconds respectively. The third
recording contains demo 3 and demo 4; keep it intact. Preparation scripts are
one-deck migration helpers, not a generic Keynote import product. They save
hashes and media metadata beside the deck. No Keynote notes, trim or build
fidelity is claimed until those properties are actually recovered.

The generic Playwright pass checks local video buffered readiness (readyState 4),
seek completion, decode errors and poster presence/decoding before capturing.
It first waits for the active slide layout to mount, so an empty media query
cannot incorrectly satisfy readiness while an async slide is still loading.
It allows two seconds for native media controls to settle after readiness,
without playing the video or hiding controls. Navigation waits for DOM load plus
explicit content readiness, not network idle during a large video download.
Text-font checks apply when visible text exists, not to video-only slides.
`scripts/review-caching-media.mjs <successful-review-directory>` separately
checks the real production output with external traffic blocked: playback,
seeking, pause-on-leave, paused return, overview and presenter view. It does not
invent synchronization between separate native video elements. The checkpoint
test confirmed that playing in presenter view leaves the audience video paused.
Operate the audience window's controls; rehearse the actual two-window setup
before presenting. A synchronized playback controller is not implemented.

### Interactive websites

Use Slidev's native iframe layouts for simple live embeds. A remote site is an
online enhancement, never the only way to understand a slide. Each embed needs
a local poster or short recording plus a visible URL. A later `DemoEmbed`
module is justified only when at least two decks need the same live/print/
offline switching behavior.

Local interactive demos may live beside their deck and build into that deck's
public assets. Promote a demo to shared workspace code only after reuse is
real.

### Remotion

Remotion is a future authoring adapter, not a runtime dependency of every deck.
Compositions render versioned MP4/WebM files and poster frames into a deck's
local media folder. Slidev then plays the output through `SlidevVideo`. This
keeps React and video rendering out of the slide runtime and gives PDF export a
deterministic still. Recheck Remotion's version, license, codecs, and rendering
requirements before adding it.

### Sprites

A sprite is a reviewed asset bundle: approved source art, a transparent atlas
or frame sequence, metadata, and a preview page. The preview must show every
pose on light and dark surfaces. Playwright captures that page so alpha edges,
scale, identity, and timing can be reviewed. The approved avatar sheet cannot
be silently cropped into a sprite pack; clean production artwork is a separate
delivery.

## Version contract and primary documentation

- Slidev packages are pinned to 53.0.0 for this checkpoint.
- Node.js 22.12 or newer is required by the selected Slidev release.
- Revalidate extension points before a Slidev major upgrade.

Primary references:

- <https://sli.dev/guide/write-theme>
- <https://sli.dev/custom/config-fonts>
- <https://sli.dev/custom/config-highlighter>
- <https://sli.dev/guide/exporting>
- <https://sli.dev/guide/presenter-mode>
- <https://sli.dev/builtin/components#slidevvideo>
- <https://sli.dev/builtin/layouts#iframe>
- <https://www.remotion.dev/docs/player/>
- <https://www.remotion.dev/docs/render/>
