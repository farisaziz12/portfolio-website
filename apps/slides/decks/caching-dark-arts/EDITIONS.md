# Editions

One talk, several conference cuts. `slides.md` is the main deck. Each edition is a
sibling `slides.<edition>.md` that imports slide ranges with `src:` and overrides
only the slides that differ. Components, layouts, `style.css` and `public/media`
are shared, so a fix in `slides.md` reaches every edition on its next publish.

| Entry | Event | Published at | Differs from its base |
|---|---|---|---|
| `slides.md` | Original deck | `/slides/caching-payloads-dark-arts/` | (base) |
| `slides.react-advanced-london.md` | React Advanced London 2026, as "Built for Turbulence" | `/slides/built-for-turbulence/` | From `slides.md`: 1 title and byline, 2 Who Am I, 15 shorter question, 42 API limits, 58 last caption |
| `slides.heapcon.md` | HeapCon 2026 | `/slides/caching-payloads-heapcon/` | Same as React Advanced except 1 (original title, byline without a job title) and 2 ("Previously Worked With") |

`published.json` records which entry each URL was last published from. The
interactive menu (`pnpm slides`) uses it to offer "Update /slides/<url>/" and to
warn before one version overwrites another's URL.

Publish (from the repo root, or pick "Publish" in `pnpm slides`):

```bash
pnpm slides publish caching-dark-arts --slug caching-payloads-dark-arts
pnpm slides publish caching-dark-arts --edition react-advanced-london --slug built-for-turbulence
pnpm slides publish caching-dark-arts --edition heapcon --slug caching-payloads-heapcon
```

Each published folder is a snapshot. Republishing one only changes that URL.

## Adding or changing an edition

Run `pnpm slides`, pick this deck, then:

- Main deck > "Make an edition for another event": starts from the main deck (or a
  copy of an existing edition, e.g. React Advanced to reuse its changes).
- An edition > "Change a slide for this edition": copies that slide into the edition
  file and prints `file:line` to edit. "Add" and "Remove" work the same way.

Each of those edits re-resolves the deck and rolls back if any other slide changed.

Rules the menu relies on:

- Editions import only from `slides.md` (`src: ./slides.md#3-14`). Ranges count
  slides in the target file, so importing from another edition breaks as soon as
  that edition changes. Copy an edition instead of importing from it.
- The edition's first slide carries the deck settings (theme, title), so it stays.
- An edited copy no longer follows `slides.md`. Keep copies to the slides that
  genuinely differ, and fold a change back into `slides.md` when every edition wants it.
- The last import is open-ended (`#59-`), so slides appended to `slides.md` reach
  every edition. Inserting or deleting slides in the middle of `slides.md` shifts
  every edition's ranges: check each edition's "List slides" afterwards.

## Provenance

The React Advanced and HeapCon builds were first made by editing minified output
(commits 6d7136e to a8d4216, and 3bba949 to 1a1c0c9). These entries reproduce them;
rendered text matched on all 109 slides at first and last click when ported.
