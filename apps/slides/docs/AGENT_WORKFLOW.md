# Agent workflow for authoring talks

This is the repeatable workflow for humans and agents. P2b implements the four
commands and planning/writing/editing/browser passes below. Rehearsal and media
reliability remain separate, incomplete gates.

## One entry point

Run these commands from the workspace root after dependencies are installed:

```bash
pnpm slides new <talk>
pnpm slides dev <talk>
pnpm slides review <talk>
pnpm slides export <talk>
```

The implementation is one internal module in `scripts/slides/`, not another
workspace package. Deck names are lower-case kebab-case. `new` refuses existing
folders and writes a planning starter, not an approved talk. `dev` owns a fresh
loopback port and prints its URL; Ctrl+C stops only that server.

`review` runs typecheck, production build, and every native slide/click state.
It saves a fresh directory in `artifacts/reviews/<talk>/<run>/` with logs,
report.json, a machine review.md, screenshots, and the built web output.
Failures exit nonzero. Never edit captures into a passing baseline.

`export` defaults to PDF with every click step. For final-state PNGs use
`pnpm slides export authoring-example --format png --clicks final`.
An export run also gets its own artifact directory and report. It is not a
substitute for visual review. The checksum covers slides.md only, not imported
files or the theme; keep all sources stable during a run.

Read the relevant `skills/<pass>/SKILL.md` directly: `slides-plan`,
`slides-write`, `slides-edit`, or `slides-review`. They are repository-local
instruction sources, not automatically installed app skills. The protected
`.agents` directory was unavailable; AGENTS.md provides the routing instead.

Example prompts: "Use slides-plan to propose a sourced 20-minute outline; stop
for approval." Then "Use slides-write for the approved outline", "Use
slides-edit to review facts/code separately from voice", and "Use slides-review
for my-talk; inspect every screenshot and record unresolved decisions."

## Gate 1: brief and plan

Start in plan mode. The input is a short brief with:

- audience and expected knowledge;
- talk length;
- one outcome for the audience;
- claims or demos that must be included;
- source material and asset constraints;
- conference requirements.

The agent returns a slide beat sheet, evidence gaps, risky demos, likely media,
and a rough time budget. It does not style slides yet. The author approves the
argument before the deck grows.

Saved files:

```text
decks/<talk>/brief.md
decks/<talk>/outline.md
decks/<talk>/sources.md
decks/<talk>/review.md
```

Record the user's actual outline approval and approved outline checksum in
review.md before drafting. The CLI and passing machine reports never grant
approval. authoring-example reuses approved showcase material to demonstrate
the workflow; it is not a newly researched talk.

## Gate 2: Markdown draft

The agent writes the smallest complete deck in `slides.md`. It uses theme
layouts, native click steps, native code fences, and presenter notes. A local
Vue file is allowed when a slide genuinely cannot be expressed with the theme.

The draft should work without decorative art. Media requests stay as honest
placeholders until approved assets exist.

## Gate 3: writing review

Run separate passes so one concern cannot hide another.

1. Claims and code: verify facts, source every quotation, and compile or test
   code examples when practical.
2. Talk shape: check the opening promise, transitions, pacing, and ending.
3. Anti-slop edit: remove generic openings, inflated importance, vague
   attribution, padded lists, repeated sentence patterns, chatbot phrasing, and
   fake certainty.
4. Slide density: shorten or split slides before reducing readable type.
5. Voice: keep concrete opinions, useful friction, and phrases Faris would
   actually say aloud.

The agent writes the findings to `review.md`, applies approved edits, and notes
anything that still needs Faris's judgment.

## Gate 4: media plan

Choose the cheapest medium that explains the idea:

1. Real DOM text or code.
2. CSS or authored SVG diagram.
3. Static approved illustration.
4. Recorded product demo.
5. Interactive local or remote website.
6. Remotion video.
7. Three.js scene, only when the concept needs spatial interaction.

Every moving or remote item needs a static state. Store the live source,
rendered output, poster, attribution, and reproduction notes together.

### Recorded demo

- Keep the recording local to the deck.
- Provide a poster and print poster.
- Include controls; avoid relying on autoplay.
- Test playback from the production build with external requests blocked.
- Keep a visible URL or short recovery note in presenter notes.

### Interactive website

- Prefer a local build for a demo you control.
- If the source is remote, treat conference connectivity as optional.
- Provide a local poster or recording with the same teaching point.
- Test keyboard focus, escape behavior, load failure, and return to slide
  navigation.
- Never let an iframe cover presenter controls or capture shortcuts.

### Remotion clip

- Keep compositions outside the Slidev runtime.
- Render a video and poster into the deck's local media folder.
- Record the composition id, dimensions, fps, duration, and render command.
- Review the rendered file, not only the Remotion preview.
- Embed the result with `SlidevVideo`.

### Sprite development

- Start from approved source art.
- Keep source, transparent frames or atlas, metadata, and preview together.
- Preview every pose on cream and near-black backgrounds.
- Capture the preview with Playwright.
- Check alpha edges, consistent proportions, anchor points, frame timing, and
  reduced motion.
- Do not turn the approved contact sheet into a claimed production sprite.

## Gate 5: Playwright browser review

The review command starts the real deck and visits every slide and native
click state at 1920 × 1080. Current checks:

- block non-local requests unless a test explicitly covers an online embed;
- wait for local fonts and images before measuring the rendered DOM;
- wait for active-slide video buffered/seek readiness and poster decoding, then
  let native media controls settle without playing or hiding them;
- detect media decode errors and missing video posters;
- fail on unexpected console errors and page errors;
- detect broken images, clipped content, and tiny code;
- exercise forward and backward click navigation;
- navigate deep links and capture with reduced motion enabled;
- capture one PNG per state, whether or not it has visual approval;
- write a machine-readable report next to the images.

Streaming video is not a reason to wait for network idle: the adapter waits
for DOM navigation and explicit content readiness instead. Text-only font
requirements do not apply to a slide containing only video; negative probes
still verify missing fonts on actual text and missing posters/unloaded videos.

An agent inspects every full-size image. It records hierarchy, wrapping,
contrast, empty space, collisions, and media state in `review.md`. Screenshot
baselines change only after human approval.

Limits: 200 slides, 100 clicks per slide, 1000 total states. The adapter uses
the pinned Slidev 53 development navigation object and expects Faris layouts;
revalidate on upgrades. The known caught FloatingVue warning is recorded
separately; other console/page errors fail. Other-origin HTTP and WebSocket
traffic is blocked. The generic pass does not cover presenter/audience sync,
overview, playback controls, embed focus, full-motion comparison, numeric
contrast, or offline production rehearsal. The caching migration has a separate
production-media pass covering play/seek/pause, overview and presenter behavior
with external traffic blocked. That pass confirmed native videos in presenter
and audience windows play independently; it does not establish full rehearsal
or coverage for other decks. See that deck's review.md for exact evidence.

## Gate 6: rehearsal and export

Run the production build offline. Open audience and presenter views, check
notes, then rehearse the click sequence. Export PDF and PNG with the chosen
click policy. Render the PDF back to images and inspect it.

The handoff includes:

- commands actually run;
- checks that passed or failed;
- screenshots and exports;
- known online-only behavior;
- media fallbacks;
- the next approval decision.

## Agent handoff rule

`PLAN.md` says what is done and what happens next. `DESIGN.md` says why the
system is shaped this way. `review.md` inside a deck says what the current
artifact still needs. An agent should be able to resume from those three files
without reading a chat transcript.
