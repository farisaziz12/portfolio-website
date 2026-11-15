# Editions

`slides.md` is the main deck: the one-to-one migration of the original PDF. Each edition is a sibling
`slides.<edition>.md` that imports slide ranges from `slides.md` with `src:` and adds only what differs.
Rules are the same as `decks/caching-dark-arts/EDITIONS.md`.

| Entry | Event | Talk | Differs from its base |
|---|---|---|---|
| `slides.md` | Original deck | Reverse Engineering Seniority | (base) |
| `slides.halfstack-vienna.md` | HalfStack Vienna, 16 November 2026 | When Writing Code Is No Longer the Bottleneck: Rethinking Engineering Seniority | New title. Cuts 19-21, 26-29, 59, 62, 75, 94-96. Rewords 55. Moves 63 into a new product-ownership section. Adds AI bridges, three suggested slides on which axis AI flattens, and four new takeaways (marked `*` in `pnpm slides status`). |
