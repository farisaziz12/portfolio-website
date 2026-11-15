# Reverse Engineering Seniority: review

Outline approval: pending. This is a one-to-one migration Faris asked for in chat on 2026-11-13 ("convert this into a new deck for me").
That message is not an approval of outline.md; Faris records it through `pnpm slides` > "Approve the outline".
Draft: slides.md written 2026-11-13 by agent from the source PDF, 98 slides / 98 states, `sourceSlide: 1..98`. No notes (the PDF has none).
Deck-local additions: layouts/media.vue (screenshots and photos), style.css, migration/source.json.
Visual direction: the source's dark-to-magenta gradient is replaced by the theme's dark mode, per the brand rule against purple gradients.
Its yellow highlight words are kept, in the theme's yellow.
Test: scripts/seniority-migration.test.mjs (source identity, wording against the PDF, asset hashes, redactions). 4/4 pass.

Claims/code review: not run. Open items in sources.md.
Editorial/anti-slop pass: not run. The wording is Faris's own from the source deck; only typos were fixed.
Browser review: passed 2026-11-13 (typecheck, build, 98 states, only the known FloatingVue warning).
Run: artifacts/reviews/reverse-engineering-seniority/2026-11-13T22-52-56.813Z-CLddKx (local; artifacts/ is gitignored). Slide 63 now shows the 1:1 doc unblurred, at Faris's request.
Agent inspected every screenshot. Fixed in the pass: stray empty-annotation mark hidden deck-locally; slide 24 phone screenshot
overflowed the footer; slide 98 contact lines merged into one; axes heading moved as the list grew (now top-anchored).
Human visual review: not run.
Rehearsal/export review: not run.

Next gate: Faris reviews the deck (`pnpm slides dev reverse-engineering-seniority`), approves the outline through the menu,
then `pnpm slides publish reverse-engineering-seniority` when it should go on the site.

## Edition: halfstack-vienna (2026-11-15)

`slides.halfstack-vienna.md`, HalfStack Vienna 16 November 2026, as "When Writing Code Is No Longer the Bottleneck:
Rethinking Engineering Seniority". 79 slides / 81 states; 25 imported ranges from slides.md, 21 new slides. See EDITIONS.md.
Built from the cut/add plan agreed in chat on 2026-11-15. Outline approval for the edition: pending (Faris, via the menu).
Open before delivery: slide 50 is a placeholder for one real trade-off story; slide 42 ("Which Axis Does AI Flatten?")
needs Faris's answer; slide 22 ("An Agent Can Speed Run That in an Afternoon") is opinion, not a measured claim.
Browser review: passed, run artifacts/reviews/reverse-engineering-seniority/halfstack-vienna/2026-11-15T09-10-12.585Z-iHnwPQ (passed after the Balance fix).
Agent inspected every final-click screenshot; "The Balance" list enlarged after that run.
