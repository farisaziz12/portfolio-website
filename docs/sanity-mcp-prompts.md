# Sanity MCP prompts: V3 content harmony

Copy-paste prompts for an agent with the **Sanity MCP** (`.cursor/mcp.json` → `https://mcp.sanity.io`, OAuth) to bring
every document in the dataset into the V3 model and one consistent voice. They're written for Cursor or Claude Code
with the Sanity MCP connected, but work with any agent that can run GROQ and patch documents.

**What this is for.** The V3 site reads both old (V2) and new document shapes, so nothing breaks while content is
half-migrated. But the V3 pages only look *finished* when content is complete, dated, defined and consistent:
every event has sessions with roles, every talk has a pillar and a one-line summary, every number has a date and a
definition, every quote links to its source. These prompts get it there.

## Order of operations

1. **Back up.** `pnpm --filter studio exec sanity dataset export production backup-$(date +%F).tar.gz`
2. **Deploy the V3 Studio** (merge to `main`, or `pnpm --filter studio deploy`), so the new types and fields exist.
3. **Run the mechanical migration.** It's deterministic, idempotent and dry-run by default:
   ```sh
   SANITY_STUDIO_PROJECT_ID=94fb4yui SANITY_API_TOKEN=sk_… pnpm migrate:v3            # prints the plan
   SANITY_STUDIO_PROJECT_ID=94fb4yui SANITY_API_TOKEN=sk_… pnpm migrate:v3 --apply    # writes it
   ```
   It converts V2 events into editions with `sessions[]`, creates `eventSeries`, turns `socialPost` + `testimonial`
   into `praise`, `impactMetricV2` into hidden `metric`s, `externalPost.type` into `format`, legacy workshop agendas
   into `formats[]`, profile `bioFull`/`technicalRequirements` into `bioLong`/`rider[]`, and `consulting` offers into
   `advisory`. Run it again: the plan should be empty. Keep `--delete-legacy` for after step 5.
4. **Run the prompts below in order**, one session per prompt (0 → 12). Prompts 13 (voice) and 14 (visual
   consistency) can run any time after that, and again whenever content is added. Each prompt proposes changes as a table and
   waits for your OK before writing. It writes to **drafts**; you publish in Studio (or tell the agent to publish).
5. When Prompt 12 reports zero gaps: `pnpm migrate:v3 --apply --delete-legacy` removes the migrated V2 documents
   and the unused legacy types. Then the `Legacy` section of the Studio is empty.
6. Check **Studio → Needs attention**: every list there should be empty (or deliberately so).

## House rules (paste this block at the top of EVERY session)

```text
You are editing the Sanity dataset for faziz-dev.com (Faris Aziz: software engineer, conference speaker,
ZurichJS co-founder, based in Geneva). Use the Sanity MCP. Before changing anything, fetch the schema
for the types you touch; never guess field names. Work in drafts. Before writing, show me a table of
proposed changes (document id · field · current → proposed · reason) and wait for my OK. Change only
what the prompt covers.

The content model (V3):
- talk = a bookable topic, timeless, no date. event = one dated EDITION (React Summit US 2025), optionally
  in an eventSeries (React Summit). What Faris did there lives in event.sessions[], one per thing he did,
  each with an explicit role: speaker | keynote | lightning | workshop | panel | host | organizer | judge |
  mentor | guest | attendee. A session references the talk or workshop. Recordings and slides belong on
  the SESSION (recording.url, slidesUrl), never on the talk or in text.
- Counts are derived by the site from sessions: "talks delivered" counts only speaker/keynote/lightning
  sessions in the past; hosting and attending never inflate it. Never type a count into copy.
- praise = one quote from one person, verbatim, with platform, url (link to the original), date, author,
  topic (talk|workshop|stage|mentoring|community|work) and refs to the talk/workshop/event it is about.
- metric = one dated, defined number: value (display string), label, asOf (date), definition (how it's
  counted), domain, status. Only status "approved" is public. YOU never set status to approved; that is
  Faris's call. Leave new/changed metrics at "needs-ok".
- Publications: blogPost (on this site) and externalPost (elsewhere: format article|podcast|video).
  Both carry a topic: engineering | payments | careers | community.

Voice and style:
- Site copy is first person, casual and direct ("I build…", "I reply within two days"). Bios are third
  person. Short sentences. Concrete over clever. Write like Faris talks, not like a brand guideline: no
  "available upon request", "unmodified", "leverage", "seamless", "robust", "in today's landscape";
  no stacked colons and triples, no em dashes. Read it out loud: if it sounds like an AI wrote it,
  rewrite it (full list of tells: Prompt 13). No marketing adjectives (world-class, passionate,
  cutting-edge, rockstar, ninja, guru, thought leader). No exclamation marks outside quotes.
- No emojis anywhere in content (country names drive the flag emoji automatically).
- Never use the words "essays" or "notes" for writing. Never claim "most watched/most popular" without
  a dated source. No numbers without a date. Awards only with confirmed wording and year.
- Names, exactly: "ZurichJS" (not Zurich JS / ZurichJs), "ZurichJS Conf", "React Summit US",
  "CityJS <City>", "Smallpdf", "Next.js", "TypeScript", "JavaScript", "GitNation".
- Countries: standard English names ("Czechia", "United States", "United Kingdom", "North Macedonia",
  "Switzerland"). Cities in English ("Zurich", "Geneva", "Niš" keeps its diacritic).
- Dates are ISO (YYYY-MM-DD). Timezones are IANA names (Europe/Zurich, America/New_York).
- Never add a mailto: link or an email address to any content. Contact goes through the site's forms.
- Do not mention an employer or role that isn't public yet. The public employer line is Smallpdf.
- Slugs are permanent public URLs: never change an existing slug.
- If you're unsure about a fact (a date, a number, a name), leave the field empty and list it under
  "Questions for Faris" at the end. Never invent facts.
```

---

## Prompt 0: Audit (read-only)

```text
Read-only audit. Don't change anything. Run GROQ for each check and give me a table per section with
counts and the first 10 offending documents (id, title, what's missing). Checks:

1. Legacy leftovers: count of socialPost, testimonial, impactMetric, impactMetricV2, impactCategory,
   impactPage, servicePage, siteNavigation; events that still have `type`, `conference`, `talk` or `links`;
   externalPost with `type` but no `format`; talks with homepageFeatured/viewCount; drafts of any type.
2. Events: no sessions; a session without role; talk-role sessions without a talk ref; past sessions of
   role speaker/keynote/lightning without recording.url; events without location.country (and not
   online); non-standard country names; no timezone; no series where the title suggests one (CityJS …,
   React Summit …, ZurichJS …); duplicate editions (same series + date); a `kind` missing.
3. Talks: bookable talks missing pillar, summary (or summary > 160 chars), abstract, audience,
   takeaways (≠ 3), duration; more than one isCurrentVersion=true in a version family; talks never
   referenced by any session.
4. Writing: blogPost without topic or excerpt; externalPost without format/topic/source/publishedAt;
   podcasts without durationMinutes.
5. Praise: missing url (unless platform direct), date, topic; quotes that look paraphrased (third person
   "he said that…"); pullQuote not a verbatim substring of quote; duplicates (same author + similar text).
6. Metrics: missing asOf/definition; status counts.
7. Singletons: do documents with ids exactly `homePage`, `speakerProfile`, `availability`,
   `siteSettings` exist? (Studio opens those ids.) Any duplicates of those types with other ids?
8. Photos: media type photo without image.alt or credit; speakerProfile.headshots without alt,
   credit, tag, label or a hotspot.
9. Copy hygiene across all text fields: emojis, mailto:, email addresses, "Zurich JS", "essays",
   "notes" (as a word for writing), "most watched", exclamation marks, first-person/third-person mix-ups
   in bios.

Finish with a prioritised to-do list mapped to prompts 1–12 of docs/sanity-mcp-prompts.md.
```

## Prompt 1: Singletons (site settings, profile, home, availability)

```text
Goal: one of each singleton, with the fixed ids the Studio opens, and complete.

1. siteSettings (id "siteSettings"): if a siteSettings doc exists with another id, create "siteSettings"
   with the same content and tell me which old id to delete. Fill: siteTitle "Faris Aziz",
   siteUrl "https://faziz-dev.com", nowLine "Software engineer · speaker · ZurichJS co-founder",
   metaDescription (≤160 chars, first person is NOT used here: "Faris Aziz: software engineer,
   conference speaker and ZurichJS co-founder in Geneva. Talks and workshops on production engineering,
   payments at scale and technical leadership."), twitterHandle, linkedinUrl, githubUrl, blueskyUrl,
   youtubeUrl, discoveryCallUrl (cal.com), introEnabled true.
2. speakerProfile (id "speakerProfile"): name, pronunciation "FAH-riss ah-ZEEZ", tagline = the nowLine,
   travelBase "Geneva, Switzerland", replyTime "two working days", socialLinks (no email).
   Bios: bioShort (~30 words), bioMedium (~80), bioLong (~180), all THIRD person, the same facts in
   the same order, each longer bio a strict superset of the shorter one. Facts only: engineer on
   frontend and payment systems at scale; conference speaker; co-founded ZurichJS in 2024, chairs
   ZurichJS Conf and built its ticketing/CFP/sponsor platform; non-traditional route into
   engineering. No numbers that would go stale (say "thousands of members", not "4,500"). Set
   bioUpdatedAt to today. Show me all three side by side before writing.
   rider[]: Video / Audio / Timing / Recording (label + one line each).
   goodToKnow[]: In person / Remote / Fee / Tech / Lead time (first person, one or two sentences each).
   topicClusters[] (max 3): one per pillar engineering, payments, careers; title = the lead talk's
   title, description one sentence, talk = reference to that talk.
   formats[]: Keynote (30–45 min) · Talk (20–30 min) · Workshop (3 h or full day) · Panel · podcast.
   headshots[]: for each photo set label ("Stage portrait"), tag (portrait|stage|workshop|community|
   speaking|event — also the download filename), alt, credit; list photos without a hotspot so I can
   set it in Studio (the press kit crops around it).
   Delete legacy values only after copying: bioFull (→ bioLong), technicalRequirements (→ rider),
   socialLinks.email.
3. homePage (id "homePage"): heroVariant "band"; headline "I sit at the intersection of [product
   engineering], [monetization] and [technical leadership]." (brackets = underlined); intro (first
   person, two sentences); primaryCta {label "Invite me to speak", href "/invite"}; secondaryCta
   {"Where I'll be next", "/events"}; heroPhotos: pick one stage/workshop photo from the press photos (the hero shows only the first);
   featured: exactly three references — the flagship talk with a recording first, then the two most
   recent podcast externalPosts; featuredQuote: the best praise about the flagship talk; praise: seven
   featured praise refs (the first is the big spotlight quote); community: the ZurichJS community doc;
   invitePanel headline "Invite me to your stage." + body.
4. availability (id "availability"): the calendar is DERIVED from upcoming events (1–2 confirmed
   appearances in a month = "some dates taken", 3+ = "limited"), so months[] holds overrides only.
   Remove any month entry that just repeats what the events already say. Keep/add entries only for
   months that differ from the events (a holiday, a month kept free) and give them a note.
   leadTime: "Six weeks is comfortable; shorter is often fine."
```

## Prompt 2: Events, series and sessions

```text
Goal: every event is a clean edition with sessions carrying explicit roles.

1. Series: list distinct eventSeries names and any event titles implying a series. Merge duplicates
   ("Zurich JS" / "ZurichJS"); a series name is the brand only (no year, no city): "React Summit",
   "CityJS", "ZurichJS", "JSNation", "WhatTheStack". Set isOwn=true on ZurichJS. Set url where known.
   Point each edition at its series.
2. Edition titles: "<Series> <City or region> <Year>" when the series runs in several places
   ("CityJS Singapore 2025", "React Summit US 2025"), "<Series> <Year>" otherwise
   ("ZurichJS Conf 2026"), meetups by their own name ("Devs.Ghent"). Never change slugs.
3. Per event: kind (conference | meetup | workshop | podcast | livestream | company | awards) = what
   the event IS; timezone (IANA, from the city); location.venue/city/country in standard English;
   language; url (the event website, from links.eventUrl if still present); description ≤ 2 sentences.
4. Sessions (one per thing Faris did; a talk + a workshop at the same event = two sessions):
   role; talk or workshop reference; title only when it differs from the talk ("Chair · host ·
   platform", "Panel: Growing to senior"); detail ("3-hour workshop", "Opening keynote");
   startsAt when known (ISO with the event's offset); durationMinutes; stage; status: "tba" for upcoming
   sessions without time/stage, "cancelled" for talks that didn't happen (don't delete them), leave
   the rest "confirmed" (past sessions count as delivered automatically).
   Move every legacy links.videoUrl / links.slidesUrl onto the matching session's recording.url /
   slidesUrl. If one talk has several recordings, set featured=true on the best one.
5. Attending-only events: role attendee. Hosting: host (MC) or organizer (chair). Judging: judge.
6. Remove the legacy fields type / conference / talk / workshop / links only after their information is
   in the new fields.
Report: events changed, series created/merged, sessions added, and any event where the role is unclear.
```

## Prompt 3: Podcasts, videos and writing

```text
Goal: one timeline for written + podcasts + video, with consistent metadata.

1. Podcast appearances modelled as events (kind/type podcast, role guest): for each, create an
   externalPost {title (the episode title), url (episode page, not a search link), format "podcast",
   source (the SHOW name: "PodRocket", "ConTejas Code", "JS-Craft", "Life of Dev"), episode ("episode 36"
   if known), publishedAt, durationMinutes, topic, relatedTalk if it discusses a catalogue talk,
   excerpt (one sentence, third person is fine)}. Then propose deleting the podcast event (it doesn't
   belong in the speaking archive). Livestreams/videos of talks stay as session recordings; standalone
   videos (interviews, YouTube shows) become externalPost format "video".
2. Every externalPost: format, topic, source = outlet/show (not "Spotify"/"YouTube" unless there is no
   show name), publishedAt, excerpt ≤ 1 sentence, durationMinutes for podcasts/videos, featured only
   for the two items on the home page.
3. Every blogPost: topic (engineering | payments | careers | community; map category retrospective →
   careers, announcement → community, the rest → engineering unless the content says otherwise),
   excerpt (one sentence, first person), relatedTalk/relatedEvent when relevant, seoTitle ≤ 60,
   seoDescription ≤ 160. If a published post changed a number after publication, add a corrections[]
   entry {date, note} instead of silently editing.
4. Titles: sentence case for posts ("Why it's called ZurichJS"), keep external titles as published.
```

## Prompt 4: Talk catalogue

```text
Goal: a catalogue where every bookable talk reads the same way.

For every talk with isBookable == true (unset counts as NOT bookable) and isCurrentVersion != false:
- pillar: engineering | payments | careers | community (one).
- shortTitle: how people refer to it ("the caching talk", "the payments talk"); lower case.
- summary: ONE sentence, ≤ 160 chars, concrete, no marketing ("Data fetching when the network, the
  device and the backend are all against you.").
- abstract ("The premise"): first person, 60–120 words, one real production example carried end to end.
- audience ("Who it's for"): one sentence naming the role and an assumption ("Assumes you've shipped
  something that got slow.").
- takeaways ("You leave with"): exactly three, each starting with a noun phrase.
- duration (default minutes) and durationOptions (e.g. [20, 30, 45]).
- level ("Intermediate to senior"). setup only if it differs from the rider.
- alsoAsWorkshop: reference if a workshop covers it; relatedTalks: up to two ("Pairs well with").
- thumbnail: a stage photo of this talk with alt + credit (from media or the event cover).
- order: catalogue order (flagship first).
Versions (one talk, many years): a talk whose title or abstract changed over time is ONE family, not
separate talks. List every talk, then propose families: same idea, renamed or re-cut ("Data Fetching at
Scale" 2024 → "Caching, Payloads, and Other Dark Arts" 2025), or the same talk in another length/format
(a 20-min cut of a 30-min talk is a durationOption, not a new talk). For each family:
- the original has no parentTalk; every later cut sets parentTalk → the original (one level only);
- version: a short label ("2024", "2025 US tour"); versionNotes: one plain sentence on what changed;
- exactly one isCurrentVersion=true (the one to book); the others false. Sessions stay on the version
  that was actually given (the site shows "as <old title>" in the history).
Bookable: only isBookable == true is listed on /talks; unset or false keeps a talk off the catalogue.
Set it true only for talks Faris would give today (never delete the others: their sessions still count
and their pages stay for the recording).
Show the family table (family · version · title · years given · current? · bookable?) for my OK first.
Move any talk-level assets.videoUrl/slidesUrl onto the session where it was recorded; then clear them.
Clear legacy homepageFeatured / viewCount / firstDelivered.
```

## Prompt 5: Metrics (dated and defined)

```text
Goal: every number on the site is dated, defined and approved by Faris.

1. For each metric (and any legacy impactMetricV2/impactMetric not yet migrated): value as displayed
   ("4,500", "~14×", "−60%", "40+", "6 figures"), label (lower case, what it counts), qualifier,
   asOf (the date it was true), period when it's a range ("2024–26"), definition (one sentence: how it's
   counted, from what source), context (one honest sentence for cards), domain, sourceUrl if public.
2. Community (domain community, community → ZurichJS): members across groups; CFP submissions for the
   first Conf; meetup speakers hosted; sponsors & partners.
3. Engineering (domain engineering, company → Smallpdf etc.): only numbers Faris has cleared for
   public use. Transaction volume is VOLUME, not revenue, and needs currency + period in the definition.
   Set area (payments | growth | performance | reliability | product | platform | leadership) on every
   engineering metric: it drives the explorer filter on /impact. Mark up to four as featured (headline).
4. Leave status at "needs-ok" for everything you created or changed and list them for Faris to approve.
   Delete duplicates. Don't create metrics for speaking counts (talks delivered, countries): the site
   derives those from sessions.
```

## Prompt 5b: Brag list → metrics

Paste your wins as rough notes after this prompt (one per line, any format: "cut checkout JS 60% in
2025", "launched 12 local payment methods", "hired the first 8 engineers at Navro"). The MCP turns them
into metric drafts; you approve them in Studio.

```text
Turn the list below into engineering metric documents. For each line:
- value exactly as it should display ("−60%", "12", "0 → 8"), label (lower case, what it counts),
  company → the matching career entry, area (payments | growth | performance | reliability | product |
  platform | leadership), asOf (or period for a range), definition (one sentence: how it's counted and
  compared: before vs after, which window, which source), context (optional, one plain sentence).
- status "needs-ok". Never approve. Never invent a number, date or definition: if a line doesn't give
  one, leave the field empty and ask me in "Questions for Faris".
- Skip duplicates of existing metrics (same label + company); show them as "already there".
Show the table first (value · label · company · area · asOf · definition · questions), wait for my OK,
then create drafts. Voice rules apply to label and context (see house rules).

List:
```

## Prompt 6: Praise

```text
Goal: every quote verbatim, sourced, dated and tagged.

For each praise document (and any socialPost/testimonial not yet migrated):
- quote: the author's words verbatim. Trim with "[…]" only; fix nothing but obvious typos. If it's a
  paraphrase, flag it for removal.
- pullQuote: the single strongest sentence, copied verbatim from the quote, ≤ 160 chars.
- platform: linkedin | x | bluesky | mentorcruise | direct. url: the original post (required unless
  direct). date: the post date.
- author: name, handle (@ for X/Bluesky), headline (their role at the time, short: "Staff Engineer",
  "WhatTheStack co-founder"), avatar image if available.
- topic + references: talk (and event) for talk feedback, workshop for workshop feedback, mentoring,
  community (ZurichJS), stage (general speaking), work (colleagues/clients).
- label only when the default ("On the caching talk", "On the workshop", "On mentoring") is wrong,
  e.g. "On the warm-up".
- featured: at most 8 overall, balanced across topics, newest strong ones first; order for the home set.
Merge duplicates (same author + same text). Report praise with no link or date for Faris to source.
```

## Prompt 7: Workshops

```text
Goal: bookable workshop templates with agendas per format.

For each workshop: pillar; summary (one sentence); description (intro, first person OK); formats[]:
one per length ({label "3-hour edition", duration "3 h", agenda[]}, {label "Full day", duration
"6.5 h", agenda[]}) — agenda items {at "0:00", title, summary (one line), isBreak for breaks}; the
item offsets must add up to the advertised length. Move a legacy single `agenda` into formats[0].
duration summary ("3 h or full day (6.5 h)"), participants {min, max}, room ("Tables, power, reliable
wifi, projector"), after ("Repo, slides and resources stay available via the attendee link"),
prerequisites (≤ 4, concrete: "Own laptop, Node 20+, a GitHub account"), outcomes, relatedTalk (the
30-minute version), isBookable, order. Check every delivery exists as an event session with role
"workshop" referencing the workshop (workshopInstance documents are attendee pages, not the public record).
```

## Prompt 8: Community (ZurichJS)

```text
Goal: one community document that feeds /community and the home feature.

Create/complete community "ZurichJS" (slug zurichjs): role "Co-founder and chair", founded 2024, city
Zurich, url, series → the ZurichJS eventSeries, headline "I co-founded and lead ZurichJS.",
caseStudyHeadline "Co-founded in 2024. A conference by 2026.", summary (first person, 3–4 sentences:
why it exists, what Faris does — chairs, hosts, built the platform — and the first two-day Conf).
pillars[3]: Host / Teach / Build, each {kicker, title, body (one or two sentences), link}.
metrics: references to the four community metrics (prompt 5). recognition[]: {title, issuer, year,
url, confirmed}. The confirmed award (Faris, Sep 2026): title "Open Source Award: Global Community
with the Highest Impact", year 2026, confirmed=true; ask for the issuer's exact name (e.g. "Open Source
Awards at JSNation") and a link. Any other award stays confirmed=false until Faris confirms wording
and year. aftermovie: {title, caption, credit, poster, video (upload the MP4 in Studio: it plays on
/community with captions) or url (YouTube/Vimeo), captions (.vtt), published=false until the film is
public}. photos: 2–4 meetup/conference photos with alt + credit. platformProject: the project
document for the conference platform (create a project if missing).
```

## Prompt 9: About page and career timeline

```text
Goal: a first-person About story and a public career timeline.

1. page (identifier "about"), work first: kicker "About · Geneva"; title "A builder at heart. Products,
   payments and a JavaScript community."; subtitle (intro, 2 sentences, today's work first: "By day I
   build frontend and payment systems for products used by millions, and lead the teams that ship them.
   The rest of the time I'm on stage talking about it, or running ZurichJS."); content (story, first
   person, 3–4 paragraphs: today's work, how speaking started, ZurichJS; the route into tech last, in one
   or two sentences). No headings, no lists, no numbers that go stale.
   inShort[]: Work / Speak / Build (label + one line). heroImage with alt + credit.
   Clear the legacy aboutHero/aboutWhatIDo/aboutJourney/aboutSkills/aboutCta objects after copying
   anything still true into the new fields.
2. company (Career entry) documents: name, role, startDate and endDate (empty = current) — these drive
   the timeline label ("2024 →", "2021–2023") and order, so fill them for every entry. periodLabel only
   to override ("Before code"); clear labels like "Earlier" once dates exist. description (one line,
   only where needed), isPublic (false for anything not announced yet).
3. Agency roles are ONE entry with clients[]: FX Digital (Junior Front-End Developer, 2019–2021) with
   clients Discovery+ (connected devices app), Eurosport (Connected TV apps reaching millions of users
   worldwide), GCN. Merge the separate Discovery+ / Eurosport / GCN entries into it (keep their urls and
   one-line descriptions as client notes), then delete the separate entries.
4. Delete the "Software Engineering Mentor · MentorCruise" career entry (mentoring lives on /mentorship).
```

## Prompt 10: Services

```text
Goal: three service cards and the mentorship offers.

serviceOffer per type, in order:
- events: title "Events: speaking and workshops", audience "Conferences, meetups, podcasts, teams",
  reachOutIf (lower case, finishes "Get in touch if…"), youGet (finishes "You get…"), primaryCta
  {"Invite me", "/invite"}, secondaryCta {"See workshops", "/workshops"}.
- advisory (legacy "consulting" offers become advisory): title "Advisory", audience "Companies and
  founders · limited availability", reachOutIf/youGet, primaryCta {"Tell me what's going on",
  "/contact#message"}.
- mentorship: title "Mentorship", audience "Individual engineers", primaryCta {"How mentorship works",
  "/mentorship"}; plus the detailed mentorship offers (bestFor, outcomes ≤ 5, engagementFormat, pricing
  fields, bookingUrl) for /mentorship.
Remove superlatives; first person; no prices in reachOutIf/youGet.
```

## Prompt 11: Photos and media

```text
Goal: every public photo has alt text and a credit, and is attached to its event.

For media documents of type photo: image.alt (describe what's in the picture: "Faris on stage at React
Summit US, wide shot"), credit (photographer or organiser), event reference, date, title. Suggest
event covers (event.coverImage) from these photos for past events without one. Flag media of type
video/press/podcast/screenshot: videos should become session recordings or externalPost videos; press
items externalPost articles. Don't delete media, just list what should move.
```

## Prompt 12: Cross-document harmony pass

```text
Final pass across the whole dataset. Read-only first, then propose fixes as a table.

1. The same thing is named the same everywhere: talk titles in praise labels, homePage, topicClusters
   and blog relatedTalk; series names; "ZurichJS Conf"; country names.
2. Bios vs metrics vs About: no fact disagrees (founding year, role, employer line, community size
   wording). Bios stay number-free.
3. Every referenced document exists and is published (no dangling references; no references to drafts).
4. Every upcoming event (date ≥ today) has at least one non-attendee session; every past talk session
   has either a recording or a note in the report.
5. Re-run the Prompt 0 audit and show the before/after counts. When the "Legacy leftovers" section is
   all zero, tell me to run `pnpm migrate:v3 --apply --delete-legacy`.
6. List "Questions for Faris" (facts only he can confirm): award wording/year, engineering figures for
   public use, career dates, aftermovie URL, availability month statuses, unannounced roles.
```

## Prompt 13: Voice sweep (AI tells)

Run any time content has been added. Get the findings first, locally:
`pnpm voice:cms --json > voice.json` (the same rules the Studio warning uses; see `docs/voice.md`), then paste
the JSON after this prompt. Without it, the MCP scans itself using the list below.

```text
Voice sweep. Goal: every piece of copy sounds like Faris talking, not like an AI wrote it.
Scope: all published documents EXCEPT praise.quote (other people's words stay verbatim) and slugs,
names, dates and URLs (never change facts while fixing voice).

Flag and rewrite:
- Words: leverage, utilise, harness, seamless, robust, effortless, delve, deep dive, dive into, elevate,
  unlock, empower, supercharge, crucial, pivotal, paramount, passionate, thought leader, visionary,
  world-class, cutting-edge, game-changing, journey, embark, showcase, boasts, resonates, curated,
  bespoke, comprehensive, meticulous, nuanced, synergy, holistic, innovative, streamline, actionable,
  upon request, unmodified, prior to, in order to, facilitate, reach out, don't hesitate, essays.
- Shapes: "not just X, it's Y" / "more than just"; scene-setting ("In today's fast-paced…");
  setup lines ("Here's the thing:", "The best part?", "The result?"); "Whether you're…";
  copy that narrates the page or the counting ("This section lists…", "counted separately");
  reflexive triples; stacked colons; em dashes (use a comma, colon or full stop).
- Register: legal or brand-guideline tone ("available on request, unmodified") → how he'd say it
  ("Just ask. Please keep it as it is.").

Rewrite rules: first person on site copy, third person in bios. Short sentences. Keep the meaning and
every fact; change the fewest words that fix it. Don't add adjectives, numbers or claims.

Output one table: document id · field · current → proposed · tell. Wait for my OK, then write drafts.
After publishing, I'll re-run `pnpm voice:cms`; the goal is zero findings (a talk title someone else
chose may stay; list those as "kept on purpose").
```

## Prompt 14: Visual consistency (photos, crops, covers)

Run after Prompt 11, and again whenever photos are added. The site crops every photo to a fixed shape and
centres the crop on the photo's **hotspot**, so a missing hotspot is the most common reason a face gets cut off.

```text
Visual consistency pass. Goal: every photo the site shows is sharp, well cropped, described and
consistent with the others in the same place. Read-only first; propose changes as a table; wait for my OK.
You cannot set a hotspot through the API reliably by eye: list the photos that need one and I'll set it
in Studio (drag the circle onto the face or the stage). Never replace or delete an asset.

Where each photo appears and the shape the site crops it to:
- homePage.heroPhotos[]: the hero shows the FIRST photo only, one image clipped into the band (cover
  crop around the hotspot); the third, if set, is the opener's square speaker card. Empty = the site
  uses speakerProfile.headshots (stage shots first). Want: a landscape stage or workshop shot, Faris
  clearly visible, at least 1920 px wide.
- speakerProfile.headshots[]: press kit crops 1:1, 4:5 and 16:9 around the hotspot; the "portrait" tag
  is the opener's speaker card (square). Want: at least 2000 px on the short side, one photo per tag,
  tag in portrait|stage|workshop|community|speaking|event.
- talk.thumbnail: talk rows 16:10, talk page backdrop full width. Want: a stage photo of THAT talk,
  landscape, at least 1600 px wide. No slide screenshots, logos or text-heavy images.
- event.coverImage: event aside 4:3. Want: a photo from the day (before the event: the venue),
  at least 1200 px wide. Not the conference logo (that goes on eventSeries.logo).
- blogPost.coverImage: 2:1 on the article, 16:9 in lists. externalPost.image: 16:9 in lists.
- praise.author.image: square avatar, 1:1. Want: the person's own profile photo, face centred.
- community.photos[]: 16:9 (32:9 when there is only one); aftermovie.poster 2:1 and 16:8.5.
- media (type photo).image: gallery 3:2. project.image 16:9, project screenshots 16:10.

Check, per photo (use asset->metadata.dimensions for size):
1. Hotspot missing on any photo above → "needs hotspot" list (document, field, what's in the photo).
2. Too small for where it's used (widths above) → list with the actual size; suggest a better photo
   from media or headshots if one exists.
3. Wrong orientation for the slot (a portrait photo as a talk thumbnail or hero) → suggest a swap.
4. alt: missing, generic ("image", "photo", a filename) or describing the file instead of the picture.
   Write alt as what a sighted person sees, one sentence, no "image of": "Faris on stage at React
   Summit US 2025, wide shot". Don't guess names of other people; say "an attendee" instead.
5. credit: missing on photos someone else took → "Questions for Faris" (never invent a photographer).
6. caption (where used): sentence case, no trailing full stop, what and where: "On stage at CityJS
   Athens 2025". Same pattern everywhere.
7. Repetition: the same asset used as the thumbnail of several talks or the cover of several events,
   or the same photo three times on the home page (hero + community + posters). Suggest alternatives
   from media photos attached to the right event.
8. Consistency inside a list: all talk thumbnails are stage photos (not a mix of stage, headshot and
   logo); all event covers are photos, not logos; all praise avatars are photos, not platform logos.

Output: one table per check (document id · field · issue · proposed fix), then the "needs hotspot" list,
then "Questions for Faris". After I set hotspots, re-run checks 1–3 and show the before/after counts.
```

---

### Open items from the design review (only Faris can close these)

- Approve engineering figures: Studio → Needs attention → Metrics waiting for an OK (or Proof → Metrics) → open each metric, check value/definition/date, set Status to "Approved for public use", Publish.
- Career dates: enter them on each Career entry in Studio (they drive the timeline).
- Award: "Open Source Award: Global Community with the Highest Impact" (2026) is confirmed; the issuer's exact name and a link are still to add.
- Currency and period for platform transaction volume (volume, not revenue).
- Aftermovie: upload the file on the ZurichJS community document (Aftermovie → Video file, plus captions .vtt) or paste a YouTube/Vimeo URL, then switch Published on.
- Bluesky praise posts (none collected yet).
- Availability: derived from events; add month overrides only for holidays or months kept free.
- The next role stays out of public copy until announced: it's a one-string swap of `siteSettings.nowLine`
  and one `company` entry (`isPublic`).
