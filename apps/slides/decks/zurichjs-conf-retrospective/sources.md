# ZurichJS Conf Retrospective: sources

For each factual claim or quotation, record the slide, primary source, relevant
section, date checked, and any limits on the claim. Opinions are labelled.
Visible slides carry no citations; provenance lives here.

## Verified

Repo: local clone `~/Desktop/zurichjs-conf` at commit `c017d062`, checked 2026-11-08.

| Slide | Claim | Source | Limits |
| --- | --- | --- | --- |
| 1, 4 | Conference 9 to 12 Sept 2026, main day 11 Sept | `src/config/pricing-stages.ts` (Last Minute ends 2026-09-11), `src/config/trip-cost.ts` (flight search 2026-09-09 to 2026-09-12), outline | Dates come from config, not a published schedule. City "Zurich" follows the ZRH flight search. |
| 4 | First commit 3 Nov 2025, last commit 1 Sep 2026 | `git log` | Last commit in the clone, not necessarily the last deploy. |
| 4, 10 | Pricing stages: Blind Bird 14 Nov 2025, Early Bird 1 Jan 2026, General Admission 22 Apr 2026, Late Bird 1 Aug 2026, Last Minute 28 Aug 2026 | `src/config/pricing-stages.ts` `PRICING_STAGES` | Configured start dates; "tickets on sale 14 Nov" assumes sales opened with the first stage. Blind Bird was stock-limited (30, standard and VIP). |
| 5 | Ten admin areas (tickets, workshops, CFP and reviewers, speaker travel, sponsorships, partnerships, company invoices, VIP perks, apparel, door check-in) | `src/pages/admin/*`, `src/components/admin/*` (b2b, cfp, cfp-travel, checkin, sponsorships, partnerships, tickets, workshops, vip-perks, apparel) | Shows the features exist, not how much each was used. |
| 14 | 1,239 commits; per month Nov 137, Dec 87, Jan 96, Feb 116, Mar 83, Apr 158, May 191, Jun 92, Jul 173, Aug 102, Sep 4 | `git rev-list --count HEAD`; `git log --format=%ad --date=format:%Y-%m` | Commits are not effort. Months are author dates. |
| 14 | 218 merged PRs, 119 from agent branches (109 `claude/`, 5 `cursor/`, 5 `codex/`) | `git log --merges` "Merge pull request" subjects | **Corrects outline's 123.** Counts only merge commits; squash-merged PRs would be missed. |
| 14 | Main human authors Faris, Nadja, Bogdan; small outside contributions (Colin S., Nicolò Ribaudo) | `git log --format=%an` | "Claude" appears as author on 329 commits; described as agent-authored, not a team member. |
| 14 (notes) | 98 Supabase migrations; stack Next.js Pages Router, Supabase, Stripe, Resend, PostHog, Sentry | `supabase/migrations` count; outline | Stack list not re-verified against package.json in this pass. |

## Repo history (origin/main)

Slide 14 now uses `origin/main` at `1e76dd7d` (2026-09-21), which matches the production
Sentry release ID, so conference week is included. Local HEAD `c017d062` stops on 1 Sep.
Full analysis: session scratchpad `repo-history.md` (subagent report); figures below were
re-checked by hand on 2026-11-08.

| Slide | Claim | Source | Limits |
| --- | --- | --- | --- |
| 14 | 1,336 commits; per month Nov 137 ... Aug 104, Sep 99 | `git log origin/main` | |
| 14 | 281 merged PRs, 164 from agent branches (145 claude/, 11 cursor/, 8 codex/); first PR merged 5 Nov 2025 | `gh pr list --state merged` | Supersedes the 218 / 119 merge-commit counts above. |
| 14 | Merged PRs per month Nov 8, Dec 12, Jan 7, Feb 15, Mar 20, Apr 32, May 50, Jun 22, Jul 37, Aug 40, Sep 38; agent share Jun 68%, Jul 89%, Aug 85%, Sep 71% | subagent, `gh` | Agent share not re-derived by hand per month. |
| 14 | 133 test files, 108 migrations | `git ls-tree origin/main` | |
| 14 (notes) | Faris's commits 99 in May to 9 in Aug; agent-authored commits peak 121 in Jul | subagent | Not re-checked by hand. "Moved to reviewing" is inference. |
| 4, 14 | Door check-in: 16 merged `[door-checkin n/17]` PRs, 2 on 24 Aug, 14 on 31 Aug | `gh pr list --search door-checkin` | **Corrects the subagent's "17 on 31 Aug".** Part 3 has no merged PR. |
| 14 (notes) | PR #178 (25 May 2026) removed an obfuscated malicious payload from postcss.config.mjs | `gh pr view 178` | Title verified; payload behaviour per PR, not re-analysed. |

## Faris's own statements (not admin figures)

| Slide | Statement | Date |
| --- | --- | --- |
| 12 | "Just over break even" | 2026-11-08 |
| 7, 11, 14, 15 | Lessons: execution, distribution, pragmatism (opinion) | 2026-11-08 |

## Admin data

Read 2026-11-08 ~16:45 UTC from conf.zurichjs.com/api/admin/* (financials, tickets,
cfp/analytics, cfp/reviewers, cfp/insights, sponsorships/deals, checkin/dashboard,
feedback), using an admin session Faris supplied. Raw responses contain attendee and
volunteer personal data; they stay in the session scratchpad and are not committed.
Only aggregates below are used.

Money is stored per currency in minor units. CHF figures convert EUR, GBP and USD at
the ECB rate for 2026-09-11 (1 CHF = 1.0581 EUR, 0.908 GBP, 1.2265 USD, via
api.frankfurter.dev, the source the app itself uses). They are approximate. Per Faris (2026-11-08), admin income may have small inconsistencies of up to ~5%, so slides round to ~CHF 1k per stream and ~CHF 170k in total.

| Slide | Claim | Admin source | Limits |
| --- | --- | --- | --- |
| 1 | 330 tickets (267 paid, 63 complimentary) | financials `summary.confirmedTickets`; tickets with `amount_paid > 0` | Excludes 2 cancelled, 3 refunded. |
| 4 | First ticket sold 13 Nov 2025 | financials `purchasesTimeSeries[0]` | Includes test or comp tickets, if any, on that day. |
| 4, 6 | CFP ran 29 Dec 2025 to 3 Apr 2026 | cfp/analytics `submissionTimeline` first and last dates | First and last submission, not official open/close. |
| 5 | 15 CFP reviewers (11 reviewers, 4 admins) | cfp/reviewers | |
| 5 | 14 door volunteers (6 scanners, 6 goodies, 2 door leads) | checkin/dashboard `volunteers` | Conference day only. |
| 6 | 434 submissions (347 talks, 47 lightning, 40 workshops); 121 in the final week (28%) | cfp/analytics | Weeks start Monday. |
| 6 | 267 speakers; 2,489 reviews; 9 accepted (6 talks, 3 workshops); 5 waitlisted | cfp/analytics, cfp/reviewers `total_reviews` | Invited speakers are not in the CFP data. |
| 6 (notes) | 171 of 428 analysed submissions mention AI | cfp/analytics `contentInsights` | Keyword-based. |
| 7 | 253 of 330 badges picked up (~77%) | checkin/dashboard `badgesPickedUp` | **Needs Faris's confirmation.** Door scans recorded only 156 (`arrived`); 222 T-shirts and 204 goodies were handed out. Badge pickups are used as the attendance proxy. |
| 7 | Busiest 10 minutes: 29 scans, 08:30 to 08:40 CEST | tickets `checked_in_conference_day_at`, bucketed | Only the 156 scanned arrivals. |
| 9 | Sponsorship ~CHF 80.8k (24 paid deals), tickets ~CHF 74.5k, workshops ~CHF 14.4k (80 seats), VIP upgrades ~CHF 1.2k; total ~CHF 171k; Stripe fees ~CHF 2.4k | financials `summary`, `sponsorshipSummary`, `workshopSummary`, `upgradeSummary` | FX-converted. Ticket total includes ~CHF 671 later refunded. Workshop revenue is after discounts (~CHF 2.1k). |
| 10 | Paid tickets per month Nov 3, Dec 16, Jan 10, Feb 22, Mar 35, Apr 21, May 11, Jun 34, Jul 50, Aug 39, Sep 26; 149 of 267 from 1 Jun | tickets `created_at`, `amount_paid > 0` | Purchase date in UTC. |
| 10 (notes) | Paid per stage: Blind 20, Early 81, GA 110, Late 37, Last Minute 19 | tickets `ticket_stage` | |
| 11 | 30 company tickets across 9 invoices, all by bank transfer; ~10% of ticket revenue; 9 individuals also paid by transfer | financials `revenueBreakdown`, `b2bSummary` | Revenue share computed on mixed-currency raw totals, so approximate. |
| 11 | 64 of 330 tickets in other currencies (55 EUR, 5 GBP, 4 USD) | tickets `currency` | |
| 12 | Income roughly CHF 170k (computed 170.9k, ±5%) vs "just over break even" | slide 9 total; Faris | Costs not in the admin. |

Not used yet: 919 session feedback responses, average 4.2 of 5 across 17 sessions (feedback `totals`).

## Attendee survey

File: `~/Downloads/ZurichJS Conf 2026 Feedback - Attendees_Submissions_2026-11-08.csv`,
112 responses submitted 16 Sep to 20 Oct 2026, read 2026-11-08. Contains emails, names and
social links; not copied into the repo. Aggregates only.

| Slide | Claim | Column | Limits |
| --- | --- | --- | --- |
| 11 | 38 of 112 heard about it from a friend or colleague (~1 in 3); meetup/newsletter 20, web search 17, social 16, speaker 9, employer/sponsor 4 | "How did you find out..." | 106 answered; self-selected respondents (~1 in 3 of 330 ticket holders). |
| 7 (notes) | Overall 4.6/5 (70 fives, 40 fours); organisation and logistics 3.73/4 best item; food and drinks 3.19/4 weakest | rating columns | Sub-ratings are on a 1 to 4 scale; "Didn't use" excluded. |
| 15 (notes) | 99 of 112 would come back ("Absolutely" 61, "I'll try" 38) | "Do you want to join us at the next edition?" | Intent, not purchases. |

Not used yet: value for money (98 of 112 Good, Excellent or Just right; 14 found it
expensive); to bring a team: more advanced content 37, team packages 35, group discount 33,
earlier dates and agenda 25, easy invoicing 7; most valuable: talks 95, community atmosphere 67,
meeting speakers 38. "Meeting other attendees" is 0 for every row, likely a form export bug;
don't use it. 12 respondents agreed to be quoted by name.

## Revision 3 additions (2026-11-08)

Extra admin endpoints read the same day: partnerships (all 80), partnerships/stats,
workshops, b2b-invoices, speaker-logistics, cfp/travel/flights, cfp/travel/speakers,
program-schedule, sponsorships/stats, vip-perks. Personal data stays in the scratchpad.

| Slide | Claim | Source | Limits |
| --- | --- | --- | --- |
| Opening | 359 people = 330 tickets + 19 of 21 on-stage people without a ticket + 10 of 13 door staff without a ticket | tickets; speaker-logistics; checkin/staff (matched by email in memory) | Organisers counted only if they hold a ticket or staff account. Faris estimated "almost 350". |
| Opening | Complimentary reasons: sponsor 40, speaker 10, other 5, unlabelled 2, contest 4, volunteer 1, partner 1 | tickets `metadata.complimentaryReason` | |
| Opening, Team | 51,202 Slack messages since 7 Oct 2025 (Faris 20,354 / 396 active days; Bogdan 19,954 / 382; Nadja 6,979 / 327; Colin 3,915 / 327) | Slack member analytics, supplied by Faris 2026-11-08 | Not independently checked. "4 organisers" inferred from this list; confirm. |
| Landscape | Supporter 12 of 24 paid deals; 2 Diamond deals not realised (1 cancelled, 1 draft); 15 of 24 paid Jul to Sep | sponsorships/deals | |
| Landscape | 96 tickets with a discount; 33 student/unemployed; 27 status verifications approved, 15 purchased | tickets, verifications `stats` | |
| Landscape | Survey topics wanted: JS/TS deep dives 75, case studies 71, performance 66, AI 48 | survey CSV | Multi-select. |
| Landscape | "Sponsor budgets shrank", "buyers were price-sensitive", "tech events were dying" | Faris's flow draft | Faris's framing; no external source. |
| Machine | 18 of 21 speakers flew in: USA 3, Germany 3, Canada 2, NL 2, Austria 2, UK 2, Spain 2, Czechia 1, Portugal 1 | cfp/travel/flights, first inbound flight's departure airport | Airport country, not home country (e.g. a Halifax speaker departed YYZ). |
| Machine | 21 countries; 169 of 250 known paid tickets Swiss; top abroad Germany 26, Austria 10, UK/Spain/USA 7 | tickets `session_metadata.country`, invoice billing country | Purchaser billing country; 62 tickets unknown. Country spellings normalised. |
| Machine | International share by stage: 6%, 22%, 44%, 38%, 26%; VIP 28 of 81 international vs 18 of 169 Swiss | tickets | "Locals trust the meetup, travellers wait for the lineup" is inference. |
| Machine | 41 partner-code tickets, 24 from abroad; top WarsawJS 5, ReactJS Barcelona 4 | partnerships/stats, tickets `partnership_id` | |
| Machine | Paid tickets by company type: product 94, agency 81, indie/student 27, enterprise 25, finance 21, other 16, education 3; agencies 60 of 81 Swiss; product 39 of 91 abroad; 169 companies, 22 sent 3+ (83 tickets) | tickets company field; classification script in session scratchpad (classify.py) | Agent's keyword classification of self-typed company names; rough. |
| Machine | Agent share by month 12, 50, 0, 53, 55, 47, 28, 68, 89, 85, 71% | `gh pr list`, head branch prefix | Re-derived by hand. |
| Machine | Faris non-merge commits 56 (May) to 1 (Aug); Claude-authored 119 (Jul) | `git log origin/main --no-merges --author` | **Corrects the subagent's 99 to 9 and 121.** |
| Machine | 266 API route files (1 at first commit); 133 test files; 108 migrations | `git ls-tree origin/main` | **Corrects the subagent's 30 to 267.** |
| Rollercoaster | 1,000-row cap fixed 31 Mar / 1 Apr; busiest commit week 27 Jul to 2 Aug (91) | git log | |
| Close | 6 workshops, 80 seats (17, 10, 9, 16, 22, 6) | workshops | |

## Slack workspace export

File: `~/Downloads/_Analytics Oct 7 2025 to Nov 7 2026 - Nov 8 2026.csv`, 397 daily rows,
read 2026-11-08. Aggregates only.

| Slide | Claim | Column | Limits |
| --- | --- | --- | --- |
| Opening, Machine | 53,277 member messages (public 474, private 46,893, DMs 5,910) | Messages posted by members; per-channel columns | "Messages posted" incl. other types is 59,429; apps 98. |
| Machine | 51,202 of 53,277 (96%) from the four organisers | per-member figures from Faris / member export | Different exports; small mismatch possible. |
| Machine | 3 days with no messages; ~15% of messages on weekends | Messages posted by date | Weekend share uses "Messages posted". |
| Machine | Busiest day 3 Sep 2026 (836); busiest month Aug 2026 (8,265) | Messages posted | |

## PostHog (website analytics)

Project 56167 (conf.zurichjs.com), read-only, queried 2026-11-08. Web tracking starts
1 Dec 2025. Full analysis by a subagent in the session scratchpad (posthog-insights.md);
the numbers below were re-run by hand.

| Slide | Claim | Query | Limits |
| --- | --- | --- | --- |
| Filling The Room | Visitors per month Dec 565 ... Aug 10,385, Sep 4,408 | uniq(person_id) on $pageview by month | Unique persons; the subagent's distinct counts differ by ~2%. |
| Filling The Room | 1,215 visitors from a ConvertKit email on 28 Jul (1,377 that day) | utm_source on $pageview | |
| Filling The Room | Ad-click visitors 8,901, 25 checkouts (0.28%); others 15,364, 131 (0.85%) | gclid present vs not; checkout_completed | Site checkouts only; PostHog sees ~239 of 267 paid tickets. |
| Filling The Room | Cart viewers 631, emails entered 162, checkouts 156 (~1 in 4) | cart_step_viewed, checkout_email_captured, checkout_completed | Per person, 1 Dec to 11 Sep. |
| Rollercoaster | 11 Sep: 5,067 pageviews, busiest day; 69% mobile; /schedule 3,729 views 9 to 12 Sep; 868 session ratings from 159 people | $pageview by day; subagent for mobile, /schedule and ratings | Mobile share, /schedule and ratings not re-run by hand. |
| Notes only | Google Ads made Italy the top visitor country; Reddit ads 919 visitors, 0 checkouts; the PR #244 "88% drop" was a missing event and conversion stayed ~flat | subagent | Not re-run by hand. |

## Industry context (Faris, 2026-11-08, NOT independently verified)

Used in chapter 2 ("Around Us") and the Why chapter. Each needs a source or must be
said as Faris's own observation before the talk is presented:

- React Advanced London: ticket sales down about 50%; rebranded to Web Engineering London.
- React Alicante: 200 fewer seats than the previous year.
- React India: last edition this year.
- CityJS: rebranded to CityAI.
- JSWorld: 2027 is the last edition.
- Devoxx Belgium: 2027 most likely the last.
- Front Conference (Zurich): two revival attempts (Q4 2025, Q1 2026) did not happen (Faris). The Front 26 cancellation itself is sourced below.
- Layoffs at Netflix, Google, Microsoft, Canva, Smallpdf and others; sponsor budgets cut.
  Smallpdf was a Gold sponsor of ZurichJS Conf.

## Open gaps (shown on canvas as orange `DataGap` boxes)

| Gap | Slide | Needed |
| --- | --- | --- |
| W1 | Why: the meetup itch | Faris's story |
| M1 | Machine: brand and design | Faris's story |
| R1 | Rollercoaster: personal highs and lows | Faris's story |
| O5 | Close: next edition date | Faris |

Also: attendance proxy (badges 253 vs scans 156) needs confirmation; opinion on the
sales curve; PostHog analysis (MCP not available in this session); movie (media gap).

## Front Conference screenshots

`public/media/front-cancel.png` and `public/media/front-book.png`: Playwright captures of
https://frontconference.com/ on 2026-11-08 (sticky header hidden, text unchanged). The page
announces the cancellation of Front 26 (27 Feb 2026, Alte Papierfabrik, Zurich) because ticket
demand was "way off, both via B2C and B2B channels", and lists https://conf.zurichjs.com first
under "BOOK YOUR TICKET IMMEDIATELY". Third-party page shown as a quoted public statement.

## Assets

- `FarisBadge` and `FarisIllustration name="duck-curious"`: approved theme assets, unchanged.
- `components/BarChart.vue`: authored SVG from the repo numbers above.
- `components/DataGap.vue`: draft placeholder; every instance must be removed before presenting.
