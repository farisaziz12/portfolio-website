# The brutal audit — faziz-dev.com vs the world-class bar

*July 2026 · benchmark set: kentcdodds.com, joshwcomeau.com, cassidoo.co,
wesbos.com, tejas.kim, emilkowal.ski, rauno.me*

The question this audit answers: does someone landing on this site say "wow,
I want this person" — and can they act on that impulse in under a minute?

Verdict: **the machine is world-class; the fuel is not loaded yet.** The code
side now beats most of the benchmark set on craft, conversion architecture,
and agent/SEO readiness. What separates it from "wow" today is almost entirely
content that only Faris can supply: photos, offers, a reel, and a publishing
cadence. Ship the content and this site is top-tier; don't, and it's a
beautiful empty theater.

## Where the site now beats the benchmark set

- **A signature nobody else has.** The working hero terminal (with `hire`,
  `sudo hire-me`, konami, a terminal 404) is the kind of detail people
  screenshot and share. Rauno/Emil have craft; nobody has this.
- **Conversion architecture.** Four doors → one inbox, context-aware CTAs on
  every page, cal.com opening in-page, slim forms with progressive disclosure,
  a sticky invite bar on talk pages, honest date-derived urgency. Kent and
  Cassidy make you hunt for the "hire me" path; here it's never more than one
  scroll away.
- **Agent-first layer.** llms.txt, markdown mirrors of every key page, a
  stable `#person` entity graph, AI-crawler allowlist. None of the benchmark
  sites do this properly yet; ChatGPT/Claude/Perplexity can quote this site
  verbatim with correct facts and working form links.
- **Honesty as a design principle.** Numbers pull from live data with one
  fallback source; urgency derives from the actual calendar; no fake scarcity.
  This reads as confidence and ages well.
- **Ops discipline.** CI guardrails on design tokens, resilient-by-default
  data layer, e-mail pipeline with fail-open behavior, documented CMS
  workflows, auto-deployed Studio. Most personal sites are one `mailto:` and
  a stale "2023 availability" string.

## What still gates "wow" — the punch list

Ranked by (impact on a first-time visitor) × (how fast it can be done).

1. **Load the photos.** The home hero mosaic, /gallery, and /invite headshots
   are the emotional core of a speaker site, and they're empty until Sanity
   has media. A face sells a keynote; a gray grid doesn't. → *Owner: upload
   ~8 strong hero shots (varied stages/crowds), 3–4 headshots, and a first
   gallery batch. One afternoon.*
2. **Enter the offers.** /consulting and /mentorship say "Coming soon" until
   the drafted packages in `SANITY_SERVICES_CONTENT.md` are entered in the
   Studio. Every "wow" that lands on an empty pricing page is a lost lead.
   → *Owner: ~1 hour in the Studio.*
3. **A 60–90s showreel.** Every top speaker site converts through one tight
   video above the fold on /speaking or /invite. The schema and layout
   support it (`speakerProfile`/featured talk video); the asset doesn't
   exist. → *Owner: cut one from existing recordings.*
4. **Publishing cadence.** Josh and Kent's gravity comes from the blog
   flywheel; the site's blog machinery (RSS, mirrors, OG cards) is ready but
   thin on posts. One strong production story per month changes the
   trajectory more than any further code. → *Owner habit, not a feature.*
5. **Prod verification pass.** cal.com modal, sticky bar, view-transition
   morphs, the Bluesky strip, and PostHog funnels were all verified locally
   but Sanity/network is blocked in the dev sandbox — walk the live site
   once after deploy, then build the four funnels in `docs/measurement.md`.
6. **Search-engine plumbing (15 min each):** Google Search Console + Bing
   verification, IndexNow key, a Wikidata entity pointing at the site.

## Code-side nits found in this pass (all fixed)

- 21 copy-pasted scroll-reveal scripts → one global initializer (also fixed
  /speaking and /services reveals not re-arming after client-side nav).
- /appreciation was the only page that could 500 on a Sanity hiccup.
- Two pages carried inline stat fallbacks that could drift from proof.ts.
- /about testimonials were initials-only cards while every other surface used
  the real social cards.
- Agency-slogan headlines ("Ship better software, faster.", "Accelerate your
  career.") replaced with lines in Faris's actual voice, OG cards synced.

## The bar, restated

When the punch list above is done, the site's story is: *you land, a real
terminal winks at you, a real face is on stage in front of a real crowd, the
numbers are live, the next step is one click, and the reply comes in two
days.* That's the "wow → funnel" loop the top-tier sites run — and this one
will run it with better plumbing.
