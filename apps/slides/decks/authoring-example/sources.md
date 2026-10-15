# authoring example: sources

Checked 2026-09-29.

- Slides 1-3 reuse `decks/showcase/slides.md` (original slides 1, 4 and 5).
  The scope statement and cache-policy annotation are opinions, not research
  findings or quotations. No measurements or external experience are claimed.
- Slide 3 is illustrative: the cache and catalog are injected assumptions.
  A cached product is a truthy object; ttl is assumed to mean seconds in this
  fictional cache interface. The example makes no invalidation, failure,
  concurrency or performance guarantee. `scripts/example-code.test.mjs`
  exercises the displayed hit and miss paths with in-memory test doubles.
- The original badge is used intact through `FarisBadge`. Source:
  `references/original-badge.png`; no personal photos or new art are used.
- Native click and export behavior was checked against the installed Slidev
  53 source and official documentation:
  [animations](https://sli.dev/guide/animations),
  [exports](https://sli.dev/guide/exporting).

This fixture demonstrates the tool, not evidence that the draft is ready for
a conference. Timing and audience understanding still need human rehearsal.
