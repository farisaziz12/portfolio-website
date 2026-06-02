# Faris Aziz portfolio — voice & project guide

This is the canonical guide for any AI assistant (Claude Code or otherwise) writing or editing copy in this repo. Read it before writing user-facing prose. The rules here are policy, not preferences.

The email-subsystem doc lives at `apps/web/CLAUDE.md` — separate concern, kept narrow on purpose.

---

## Project map

- Monorepo. `apps/web` (Astro 5 site), `apps/studio` (Sanity v3 studio), `packages/shared` (types + utils).
- Stack: Astro 5 + Sanity v3 + Beehiiv (newsletter) + Resend (transactional email). Deployed on Vercel with 1-hour ISR.
- Copy lives in two places: Astro pages and components (`apps/web/src/pages/**/*.astro`, `apps/web/src/components/**`), and Sanity documents (blog post bodies, talk abstracts, event descriptions, testimonials, page overrides). Both surfaces follow the same voice rules.
- Pin Node 22 via `.nvmrc`. Sanity CLI doesn't run on Node 26.

---

## Voice in one paragraph

Faris is a Staff Software Engineer based in Geneva, ten years in. Built and shipped resilient frontend systems and payment integrations — the kind where a dropped request loses real money. Speaks at conferences (60+ talks, 12 countries) and runs ZurichJS (425 members and counting). The voice on this site is direct, specific, opinionated, and engineer-to-engineer. Short sentences allowed. Sentence fragments allowed when they earn their place. Name things — companies, conferences, products, people. If a sentence could be on any tech founder's site, rewrite it.

The anchor line is on `/about`: *"Engineer first. Speaker because of it."* Match that register.

---

## HARD BANNED PHRASES (never use)

### Meta-commentary & disclaimers
- "It is important to note that"
- "that's why it's just a 'X', but it's a 'Y'."
- "But here's the catch"
- "This underscores the importance of"
- "they don't just 'x', they start 'y'."
- "It cannot be denied that"
- "As of my knowledge cutoff"
- "And the X(benefit, mistake, big lesson)?" — attempted emphasis
- "They don't need 'x', they need 'y'."
- "you not only 'x', you know you can 'y'"
- "Because the transformation isn't 'x'. It's in the 'y'."
- "'a' aren't 'x'. They're 'y'."

### Generic openings & closings
- "In today's fast-paced world"
- "In this ever-evolving landscape"
- "In the digital age"
- "In conclusion" / "To summarize" / "Finally"
- "Let's delve into" / "delve deeper"
- "At its core" / "at the core"

### Overused transitions
- "Moreover" / "Furthermore" / "Additionally" — at most once per 800 words
- Consecutive paragraphs starting with "However" / "Therefore"
- The "X isn't the problem, Y is" construction (e.g. "the biggest enemy isn't churn, it's user apathy")
- **Rule-of-three sentence lists** — no "X, Y, and Z." constructions inside a single sentence (e.g. "fight this with more features, more ads, or more discounts"). This is the single most common AI tic in this codebase. Break into two items, or split across sentences.

### Buzzword clichés
- "Ever-evolving landscape"
- "Dynamic world of"
- "Digital realm" / "in the realm of"
- "Uncharted waters"
- "Embark on a journey"
- "Treasure trove of information"
- "Game-changer" — unless backed by specific metrics

---

## RESTRICTED WORDS (max 2 per page)

Corporate jargon cluster:
- leverage, optimize, enhance, utilize, synergy, notice
- deliverables, holistic, capability
- pivotal, crucial, groundbreaking, cutting-edge (unless paired with a specific metric)
- explore, delve, ensure, foster, embark

Vague qualifiers:
- significant, relevant, dynamic, innovative
- comprehensive, robust, streamlined

If a sentence uses one of these, ask: can a concrete verb or specific noun replace it? Usually yes.

---

## DO — patterns that make copy human

### Useful phrasings
- "If you want to actually [audience desire]…"
- A big separate **BUT** to flip the reader's expectation
- "Why aren't you [doing what you want them to do]?"
- "The real reason why [audience problem]" — as a hook
- "Here is the fix ↓"
- "One step at a time."
- "Want a deep dive on this?" — in a CTA
- "Most [target audience] think the biggest risk is X."
- "I'll show you my X-step process."
- "So how do you achieve [outcome]? Simple. Just follow this [framework]."

### Writing style
- Mix sentence lengths — aim for 20-30% of sentences under 10 words.
- Use contractions (you're, don't, can't).
- Sentence fragments are fine for emphasis.
- Register: explaining something to a colleague over coffee.
- Specific numbers beat "many" and "several".

### Voice & tone
- Be direct and opinionated when it earns its place.
- Share personal observations or first-person experience.
- Use industry terms naturally — Next.js, React, GROQ, payment intents, etc.
- Include insider details only Faris would know.
- Reference current events or timely examples.

### Structure variety
- Vary paragraph lengths — some 1-liners, some 4-5 lines.
- Transitions follow logic, not formula.
- End sections without announcing the ending.
- Let content flow without scaffolding language.

---

## DON'T — patterns to avoid

### Generic structure
- Don't follow an obvious intro-body-conclusion template.
- Don't start 3+ paragraphs with the same transition word.
- Don't make every paragraph the same length.
- Don't announce structure ("First, I'll discuss…").

### Tone mistakes
- Don't be overly polished or risk-averse.
- Don't use abstract balance statements without concrete examples.
- Don't speak in generalities without backing details.

### Content red flags
- No broad claims without specific evidence.
- No "research shows" without naming the research.
- No platitudes that could apply to any topic.

---

## Specificity baseline

Every marketing page (anything more than ~200 words of prose) should clear these:

- **≥3 proper nouns** — companies, conferences, products, people, places.
- **≥1 concrete example** per main point. Numbers, names, dates, places.
- **Citations** — if you reference a trend or stat, name the source.

Faris's go-to proper nouns, reuse naturally:

- Companies / products: Stripe, Alipay, Smallpdf, Vercel, Next.js, React, TanStack Query, Sanity, Beehiiv, Resend, Cal.com
- Conferences: ReactSummit, Voxxed Days, CityJS, React Advanced, ZurichJS, JSDay, Frontend Nation
- Places: Geneva, Zurich, APAC, San Francisco, Singapore
- People: keep specific testimonial attributions verbatim; if a quote is from "Tejas Kumar" or "Hammad Hassan", say so.

---

## Newsletter-specific guidelines

### What this newsletter actually is

A running notebook from the conference road and the engineering trenches. Mix of:

- **Conferences attended or spoken at** — talks worth recommending, tools worth trying, ideas to advocate for. Faris travels a lot; this is the field reporter slice.
- **React / Next.js / TanStack** — framework-agnostic at heart, but these are the day-job tools. Snippets and patterns from production.
- **Payments + monetization** — one slice, not the dominant theme. Quick tips when something is genuinely worth a look. Don't anchor every issue here.
- **Workshop Q&A** — questions from his workshops that deserve a wider audience.
- **Talk snippets** — bits from talks Faris has given.
- **Recommendations** — books, tools, talks, podcasts he comes across and rates.
- **Speaker schedule** — where he's speaking next; quick recap from the last one.
- **Subscriber perks** — discounts to events Faris is tied into, partner offers for his network.

**Anti-patterns to avoid when writing about the newsletter:**
- Don't pitch it as "deep technical writing" — that's the blog.
- Don't pitch it as a payments-only newsletter — payments is one stripe of many.
- Don't pitch it as a weekly schedule — it goes out when there's something worth saying.
- Don't tricolon the topics ("X, Y, and Z") — break into fragments or two-item pairs.

The voice anchor: *"the stuff I'd tell a colleague over coffee but never get around to writing up — plus reader-only perks."*

### Subject lines
- Use specific numbers: "3 changes" not "several updates".
- Reference current events or recent developments.
- Direct questions about reader challenges work.
- Skip generic promises like "boost your success".

### Pain-point copy
- Name the frustration specifically.
- Use concrete scenarios: "When your manager asks for ROI data but your analytics show…"
- Quote real reader messages where you have them.
- Quantify with real data.

### Solution copy
- Explain the *why* behind each step.
- Active voice: "you'll configure" not "configuration should be done".
- Name the obstacles and how to clear them.
- Use specific timeframes: "within 2 weeks" not "soon".

### CTAs
- Be specific about what happens next.
- Set clear expectations on time and effort.

---

## Phrase replacement quick-ref

| Reach for instead of | Use |
|---|---|
| Moreover / Furthermore | Plus / And / Also / just start with the point |
| It's crucial to | You need to / Make sure you |
| Leverage this framework | Use this process / Try this approach |
| In today's landscape | Right now / Currently |
| Optimize your strategy | Improve your results / Fix your approach |

---

## Pre-publish quality checks

Before merging a copy change, run these:

1. **Banned-phrase scan.** Rip out any hit from the list above. The grep set lives in this file under "Tools".
2. **Restricted-word count.** Open the file. Confirm no banned word appears more than twice across the page.
3. **Repetitive transitions.** Skim section openings — no two consecutive sections should start with the same connector.
4. **Specificity score.** Count proper nouns — target ≥3 on long pages, ≥1 on short ones. Confirm every main claim has a concrete example or stat.
5. **Voice authenticity.** Read aloud. Does it sound like a person, or like a deck?
6. **Sentence variety.** Mix of long and short. At least one fragment if the section runs long.
7. **Reader value test.** If you swap "newsletter" for "product" or "course" and the sentence still works, it's too generic — rewrite.

**Final rule:** if a sentence could be written by an AI about any topic, rewrite it to be specific to this audience and their exact problem.

---

## When editing Sanity content

The voice rules don't stop at `.astro` files. They apply to every Sanity document type with user-facing prose:

- `blogPost.body` — long-form, but same banned-phrase + tricolon rules.
- `talk.abstract` — used on `/talks/[slug]` and in scheduling. Specific, not pitch-deck.
- `event.description` — short and concrete; this conference, this venue, this date.
- `workshop.description`, `project.description` — same.
- `testimonial.quote` — verbatim from the person, never paraphrased. Tag the role and company.
- `page.aboutHero.bio`, `page.aboutCta.*`, `page.aboutJourney.milestones` — page-level overrides for `/about`. Hold to the same bar as the page defaults.
- `nowPage.*` — `/now` page; stamp `lastUpdated` every time you edit.
- `impactMetricV2.contextNote`, `serviceOffer.summary` — short, concrete, specific.

When publishing to Sanity Studio, run the same pre-publish checks as for code copy. The rendered HTML doesn't care which source it came from.

---

## Tools

Run these from the repo root before merging copy changes. Each one should return zero hits (or hits you can defend out loud).

```sh
# Hard banned phrases — must return 0
rg -i "it is important to note|underscore the importance|cannot be denied|as of my knowledge cutoff|in today's fast-paced|ever-evolving landscape|in the digital age|in conclusion|to summarize|delve into|delve deeper|at its core|in the realm of|digital realm|uncharted waters|embark on a journey|treasure trove|game-changer" apps/web/src

# Tricolon list pattern (X, Y, and Z) — heuristic, expect false positives, manual review
rg ", [a-z ]+, and [a-z ]+\." apps/web/src/pages apps/web/src/components

# Restricted-word counts — cap each at 2 per file
for word in leverage optimize enhance utilize synergy pivotal crucial groundbreaking cutting-edge foster embark holistic capability comprehensive robust streamlined significant relevant dynamic innovative; do
  echo "=== $word ==="
  rg -i -c "\b$word\b" apps/web/src
done

# Generic paragraph openings
rg "^(Moreover|Furthermore|Additionally|However|Therefore)" apps/web/src
```

---

## Where to look for context before writing

- `/about` — voice anchor. Read its hero + journey before writing any first-person copy.
- `/services`, `/consulting`, `/mentorship` — service-side voice. Direct, qualified, no fluff.
- `/impact` — how Faris talks about outcomes with numbers attached.
- `apps/web/src/emails/*.tsx` — the same voice in a different medium. Terminal headers, kicker, direct one-liner intros.
- Past blog posts in Sanity Studio — read 2-3 before drafting new long-form.
