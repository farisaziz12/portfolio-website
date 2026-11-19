# No Rewrite, No Safety Net: outline

Status: revision 2, 2026-11-19. Restructured from Faris's chat feedback of 2026-11-19 (quoted in review.md):
new opening, Netlify role and bio, real constraints, three checkouts as the running example, a migrate-while-hot section,
and about 30 seconds per slide with one idea each. 48 slides, about 20 to 22 minutes at 30 seconds a slide (dividers and one-line statements run shorter). Dark mode.
Revision 1 (approved in chat 2026-11-17, SHA-256 e191bf5f440a0d287664f76826787e660beccb56ff42b7b351488a5f54b5440b) is superseded.

Layouts: theme `cover`, `statement`, `code`, `section`, plus the deck-local `content` layout.
Labels: **fact** (sources.md), **opinion**, **approach** (a recommended way of working, not a claim about what the team did).

## 1. Setup (slides 1 to 22, about 9:30)

1. Cover: Faris Aziz, Senior Software Engineer @ Netlify
2. Who am I? (bio slide from the caching deck, updated)
3. The React we hear about: `<Activity>` (19.2) **fact**
4. `useEffectEvent` (19.2) **fact**
5. React Compiler 1.0 **fact**
6. But what if you're on React 16?
7. redux-saga, all over the place **fact** per scan
8. Many paths into the same views **fact** per Faris
9. 13 years of React, used by tens of millions every month (merged)
11. About 50,000 users see a release within 30 minutes **fact** per Faris
12. Five developers
13. Accounts have been migrated more than once **fact** per Faris
14. Web views inside mobile apps, sharing views with the web **fact** per Faris
15. Every browser, including Safari's storage limits **fact** per Faris
15a. A/B tests outlive their enrolment: closed to new users, existing segments kept **fact** per Faris (2026-11-19)
15b. Assignment lives in localStorage, so a login on a new browser loses it **fact** per Faris
15c. Derive the variant from the account: account flags such as the payment gateway rebuild the assignment for parity **fact** per Faris
16. No unit, integration or end-to-end tests **fact** per Faris
17. Datadog runs out after two weeks **fact** per Faris, wording to confirm
18. Errors live in TrackJS, with limited filtering **fact** per Faris
19. Analytics: our own Redshift, queried in Metabase **fact** per Faris
20. The documentation is the code (three questions: safe to delete, blast radius, where AI fits)
21. Every era is still in production (generations table) **fact** per scan
22. Why we're still on React 16 (three clicks: hydration scripts, React 18 mismatches, hidden peer conflicts) **fact** per scan, React 18 effect reasoned

## 2. Build the mental model (23 to 28, about 3:00)

23. 01 Build the mental model
24. One checkout, three doors: mobile web view, marketing emails, UTM landing pages **fact** per Faris
25. Follow one checkout end to end (six steps) **fact** per scan
27. When is it safe to delete code?
28. Five kinds of evidence **approach**
28a. Not urgent? Mark it deprecated and add a deprecation event; watch usage fall **fact** per Faris (2026-11-19)
28b. Fewer branches, fewer events to watch (cyclomatic complexity) **fact** per Faris
28c. Events aren't free at millions of users **fact** per Faris

## 3. Constrain the context (29 to 33, about 2:30)

29. 02 Constrain the context
30. Give the agent a task, not the repo **opinion**
31. The context pack **approach**
31a. We built an MCP server for Redshift: agents can query every event table **fact** per Faris (2026-11-19)
31b. Every PR: a CLAUDE.md / AGENTS.md rule finds the hot-path events in the diff and checks their volume **fact** per Faris
32. A scoped prompt: map every door into checkout **approach**
33. Agents investigate. Humans decide what ships. **opinion**

## 4. Migrate while it's hot (34 to 40, about 3:20)

34. 03 Migrate while it's hot
35. Two axes: reach × reversibility **approach**
36. Small decisions, multiplied: about 2.4 million extra requests a day from one extra request per session (arithmetic from slide 11)
37. One front door: a facade in front of three checkouts (strangler fig) **approach**, sourced
38. Run both, compare (branch by abstraction, parallel run) **approach**, sourced
39. Ramp one door at a time, then delete **approach**, sourced
40. Where AI fits at each step **approach**

## 5. Close (41 to 42, about 0:50)

41. Three habits
42. Thank you

## Evidence gaps

1. Public clearance: Smallpdf figures, React version, vendor names (Datadog, TrackJS, Redshift, Metabase), the three checkouts.
2. Slide 17: does "Datadog runs out after two weeks" mean the retention window or the budget?
3. React version: Faris said 16.8 in chat; the scan read 16.14. Slides say "React 16".
4. Slides 37 to 39: did Smallpdf consolidate the three checkouts? Until confirmed they are framed as the approach, not a story.
5. Slide 30: a real example of an agent picking the old pattern.
