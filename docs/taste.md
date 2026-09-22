# Taste: extracting signal from reference sites

A method for reading a reference site against this one, and the keep / translate / reject decisions that now drive the pages. Run the same six layers on the next reference. Do not copy pixels.

Companion: [`ui-rules.md`](./ui-rules.md) is tokens, contrast, and primitives. This file is *why* the pages are written the way they are.

## The six layers

Score every finding **keep**, **translate**, or **reject** for this site — never “copy.”

1. **Intent** — What should a stranger believe in ten seconds?
2. **Grammar** — Labels vs complete sentences. Kickers vs claims.
3. **Proof grammar** — Is evidence counted, quoted, played, or summarized?
4. **Signature object** — The one thing only this person has.
5. **Refusal list** — What the site will not do.
6. **Conversion posture** — When and how it asks.

## Taste tokens (not color tokens)

- Sentence-as-heading
- Evidence-is-the-section
- Honest counting in prose
- External voice, unedited
- One cinematic object per viewport
- Ask after proof
- One reading measure (62–68ch prose)

## Editorial essay vs conversion machine

| Layer | Editorial speaker site | This site (now) | Verdict |
|---|---|---|---|
| Intent | One identity sentence a stranger can repeat | Staff engineer who ships payments and speaks about it | **Translate** the sentence form; keep Faris’s facts |
| Grammar | “I'm [name],” / “I speak at conferences.” | Name stack, kickers, “What brings you here?” | **Translate** |
| Proof | The object *is* the section (talks, quotes, a book) | Stats ticker, map, social wall, topic cards | **Translate**: prose numbers + unedited quotes; keep the wall |
| Signature | One cinematic archive or essay object | Working hero terminal + photo mosaic | **Keep** Faris’s objects |
| Refusal | No skills grid, no audience router | Conversion machine with four doors | **Keep** the doors; **reject** the SaaS card grid |
| Ask | Late, after proof | Invite / Work with me, early and often | **Keep** the forms; they can sit high *and* at the bottom |

**Keep (Faris-only):** hero terminal, photo mosaic, invite forms, reach map, quarter wrap, dark-first electric blue, Space Grotesk / Hanken Grotesk / IBM Plex Mono.

**Reject (do not clone):** another person's biography, a serif-essay restyle, dumping the terminal, killing `/invite`, a vanity talk carousel without recordings, a memoir-length story page.

## How to run this on the next site

1. Write the stranger’s ten-second belief in one sentence.
2. List every homepage heading. If most are labels, the grammar is product. If most are sentences, it is an essay.
3. For each section, name the *object* that proves the claim. If the object is a card grid summarizing the claim, it is not proof.
4. Name the one cinematic object. A second one has to lose.
5. Write the refusal list from what the site *will not* show.
6. Note where the first ask appears. Move ours only if proof is missing above it.

Then score keep / translate / reject before touching CSS.
