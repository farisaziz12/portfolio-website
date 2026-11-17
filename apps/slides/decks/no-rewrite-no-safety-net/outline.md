# No Rewrite, No Safety Net: outline

Status: approved in chat 2026-11-17 (see review.md). 21 slides, about 19:30 of speaking. Dark mode.

Layouts: theme `cover`, `statement`, `code` and `section`. Beats marked `content` need a deck-local
`content` layout for tables, card grids and step rows (copy the pattern from `orchestrating-payments/layouts/content.vue`).
Labels: **fact** (needs a source or Faris's confirmation), **opinion** (Faris's view), **illustrative** (made-up example, labelled as such).
`[gap]` marks material only Faris can supply.

## 1. Setup (about 5:10)

1. **Cover** · `cover` · 0:30
   No Rewrite, No Safety Net. Navigating 13 years of React at scale. Faris Aziz, Staff Software Engineer, [Smallpdf / Netlify line].
   Visual: `FarisBadge`.

2. **A small change: where does this land?** · `code` · 1:00 · 1 click
   A one-line import swap of a shared price formatter, then the question. Point: in a 13-year-old app, one import reaches more paths than anyone can name.
   Evidence: **illustrative** diff. `[gap]` a real, sanitized diff would be stronger.

3. **Smallpdf, 13 years in** · `content` (2x2 figures) · 0:50
   13 years of React in production. Tens of millions of monthly users. Tens of millions in annual revenue. Five developers across three squads.
   Evidence: **fact**, from the abstract. `[gap]` confirm each can be said publicly.

4. **And the safety net?** · `statement` · 0:50 · 3 clicks
   No dedicated QA. No automated tests. Limited observability. Several generations of React, state, data fetching and tooling live at once.
   Evidence: **fact**, from the abstract.

5. **Every era is still in production** · `content` (table) · 1:00
   Rows: components, state, data fetching, tooling. Columns: oldest, middle, newest. One user flow can cross all of them.
   Evidence: `[gap]` the real generations in the codebase. The draft guesses (createClass, Flux, Redux, sagas, Gulp, webpack) must not ship unconfirmed.

6. **Rewrite, upgrade or migrate** · `content` (table) · 1:00
   Rewrite touches everything with high revenue risk for a long time. Big-bang upgrade moves every generation at once. Progressive migration takes one path at a time with bounded risk, and fits five developers. The roadmap does not pause.
   Evidence: **opinion**.

## 2. Build the mental model (about 3:40)

7. **01 Build the mental model** · `section` · 0:10

8. **Weird code is a hypothesis to test** · `content` (2x2 cards) · 1:10
   Deprecated paths still reached by old links and embeds. Partial migrations with two live implementations. Undocumented assumptions (locale, plan, file size, browser). Edge cases that encode a customer workflow.
   Evidence: **opinion**. `[gap]` one real story where "dead" code mattered. This is the strongest anecdote slot in the talk.

9. **Follow one request end to end** · `content` (six-step row) · 1:20 · steps revealed in order
   Entry, guards, state, data, render, side effects. Written down, this map is the first deliverable and the input for the AI part.
   Evidence: **opinion**. `[gap]` how long mapping one real flow took and what it revealed.

10. **Four questions per change** · `content` (numbered rows) · 1:00
    Who reaches this path? What does it read and write? How would it fail silently? Who pays if it breaks? Silent failures are the expensive ones with limited observability.
    Evidence: **opinion**.

## 3. Constrain the context (about 4:30)

11. **02 Constrain the context** · `section` · 0:10

12. **Give the agent a task, not the repo** · `statement` · 0:50
    A 13-year-old codebase holds several right answers to every question. With all of it in context, an agent picks one and sounds sure. How often a pattern appears says nothing about whether it is current.
    Evidence: **opinion**. `[gap]` a real case of an agent picking the old era's pattern.

13. **The context pack** · `content` (five rows) · 1:20
    Modules on the mapped path. Interfaces: props, store shapes, API contracts where modules meet. Assumptions stated as claims to challenge. Production evidence: logs, traces, analytics events, real payloads with personal data removed. Non-goals: legacy URLs, tracking, behaviour that must not change.
    Evidence: **opinion**.

14. **A scoped investigation prompt** · `code` · 1:10
    Task, scope, interfaces, assumptions, evidence, non-goals, output. The prompt asks for a table of call sites and divergence risk, not a patch.
    Evidence: **illustrative** prompt. `[gap]` a real, sanitized prompt.

15. **Agents investigate. Humans decide what ships.** · `content` (two columns) · 1:00
    Agents: targeted discovery, comparing patterns across eras, drafting characterization tests, checking a diff against the map. Humans: release safety, rollout size and timing, what counts as a regression, the rollback call.
    Evidence: **opinion**.

## 4. Size the risk (about 3:50)

16. **03 Size the risk** · `section` · 0:10

17. **Two axes decide how careful to be** · `content` (2x2 grid) · 1:10
    Reach (few or most users) against reversibility. Few and reversible: ship behind a flag. Few and hard to undo: pair review and dry runs. Most and reversible: staged rollout. Most and hard to undo: split it until each part is reversible.
    Evidence: **opinion**. `[gap]` one change that was split this way.

18. **Small decisions, multiplied** · `content` (formula plus three cards) · 1:10
    1 extra request per view × [__M] views per month = [__M] requests every month. Same for a fetch on mount, a heavier hot route, a per-user cache key. Put the number in the PR description.
    Evidence: `[gap]` real traffic figure, even an order of magnitude, cleared for public use.

19. **One path at a time** · `content` (five-step row) · 1:20 · steps revealed in order
    Characterize, isolate behind an adapter, flag, ramp with evidence, delete the old path and update the map. Deleting is the step teams skip.
    Evidence: **opinion**. `[gap]` real rollout stages.

## 5. Close (about 1:30)

20. **Three habits** · `content` (numbered rows) · 1:00
    Map the execution path first. Give agents a scoped task. Size each change by reach, reversibility and cost, then ship in steps.

21. **Thank you** · `cover` · 0:30
    faziz-dev.com, `[gap]` social handle, slides link or QR, Q&A channel.
    Visual: `FarisIllustration` (speaking pose), if Faris wants a character here.

## Evidence gaps, by priority

1. Public clearance for the Smallpdf figures and name (slides 1, 3), given the move to Netlify.
2. Real anecdotes: slide 8 (dead code that mattered), 12 (agent picked the old pattern), 18 (traffic number).
3. Real codebase generations for slide 5.
4. Sanitized real diff (2) and prompt (14).
5. Slides 9, 17, 19 stories and rollout stages.

## Open decisions for Faris

- Is about a quarter of AI content enough for the React with AI track, or should agent work move earlier (characterization tests, diff checks against the map)?
- Mode: dark (Faris, 2026-11-17).
