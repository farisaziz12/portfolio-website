# ZurichJS Conf Retrospective: review

Outline approval: approved 2026-11-08 by Faris, outline.md SHA-256: bdc09d45424fbb96e13ea4fdea00225d500f5f634b921ba48cec1bfe7c17c880. Message: "all good"
Draft: slides.md written 2026-11-08 by agent (slides-write) from the approved outline, 15 slides / 41 states.
Deck-local additions: components/BarChart.vue, components/DataGap.vue, style.css.
Fact correction vs outline: 119 (not 123) merged PRs from agent branches; see sources.md.
2026-11-08 update: admin data (read via Faris's admin session) filled A1, O1, O3, O4, F1, F2, F3.
Slides 6, 9, 10, 14 now use BarChart (weekly CFP, income by stream, paid tickets per month,
merged PRs per month). Slide 14 moved to origin/main (1e76dd7d, 21 Sep): 281 PRs, 164 agent.
Income rounded to ~CHF 1k per stream, ~CHF 170k total, per Faris's ±5% caveat.
Remaining gaps on canvas: O2 (organisers, slide 5), O5 (next edition, slide 15).
Needs Faris: confirm badge pickups (253) rather than door scans (156) as attendance; slide 10 opinion.
Revision 3 rebuild 2026-11-08: slides.md regenerated (now 87 slides, eight chapters, PostHog and industry context added; build_deck_v3.py) on Faris's flow draft
(Opening, Why, Landscape, Machine, Rollercoaster, Lessons, Close) at ~15 s per slide.
outline.md revision 3 is written but NOT approved: the recorded approval hash covers
revision 2. Faris must re-approve through the menu.
Generator used for the many one-number slides: session scratchpad build_deck_v2.py
(slides.md is the source of truth; edit it directly from here on).
From here on slides.md is the source of truth; edit it directly (the generator lived in
the 2026-11-08 session scratchpad and is not in the repo).
Claims/code review: not run. Priority claims to check: industry context (chapter 2),
attendance proxy (badges 253 vs scans 156), company-type classification.
Editorial/anti-slop pass: not run.
Browser review: latest pass 2026-11-08 run 2026-11-08T16-52-04.292Z-Z3XReD (slides 4, 6, 9, 14 inspected). Earlier: passed 2026-11-08
(typecheck, build, 41 states; only the known FloatingVue warning). Run:
artifacts/reviews/zurichjs-conf-retrospective/2026-11-08T16-38-26.473Z-dXpvGH.
An earlier run (2026-11-08T16-37-04.809Z-lGzQwD) failed on slide 14 overflow; fixed
by a one-line heading and a shorter chart. Agent inspected final-click screenshots for
every slide: no collisions or clipping; stray empty-annotation underline hidden deck-locally.
Slide 4 timeline leaves empty space below; slide 14 lesson note sits close under the facts line.
Human visual review: not run.
Rehearsal/export review: not run.

Save concrete findings by slide and click state, changes made, commands run,
the exact artifact run directory, remaining limitations and the next gate.
Do not mark a pass complete merely because its command or checklist exists.
