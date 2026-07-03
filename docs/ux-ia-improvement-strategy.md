# UX, IA & Navigation Improvement Strategy

Audit date: 2026-07-03 · Scope: `apps/web` (faziz-dev.com) · Companion doc: [`ui-rules.md`](./ui-rules.md)

This document is the result of a full code-level audit of every page, navigation surface, conversion
path, and the theming/styling system. It is organized as: **current-state map → findings → phased
strategy**. Findings carry `file:line` references so each one is directly actionable.

---

## 1. Executive summary

The site has strong bones — a coherent Design System v2, a clean Sanity content model (dated
`event` docs vs. timeless bookable `talk` docs), auto-computing availability labels, and a
conversion sink (`/invite`) that nearly every CTA feeds. The problems are all *seams*:

1. **The Speaking mental model leaks.** "Speaking" (hub), "Talks" (catalogue), and "Events"
   (archive) present overlapping content with colliding vocabulary — on `/speaking` the filter
   chip "Talk" means an *event type*, while the "Past talks" cards link into the *talk catalogue*.
   A visitor asking "where are his upcoming talks?" has three partial answers and no canonical one.
2. **Two conversion funnels that never touch.** The speaking silo (speaking/talks/events/
   workshops/invite) and the services silo (consulting/mentorship) do not cross-link anywhere
   except the homepage and footer. The site-wide header CTA is always "Invite me" — a consulting
   or mentoring prospect is pushed into a speaker-invitation form on every page.
3. **Three booking mechanisms, no router.** Speaker invite form (`/invite`), cal.com discovery
   call (consulting), mentorship inquiry form (`/mentorship#apply`) — plus per-offer booking URLs,
   one `mailto:`, and MentorCruise hidden in the footer. Nothing explains which door to take.
4. **Dark mode wasn't actually the default,** and the applied theme was stripped on every
   client-side navigation (Astro ViewTransitions replaces `<html>` attributes). *Both fixed on
   this branch — see §5.1.*
5. **Two design systems coexist.** All static pages use tokenized DS v2 (`ds-*`,
   `rgb(var(--token))`); most React islands, `services/[slug].astro`, and `ServiceOfferCard` still
   use the v1 Tailwind slate/violet/pink palette with `dark:` variants. This causes visible seams,
   one real light-mode legibility failure (`AgendaAccordion`), and doubled maintenance (two
   button/card/tag/terminal/stat systems in `global.css`).

The strategy (§5) is four phases: **P0 theme fixes (done on this branch) → P1 quick wins
(hours–days) → P2 IA & conversion restructure (~1 week) → P3 design-system consolidation
(incremental) → P4 content ops & measurement.**

---

## 2. Current-state map

### 2.1 Page inventory & reachability

| Page | Role | Desktop nav | Mobile drawer | Footer | ⌘K palette |
|---|---|---|---|---|---|
| `/` | Landing / audience router | ✅ | ✅ | ✅ | ✅ |
| `/speaking` | Speaking hub (duplicates below) | ✅ top-level | ✅ | ✅ | ✅ |
| `/talks` (+`[slug]`) | Bookable talk catalogue (dateless) | mega-menu | via /speaking | ✅ | ✅ |
| `/events` (+`[slug]`) | Dated archive, upcoming + past | mega-menu | via /speaking | ✅ | ✅ |
| `/workshops` (+`[slug]`) | Bookable workshop catalogue | mega-menu | via /speaking | ✅ | ✅ |
| `/invite` | Speaker booking form + press kit | header CTA + mega-menu foot | ✅ CTA | ✅ | ✅ |
| `/services` | Services hub (router page) | ✅ top-level | ✅ | ✅ | ✅ |
| `/consulting` | Consulting detail + offers | mega-menu | via /services | ✅ | ✅ |
| `/mentorship` | Mentorship detail + inquiry form | mega-menu | via /services | ✅ | ✅ |
| `/impact` | Proof / track record | mega-menu only | ✅ top-level (!) | ✅ | ✅ |
| `/blog` (+`[slug]`) | Writing ("Writing" in nav, "Blog" in footer) | ✅ | ✅ | ✅ | ✅ |
| `/about` | Bio / timeline | ✅ | ✅ | ✅ | ✅ |
| `/projects` (+`[slug]`) | Portfolio | ❌ | ❌ | ✅ | ✅ |
| `/media` | Press kit gallery | ❌ | ❌ | ✅ | ❌ |
| `/appreciation` | Social proof wall | ❌ | ❌ | ❌ | ❌ — only via homepage "View all mentions" |
| `/services/[slug]` | CMS landing pages | ❌ | ❌ | ❌ | ❌ — fully orphaned unless a CMS CTA links them |

### 2.2 The content model (already good — the UI just doesn't teach it)

- **`event`** — a dated engagement (`date`, `type`: conference/meetup/podcast/…). Upcoming vs past
  is a pure query split (`queries.ts:4-26`). The only true upcoming/past archive UI is
  `/events` (`EventsFilter` with `splitByTime`, `events/index.astro:108`).
- **`talk`** — a *timeless, reusable* talk with `isBookable`, versioning, and delivery counts.
  `/talks` is a catalogue, not a schedule.
- **`workshop`** (+ `workshopInstance`) — bookable offering + dated instances.

### 2.3 Conversion mechanisms (complete inventory)

| Mechanism | Where it lives | Entry points |
|---|---|---|
| **Invite form** → `POST /api/invite` | `/invite` | Header CTA (every page), hero CTAs, every speaking-side ContactPanel, footer, palette — the universal sink |
| **cal.com discovery call** (plain link, no embed) | — | `/services` ×2, `/consulting` ×3 only |
| **Mentorship inquiry form** → `POST /api/mentorship` | `/mentorship#apply` | `/mentorship` only |
| **Per-offer `bookingUrl`** (Sanity) | `ServiceOfferCard` | `/consulting`, `/mentorship` programs |
| **`mailto:hello@farisaziz.com`** | `/services` ContactPanel only | one place on the whole site |
| **MentorCruise** | footer "Elsewhere" only | `mentorship.astro:173` has a stale comment promising it "below" — it isn't there |

---

## 3. Findings — Information architecture & navigation

### 3.1 Speaking vocabulary collision (highest-impact IA problem)

- `/speaking` mixes both namespaces on one page: upcoming rows link to `/events/{slug}`
  (`speaking.astro:213`) while "Past talks" cards link to `/talks/{slug}` (`speaking.astro:291`).
- The `/speaking` filter chip **"Talk"** is an event-*type* bucket (any non-workshop/non-meetup
  event, `speaking.astro:65-72`) — a different concept from the `/talks` catalogue one click away.
- "Upcoming" appears in three places (home "Next up" band, `/speaking` calendar, `/events`
  upcoming section); "past talks" is answered by two different content types (past *events* on
  `/events`, watchable *talks* on `/talks`).
- The nav labels don't disambiguate: *Speaking / Talks / Events / Workshops* all sound like the
  same thing to an organizer. The mega-menu descriptions (`Header.astro:38-49`) are the only
  place the distinction is taught, and they're invisible on mobile.

### 3.2 Siloed funnels — speaking never meets consulting/mentorship

- None of `/speaking`, `/talks`, `/events`, `/workshops`, `/invite` links to `/consulting` or
  `/mentorship`. None of `/consulting`, `/mentorship` links back to speaking. Cross-traffic is
  only possible via homepage, footer, or palette.
- The header CTA is **always** "Invite me" → `/invite` (`Header.astro:100`), even on
  `/consulting` and `/mentorship`. The mobile drawer CTA is "Invite me to speak"
  (`Header.astro:134-139`). For the user's stated goals (booking time, mentoring, consulting)
  this is the single most misrouted pixel on the site.
- `/impact` — the proof page shared by both funnels — is top-level in the *mobile* drawer but
  buried in the Services mega-menu on desktop (inconsistent hierarchy, `Header.astro:126` vs `:75`).
- `/projects` "Work with me" CTA points to `/invite` (speaker form) rather than services
  (`projects/index.astro:65`) — mis-routed for a portfolio context.

### 3.3 Orphans, dead ends, dead code

| Issue | Evidence |
|---|---|
| `/appreciation` unreachable from any nav surface (homepage body link only) | no reference in Header/Footer/palette |
| `/media` footer-only; missing from palette | `CommandPalette.tsx:21-38` |
| `/services/[slug]` CMS pages orphaned (hub links `/consulting`+`/mentorship` instead) | `services.astro:163-211` |
| `/speaking` topic cards are inert `<div>`s while identical homepage cards link to `/talks` | `speaking.astro:262-270` vs `index.astro:464` |
| `/workshops` benefit + topic cards inert | `workshops/index.astro:93-101, 176-184` |
| `/media` cards fall back to `href="#"` (literal dead links) | `media.astro:90, 137, 174` |
| Stale comment promising a MentorCruise alternative that doesn't exist on the page | `mentorship.astro:173` |
| `MobileMenu.astro` never imported — dead code (live drawer is in `Header.astro:112-141`) | grep: 0 imports |
| Palette navigates with `window.location.href`, bypassing ViewTransitions | `CommandPalette.tsx:102` |

### 3.4 Copy drift & duplicated logic

- Hardcoded availability strings that will go stale, next to a lib built to avoid exactly this:
  `"Custom talks available · 2026"` (`talks/index.astro:102`), `"Custom workshops · 2026"`
  (`workshops/index.astro:203`) — vs `availabilityLabel()` / `bookingYears()`
  (`lib/availability.ts`) used everywhere else.
- Proof numbers (425 members / 15 engineers / 3.5× revenue / 86 talks) are hardcoded as
  *independent* fallbacks on `/services`, `/impact`, `/about`, and the homepage — and they
  already disagree (homepage fallback says 60 events, `index.astro:79`; impact says 86 talks,
  `impact.astro:64`).
- The "stages I've shared" logo-wall dedupe loop is copy-pasted three times with *divergent*
  behavior (`index.astro:131-147` collapses "Zurich JS"/"ZurichJS"; `speaking.astro:94-106` and
  `invite.astro:122-134` don't).
- Nav says "Writing", footer says "Blog" — one name per thing (`ui-rules.md §7`).

---

## 4. Findings — Theming & styling

### 4.1 Dark mode (fixed on this branch — see §5.1)

- **Default was OS-dependent, not dark:** `stored || (prefersLight ? 'light' : 'dark')`
  (`BaseLayout.astro`). OS-light visitors got light mode on first visit.
- **Theme stripped on every client-side navigation:** the bootstrap script ran only on first
  load; Astro ViewTransitions swaps in the server-rendered `<html>` (no `class` / `data-theme`),
  so light-mode users got a dark flash — and `dark:` variants momentarily broke — on *every*
  internal link until the toggle island re-hydrated. (`Header.astro` and others re-run setup on
  `astro:after-swap`; the theme script was the one that didn't.)
- `ThemeToggle.tsx` had its own third opinion (`prefers-color-scheme: dark` bias).
- Remaining nit: the ⌘K "Toggle theme" action doesn't sync the ThemeToggle island's icon state.

### 4.2 Two design systems (v1 vs v2)

- All 21 static pages use v2 primitives (`page-hero/page-section/ds-btn/ds-card/kicker`,
  ~250 usages). Meanwhile **114 `dark:` variants and ~234 raw Tailwind color-scale usages**
  live almost entirely in React islands (`AppreciationFilter` 68, `WorkshopAttend` 20,
  `ImpactExplorer` 14, `EventCarousel` 12, `SocialPostCard` 11 …) and in
  **`services/[slug].astro`** — the one page still fully on v1 (rainbow
  indigo/violet/pink/emerald `colorClasses` map `:74-79`, `.section-dark` `:197`,
  gradient CTA `:371`).
- `ServiceOfferCard.astro` hardcodes indigo/pink spotlight rgba values (`:32-35`) and renders
  *inside* token-styled pages — a visible seam on `/consulting` and `/mentorship`.
- `global.css` carries **duplicate systems**: `.btn`/`.ds-btn`, `.card`/`.ds-card`,
  `.tag`+`.pill`/`.ds-tag`+`.ds-pill`, `.terminal`/`.ds-terminal`, `.stat`/`.ds-stat`,
  `.social-link`/`.ds-social`.
- `.section-accent` is **red** (`rgb(185 28 28)`, `global.css:927-934`) — a v1 remnant off the
  v2 blue identity.

### 4.3 Light-mode defects (matters even with dark default — the toggle still exists)

- **`AgendaAccordion.tsx` is illegible in light mode**: `text-white` headings, white-alpha glass
  backgrounds, `text-slate-300` body with no `dark:` guards (`:108, 124, 142-143, 184`) —
  white-on-white on workshop/event pages.
- `--ink-faint` in light mode ≈ **3.9:1** contrast (below AA 4.5:1) and is used for kickers,
  labels, breadcrumbs, footer meta (`global.css:56-88`).
- Tailwind `accent.muted` / `success.muted` utilities are wired to alpha-washes of *other*
  tokens, ignoring the actual `--accent-muted` / `--success-muted` vars (`tailwind.config.mjs:37,51`)
  — the CSS vars are effectively dead.

### 4.4 Findings from rendered-page review (Playwright, both themes, desktop + mobile)

- **Double subscribe block on the homepage**: the page ends with the "Follow my conference
  schedule" `GeneralSubscribe` section (`index.astro:613-621`) rendered immediately above the
  footer, which contains its own identical `GeneralSubscribe` form (`Footer.astro:181-183`).
  Two identical email forms stacked within one viewport.
- **`/consulting` renders a "Coming soon" empty state** in the middle of the page ("Engagement
  formats" → "Consulting packages will appear here once content is added"). The offer content
  exists as a draft in `SANITY_SERVICES_CONTENT.md` at the repo root — including placeholder
  booking URLs (`https://cal.com/YOUR_LINK`) — and appears never to have been entered into
  Sanity. **Verify in Sanity Studio / production**: if live visitors see "Coming soon" on the
  consulting page, that is the single most conversion-damaging content gap on the site.
  (Local verification wasn't possible — this environment can't reach the Sanity API.)
- Mobile hero: the third stat ("25 cities") wraps onto an orphan line at 390px.
- Light mode holds up well on the audited v2 pages (services/consulting/mentorship/invite/
  speaking) — the light-mode risks are concentrated in the v1 islands (§4.3).

### 4.5 Layout & consistency debt

- **71 inline `style=""` attributes across 22 files.** The same patterns repeat:
  `font-size:2.2rem` on hero stats (12×: speaking/talks/events/media/appreciation/projects),
  `margin-top:1rem` on empty-state buttons (4×), `scroll-margin-top:80px` on anchor sections,
  centering wrappers.
- The image-scrim badge (`rgba(10,12,16,.55)` + white hairline) is copy-pasted into 5 page
  `<style>` blocks (`media`, `events/[slug]`, `blog`, `talks/[slug]`, `FeaturedTalk`).
- Off-palette one-off hexes with no tokens: meetup amber `#F2C94C` (`speaking.astro:567`),
  availability-"limited" amber `#F4B860` (`invite.astro:921-960`), emerald gradient in
  `AgendaAccordion.tsx:122`.
- Vertical rhythm: v2 pages share `.page-section`; `services/[slug].astro` freehands
  `py-20 md:py-28` / `py-24 md:py-32` per section.
- `consulting.astro:217-282` re-declares `.workshop-topics` styles copied from `/workshops`
  (the comment admits it); `mentorship.astro` re-declares `.svc-faq` from `/services`;
  `invite.astro:534` leaks form CSS globally so `/mentorship` can reuse it.

---

## 5. The strategy

### Phase 0 — Dark-by-default + theme persistence ✅ (shipped on this branch)

1. `BaseLayout.astro`: theme = stored preference if `light`, otherwise **dark** — OS preference
   no longer decides the first visit. The bootstrap now re-runs on `astro:after-swap`, so the
   chosen theme survives every client-side navigation (no more flash / stripped `dark:` styles).
2. `ThemeToggle.tsx`: same rule (`stored === 'light' ? light : dark`), initial state dark.

Follow-ups worth doing when convenient: sync the toggle icon when the ⌘K action flips the theme
(listen for a `themechange` custom event), and add `transition:persist` to the toggle island.

### Phase 1 — Quick wins (hours–days, no design decisions needed)

| # | Task | Where |
|---|---|---|
| 1.1 | Link `/speaking` topic cards to `/talks` (match homepage behavior); make `/workshops` benefit/topic cards either links or visually non-card (per ui-rules §4 "never mix") | `speaking.astro:262`, `workshops/index.astro:93,176` |
| 1.2 | De-orphan: add **Appreciation** to footer Explore column + palette; add **Media** to palette | `Footer.astro:43-49`, `CommandPalette.tsx:21-38` |
| 1.3 | Replace `"… · 2026"` hardcoded strings with `availabilityLabel()`/`bookingYears()` | `talks/index.astro:102`, `workshops/index.astro:203` |
| 1.4 | Fix `/media` `href="#"` fallbacks — render a non-anchor element when there's no URL | `media.astro:90,137,174` |
| 1.5 | Delete `MobileMenu.astro` (dead code) | — |
| 1.6 | Resolve the MentorCruise stale comment: add it as a real alternative link on `/mentorship` or delete the comment | `mentorship.astro:173` |
| 1.7 | One name per destination: pick "Writing" or "Blog" and use it in nav + footer + palette | `Header.astro:88`, `Footer.astro:44` |
| 1.8 | Route `/projects` "Work with me" to `/services` (or the P2 router), not the speaker form | `projects/index.astro:65` |
| 1.9 | Align Impact placement: same level on desktop and mobile | `Header.astro:75,126` |
| 1.10 | Palette navigation via ViewTransitions (`navigate()` from `astro:transitions/client`) | `CommandPalette.tsx:102` |
| 1.11 | Remove the homepage's duplicate subscribe section (the footer already carries the same form), or drop the footer copy on the homepage | `index.astro:613-621` vs `Footer.astro:181-183` |
| 1.12 | **Enter the drafted consulting/mentorship offers into Sanity** (`SANITY_SERVICES_CONTENT.md`) with real cal.com URLs, so `/consulting` stops showing "Coming soon" | Sanity Studio |
| 1.13 | Fix mobile hero stat wrap (third stat orphans at 390px) | `index.astro` hero stats |

### Phase 2 — IA & conversion restructure (~1 week; the core of this strategy)

**2a. Teach the content model through naming.** Keep the URLs; change the labels and page
framing so each page answers exactly one question:

| URL | Question it answers | Suggested label/framing |
|---|---|---|
| `/events` | *Where will/did he speak?* | **Schedule** — upcoming first, past archive below (already built this way) |
| `/talks` | *What can he present at my event?* | **Talk catalogue** — every card gets a "Book this talk" affordance |
| `/workshops` | *What can he teach my team?* | Workshops (fine as-is) |
| `/speaking` | *Router/pitch* | Keep as hub but **stop duplicating**: one "next 3 events" strip → `/events`, three talk teasers → `/talks`, topics → `/talks`. Cut the filterable event list (it duplicates `/events`) |
| `/invite` | *How do I book him to speak?* | Invite / press kit (fine — it's the best page on the site) |

Also: rename the `/speaking` filter chip "Talk" → "Conference" (or drop type chips there
entirely once the list moves to `/events`).

**2b. One front door for "work with me".** Add a conversion router — either a new `/contact`
page or an upgraded ContactPanel — with three explicit doors:

1. **Invite me to speak** → `/invite` (form)
2. **Book a consulting call** → cal.com discovery link
3. **Mentorship inquiry** → `/mentorship#apply` (form)
   plus the `mailto:` fallback (currently hidden on one page).

Then make the **header CTA context-aware**: "Work with me" → router by default; on
speaking-silo pages it can stay "Invite me" → `/invite`. This single change gives mentoring and
consulting prospects a visible path from every page — today they have none.

**2c. Cross-link the silos.** Minimum viable set:
- `/invite` form success state + press-kit foot: "Not an event? I also do consulting & mentorship."
- `/consulting` + `/mentorship`: a small "Want me at your event instead? → /invite" row.
- ContactPanels on speaking pages get a tertiary "Consulting & mentorship" link.

**2d. Deepen the funnel with context.** Support `/invite?talk=<slug>&format=workshop` prefill
so "Book this talk" / "Book a workshop" CTAs land in a pre-filled form instead of a generic one.
(The form is a React island; read `URLSearchParams` on mount.)

**2e. Mobile drawer parity.** Expand Speaking/Services into accordion sub-links (Talks,
Schedule, Workshops, Invite / Consulting, Mentorship, Impact) — the mega-menu descriptions that
teach the model are currently desktop-only.

### Phase 3 — Design-system consolidation (incremental, ~2–3 weeks of small PRs)

Priority order (visitor-visible first):

1. **Fix `AgendaAccordion` light mode** — tokenize (`text-ink`, `bg-surface-*`, `border-edge`). It's illegible today.
2. **Migrate `services/[slug].astro` + `ServiceOfferCard.astro` to DS v2** — kill the rainbow `colorClasses` map, `.section-dark`, gradient CTA; use `ds-card`/tokens. This removes the "different site" seam inside `/consulting` and `/mentorship`.
3. **Re-skin or remove `.section-accent` (red)** and the v1 rainbow gradient utilities (`.text-gradient`, `.stat-big__value`, `.bento__item--featured`, aurora/spotlight colors) to the v2 accent family.
4. **Migrate islands off slate/`dark:`** one at a time: AppreciationFilter → WorkshopAttend → EventCarousel → ImpactExplorer → TalksFilter → SocialPostCard. Acceptance: zero raw `slate-*`/`violet-*`/`pink-*` classes; `dark:` only where a token genuinely can't express it.
5. **Raise `--ink-faint` (light) to ≥4.5:1** (e.g. `#5C6875`) or restrict it to large text.
6. **Promote repeated patterns to shared primitives**: hero stat size (extend `ds-stat`, delete the 12 inline `font-size:2.2rem`), scrim badge class, one `<LogoWall>` component + one dedupe util in `lib/`, `scroll-margin-top` utility for anchor sections.
7. **Delete v1 classes** (`.btn*`, `.card*`, `.tag`, `.pill`, `.terminal*`, `.stat*`, `.social-link`) once nothing references them; align or delete dead `--accent-muted`/`--success*` vars vs `tailwind.config.mjs:37,51`.
8. **Tokenize the ambers** (`#F2C94C`, `#F4B860`) as a semantic `--warn`/`--limited` pair with light+dark values.
9. **Enforce**: a small CI grep (fail on new inline `style=`, raw hex, or `slate-` outside `emails/`) pointing at `docs/ui-rules.md`.

### Phase 4 — Content ops & measurement

- **Single source for proof numbers**: move the 425/15/3.5×/86 figures into Sanity
  (`siteSettings` or impact docs) so `/services`, `/impact`, `/about`, and home render the same
  values; fallbacks currently disagree.
- **Decide the fate of `/services/[slug]`**: either link the published CMS landing pages from
  the `/services` hub or unpublish the route.
- **Consolidate the proof cluster**: `/appreciation` content could fold into `/impact` (or into
  the `/invite` press kit) rather than living as an orphaned page.
- **Instrument the funnels in PostHog** (already installed): `cta_click` with
  `{source, destination}` on every invite/consulting/mentorship CTA; form submit + success
  events; mega-menu vs palette vs footer usage; theme toggle usage. Review after 4–6 weeks and
  let the data arbitrate P2 label choices.

---

## 6. Target navigation model (reference)

```
Header:  Home · Speaking ▾ · Work with me ▾ · Writing · About        [⌘K] [theme] [Work with me]
                 │                    │
                 ├ Schedule (/events)  ├ Consulting (/consulting)
                 ├ Talk catalogue      ├ Mentorship (/mentorship)
                 │   (/talks)          ├ Results (/impact)
                 ├ Workshops           └ foot: "Book a discovery call" (cal.com)
                 └ foot: "Invite me" (/invite) + press kit link

Footer:  Speaking (Schedule/Talks/Workshops/Invite/Media·press kit)
         Work with me (Consulting/Mentorship/Impact)
         Explore (Writing/Projects/About/Appreciation/RSS)
         Elsewhere (ZurichJS/MentorCruise/socials)
```

Header CTA is context-aware: "Invite me" on speaking pages, "Work with me" elsewhere.

---

## 7. Appendix — evidence index

- Theme bootstrap: `src/layouts/BaseLayout.astro` (theme script) · toggle:
  `src/components/islands/ThemeToggle.tsx` · palette toggle: `CommandPalette.tsx:89-98`
- Nav surfaces: `src/components/layout/Header.astro` (mega-menus `:37-86`, CTA `:100`, drawer
  `:112-141`) · `Footer.astro:29-54` · `CommandPalette.tsx:21-38` · dead: `MobileMenu.astro`
- Upcoming/past machinery: `src/lib/sanity/queries.ts:4-26` · `EventsFilter.tsx:201-242,544-569`
  · availability: `src/lib/availability.ts`
- Speaking duplication: `speaking.astro:187-311` vs `events/index.astro:94-117` vs
  `talks/index.astro:71-96` · type normalizer `speaking.astro:65-72`
- Funnel silo: no services links in any speaking-side page; header CTA `Header.astro:100`
- v1 remnants: `services/[slug].astro:74-79,197,371,397` · `ServiceOfferCard.astro:32-35` ·
  `global.css:233-362,419-431,927-962,1473-1514` (v1) vs `global.css:1869-2060,2298-2314` (v2)
- Light-mode defects: `AgendaAccordion.tsx:108,124,142-143,184` · `--ink-faint` `global.css:56-88`
- Inline styles: 71 across 22 files (top: speaking 10, workshops/[slug] 8, projects 6)
