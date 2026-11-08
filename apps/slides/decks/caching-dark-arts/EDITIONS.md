# Editions

One talk, several conference cuts. `slides.md` is the main deck. Each edition is a
sibling `slides.<edition>.md` that imports slide ranges with `src:` and overrides
only the slides that differ. Components, layouts, `style.css` and `public/media`
are shared, so a fix in `slides.md` reaches every edition on its next publish.

| Entry | Event | Published at | Differs from its base |
|---|---|---|---|
| `slides.md` | Original deck | `/slides/caching-payloads-dark-arts/` | (base) |
| `slides.react-advanced-london.md` | React Advanced London 2026, as "Built for Turbulence" | `/slides/built-for-turbulence/` | From `slides.md`: 1 title and byline, 2 Who Am I, 15 shorter question, 42 API limits, 58 last caption |
| `slides.heapcon.md` | HeapCon 2026 | `/slides/caching-payloads-heapcon/` | From React Advanced: 1 original title, byline without a job title; 2 "Previously Worked With" |

Publish (from the repo root):

```bash
pnpm slides publish caching-dark-arts --slug caching-payloads-dark-arts
pnpm slides publish caching-dark-arts --edition react-advanced-london --slug built-for-turbulence
pnpm slides publish caching-dark-arts --edition heapcon --slug caching-payloads-heapcon
```

Each published folder is a snapshot. Republishing one only changes that URL.

## Adding an edition

1. Copy the closest edition file to `slides.<event>.md`. Its first slide carries the
   deck headmatter, so keep the cover (or another full slide) first.
2. Replace a range import with `src: ./slides.md#a-b` gaps around each slide you
   change, and paste an edited copy of that slide in the gap. Keep slide numbers
   aligned with the base unless the cut really adds or drops slides.
3. `pnpm slides dev caching-dark-arts --edition <event>`, then `review`, then `publish`.

An edited copy no longer follows `slides.md`. Keep overrides to the slides that
genuinely differ, and fold a change back into `slides.md` when every edition wants it.

## Provenance

The React Advanced and HeapCon builds were first made by editing minified output
(commits 6d7136e to a8d4216, and 3bba949 to 1a1c0c9). These entries reproduce them;
rendered text matched on all 109 slides at first and last click when ported.
