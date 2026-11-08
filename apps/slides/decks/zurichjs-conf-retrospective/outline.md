# ZurichJS Conf Retrospective: outline

Status: proposed outline, revision 3 (2026-11-08). Restructured on Faris's own flow
draft (pasted 2026-11-08) and his instruction to plan about 15 seconds per slide.
Revision 2 was approved; revision 3 changes the structure and length, so it needs
Faris's renewed approval through the slides menu. slides.md already follows
revision 3 at Faris's direct request.

## Revision 3 structure (76 slides, ~15 s each, ~19 min before trimming)

Opening hook (359 people, where they came from, a year in numbers), then an
agenda of eight chapters. Chapter 2 states three problems; chapters 3 to 5 answer
them; the lessons close the loop.

1. Why On Earth: the meetup itch [W1], Front Conference cancelling Front 26 (screenshots), "events were dying, so we
   started one", first commit.
2. A Hard Year: smaller sponsors, price-sensitive buyers, AI-heavy submissions;
   "three problems, each forced a decision".
3. The Machine: team and admin, Slack (4 people, 51,202 messages, 96% of all,
   3 silent days in 397, 836 on 3 Sep), brand [M1], timeline, platform and agents.
4. Building The Programme: CFP funnel, attendees wanted fundamentals, speakers'
   flights, workshops.
5. Filling The Room: price stages, sales curve, ways in, invoices, currencies,
   word of mouth, partners, countries, waves, VIP, company types.
   (PostHog traffic and conversion slides to be added here.)
6. The Rollercoaster: dated highs and lows, door rush, badges, personal [R1].
7. What We Learned: execution, distribution, pragmatism.
8. The Final Numbers: income, break even, 4.6/5, 88% return, thank you, 2028 [O5].

Story gaps for Faris: W1, W2, M1, R1, O5. PostHog traffic analysis pending.

---

Revision 2 (approved 2026-11-08) follows for history.

# ZurichJS Conf Retrospective: outline

Status: proposed outline, revision 2 (2026-11-08), with Faris's answers on the result and lessons. Awaiting Faris's approval.
Approval: none. An agent must not approve its own outline.

Stop here for the author's approval before expanding slides.md.
When approved, record the date, the exact outline revision and the user's
approval message. Material argument changes require renewed approval.

## Brief, as read

- Audience: anyone. Assume no conference-organising or Stripe/Supabase
  knowledge; technical terms get one plain sentence each.
- Length: 15 minutes, 15 slides (three short section dividers), under a minute spare.
- Outcome: the audience understands how ZurichJS Conf worked operationally,
  financially and technically.
- Format: no demos. Graphs, numbers and charts only.
- Source: the conf admin (conf.zurichjs.com/admin) and the zurichjs-conf repo.

## Argument

A community meetup ran a multi-day paid conference (9 to 12 September 2026)
with a tiny volunteer team because the team built its own operating system
for it: one Next.js app that sold tickets, ran the CFP, invoiced companies,
tracked money and checked people in at the door. The talk walks through the
three questions people ask: how did you run it, how did you pay for it, and
how did you build it.

Order: operations, then money, then tech. Money sits in the middle because
the tech section explains how the money numbers were even visible.

Each section ends on one of Faris's three lessons, and the close names all
three together: execution (operations), distribution (money: tickets only
sell if people hear about them and can buy the way they want), pragmatism
(tech: one app, boring stack, agents for the grind). The money result is
"just over break even", per Faris on 2026-11-08.

Label key: **F** fact (needs a source), **O** Faris's opinion, **X** example.

## Timed beat sheet

| # | Time | Point (one per slide) | Evidence | Layout | Clicks / media |
| --- | --- | --- | --- | --- | --- |
| 1 | 0:30 | ZurichJS Conf happened: dates, city, one headline number. | F: dates from repo (9 to 12 Sept 2026, main day 11 Sept). Headline number from admin: confirmed tickets **[GAP A1]**. | cover | none. `FarisBadge` visual. |
| 2 | 0:45 | Promise: three questions, operations, money, tech. | O: framing. | statement | 3 clicks, one per question. |
| 3 | 0:15 | Section: Operations. | none | section | none |
| 4 | 1:15 | The year at a glance: from first commit to the door. | F: repo first commit 2025-11-03, last 2026-09-01. Milestones (CFP open/close, ticket launch, sponsor deals, schedule live) **[GAP O1]**. | statement with authored SVG timeline | 1 click per milestone (about 5). Needs a timeline component **[GAP M1]**. |
| 5 | 1:15 | A tiny team carried it; the admin did the rest. | F: team size and roles **[GAP O2]**. Admin areas that replaced spreadsheets: tickets, workshops, CFP and reviewers, speaker travel, sponsorships, partnerships, B2B invoices, VIP perks, apparel, door check-in (repo `src/pages/admin`). | statement | 2 clicks: team, then the list of admin areas. |
| 6 | 1:00 | The CFP in numbers: from submissions to a programme. | F: submissions, reviewers, accepted talks, workshops **[GAP O3]**. | statement with funnel chart | 1 click to reveal the accepted share. Chart component **[GAP M1]**. |
| 7 | 1:00 | The door: how check-in held up on the day. Lesson 1: execution. | F: tickets checked in vs sold, peak minutes or no-show rate **[GAP O4]**. O: execution is the lesson. | statement, big number | 2 clicks: no-show rate, then the lesson. |
| 8 | 0:15 | Section: Money. | none | section | none |
| 9 | 1:30 | Where the money came from. | F: admin Financials "Revenue Breakdown": ticket sales, VIP upgrades, workshops, sponsorship, minus Stripe fees **[GAP F1]**. | statement with stacked bar or treemap | 1 click per stream (4) then fees. Chart **[GAP M1]**. |
| 10 | 1:15 | When people bought: the sales curve and pricing stages. | F: admin "Ticket Purchases Over Time" and "Revenue by Purchase Stage" **[GAP F2]**. O: what the curve taught us about deadlines. | statement with line chart | 1 click: annotate stage changes on the curve. Chart **[GAP M1]**. |
| 11 | 1:00 | Lesson 2, distribution: reach people where they buy, including companies by invoice and bank transfer. | F: admin "Ticket Revenue by Channel", individual vs B2B, Stripe vs bank transfer **[GAP F3]**. O: distribution is the lesson. | statement, two big numbers | 2 clicks: channel split, then the lesson. |
| 12 | 1:15 | It paid for itself, just. | F: "just over break even" (Faris, 2026-11-08). Optional: total costs or a cost split to show what the income had to cover **[GAP F4]**. | statement, big number | 1 click: the bottom line. |
| 13 | 0:15 | Section: Tech. | none | section | none |
| 14 | 1:30 | One app, built by three people and a lot of agents. Lesson 3: pragmatism. | F (repo, verified 2026-11-08): 1,239 commits, 218 merged PRs, 123 of them from agent branches (cursor/, claude/, codex/); 98 Supabase migrations; human authors Faris, Nadja, Bogdan; commits per month peak in May 2026 (191) and July (173). Stack: Next.js Pages Router, Supabase, Stripe, Resend, PostHog, Sentry. | statement with monthly commits bar chart | 3 clicks: chart, agent share of PRs, then the lesson. Chart **[GAP M1]**. |
| 15 | 1:00 | Close: execution, distribution, pragmatism. | O: Faris's three lessons (2026-11-08), each tied back to its section. | statement | 3 clicks, one lesson each. Thank-you and next date if announced **[GAP O5]**. |

Total: 14:15 of planned time over 15 slides (three are 15-second section
dividers), leaving 45 seconds of slack for a 15-minute slot.

## Facts, opinions and examples

- Facts from the repo (slides 1, 5, 14) are checked against the local
  zurichjs-conf clone at commit c017d062. Repo numbers count commits, not
  effort; "Claude" appears as a commit author 329 times, which the talk should
  describe as agent-authored commits, not as a team member.
- Facts from the admin (slides 1, 7, 9 to 11) are all gaps until the numbers
  are read from conf.zurichjs.com/admin and recorded in sources.md with the date
  checked. The admin mixes currencies; quote CHF unless the slide says
  otherwise.
- Opinions (slides 2, 7, 10, 11, 14, 15) are Faris's and should read as such on the slide.
- The break-even result is Faris's own statement, not an admin figure. Record
  it in sources.md as such; add a figure only if Faris wants one shown.
- No illustrative examples are planned. No demos, per the brief.

## Evidence gaps

Admin data, unread because the browser extension was not connected:

- **A1** Confirmed ticket count for the cover headline.
- **F1** Revenue Breakdown per stream and Stripe fees (CHF).
- **F2** Ticket Purchases Over Time series and Revenue by Purchase Stage.
- **F3** Ticket Revenue by Channel: individual vs B2B, Stripe vs bank transfer.
- **O4** Check-in totals from /admin/checkin (checked in vs sold).
- **O3** CFP totals from /admin/cfp: submissions, reviewers, accepted.

Not in the admin or repo:

- **F4** Optional: costs (venue, catering, AV, speaker travel, swag) if slide 12
  should show a number rather than the words "just over break even".
- **O1** Dated milestones for the timeline.
- **O2** Team size and who did what (organisers, volunteers).
- **O5** Whether a next edition is announced.

Media and components:

- **M1** No chart or timeline layout exists in the theme. Slides 4, 6, 9, 10
  and 14 need authored SVG or a small deck-local chart component built from the
  numbers above. Charts must render as real DOM/SVG, not admin screenshots.
  This is media work for after approval, not part of the outline.

No risky demos.

## Answered questions

- **Q1** Result: just over break even (Faris, 2026-11-08).
- **Q2** Lessons: execution, distribution, pragmatism (Faris, 2026-11-08).

No open questions change the argument. The remaining gaps are numbers.
