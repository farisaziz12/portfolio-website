# Editions

`slides.md` is the main deck: the one-to-one migration of the original PDF. Each edition is a sibling
`slides.<edition>.md` that imports slide ranges from `slides.md` with `src:` and adds only what differs.
Rules are the same as `decks/caching-dark-arts/EDITIONS.md`.

| Entry | Event | Talk | Differs from its base |
|---|---|---|---|
| `slides.md` | Original deck | Reverse Engineering Seniority | (base) |
| `slides.halfstack-vienna.md` | HalfStack Vienna, 16 November 2026 | When Writing Code Is No Longer the Bottleneck: Rethinking Engineering Seniority | New title. Cuts 13, 19-21, 26-29, 42-43, 48-51, 55-57, 59, 61-62, 64-74, 94-96. Adds AI bridges, a product-ownership section and four new takeaways (marked `*` in `pnpm slides status`). Slide 50 is a placeholder for one real trade-off story. |
