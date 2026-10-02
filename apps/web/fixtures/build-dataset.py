#!/usr/bin/env python3
"""
Builds fixtures/sanity-dataset.json: an offline dataset for `SANITY_FIXTURES=1`.
Content mirrors the V3 design handoff. It includes a few documents in the
LEGACY V2 shape on purpose, so the fallback paths stay tested.
Not production content. Never import it into the real dataset.
"""
import json, os

def img(aid, w, h, alt, credit=None, **extra):
    o = {"_type": "image", "asset": {"_type": "reference", "_ref": f"image-{aid}-{w}x{h}-jpg"}, "alt": alt}
    if credit: o["credit"] = credit
    o.update(extra)
    return o

PHOTOS = [
    ("b1ae7c349483be8176fcab676e48a88e958ec52e", 6488, 4325, "Faris speaking under stage lighting", "Stage portrait", "portrait"),
    ("0d739fe9e228e63bd5359f51426c202d1363fc6d", 6256, 4172, "Faris on a conference stage, wide", "Conference stage, wide", "stage"),
    ("5b80e104550c6b67f5503564a0a030e82f0b34b6", 2856, 2142, "Faris running a workshop", "Workshop in progress", "workshop"),
    ("9dae32e83775700b957d149806b774fb7f88698a", 2048, 1088, "A ZurichJS evening", "ZurichJS meetup", "community"),
    ("8c1dec0d38844e17eb42865ebb7c879bfbd355af", 4032, 3024, "Faris speaking, mid-gesture", "Speaking, close", "speaking"),
    ("247e8ebcfc22176df3240a49436667f325581768", 4928, 3279, "Conference audience and stage", "Event, audience", "event"),
]
docs = []
for aid, w, h, *_ in PHOTOS:
    docs.append({"_id": f"image-{aid}-{w}x{h}-jpg", "_type": "sanity.imageAsset",
                 "url": f"https://cdn.sanity.io/images/94fb4yui/production/{aid}-{w}x{h}.jpg",
                 "metadata": {"dimensions": {"width": w, "height": h, "aspectRatio": w / h}}})
P = {p[5]: img(p[0], p[1], p[2], p[3], "Event photographer") for p in PHOTOS}

def ref(i): return {"_type": "reference", "_ref": i}
def slug(s): return {"_type": "slug", "current": s}

docs += [
  {"_id": "siteSettings", "_type": "siteSettings", "siteTitle": "Faris Aziz", "siteUrl": "https://faziz-dev.com",
   "nowLine": "Software engineer · speaker · ZurichJS co-founder", "twitterHandle": "farisaziz12", "introEnabled": True},
  {"_id": "speakerProfile", "_type": "speakerProfile", "name": "Faris Aziz", "pronunciation": "FAH-riss ah-ZEEZ",
   "travelBase": "Geneva, Switzerland", "bioUpdatedAt": "2026-09-01",
   "headshots": [dict(P[p[5]], _key=p[5], label=p[4], tag=p[5]) for p in PHOTOS]},
  # Months are derived from events; this is one override (a month kept free).
  {"_id": "availability", "_type": "availability", "months": [
     {"_key": "b", "month": "2027-08-01", "status": "limited", "note": "Summer break"}]},
]

# ── series ──
series = [("react-summit", "React Summit", "conference"), ("cityjs", "CityJS", "conference"), ("zurichjs", "ZurichJS", "meetup"),
          ("game-of-codes", "Game of Codes", "conference"), ("devs-ghent", "Devs.Ghent", "meetup"), ("whatthestack", "WhatTheStack", "conference"),
          ("react-alicante", "React Alicante", "conference"), ("jsnation", "JSNation", "conference")]
for s, n, k in series:
    docs.append({"_id": f"series-{s}", "_type": "eventSeries", "name": n, "slug": slug(s), "kind": k, "isOwn": s == "zurichjs"})

# ── talks ──
talks = [
  {"_id": "talk-caching", "title": "Caching, Payloads, and Other Dark Arts: Optimizing UX in Suboptimal Conditions", "shortTitle": "the caching talk",
   "slug": slug("caching-payloads-dark-arts"), "pillar": "engineering", "order": 1,
   "summary": "Real-world data fetching at scale: BFF layers, granular payload shaping, and what to cache where.",
   "abstract": "This talk breaks down real-world data fetching challenges at scale and how to solve them with modern patterns like the BFF layer, granular payload shaping, and caching that fits the data instead of the framework. One production example carried end to end: what the user saw, what the network did, and what we changed.",
   "audience": "Frontend and full-stack engineers who own a data layer in production. Assumes you've shipped something that got slow.",
   "takeaways": ["A decision table for what to cache, where, and for how long", "Payload shaping patterns that cut bytes without a rewrite", "A BFF checklist you can argue for on Monday"],
   "duration": 30, "durationOptions": [20, 30, 45], "level": "Intermediate to senior", "topics": ["React", "Caching", "BFF"],
   "thumbnail": P["speaking"], "alsoAsWorkshop": ref("workshop-react-arch"),
   "parentTalk": ref("talk-caching-v1"), "version": "2025", "isCurrentVersion": True,
   "versionNotes": "New title, payload shaping and a real production example carried end to end.", "relatedTalks": [dict(ref("talk-resilient"), _key="r1")]},
  {"_id": "talk-payments", "title": "Orchestrating Millions Across the Globe: Reactive Payments at Scale", "shortTitle": "the payments talk",
   "slug": slug("reactive-payments-at-scale"), "pillar": "payments", "order": 2, "duration": 30,
   "summary": "“Just integrate Stripe” works, until it doesn’t. Multi-provider orchestration and its failure modes.",
   "abstract": "“Just integrate Stripe” works, until it doesn’t. At a few million payments a month you run more than one provider, in more than one currency, with more than one way to fail. This talk follows one checkout from click to settlement.\n\nWe look at routing between providers, retries that don’t double-charge, and what the UI should say while a payment is still pending. Then the failure modes: soft declines, timeouts that succeeded, webhooks that arrive twice or never.\nEach one comes with the fix we shipped.\n\nYou leave with a map of where payments break and a short list of patterns that keep the checkout honest.",
   "audience": "Product engineers, payments and platform teams", "thumbnail": P["stage"]},
  {"_id": "talk-resilient", "title": "Building Resilient UIs with React", "slug": slug("building-resilient-uis-with-react"), "pillar": "engineering",
   "order": 3, "duration": 25, "summary": "React apps sit at the boundary of a distributed system. Design them to fail well.",
   "abstract": "React applications sit at the boundary of a distributed system: APIs, third parties, feature flags. This session is about designing them to fail well.",
   "audience": "React teams shipping to production"},
  {"_id": "talk-senior", "title": "Growing into Senior and Lead Roles Early", "slug": slug("growing-into-senior-early"), "pillar": "careers", "order": 4,
   "duration": 30, "summary": "Taking responsibility before you feel ready, and what that costs.", "audience": "Engineers two to six years in"},
  {"_id": "talk-community", "title": "Why It's Called ZurichJS: Building a Community from Zero", "slug": slug("building-a-community-from-zero"), "pillar": "community",
   "order": 5, "duration": 20, "summary": "Meetups to a conference in two years, and the systems that made it possible.", "audience": "Organisers and DevRel"},
  # version family: the 2024 cut of the caching talk (retired; the current one links it as parentTalk)
  {"_id": "talk-caching-v1", "title": "Data Fetching at Scale: BFFs and Caching", "slug": slug("data-fetching-at-scale"), "pillar": "engineering",
   "duration": 25, "summary": "A BFF layer and a caching plan for a data-heavy React app.", "version": "2024", "isCurrentVersion": False,
   "versionNotes": "The first cut: BFF and caching only, one example app."},
  # a V2-shaped talk (no pillar/summary, legacy assets) to exercise fallbacks
  {"_id": "talk-legacy-next", "title": "Next.js at the Edge (2023 cut)", "slug": slug("nextjs-at-the-edge"), "duration": 30, "topics": ["Next.js"],
   "isBookable": False, "assets": {"videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}},
]
for t in talks:
    t["_type"] = "talk"
    t.setdefault("isBookable", t["_id"] in {"talk-caching", "talk-payments", "talk-resilient", "talk-senior", "talk-community"})
    docs.append(t)

docs.append({"_id": "workshop-react-arch", "_type": "workshop", "title": "React Architecture in Production", "slug": slug("react-architecture-in-production"),
  "pillar": "engineering", "summary": "The patterns that keep large React applications standing.",
  "description": "A working session on the patterns that keep large React applications standing: atomic design that survives growth, reconciliation you can reason about, resilience engineering, and observability that tells you something before your users do.",
  "duration": "3 h or full day (6.5 h)", "participants": {"min": 12, "max": 30}, "room": "Tables, power, reliable wifi, projector",
  "after": "Repo, slides and resources stay available via the attendee link", "relatedTalk": ref("talk-caching"),
  "prerequisites": ["Comfortable with React and TypeScript", "Own laptop, Node 20+, a GitHub account", "The repo link arrives the day before"],
  "formats": [
    {"_key": "f3", "_type": "workshopFormat", "label": "3-hour edition", "duration": "3 h", "agenda": [
      {"_key": "1", "_type": "agendaItem", "at": "0:00", "title": "Warm-up: break something on purpose", "summary": "A live exercise that sets expectations and shows how failure actually looks in a React app."},
      {"_key": "2", "_type": "agendaItem", "at": "0:25", "title": "Structure that survives growth", "summary": "Atomic design applied to a real codebase; where the boundaries go and why."},
      {"_key": "3", "_type": "agendaItem", "at": "1:10", "title": "Reconciliation, for real", "summary": "What React does with your tree and the three mistakes that cost the most in production."},
      {"_key": "4", "_type": "agendaItem", "at": "1:45", "title": "Break", "isBreak": True},
      {"_key": "5", "_type": "agendaItem", "at": "2:00", "title": "Resilience engineering", "summary": "Retries, fallbacks, circuit breakers and chaos, in the UI layer."},
      {"_key": "6", "_type": "agendaItem", "at": "2:40", "title": "Observability and alerting", "summary": "What to measure, what to alert on, and what to ignore. Wrap-up and resources."}]},
    {"_key": "fd", "_type": "workshopFormat", "label": "Full day", "duration": "6.5 h", "agenda": [
      {"_key": "1", "_type": "agendaItem", "at": "0:00", "title": "Warm-up: break something on purpose"},
      {"_key": "2", "_type": "agendaItem", "at": "0:45", "title": "Structure that survives growth, with a refactor lab"},
      {"_key": "3", "_type": "agendaItem", "at": "2:30", "title": "Lunch", "isBreak": True},
      {"_key": "4", "_type": "agendaItem", "at": "3:30", "title": "Resilience engineering lab"},
      {"_key": "5", "_type": "agendaItem", "at": "5:30", "title": "Observability, and your own action plan"}]}]})
# V2-shaped workshop: long description, no summary, many outcomes/prereqs (the layout must cope).
docs.append({"_id": "workshop-legacy", "_type": "workshop", "title": "Payments UI Deep Dive", "slug": slug("payments-ui-deep-dive"), "duration": "Full day",
  "description": "Checkout flows that survive real traffic. We start from a working but naive checkout and harden it step by step: idempotent submissions, retries that don't double-charge, 3-D Secure challenges that don't lose the cart, local payment methods that redirect away and come back, and error states people can actually recover from. Along the way we look at how the big providers model payments, where their SDKs help and where they get in the way, and how to test all of it without a real card. The afternoon is a lab: you pick a provider, wire up two local methods and ship a checkout that passes a scripted chaos run. Bring questions from your own product; the last hour is open for them.",
  "outcomes": ["Design an idempotent checkout submission", "Handle 3-D Secure without losing state", "Add a redirect-based local payment method", "Write recoverable error states", "Test payments without real cards", "Choose between provider SDKs and your own UI", "Run a chaos test on your checkout"],
  "prerequisites": ["Comfortable with React and TypeScript", "Own laptop with Node 20+", "A free Stripe test account", "A free Adyen test account (optional)", "Basic HTTP and REST knowledge"],
  "participants": {"min": 10, "max": 24},
  "agenda": [{"_key": "x", "_type": "object", "title": "Checkout anatomy", "duration": "1 hour"}]})

# ── workshop deliveries (token-gated attendee pages): open, upcoming, closed ──
def wsi(i, token, date, **kw):
    blk = lambda k, t, style="normal": {"_key": k, "_type": "block", "style": style, "markDefs": [], "children": [{"_key": k + "s", "_type": "span", "marks": [], "text": t}]}
    d = {"_id": f"wsi-{i}", "_type": "workshopInstance", "title": "React Architecture in Production", "event": "ZurichJS · November edition",
         "token": {"_type": "slug", "current": token}, "workshopDate": date, "accessDurationDays": 30, "forceClose": False,
         "repoUrl": "https://github.com/farisaziz12/react-architecture-workshop", "overallFeedbackUrl": "https://forms.gle/example",
         "sections": [
            {"_key": "s1", "_type": "workshopSection", "title": "Warm-up: break something on purpose", "content": [blk("a", "Clone the repo and run it."), blk("b", "Then break the data layer on purpose and watch what the UI does.")]},
            {"_key": "s2", "_type": "workshopSection", "title": "Structure that survives growth", "content": [blk("c", "Atomic design, applied to the repo you just broke.")]},
            {"_key": "s3", "_type": "workshopSection", "title": "Resilience engineering", "sectionFeedbackUrl": "https://forms.gle/example", "content": [blk("d", "Retries, fallbacks and circuit breakers in the UI layer.")]}]}
    d.update(kw); docs.append(d)
wsi("open", "demo-open", "2026-09-28")
wsi("upcoming", "demo-upcoming", "2026-11-20")
wsi("closed", "demo-closed", "2026-06-01", forceClose=True)

# ── events ── (V3 shape unless marked legacy)
def ev(i, title, date, city, country, series_id, kind, sessions, tz="Europe/Zurich", **kw):
    d = {"_id": f"event-{i}", "_type": "event", "title": title, "slug": slug(i), "date": date, "timezone": tz, "kind": kind,
         "location": {"city": city, "country": country, **kw.pop("loc", {})}, "sessions": sessions}
    if series_id: d["series"] = ref(f"series-{series_id}")
    d.update(kw); docs.append(d)
def sess(key, role, talk=None, workshop=None, **kw):
    s = {"_key": key, "_type": "session", "role": role}
    if talk: s["talk"] = ref(talk)
    if workshop: s["workshop"] = ref(workshop)
    s.update(kw); return s

ev("devs-ghent-2026", "Devs.Ghent", "2026-09-30", "Ghent", "Belgium", "devs-ghent", "meetup",
   [sess("a", "speaker", "talk-payments", startsAt="2026-09-30T17:00:00Z")], tz="Europe/Brussels", url="https://devs.gent")
ev("game-of-codes-2026", "Game of Codes 2026", "2026-10-09", "Niš", "Serbia", "game-of-codes", "conference",
   [sess("a", "speaker", "talk-resilient", status="tba", durationMinutes=25)], tz="Europe/Belgrade",
   loc={"venue": "Science & Technology Park"}, url="https://gameofcodes.rs", language="English")
ev("react-alicante-2026", "React Alicante 2026", "2026-09-12", "Alicante", "Spain", "react-alicante", "conference",
   [sess("a", "speaker", "talk-resilient", recording={"url": "https://www.youtube.com/watch?v=aaaaaaaaaaa"})], tz="Europe/Madrid")
ev("zurichjs-conf-2026", "ZurichJS Conf 2026", "2026-09-10", "Zurich", "Switzerland", "zurichjs", "conference",
   [sess("a", "organizer", title="Chair · host · platform")], endDate="2026-09-11", featured=True)
ev("react-summit-us-2025", "React Summit US", "2025-11-18", "New York", "United States", "react-summit", "conference",
   [sess("a", "speaker", "talk-caching", featured=True, recording={"url": "https://www.youtube.com/watch?v=bbbbbbbbbbb", "durationMinutes": 30},
         slidesUrl="https://slides.example/caching.pdf", slidesNote="PDF, 4.2 MB"),
    sess("b", "panel", title="Panel: Growing to senior")], tz="America/New_York", featured=True)
ev("zurichjs-react-arch-2025", "ZurichJS · React Architecture workshop", "2025-11-12", "Zurich", "Switzerland", "zurichjs", "meetup",
   [sess("a", "workshop", workshop="workshop-react-arch", detail="3-hour workshop")])
ev("zurichjs-december-2026", "ZurichJS December meetup", "2026-12-03", "Zurich", "Switzerland", "zurichjs", "meetup", [sess("a", "host")])
ev("zurichjs-anniversary-2025", "ZurichJS 1st anniversary", "2025-11-05", "Zurich", "Switzerland", "zurichjs", "meetup", [sess("a", "host")])
ev("whatthestack-2025", "WhatTheStack", "2025-09-20", "Skopje", "North Macedonia", "whatthestack", "conference",
   [sess("a", "speaker", "talk-caching"), sess("b", "workshop", workshop="workshop-react-arch", detail="Full-day workshop")], tz="Europe/Skopje")
ev("cityjs-singapore-2025", "CityJS Singapore", "2025-07-18", "Singapore", "Singapore", "cityjs", "conference", [sess("a", "speaker", "talk-payments")], tz="Asia/Singapore")
ev("cityjs-athens-2025", "CityJS Athens", "2025-06-05", "Athens", "Greece", "cityjs", "conference", [sess("a", "speaker", "talk-caching")], tz="Europe/Athens")
ev("react-day-berlin-2024", "React Day Berlin 2024", "2024-12-13", "Berlin", "Germany", None, "conference",
   [sess("a", "speaker", "talk-caching-v1")], tz="Europe/Berlin")
ev("jsnation-2025", "JSNation", "2025-06-12", "Amsterdam", "Netherlands", "jsnation", "conference", [sess("a", "attendee", detail="OSS Awards")], tz="Europe/Amsterdam")
# legacy V2 events (no sessions[]; type + conference + talk + links)
docs.append({"_id": "event-cityjs-london-2025", "_type": "event", "title": "CityJS London 2025", "slug": slug("cityjs-london-2025"), "type": "conference",
  "conference": "CityJS", "date": "2025-04-16", "location": {"city": "London", "country": "United Kingdom"}, "talk": ref("talk-caching"),
  "links": {"eventUrl": "https://london.cityjsconf.org", "videoUrl": "https://www.youtube.com/watch?v=ccccccccccc"}})
docs.append({"_id": "event-react-paris-2025", "_type": "event", "title": "React Paris", "slug": slug("react-paris-2025"), "type": "hosting",
  "conference": "React Paris", "date": "2025-03-20", "location": {"city": "Paris", "country": "France"}})
docs.append({"_id": "event-podcast-legacy", "_type": "event", "title": "Life of Dev", "slug": slug("life-of-dev"), "type": "podcast",
  "conference": "Life of Dev", "date": "2026-03-02", "location": {"isOnline": True}})

# ── praise (V3) + legacy socialPost/testimonial ──
def pr(i, quote, name, headline, platform, date, topic, **kw):
    d = {"_id": f"praise-{i}", "_type": "praise", "quote": quote, "author": {"name": name, "headline": headline}, "platform": platform,
         "date": date, "topic": topic, "url": kw.pop("url", f"https://example.com/post/{i}")}
    d.update(kw); docs.append(d)
pr("tejas", "Faris is one of the best speakers I've seen recently. The guy is going places.", "Tejas Kumar", "host of ConTejas Code, author of Fluent React", "linkedin", "2025-09-24", "stage", featured=True, order=1)
pr("rajni", "One of the most impressive 20-minute sessions I've ever seen. 5× content with perfect clarity. He delivered 5× content with perfect clarity, no confusion, and a beautifully structured walkthrough of the entire caching optimization process.", "Rajni Gediya", "Staff Engineer", "linkedin", "2025-11-20", "talk", talk=ref("talk-caching"), event=ref("event-react-summit-us-2025"), featured=True,
   pullQuote="One of the most impressive 20-minute sessions I've ever seen.")
pr("darko", "You need a Faris Aziz on your conference, meetup, whatever. This guy's enthusiasm lights up rooms.", "Darko Bozhinovski", "WhatTheStack co-founder", "linkedin", "2025-09-22", "stage", featured=True, pullQuote="This guy's enthusiasm lights up rooms.")
pr("ioannis", "An intense 3-hour crash course on production-ready patterns. The kind of tactical knowledge that immediately changes how you write code.", "Ioannis Krokos", "attendee, ZurichJS", "linkedin", "2025-11-14", "workshop", workshop=ref("workshop-react-arch"), featured=True)
pr("hammad", "Whenever I need guidance about my career, there is one person I always turn to.", "Hammad Hassan Bajwa", "mentee", "linkedin", "2025-12-02", "mentoring", featured=True)
pr("mark", "Faris is awesome, and you should go attend ZurichJS Conf!", "Mark Erikson", "Redux maintainer", "x", "2025-12-10", "community", featured=True, author={"name": "Mark Erikson", "handle": "@acemarke", "headline": "Redux maintainer"})
pr("daniel", "His warm-up exercise is one of the best things I have seen for a workshop.", "Daniel Afonso", "Developer Advocate", "x", "2025-04-08", "workshop", label="On the warm-up", featured=True, author={"name": "Daniel Afonso", "handle": "@danieljcafonso", "headline": "Developer Advocate"})
docs.append({"_id": "socialPost-legacy-1", "_type": "socialPost", "url": "https://bsky.app/profile/x/post/1", "platform": "bluesky", "author": "Sam Legacy",
  "authorHandle": "@sam.bsky.social", "content": "Great session on resilient UIs at React Alicante, lots to take home.", "postDate": "2026-09-13", "context": "talk", "relatedTalk": ref("talk-resilient")})
docs.append({"_id": "testimonial-legacy-1", "_type": "testimonial", "type": "mentorcruise", "quote": "Faris helped me land my first senior role with a clear plan.",
  "author": "Priya Legacy", "role": "Senior Engineer", "company": "Acme", "date": "2025-10-01", "context": "mentored", "source": "https://mentorcruise.com/mentor/farisaziz/"})

# ── metrics ──
def m(i, value, label, domain, as_of, definition, **kw):
    d = {"_id": f"metric-{i}", "_type": "metric", "value": value, "label": label, "domain": domain, "asOf": as_of, "definition": definition, "status": "approved"}
    d.update(kw); docs.append(d)
m("members", "4,500", "members across our groups", "community", "2026-07-01", "Unique members across ZurichJS meetup groups.", order=1)
m("cfp", "436", "talk proposals, first Conf", "community", "2026-05-01", "CFP submissions received for ZurichJS Conf 2026.", order=2, period="2026")
m("speakers", "40+", "speakers hosted at meetups", "community", "2026-07-01", "Distinct speakers at ZurichJS meetups.", order=3, period="2024–26")
m("sponsors", "30+", "sponsors and partners", "community", "2026-07-01", "Organisations sponsoring or partnering since 2024.", order=4)
# Engineering sample figures (offline fixture only; real ones live in Sanity). company-0 = Smallpdf, company-2 = Navro.
SPDF = {"_type": "reference", "_ref": "company-0"}
NAVRO = {"_type": "reference", "_ref": "company-2"}
m("china", "~14×", "new subscriptions in China", "engineering", "2025-06-01", "Monthly new subscriptions after vs before localised checkout.", context="After localising checkout and payment methods for the market.", order=1, area="growth", company=SPDF, featured=True)
m("bundle", "−60%", "checkout bundle size", "engineering", "2025-03-01", "Gzipped JS on the checkout route, before vs after.", context="Payload shaping and code-splitting on the checkout path; the material behind the caching talk.", order=2, area="performance", company=SPDF, featured=True)
m("methods", "12", "local payment methods shipped", "engineering", "2025-09-01", "Payment methods live in checkout beyond cards and PayPal.", order=3, area="payments", company=SPDF, featured=True)
m("auth", "+9 pts", "card authorisation rate", "engineering", "2025-11-01", "Share of card attempts authorised, 30 days before vs after retry routing.", context="Smart retries and a second acquirer for soft declines.", order=4, area="payments", company=SPDF, featured=True)
m("lcp", "−1.2 s", "checkout LCP on 4G", "engineering", "2025-04-01", "p75 Largest Contentful Paint on the checkout route, real-user data.", order=5, area="performance", company=SPDF)
m("uptime", "99.98%", "checkout availability", "engineering", "2025-12-31", "Successful checkout page loads over a calendar year.", period="2025", order=6, area="reliability", company=SPDF)
m("incidents", "−70%", "payment incidents", "engineering", "2025-12-31", "Sev-2+ incidents on the payments path, 2025 vs 2024.", period="2025 vs 2024", order=7, area="reliability", company=SPDF)
m("paywall", "+18%", "trial starts from the paywall", "engineering", "2024-10-01", "Trial starts per paywall view, A/B test over four weeks.", order=8, area="product", company=SPDF)
m("ds", "40+", "shared UI components", "engineering", "2024-06-01", "Components in the design system used by more than one product team.", order=9, area="platform", company=SPDF)
m("ci", "−55%", "CI time per pull request", "engineering", "2024-02-01", "Median pipeline duration, month before vs month after caching and sharding.", order=10, area="platform", company=SPDF)
m("team", "0 → 8", "engineers hired and onboarded", "engineering", "2022-12-31", "Engineers who joined the team I led, from first hire.", period="2021–22", order=11, area="leadership", company=NAVRO)
m("payouts", "30+", "payout currencies at launch", "engineering", "2022-06-01", "Currencies supported for cross-border payroll payouts on day one.", order=12, area="payments", company=NAVRO)
m("pending", "3×", "unconfirmed number", "engineering", "2025-01-01", "Hidden until approved.", status="needs-ok")

docs.append({"_id": "community-zurichjs", "_type": "community", "name": "ZurichJS", "slug": slug("zurichjs"), "role": "Co-founder and chair", "founded": 2024,
  "city": "Zurich", "url": "https://zurichjs.com", "series": ref("series-zurichjs"), "headline": "I co-founded and lead ZurichJS.",
  "caseStudyHeadline": "Co-founded in 2024. A conference by 2026.",
  "summary": "I started it because Zurich didn't have the JavaScript community I wanted. I chair it, host most evenings, and wrote the platform that sells the tickets, runs the call for papers and onboards sponsors. In September 2026 the first ZurichJS Conf happened.",
  "metrics": [dict(ref(f"metric-{k}"), _key=k) for k in ["members", "cfp", "speakers", "sponsors"]],
  "recognition": [{"_key": "g", "_type": "award", "title": "Open Source Award: Global Community with the Highest Impact", "issuer": "Open Source Awards", "year": 2026, "confirmed": True}],
  "pillars": [
    {"_key": "h", "_type": "communityPillar", "kicker": "Host", "title": "Most ZurichJS evenings since 2024", "body": "I open most evenings, introduce the speakers and keep the Q&A moving."},
    {"_key": "t", "_type": "communityPillar", "kicker": "Teach", "title": "Workshops for the community", "body": "React architecture in production, delivered at ZurichJS and WhatTheStack."},
    {"_key": "b", "_type": "communityPillar", "kicker": "Build", "title": "The conference platform", "body": "Tickets, CFP and sponsor onboarding for ZurichJS Conf."}],
  "aftermovie": {"title": "ZurichJS Conf 2026", "caption": "436 talk proposals to choose from.", "published": False},
  "photos": [dict(P["community"], _key="c1"), dict(P["event"], _key="c2")]})

docs.append({"_id": "homePage", "_type": "homePage", "heroVariant": "band", "heroPhotos": [dict(P["stage"], _key="h1"), dict(P["workshop"], _key="h2"), dict(P["portrait"], _key="h3")],
  "featured": [dict(ref("talk-caching"), _key="f1"), dict(ref("ext-contejas"), _key="f2"), dict(ref("ext-podrocket"), _key="f3")],
  "praise": [dict(ref(f"praise-{k}"), _key=k) for k in ["tejas", "rajni", "darko", "ioannis", "hammad", "mark", "daniel"]],
  "featuredQuote": ref("praise-rajni"), "community": ref("community-zurichjs")})

# ── writing ──
def block(text, key): return {"_type": "block", "_key": key, "style": "normal", "markDefs": [], "children": [{"_type": "span", "_key": key + "s", "text": text, "marks": []}]}
lorem = "Production teaches you things no tutorial does. " * 60
docs.append({"_id": "post-zurichjs-name", "_type": "blogPost", "title": "Why it's called ZurichJS", "slug": slug("why-its-called-zurichjs"), "published": True,
  "publishedAt": "2026-03-09T09:00:00Z", "topic": "community", "excerpt": "The name started as something simple. Over time it came to represent something much bigger.",
  "coverImage": P["community"], "body": [block(lorem, "b1"), {"_type": "block", "_key": "h", "style": "h2", "markDefs": [], "children": [{"_type": "span", "_key": "hs", "text": "Where the name came from", "marks": []}]}, block(lorem, "b2")]})
docs.append({"_id": "post-npmx", "_type": "blogPost", "title": "Community, Open Source, and npmx", "slug": slug("community-open-source-npmx"), "published": True,
  "publishedAt": "2026-03-02T09:00:00Z", "category": "announcement", "excerpt": "A fast-moving open source train that welcomes you aboard the moment you show up.", "body": [block(lorem * 2, "b1")]})
docs.append({"_id": "post-2025-review", "_type": "blogPost", "title": "2025 in review: a year of exposure, compounding, and trusting my gut", "slug": slug("2025-in-review"),
  "published": True, "publishedAt": "2026-01-05T09:00:00Z", "topic": "careers", "excerpt": "The year in talks, community and work.", "body": [block(lorem * 7, "b1")],
  "corrections": [{"_key": "c1", "_type": "correction", "date": "2026-01-20", "note": "Corrected the member count to the dated figure (4,500 as of Jul 2026 had read 5,000)."}]})
def ext(i, title, fmt, source, date, topic, **kw):
    d = {"_id": f"ext-{i}", "_type": "externalPost", "title": title, "url": f"https://example.com/{i}", "format": fmt, "source": source, "publishedAt": date, "topic": topic}
    d.update(kw); docs.append(d)
ext("podrocket", "Caching, payloads, and other front-end dark arts", "podcast", "PodRocket", "2026-07-15", "engineering", durationMinutes=40, relatedTalk=ref("talk-caching"),
    excerpt="The conversation behind the React Summit talk.")
ext("jscraft", "Faris Aziz: Staff Engineer at Smallpdf and ZurichJS organiser", "podcast", "JS-Craft", "2026-07-02", "careers")
ext("ai-craft", "AI Engineering: Are we trading craftsmanship for scale?", "video", "YouTube", "2026-06-10", "engineering")
ext("contejas", "How to get promoted, build resilience, and lead with empathy", "podcast", "ConTejas Code", "2026-01-20", "careers")
ext("ijs", "React 19.2 explained: updates, impact, and what to watch for", "article", "iJS", "2025-10-08", "engineering", episode="guest article")
docs.append({"_id": "ext-legacy-spotify", "_type": "externalPost", "title": "Developer communities: what’s the secret behind ZurichJS’ rise?", "url": "https://open.spotify.com/x",
  "type": "podcast", "source": "Spotify", "publishedAt": "2025-07-01"})  # legacy V2 shape: type, no format/topic

# ── career, services, about, media ──
# Labels derive from dates; "Before code" shows a manual override.
for i, (name, role, start, end, label, desc) in enumerate([
    ("Smallpdf", "Staff Software Engineer", "2023-01-01", None, None, "Monetization, checkout and frontend architecture for a product used by millions."),
    ("ZurichJS", "Co-founder and chair", "2024-03-01", None, None, "Meetups, then ZurichJS Conf 2026."),
    ("Navro", "Founding engineer and lead", "2021-06-01", "2022-12-31", None, None),
    ("FX Digital", "Junior Front-End Developer", "2019-06-01", "2021-05-31", None, None),
    ("Outside tech", "", None, None, "Before code", "Coaching, before the switch into engineering.")]):
    d = {"_id": f"company-{i}", "_type": "company", "name": name, "role": role, "order": i + 1}
    if start: d["startDate"] = start
    if end: d["endDate"] = end
    if label: d["periodLabel"] = label
    if desc: d["description"] = desc
    docs.append(d)
docs[-2]["clients"] = [  # FX Digital: one role, three clients
    {"_key": "dplus", "_type": "careerClient", "name": "Discovery+", "url": "https://www.discoveryplus.com/", "note": "connected devices app"},
    {"_key": "euro", "_type": "careerClient", "name": "Eurosport", "url": "https://www.eurosport.com/", "note": "Connected TV apps for millions of viewers"},
    {"_key": "gcn", "_type": "careerClient", "name": "GCN", "url": "https://www.globalcyclingnetwork.com/"}]
docs.append({"_id": "company-private", "_type": "company", "name": "Unannounced", "role": "Secret", "isPublic": False, "order": 0})
for i, (t, typ, aud, reach, get, cta) in enumerate([
    ("Events: speaking and workshops", "events", "Conferences, meetups, podcasts, teams", "you’d like a talk, keynote, panel, podcast guest, or a hands-on workshop for your event or team.",
     "a session shaped around your audience. Talks come with slides the same day; workshops with a repo you keep.", ("Invite me", "/invite")),
    ("Advisory", "consulting", "Companies and founders · limited availability", "you want an outside view on frontend architecture, payments and monetization, engineering leadership, team structure, or go-to-market.",
     "a close look at where you are, and a clear, written view of what to change first.", ("Tell me what’s going on", "/contact#message")),
    ("Mentorship", "mentorship", "Individual engineers", "you’re working towards senior or lead, or want help with speaking and getting your work seen.",
     "regular 1:1 conversations focused on your next step.", ("How mentorship works", "/mentorship"))]):
    docs.append({"_id": f"offer-{i}", "_type": "serviceOffer", "title": t, "slug": slug(t.lower().split(':')[0].replace(' ', '-')), "serviceType": typ, "audience": aud,
                 "reachOutIf": reach, "youGet": get, "primaryCta": {"label": cta[0], "href": cta[1]}, "order": i + 1,
                 **({"secondaryCta": {"label": "See workshops", "href": "/workshops"}} if typ == "events" else {})})
docs.append({"_id": "offer-mentor-monthly", "_type": "serviceOffer", "title": "Monthly mentorship", "slug": slug("monthly-mentorship"), "serviceType": "mentorship",
  "shortDescription": "Two calls a month and async feedback in between.", "bestFor": "Engineers aiming for senior or lead", "outcomes": ["A written growth plan", "Feedback on real work", "Speaking prep"],
  "bookingUrl": "https://mentorcruise.com/mentor/farisaziz/", "bookingLabel": "Apply on MentorCruise", "order": 5})
docs.append({"_id": "page-about", "_type": "page", "identifier": "about", "heroImage": P["stage"], "content": [
  block("Today I work as a software engineer on frontend and payment systems at scale: the checkout that has to work in every currency, the data layer that has to stay fast on a bad connection, the architecture decisions that only look obvious afterwards. Earlier I helped found and lead engineering at Navro, and before that I shipped at Fiit and FX Digital.", "a1"),
  block("Speaking started as a way to explain that work to other engineers. It's now a second job I don't want to give up: talks and workshops across Europe, the US and Asia on production engineering, payments, and getting into leadership earlier than you feel ready for.", "a2"),
  block("In 2024 I co-founded ZurichJS because Zurich didn't have the JavaScript community I wanted. I lead it today. It grew faster than I expected and, in September 2026, ran its first conference.", "a3")]})
docs.append({"_id": "media-1", "_type": "media", "type": "photo", "title": "React Summit US", "image": P["stage"], "event": ref("event-react-summit-us-2025"), "credit": "GitNation", "date": "2025-11-18"})
docs.append({"_id": "media-2", "_type": "media", "type": "photo", "title": "ZurichJS evening", "image": P["community"], "credit": "ZurichJS", "date": "2025-11-05"})

out = os.path.join(os.path.dirname(__file__), "sanity-dataset.json")
json.dump(docs, open(out, "w"), ensure_ascii=False, indent=1)
print(f"wrote {len(docs)} documents → {out}")
