# Voice

How the site sounds, and how to catch copy that sounds machine-written. Applies to code copy (pages,
components, emails, `.md` mirrors, OG cards, default copy) and Sanity content alike.

The rules are enforced from one list: [`packages/shared/src/voice.ts`](../packages/shared/src/voice.ts).

| Tool | What it does |
|---|---|
| `pnpm lint` (`pnpm --filter web lint:voice`) | Fails on AI tells in site copy under `apps/web/src` |
| `pnpm voice:cms` | Reports tells in every published Sanity document (`SANITY_FIXTURES=1` for the offline dataset, `--json` for agents) |
| Studio | Each copy-bearing document shows a yellow **Sounds AI-written** warning listing field, phrase and fix. Publishing is never blocked |
| Sanity MCP | Prompt 13 in [`sanity-mcp-prompts.md`](./sanity-mcp-prompts.md): a voice sweep with a change table for approval |
| Agents | Skill `voice-copy` (`.cursor/skills/voice-copy/SKILL.md`, also exposed to Claude Code via `.claude/skills`) |

The linter catches words and shapes. It can't catch a sentence that says nothing, so read your copy out loud too.

## How Faris sounds

- **First person, casual, direct.** "I build the checkout." "I reply within two days." Bios are third person.
- **Short sentences, one idea each.** If a sentence needs a colon and a semicolon, it's two sentences.
- **Concrete over clever.** A number with a date, a named event, a real failure. Not an adjective.
- **Says it like he'd say it on stage.** If you wouldn't say it to an organiser over coffee, rewrite it.
- **Warm, not salesy.** Asks plainly ("Tell me what you're planning"), never pushes.
- **Other people's words stay verbatim.** Praise quotes are never edited, never linted.

## AI tells

The patterns below are what make copy read like a model wrote it. The linter flags every one.

**Words nobody says out loud**

| Instead of | Say |
|---|---|
| leverage, utilise, harness | use |
| seamless, robust, effortless | what actually works, what it survives |
| delve, deep dive, dive into | look at, walk through, get into |
| elevate, unlock, empower, supercharge | help, let you, or say how |
| crucial, pivotal, paramount | important, or show why |
| passionate, thought leader, visionary | say what you did |
| world-class, cutting-edge, game-changing | drop it, show the proof |
| journey, embark | say what happened |
| showcase, boasts, resonates | shows, has, lands |
| upon request, prior to, in order to, facilitate | ask, before, to, help |
| reach out, don't hesitate | get in touch, tell me |
| essays | writing, articles, posts |

**Shapes**

- **"Not just X, it's Y" / "more than just"**: say the one thing it is.
- **Scene-setting**: "In today's fast-paced landscape…". Start with the point.
- **Setup lines**: "Here's the thing:", "The best part?", "The result?". Cut the setup, keep the point.
- **Talking to everyone**: "Whether you're a founder or an engineer…". Talk to one reader.
- **Narrating the page**: "This section lists…", "Filters write to the URL so a view can be shared", "counted
  separately". Let the page show it. If it matters, it's a label, not a sentence.
- **Triples by reflex**: "fast, reliable and scalable". Keep a list of three only when there really are three.
- **Stacked colons and em dashes**: "Available for event graphics on request, unmodified: no mirroring…". Use a
  comma or a full stop. The em dash in a quote attribution (`> — Name`) is fine.
- **Legal register**: "unmodified", "no mirroring, recolouring or added logos". Say it like a person:
  "Please keep it as it is."

## Before / after (from this site)

| Before | After |
|---|---|
| Illustrated avatar. Available for event graphics on request, unmodified: no mirroring, recolouring or added logos. The ZurichJS mark on the shirt is part of the artwork. | Happy for you to use the cartoon me on your event graphics. Just ask and I'll send the files. Please keep it as it is: no flipping, recolouring or extra logos. The ZurichJS logo on the shirt stays. |
| Counted separately: 51 talks delivered, 11 workshops, 18 hosted, 2 attended. Filters write to the URL (?role=hosted), so a filtered view can be shared. | *(removed: the numbers are already on the page)* |
| Thanks for subscribing! I'll reach out when I'm speaking at a conference near you. | Thanks for subscribing. I'll email you when I'm speaking at a conference near you. |
| Reach out if… | Get in touch if… |

## Fixed vocabulary

Names exactly: ZurichJS, ZurichJS Conf, React Summit US, CityJS <City>, Smallpdf, Next.js, TypeScript,
JavaScript, GitNation. Countries in standard English (Czechia, United States). No emojis in copy. No
exclamation marks outside quotes. No numbers without a date. No `mailto:` or email addresses.

## When a flagged phrase is right

A talk title someone else chose, or a quoted phrase, can keep a flagged word. In code, add a `voice-ok` comment on
that line. In Sanity, ignore the warning; it never blocks publishing. Don't weaken a rule in `voice.ts` for one
case. If a rule keeps firing on honest copy, make the pattern more specific and add the case to
`apps/web/src/lib/voice.test.ts`.
