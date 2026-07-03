# Sanity CMS guide

How to manage the content that powers faziz-dev.com. The Studio lives in
`apps/studio` (run locally with `pnpm studio`, or use the deployed Studio).
The website reads content through the GROQ queries in
`apps/web/src/lib/sanity/queries.ts` — if you add a field to a schema and want
it on the site, it must also be added to the relevant query projection there.

Every list page is resilient: if a query returns nothing, the page renders a
sensible empty state or a hardcoded fallback (`apps/web/src/lib/proof.ts`).
So publishing content only ever *adds* — nothing breaks while a section is empty.

---

## The content model in one picture

```
talk ───────────────┐            "What I can speak about" (timeless, bookable)
                    │
event ──────────────┤            "Where/when I spoke or will speak" (dated)
  └─ references talk(s)          upcoming = date >= now, past = date < now
                    │
workshop ───────────┤            Workshop template (agenda, outcomes)
  └─ workshopInstance            One delivery of a workshop (date, repo, emails)
                    │
serviceOffer ───────┤            Consulting packages & mentorship programs
testimonial ────────┤            Quotes with author/role/rating
socialPost ─────────┤            LinkedIn/X mentions (social walls)
impactMetricV2 ─────┤            Headline numbers + optional case study
speakerProfile ─────┘            Singleton: bios, headshots, taglines
```

**Talk vs event — the rule that keeps the IA clean:** a *talk* is a topic an
organizer can book (it has no date). An *event* is a concrete appearance (it
has a date and a location, and usually references the talk given). Never model
an upcoming appearance as a talk.

## What powers which page

| Page | Content types | Notes |
|---|---|---|
| `/` (home) | `event` (upcoming), `talk` (featured), `socialPost`, `testimonial`, `media`, speaking stats | ISR-cached ~1h, so new content appears without a redeploy |
| `/speaking` | `event` (upcoming + past), `talk`, speaking stats | "Next up" shows the next 3 upcoming events |
| `/events` | `event` (all) | Filterable archive; flags come from `location.country` |
| `/talks`, `/talks/[slug]` | `talk` (+ events referencing it) | Detail page lists where the talk was given |
| `/workshops`, `/workshops/[slug]` | `workshop` | Long descriptions are clamped on cards — keep `description` tight anyway |
| `/workshops/attend/[slug]` | `workshopInstance` | Token-gated attendee page with email capture |
| `/consulting` | `serviceOffer` (serviceType=consulting) | Empty → "Coming soon" + discovery-call CTA |
| `/mentorship` | `serviceOffer` (serviceType=mentorship), `socialPost` (featured) | |
| `/impact` | `impactMetricV2`, `impactPage` settings | Metrics with `caseStudy.title` become case-study cards |
| `/appreciation` | `socialPost` (all), `testimonial` (all) | |
| `/invite` | `speakerProfile` (bios, headshots), `event` (for the availability calendar) | |
| `/about` | `page` (about), `company` | |
| `/blog` | `blogPost` (self-hosted), `externalPost` | External posts are categorized by type |
| `/media` | `media`, `event` videos | |
| `/projects` | `project` | |

The agent-facing markdown mirrors (`/home.md`, `/talks.md`, `/invite.md`, …)
and the OG images are generated from the same queries — publish once, every
surface updates.

## Recipes

### Add an upcoming speaking engagement

1. Studio → **Event** → create.
2. Fill: `title`, `slug`, `type` (conference/meetup/workshop/panel/…), `conference`
   (venue name — used for the logo wall), `date` (**future date = it appears in
   "upcoming" everywhere automatically**), `location.city` + `location.country`
   (the country name drives the flag emoji — use the standard English name,
   e.g. "Czechia" not "Czech Republic"), or `location.isOnline` for remote.
3. Reference the `talk` being given so the talk's detail page picks it up.
4. Mark `featured` for headline conferences — this stars them on the logo wall.
5. After the event: add `links.videoUrl` and `links.slidesUrl` when available.
   The event flips to "past" automatically once the date passes.

### Add a bookable talk

1. Studio → **Talk** → create: `title`, `slug`, `abstract`, `audience`,
   `takeaways`, `topics`, `duration`.
2. Versioning: use `parentTalk` + `version` + `isCurrentVersion` for talks that
   evolve; only the current version is listed.
3. Assets tab: thumbnail + video make the talk card much stronger.

### Add a consulting package or mentorship program

1. Studio → **Service Offer** → create.
2. `serviceType` decides the page (`consulting` or `mentorship`).
3. Content: `title`, `slug`, `shortDescription`, `bestFor`, `outcomes` (3–5
   punchy bullets), `engagementFormat`.
4. Pricing tab: `pricingType` + `price`/`priceCurrency`/`priceUnit`, and
   `bookingUrl` (cal.com links open as an on-site modal automatically).
5. `featured` + `order` control card prominence and sorting.
6. Drafted copy for the initial offers lives in `SANITY_SERVICES_CONTENT.md`
   at the repo root — entering those documents makes /consulting and
   /mentorship fully live.

### Add social proof

- **Social post** (someone posted about a talk): create **Social Post** with
  `url`, `platform`, `author`, `content` (paste the text), `postDate`. Link
  `relatedTalk`/`relatedEvent` when relevant — detail pages then show it.
  Mark featured posts to surface them on `/` and `/mentorship`.
- **Testimonial** (a quote given to you): create **Testimonial** with `type`,
  `quote`, `author`, `role`, `company`, optional `rating` and `image`.

### Add an impact metric / case study

1. Studio → **Impact Metric (Enhanced)** → create: `domain`, `headlineNumber`,
   `unit`, `label`, `contextNote` (one honest sentence of context).
2. Case Study tab (optional): `title`, `description`, `context`, `approach`,
   `result` — filling these turns the metric into a full case-study card on
   `/impact`.
3. Featured metrics also feed the proof strips on `/` and `/services`.

### Run a workshop delivery

1. Create the **Workshop** template once (agenda, outcomes, duration).
2. For each delivery, create a **Workshop Instance**: reference the template,
   set `event`, `workshopDate`, `token` (gates the attend page),
   `repoUrl`, `accessDurationDays`.
3. For email capture: set `emailCaptureEnabled` and `resendAudienceId`
   (create the audience in Resend first). Attendees who subscribe get the
   welcome email and join that audience.
4. After the workshop, send the feedback request via the admin-protected
   `/api/workshop/follow-up` route — see `apps/web/CLAUDE.md` for the curl
   recipe (always dry-run first).

### Update bios / headshots (speaker kit)

Studio → **Speaker Profile** (singleton): `bioShort`/`bioMedium`/`bioFull`
feed the bio switcher on `/invite` (with copy-to-clipboard), `headshots` feed
the downloadable gallery. Keep bios in first person — the site's voice is
casual and direct.

## Conventions

- **Dates decide everything.** Upcoming vs past is computed from `date >= now()`
  at query time. Don't maintain manual "upcoming" flags.
- **Country names, not codes.** Flags are looked up by English country name
  (`apps/web/src/lib/flags.ts`; aliases like Czech Republic → Czechia live there).
- **Slugs are permanent.** They're public URLs and OG-image routes; changing
  one breaks inbound links.
- **Keep `conference` names consistent.** The home logo wall dedupes by
  normalized name ("ZurichJS" and "Zurich JS" merge, "ZurichJS Pro" stays
  separate).
- **No contact emails in content.** All contact flows go through the site's
  Resend-backed forms — never paste a `mailto:` into CMS copy
  (policy: `apps/web/CLAUDE.md`).
