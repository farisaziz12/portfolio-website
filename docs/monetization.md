# Monetization strategy — turning the brand into a funnel

*July 2026. Companion to `docs/brutal-audit.md`. Benchmarks are directional
(public interviews/launch posts), not audited figures.*

The asset base: Staff-level payments + React credibility, 86+ talks in 20
countries, ZurichJS (425 new members in a year), MentorCruise presence, and —
as of this branch — a site with four conversion doors, measurement, and an
agent-first surface that AI assistants can quote.

The strategy in one line: **sell expertise three ways (time, productized
outcomes, products), let speaking and ZurichJS be the top of the funnel, and
let the site route every "wow" to the right-priced door.**

## The ladder (ranked: effort → return)

### 1. Raise the floor on what already exists (this quarter)

- **Speaking fees.** With 86 talks, stop doing free corporate slots. Policy:
  community meetups free; conferences = travel + fee; corporate/internal
  talks from CHF 2–4k; keynotes 2×. The /invite rider and availability
  calendar already frame this professionally — add a "budget" field prompt
  to invite conversations, not the form (keep friction low).
- **Consulting day-rate anchor.** Enter the drafted offers (architecture
  review, advisory retainer) from `SANITY_SERVICES_CONTENT.md`. Anchor high:
  a fixed-price **Architecture/Payments Review at CHF 6–9k** (2 weeks,
  written report + roadmap call) converts better than an hourly rate and is
  repeatable. Retainers (2 days/month) create the recurring base.
- **Mentorship pricing.** MentorCruise takes ~20% and caps perceived value.
  Keep it as lead-gen, but make the site's direct inquiry the premium path
  (e.g. CHF 250–400/mo for bi-weekly + async). The inquiry form already
  asks for budget.

### 2. Productize the workshop (next 1–2 quarters)

Corporate training is the highest-leverage use of speaker credibility:
- **Corporate workshop, fixed price.** "Payments frontends that don't drop
  money" / "Production React" as a 1-day on-site/remote package, CHF 6–12k
  per team. The /workshops page, instance system (token-gated attend pages,
  Resend audiences, follow-up automation) is already built for exactly this.
- **Public cohort once per quarter** via ZurichJS Pro: 20 seats × CHF 350–500.
  Sells the corporate version; the subscribe/audience infra handles the list.
- Wes Bos / Kent model check: recorded course revenue >> workshop revenue
  long-term, but cohorts first — they fund and script the recording.

### 3. The recorded product (12-month bet)

One course, one topic where competition is thin and credibility is maximal:
**payments/checkout engineering for frontend teams** (orchestration,
resilience, region-aware UX, the Alipay 3.5× story as the case study).
Josh Comeau's CSS course and Kent's Epic React demonstrated the ceiling
(7 figures over a course's life); a niche B2B topic won't hit that, but
CHF 50–150k first-year is realistic with the speaking flywheel, and it
compounds every talk into sales. Prereq: publishing cadence (audit item #4)
to build the list — the footer subscribe + Resend audiences are the start.

### 4. Audience monetization (opportunistic, don't chase)

- **ZurichJS sponsorship leverage:** the community is already sponsored;
  the personal move is packaging "talk + workshop + meetup appearance" for
  companies entering the Swiss market. High trust, zero new infra.
- **Newsletter sponsorship** (cassidoo model) only after ~3–5k subscribers;
  before that it costs more credibility than it earns.
- **GitHub sponsors / OSS:** signal, not income. Keep it a footer link.

## What the site already does for each rung

| Rung | Site surface (already live on this branch) |
|---|---|
| Speaking fees | /invite press kit, rider, availability + honest urgency, sticky invite bar, `invite_form_submitted` funnel |
| Consulting | /consulting offers (Sanity), cal.com modal, `discovery_call_opened` tracking, review-shaped ServiceOfferCards |
| Mentorship | /mentorship inquiry with budget field, MentorCruise as alt path, mentee social wall |
| Workshops | catalogue + instances + token attend pages + Resend audiences + follow-up route |
| Course (future) | blog + RSS + md mirrors + OG cards + subscribe audiences = the list-building machine |
| All | /contact four-door router; PostHog funnels in `docs/measurement.md` to see which rung actually pulls |

## Sequencing (what to do Monday)

1. Enter the Sanity offers; set the speaking-fee policy privately (audit #2).
2. Load photos + cut the reel (audit #1/#3) — they raise close-rates on
   every rung at once.
3. Announce the corporate workshop package in one LinkedIn post + the
   newsletter; measure `cta_click`/`discovery_call_opened` for 4 weeks.
4. Run the first ZurichJS Pro cohort; use it to script the recorded course.
5. Revisit this doc against PostHog data quarterly — kill rungs that don't
   pull, double the ones that do.
