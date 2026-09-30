# Sanity CMS guide (V3 model)

How the content behind faziz-dev.com is modelled and edited. The Studio lives in `apps/studio` (`pnpm studio`, or
the hosted Studio). The site reads content ONLY through the loaders in `apps/web/src/lib/sanity/v3/` (they own all
GROQ, normalise legacy shapes and never throw). Add a field to a schema → project it in the matching loader → use it.

Every page is resilient: an empty query renders an empty state or approved default copy
(`lib/sanity/v3/defaults.ts`), so publishing content only ever *adds*.

Migrating from V2, or cleaning up content: see [`sanity-mcp-prompts.md`](./sanity-mcp-prompts.md)
(`pnpm migrate:v3` + copy-paste prompts for the Sanity MCP).

---

## The model in one picture

```
eventSeries ── React Summit, CityJS, ZurichJS (brand, optional)
   └─ event ── one dated EDITION: React Summit US 2025 (date, timezone, place, url)
        └─ sessions[] ── what Faris did there, each with an explicit ROLE
             speaker | keynote | lightning | workshop | panel | host | organizer | judge | mentor | guest | attendee
             ├─ talk ──────→ talk      (bookable, timeless; versions via parentTalk)
             ├─ workshop ──→ workshop  (formats[] with agendas)
             └─ recording.url · slidesUrl · startsAt · stage · status (tba / cancelled)

praise ── one quote: platform · url · date · author · topic → talk / workshop / event
metric ── one dated, defined number: value · label · asOf · definition · status (only "approved" is public)
community ── ZurichJS: pillars · metrics → metric · recognition (confirmed only) · aftermovie · photos
blogPost (on this site) + externalPost (elsewhere: article | podcast | video) ── one Writing timeline, by topic
serviceOffer ── events | advisory | mentorship     company ── career timeline entry     project · media (photos)

Singletons: homePage · speakerProfile ("Profile & press kit") · availability · siteSettings · page (About)
```

**Talk ≠ event.** A talk is something an organiser can book; it has no date. An event is a dated edition; what
happened there is a list of sessions with roles. **Attach recordings and slides to the session**: the talk page
("Where it's been delivered" + the Watch button), the event page (resources) and the home poster all update from
that one edit.

**Counts are derived** (`lib/sanity/v3/stats.ts`): "talks delivered" = past, not-cancelled sessions with role
speaker/keynote/lightning. Hosting, judging and attending are counted separately and never inflate it. Countries
count where Faris spoke, ran a workshop or hosted. Upcoming vs past is computed in the **event's own timezone**.

Shared vocabulary (roles, topics, platforms, statuses) lives in `packages/shared/src/content-model.ts` and is used
by both the Studio option lists and the site.

## What powers which page

| Page | Content |
|---|---|
| `/` | `homePage` (hero, featured refs, praise refs, community ref) + upcoming events, writing, stats (ISR ~1h) |
| `/speaking` | `speakerProfile` (topicClusters, formats), upcoming events, stats, praise |
| `/talks`, `/talks/[slug]` | `talk` + every session referencing it (history, recordings), praise about it, podcasts with `relatedTalk` |
| `/events`, `/events/[slug]` | `event` editions + sessions (role filter), photos (`media.event`) |
| `/workshops`, `/workshops/[slug]` | `workshop` (formats/agendas) + workshop sessions, praise |
| `/workshops/attend/[token]` | `workshopInstance` (token-gated attendee page; ops only) |
| `/invite` | `speakerProfile.goodToKnow`, `availability.months`, upcoming events ("Already booked") |
| `/press-kit` | `speakerProfile` (bios, headshots with tag/credit/hotspot, rider, pronunciation) |
| `/community` | `community` (+ its metrics), praise, stats.hosted |
| `/blog`, `/blog/[slug]` | `blogPost` + `externalPost` (one timeline by format + topic), corrections |
| `/about` | `page` (identifier about), `speakerProfile.links` |
| `/impact` | derived stats, `metric` (engineering, community), `company` (career), `community.recognition` |
| `/appreciation` | `praise` (platform-styled cards; legacy socialPost/testimonial until migrated) |
| `/services`, `/mentorship` | `serviceOffer` (by type), mentorship praise |
| `/gallery`, `/projects` | `media` (photos by event), `project` |

Markdown mirrors (`/talks.md`, …), `/llms.txt`, `/llms-full.txt` and OG cards (`/og/*.png`) are generated from the
same loaders: publish once, every surface updates.

## Recipes

### Add an upcoming appearance
1. **Event** → new: `title` ("Game of Codes 2026"), `series`, `kind`, `date` (+ `endDate`), `timezone`,
   `location` (standard English country name; it drives the flag), `url`.
2. **My sessions** tab → add a session: `role`, the `talk` (or `workshop`), `status` "Time & stage TBA" until the
   organisers publish the programme; then `startsAt` + `stage`.
3. After the day: add `recording.url` and `slidesUrl` to the session. Nothing else to update.

### Add a bookable talk
**Talk** → `title`, `shortTitle` ("the caching talk"), `pillar`, one-sentence `summary`, `abstract` (the premise),
`audience`, three `takeaways`, `duration` + `durationOptions`, `level`, `thumbnail`. New cut of an existing talk:
set `parentTalk`, mark only one version current.

### Add praise
**Praise** → paste the `quote` verbatim, pick `platform`, add the `url` of the original post and its `date`,
`author` (name, headline, handle), `topic`, and the `talk` / `workshop` / `event` it's about. `featured` for the
home and speaking highlights.

### Add a number
**Metric** → `value` as displayed, `label`, `asOf`, one-sentence `definition`, `domain`. It stays hidden until
`status` is **Approved**.

### Writing and conversations
Posts on this site: **Posts on this site** (`blogPost`, with `topic`). Guest articles, podcast episodes and videos:
**Published elsewhere** (`externalPost`, with `format`, `topic`, `source` = the outlet/show). Changed a published
number? Add a **Correction** instead of silently editing.

### Availability
Derived from your events: a month with 1–2 confirmed appearances shows "Some dates taken", 3+ shows "Limited".
**Availability** holds overrides only (a holiday, a month kept free, a note). "Already booked" lists upcoming events.

### Approve a number
**Needs attention → Metrics waiting for an OK** (or **Proof → Metrics**): check value, definition and date, set
**Status → Approved for public use**, Publish. Nothing unapproved is ever shown.

### Aftermovie
**Proof → Communities → ZurichJS → Aftermovie & photos**: upload the **Video file** (MP4) and **Captions (.vtt)**,
or paste an external URL; add a poster frame; switch **Published** on. Uploaded files play inline on /community.

### Career timeline
**Proof → Career timeline**: set Start and End (empty = current). The label ("2024 →", "2021–2023") and order
come from the dates; `Timeline label` only overrides.

### Press photos
**Profile & press kit → Press photos**: label, tag (also the download filename), alt, credit, and **set the hotspot**
on the face: the press kit crops 1:1, 4:5 and 16:9 around it.

### Workshop delivery (attendee page)
Public history = an event session with role "workshop". The token-gated attendee page is a **Workshop delivery**
(`workshopInstance`): workshop, event, date, token, short path, sections. See `apps/web/CLAUDE.md` for follow-ups.

## Conventions

- **Dates decide everything.** Never maintain "upcoming" flags.
- **Country names, not codes** (`Czechia`, `United States`, `North Macedonia`). Aliases live in `apps/web/src/lib/flags.ts`.
- **Slugs are permanent** (public URLs + OG routes).
- **Numbers need a date and a definition.** Speaking counts are never typed; they're derived.
- **No contact emails or `mailto:` in content.** Contact goes through the site's forms.
- **Unannounced roles** stay out of public copy (`siteSettings.nowLine` and `company.isPublic` are the switches).

## Voice

Every copy-bearing document shows a yellow **Sounds AI-written** warning when a field uses a phrase from the
AI-tell list (`packages/shared/src/voice.ts`): field, phrase and a plainer alternative. It never blocks
publishing. `pnpm voice:cms` lists them all; Prompt 13 in `sanity-mcp-prompts.md` cleans them up. Guide:
[`voice.md`](./voice.md).

## Health checks

Studio → **Needs attention** lists events without sessions, past talks without recordings, events without a country,
talks without a pillar/summary, praise without link/date, metrics waiting for an OK, writing without topic/format,
photos without alt/credit. **Legacy (migrate, then delete)** lists V2 documents still around.

## Local development without Sanity

`SANITY_FIXTURES=1 pnpm web` evaluates every query locally (groq-js) against `apps/web/fixtures/sanity-dataset.json`
(generated by `apps/web/fixtures/build-dataset.py`; it deliberately includes V2 shapes). `pnpm --filter web test` runs
the loader contract tests; `pnpm test:migrate` runs the migration tests.

## Studio deployments

Merges touching `apps/studio/**` deploy the hosted Studio via `.github/workflows/deploy-studio.yml`
(`SANITY_STUDIO_PROJECT_ID`, `SANITY_AUTH_TOKEN` secrets). PRs are validated by `.github/workflows/validate.yml`.
