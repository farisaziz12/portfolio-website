Stay in plan mode. Do not implement anything yet.

We are building Faris Slides, my personal presentation system on top of Slidev. I am a staff software engineer who gives technical talks and workshops. I want recognisable decks, quick Markdown-first authoring, reusable layouts and diagrams, consistent motion, light/dark modes, conference accent overrides, and eventually selected Three.js visuals.

First inspect this project and its instructions. Read AGENTS.md, docs/PROJECT_BRIEF.md, docs/DESIGN_SPEC.md, docs/ACCEPTANCE.md, docs/SOURCE_NOTES.md, and references/README.md. Open the referenced images, not only their filenames. Do not assume you can see my prior ChatGPT conversation.

The approved direction is a clean editorial deck with warm cream/near-black surfaces, bold type, restrained blue/yellow accents, short handwritten notes, and occasional flat illustrations of me and the blue duck. Preserve the approved face, nose, glasses, skin tone, and drawing style. My yellow shirt has a small ZurichJS logo on the wearer's upper-left chest, not the center. Its white top triangle points down, its blue left triangle points right, and its yellow lower-right region blends into the shirt. Keep the duck unchanged. Do not reopen the branding exploration.

Inspect the current repository and current official documentation before selecting architecture or APIs. Distinguish existing code from proposals. The handoff images are raster references, not production SVG assets or correct code examples.

Prefer one reusable local theme package plus example decks. Keep components, assets, motion, and tokens as internal modules until there is a concrete reason to extract packages. Reuse Slidev's native facilities. Do not plan a custom renderer, router, editor, CMS, compiler, or CLI for v0.1.

The first implementation checkpoint after approval should be only the visual foundation plus cover, statement, and code slides in light and dark mode, with six browser screenshots and a basic export. Review that before expanding to the proposed ten layouts, a 12 to 15 slide showcase, one conference accent preset, and a tiny second deck proving reuse.

Return an implementation-ready plan covering:
1. Your understanding of the fixed design and product decisions.
2. Repository findings, selected architectural boundaries, and file responsibilities.
3. Native Slidev capabilities versus code we genuinely need to add.
4. A small proposed authoring API, with three representative Markdown examples. Mark custom Faris metadata explicitly and show how it will be consumed.
5. Asset inventory, preparation work, and honest quality limitations.
6. Milestones, deliverables, acceptance criteria, and a first implementation slice small enough to review independently.
7. Browser screenshot tests, visual review, type/runtime checks, offline behavior, presenter/click behavior, reduced motion, and static export testing.
8. Risks and the deferred path to a single Three.js/TresJS scene, including lifecycle and export considerations without building that layer now.
9. Only questions that materially block a sound plan. State sensible defaults for other decisions.

Do not install dependencies, scaffold, edit repository files, generate new artwork, commit, push, or deploy. Present the plan in this conversation and stop for my approval.
