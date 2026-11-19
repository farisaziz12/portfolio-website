---
theme: faris
title: "No Rewrite, No Safety Net"
author: Faris Aziz
aspectRatio: 16/9
canvasWidth: 1280
fonts:
  provider: none
themeConfig:
  farisMode: dark
  farisBackground: none
transition: fade
drawings:
  enabled: false
layout: cover
faris:
  background: arc
---

# No Rewrite, No Safety Net

Navigating 13 years of React at scale

::meta::
Faris Aziz · Senior Software Engineer @ Netlify

::visual::
<FarisBadge />

<!--
Hi, I'm Faris. Today is about the React most of us actually work in: old, busy and full of history.
-->

---
layout: content
class: nr-bio-slide
---

::title::
# Who Am **I?**

::default::
<div class="nr-bio">
<div class="nr-bio__copy">

**Senior Software Engineer @ Netlify**<br>Co-Founder @ ZurichJS. Previously Smallpdf, Navro, Fiit, Discovery, GCN & Eurosport

<h2>Experience</h2>
<ul class="nr-bio__experience">
<li>Connected TV</li>
<li>Monetization & Growth</li>
<li>FinTech</li>
<li>Fitness Tech</li>
<li>Web Performance</li>
<li>Engineering Leadership</li>
</ul>

<h2>Community & Open Source</h2>
<ul class="nr-bio__community">
<li><strong>Raycast</strong>: Open Source</li>
<li><strong>Stripe</strong>: Community Builder</li>
</ul>

</div>
<img src="/media/speaker-montage.jpg" alt="Faris speaking and meeting with developer communities" />
</div>

<!--
I'm a Senior Software Engineer at Netlify. Before that I was at Smallpdf, and most of this talk comes from my time there, working on checkout, payments and subscriptions in a 13-year-old React app.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
The React we hear about

::default::
# `<Activity>`

Hide part of the UI and keep its state. React 19.2.

<!--
We spend a lot of time at conferences learning the newest React. Activity, from 19.2: hide a part of the tree, keep its state, pause its effects.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
The React we hear about

::default::
# `useEffectEvent`

Read the latest values without re-running the effect. Also React 19.2.

<!--
useEffectEvent: finally a clean way to read fresh props inside an effect without adding them to the dependency array.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
The React we hear about

::default::
# React Compiler 1.0

Automatic memoization at build time. Stable since October 2025.

<!--
And the React Compiler, stable since October 2025. Memoization you no longer write by hand. All great. All worth learning.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# But what if you're on **React 16?**

<!--
But what do you do when you can't use any of it? When the codebase you ship to every day is 13 years old and still on React 16. [Scan read 16.14; you said 16.8 in chat. Say the exact one.]
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# redux-saga, **all over the place.**

<!--
Sagas still handle things like redirects after payment and login. They work. They're also a generation of React state that most new hires have never seen.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Many paths into **the same views.**

<!--
And there's rarely one way into a screen. The same component is reached from different hot paths, each with its own assumptions. Keep that in mind: it comes back.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

::kicker::
Smallpdf

::default::
# 13 years

of React, used by tens of millions every month.

<!--
So here's the system. Smallpdf. 13 years of React in production, used by tens of millions of people every month. [Confirm the figure is OK to say publicly.]
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

::kicker::
Every release

::default::
# ~50,000 users

see it within 30 minutes.

<!--
When you ship, about 50,000 users see it in the next half hour. There is no quiet hour to test in production.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

::kicker::
The team

::default::
# 5 developers

across three squads.

<!--
And the team working on it is about five developers, spread across three squads, each with its own roadmap.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
13 years of requirements

::default::
# Accounts have been **migrated more than once.**

<!--
Thirteen years means thirteen years of changing requirements. The way accounts work has been migrated more than once, and old assumptions about accounts still live in the code.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
13 years of requirements

::default::
# Web views inside **mobile apps.**

Sharing views with the web.

<!--
Some of our screens run inside web views in the mobile apps, and those views are shared with the web. A change for the browser is also a change for an app version you can't force anyone to update.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
13 years of requirements

::default::
# Every browser, including **Safari's storage limits.**

<!--
And it has to work everywhere, including Safari, which limits and can clear local storage. Which matters a lot for the next problem.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
A/B tests

::default::
# Tests outlive **their enrolment.**

Closed to new users. Existing segments keep their variant.

<!--
We run A/B tests in versions. When a test closes, you stop enrolling new people, but you often have to keep the people already in it segmented. So old variants stay live long after the test "ended".
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
A/B tests

::default::
# Assignment lives in **localStorage.**

Log in on a new browser and it's gone.

<!--
And segmentation lives in local storage. So what happens when someone logs in on a new browser, or Safari clears storage? They lose their assignment, and could see a different checkout or price from last time.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
A/B tests

::default::
# Derive the variant **from the account.**

Account flags, like the payment gateway they use, rebuild the assignment.

<!--
The fix is a heuristic. If a user already pays through a specific gateway, that flag on their account tells you which payment experience they were in. You derive the A/B state from the account so they get the same experience on every browser. Nobody documents this kind of rule. It's just in the code.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No safety net

::default::
# No unit, integration or **end-to-end tests.**

<!--
Now the safety net. There isn't one. No unit tests, no integration tests, no end-to-end tests.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No safety net

::default::
# Datadog runs out **after two weeks.**

<!--
Observability is limited too. [Say exactly what this means: two weeks of retention, or the budget runs out mid-month.]
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No safety net

::default::
# Errors live in **TrackJS.**

With very limited filtering and querying.

<!--
No Sentry. Front-end errors go to TrackJS, which is useful but very limited when you want to filter or query.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No safety net

::default::
# Analytics: our own **Redshift + Metabase.**

<!--
And no off-the-shelf analytics. Events go into our own Redshift database and we query them through Metabase. Powerful, but every question is a SQL query someone has to write.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# The documentation **is the code.**

<!--
And there are no docs beyond the code itself. So how do you work safely in something like this?
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Three questions

::default::
<div class="nr-qs">
<v-clicks>

When is it safe to delete code?

What breaks if I change this?

Where does AI actually help?

</v-clicks>
</div>

<!--
One click per question. These are the three questions I want to answer in the next fifteen minutes.
-->

---
layout: content
---

::kicker::
In the code I owned

::title::
# Every era is still in production

::default::
<div class="nr-table nr-table--dense">

| Layer | Oldest | Middle | Newest |
|---|---|---|---|
| Components | A class error boundary | HOC hydration wrappers | Hooks |
| State | Hand-written reducers | redux-saga | Context + useReducer, Redux hooks, one RTK slice |
| Data fetching | A 2017 response helper | Saga select / put | Typed fetch wrapper, React Query v4 |
| Rendering | | styled-components | Pre-hydration scripts |

</div>

<!--
First, what's actually in there. This is only my area: checkout, payments, subscriptions, the header. One checkout touches a hand-written reducer, a saga, a Context store and React Query at the same time.
-->

---
layout: content
---

::kicker::
Why not just upgrade?

::title::
# Why we're still on React 16

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Hydration</p><p>Scripts edit server HTML before React loads. React 16 tolerates it.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">React 18</p><p>Treats that mismatch as an error and re-renders on the client.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Packages</p><p>One npm setting hides which libraries already disagree.</p></div>
</div>

<!--
Click per row. Why not just upgrade? Our anti-layout-shift system edits the server-rendered HTML before React hydrates, and React 16 accepts a DOM it didn't render. React 18 treats those differences as errors and re-renders, so the upgrade would bring the layout shift back. (Reasoned from React 18's behaviour, not tested.) And legacy-peer-deps has been quietly hiding which libraries already disagree with us. A rewrite isn't an option either: five developers can't run two products.
-->

---
layout: section
---

::kicker::
01

::default::
# Build the mental model

When is it safe to delete code?

::visual::
<FarisIllustration name="faris-thinking" decorative />

<!--
Part one.
-->

---
layout: content
---

::kicker::
Many paths into the same views

::title::
# One checkout, three doors

::default::
<div class="nr-doors">
<div class="nr-doors__in">
<div class="nr-card" v-click="1"><h3>Mobile web view</h3></div>
<div class="nr-card" v-click="2"><h3>Marketing emails</h3></div>
<div class="nr-card" v-click="3"><h3>UTM landing pages</h3></div>
</div>
<p class="nr-doors__arrow">→</p>
<div class="nr-card nr-target"><h3>Checkout</h3><p class="nr-detail">Three implementations, each with its own assumptions.</p></div>
</div>

<!--
One click per door. Remember "many paths into the same views"? At Smallpdf we had three checkouts. One for the mobile web view, one reached from marketing emails, and one behind landing pages with different UTM tags. Same job, three implementations.
-->

---
layout: content
---

::kicker::
Reconstruct the execution path

::title::
# Follow one checkout end to end

::default::
<div class="nr-steps">
<div v-click="1"><p class="nr-label">Entry</p><p class="nr-detail">A usage limit</p></div>
<span class="nr-arrow">→</span>
<div v-click="1"><p class="nr-label">Guards</p><p class="nr-detail">Login, A/B, geo pricing</p></div>
<span class="nr-arrow">→</span>
<div v-click="2"><p class="nr-label">State</p><p class="nr-detail">Three stores</p></div>
<span class="nr-arrow">→</span>
<div v-click="2"><p class="nr-label">Data</p><p class="nr-detail">Three fetchers</p></div>
<span class="nr-arrow">→</span>
<div v-click="3"><p class="nr-label">Render</p><p class="nr-detail">Hooks, one class component</p></div>
<span class="nr-arrow">→</span>
<div v-click="3"><p class="nr-label">Effects</p><p class="nr-detail">Payment SDKs, analytics</p></div>
</div>

<!--
Three clicks. Take one door and walk it. A user hits a usage limit. Guards: log in first, A/B assignment, geo-IP picks the currency. State lives in Redux, a Context store and React Query's cache. Data comes through the 2017 helper, the typed wrapper and React Query. Hooks render it inside a class error boundary. Then payment SDKs, 3D Secure, analytics events, and a saga handles the redirect.
About six generations of React patterns in one purchase. That's why you write the path down before you write a diff.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# When is it safe to **delete code?**

<!--
Which brings us to the first question. You suspect something is dead. With no tests and no docs, how do you know?
-->

---
layout: content
---

::kicker::
Evidence, not instinct

::title::
# Five things to check before deleting

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Code</p><p>No importers, no routes, no dynamic lookups.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Traffic</p><p>Nothing in Redshift for longer than Datadog keeps.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Errors</p><p>Nothing reaching TrackJS from that path.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Apps</p><p>No app version or web view still calling it.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Links</p><p>No email or campaign that still points to it.</p></div>
</div>

<!--
One click per row. Code: nothing imports it, but check dynamic lookups too. Traffic: look further back than two weeks of Datadog, so go to Redshift. Errors: nothing in TrackJS. Apps: an old app version can call a web view for years. Links: marketing emails live in inboxes forever. If all five are clean, delete it behind a flag first.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Not urgent?

::default::
# Mark it deprecated. **Add an event.**

Then watch its usage fall over time.

<!--
If removing something isn't urgent, don't guess. Mark it deprecated in the code and fire a deprecation analytics event when that path runs. Then watch it over weeks. The trend tells you the risk of removing it far better than any code search can.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Simpler code

::default::
# Fewer branches, **fewer events to watch.**

<!--
This is where reducing cyclomatic complexity pays off directly. Every branch in a flow is another path you'd need an analytics touch point on to know whether it's used. Fewer paths, fewer events, clearer answers.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Simpler code

::default::
# Events **aren't free.**

At millions of users, you can't instrument everything.

<!--
And you can't just throw events everywhere to compensate. At millions of users, every event has a real cost in volume and storage. So you choose the paths that matter, and you make the flows simpler so there are fewer of them.
-->

---
layout: section
---

::kicker::
02

::default::
# Constrain the context

Where does AI actually help?

::visual::
<FarisIllustration name="duck-curious" decorative />

<!--
Part two.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# Give the agent a task, **not the repo.**

A 13-year-old codebase has several right answers to every question.

<!--
With the whole codebase in context, an agent picks one of those answers and sounds sure. How often a pattern appears says nothing about whether it's current. [Real example of an agent picking the old pattern, if you have one.]
-->

---
layout: content
---

::kicker::
The context pack

::title::
# Five things every session gets

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Modules</p><p>Only the files on the path you mapped.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Interfaces</p><p>Props, store shapes, API contracts.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Assumptions</p><p>Stated so they can be challenged.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Evidence</p><p>Event data, TrackJS errors, real payloads.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Non-goals</p><p>What must not change.</p></div>
</div>

<!--
One click per row. The path you mapped, the contracts at the edges, your assumptions written as claims to break, real production evidence with personal data removed, and non-goals: what it must not touch, rename or improve.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Evidence for agents

::default::
# We built an MCP server **for Redshift.**

Agents can query every event table.

<!--
This was one of the most useful things we built. An internal MCP server that plugs into our Redshift database, so an agent can see every event table. Suddenly the evidence part of the context pack isn't a screenshot you paste in. The agent can go and ask.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Every pull request

::default::
# Which events does **this change touch?**

A CLAUDE.md rule finds the hot-path events in the diff and checks their volume.

<!--
Then we put it in the agent instructions. An AGENTS.md or CLAUDE.md rule: for a pull request, find the frontend events linked to the hot paths it touches, and pull their numbers. So every change comes with a quantitative read of its impact, not just a code review.
-->

---
layout: content
class: nr-prompt
---

::kicker::
In practice

::title::
# Map every door into checkout

::default::

```md
Task:        Find every entry point that opens a checkout.
Scope:       routes, email link handlers, UTM landing pages, web view bridge
Assumptions: there are exactly three checkouts. Verify or refute.
Evidence:    checkout-open events by source, last 90 days (Redshift MCP)
Non-goals:   no refactors, no renames, no new dependencies
Output:      table: entry point, checkout used, A/B logic, traffic share
```

::caption::
Example prompt. Names generalised.

<!--
Here's the kind of prompt that works. It asks for a table, not a patch. And the assumption is written so it can be wrong: if the agent finds a fourth door, that's the most valuable output of the day.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Agents investigate. **Humans decide what ships.**

<!--
Agents are good at the reading-heavy work: finding callers, comparing implementations, drafting tests. They aren't accountable for production. With no QA team, a person's judgment on release safety is the safety net.
-->

---
layout: section
---

::kicker::
03

::default::
# Migrate while it's hot

What breaks if I change this?

::visual::
<FarisIllustration name="faris-thinking" decorative />

<!--
Part three.
-->

---
layout: content
---

::kicker::
Blast radius

::title::
# Two axes decide how careful to be

::default::
<div class="nr-radius">
<span></span>
<p class="nr-label">Easy to roll back</p>
<p class="nr-label">Hard to undo</p>
<p class="nr-label">Few users</p>
<div class="nr-card"><h3>Ship behind a flag</h3></div>
<div class="nr-card"><h3>Pair review, dry run</h3></div>
<p class="nr-label">Most users</p>
<div class="nr-card"><h3>Staged rollout</h3></div>
<div class="nr-card nr-hot"><h3>Split it until it's reversible</h3></div>
</div>

<!--
How many users does it reach, and how hard is it to undo? With 50,000 people in 30 minutes, "most users" arrives fast. Anything touching payments, account data or A/B state goes bottom right: split it until every piece can be rolled back.
-->

---
layout: content
---

::kicker::
Infrastructure cost

::title::
# Small decisions, multiplied

::default::
<div class="nr-formula">
<p class="nr-term">1 extra request per session</p>
<p class="nr-op">×</p>
<p class="nr-term">~50,000 sessions per 30 min</p>
<p class="nr-op">=</p>
<p class="nr-term">~2.4M extra requests a day</p>
</div>

::caption::
Arithmetic from the release figure, assuming steady traffic and one session per user.

<!--
Frontend decisions have an infrastructure bill. One extra request per session, at 50,000 sessions every half hour, is about 2.4 million extra requests a day. Same for a few kilobytes on a hot route, or a cache key that varies per user. Put the number in the PR.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Strangler fig

::default::
# One front door **for all three.**

A facade every entry point calls. The old checkouts sit behind it, unchanged.

<!--
So how do you replace three live checkouts without a rewrite? First, one front door. Every entry point calls a single facade, and behind it the three old checkouts keep working exactly as before. That's Martin Fowler's strangler fig: grow the new thing around the old one.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Branch by abstraction

::default::
# Build the new path **behind the same door.**

Run it hot next to the old one and compare results.

<!--
Then build the new checkout behind that same interface. That's branch by abstraction. Run it hot, for real traffic, next to the old one, and compare what each produced: conversions, errors, A/B assignment. Redshift and Metabase become your test suite.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Ramp, then delete

::default::
# One door at a time. **Then delete.**

Lowest-risk door first. The mobile web view last.

<!--
Then ramp one door at a time behind a flag. Start with the door that's easiest to roll back. The mobile web view goes last, because old app versions stay in the wild. And when a door is fully on the new path, delete the old one and update the map. Deleting is the step teams skip, and skipping it is how you get 13 years of layers. [If Smallpdf actually consolidated the checkouts, say what happened.]
-->

---
layout: content
---

::kicker::
Incremental AI

::title::
# Where AI fits at each step

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Map</p><p>Find every door, and the A/B logic behind each.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Characterize</p><p>Draft tests that pin today's behaviour.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Move callers</p><p>Small, reviewable PRs onto the facade.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Compare</p><p>Query old vs new through the Redshift MCP.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Delete</p><p>Watch the deprecation event reach zero.</p></div>
</div>

<!--
One click per step. AI doesn't do the migration. It does the slow parts of each step. It maps doors. It drafts characterization tests, which is how you get tests in a codebase that has none: one migration at a time. It moves callers in small PRs. It queries Redshift through the MCP server to compare old and new. And it watches the deprecation events until it's safe to delete.
-->

---
layout: content
---

::kicker::
Take this home

::title::
# Three habits

::default::
<div class="nr-rows">
<div class="nr-row nr-take"><p class="nr-n">1</p><p>Map every door before you change the room.</p></div>
<div class="nr-row nr-take"><p class="nr-n">2</p><p>Give agents a scoped task, not the repo.</p></div>
<div class="nr-row nr-take"><p class="nr-n">3</p><p>Put a front door in, run new and old hot, then delete.</p></div>
</div>

<!--
Map every path before you change anything. Give agents narrow tasks with real evidence. And migrate while it's live: one front door, both paths running, one door at a time, then delete. You can keep using the latest React in your next project. This is how you keep shipping in the one you have.
-->

---
layout: cover
faris:
  coverVariant: speaker
---

# Thank you

faziz-dev.com · [gap: social handle]

::meta::
Slides: [gap: short link] · Questions in [gap: Q&A channel]

::visual::
<FarisIllustration name="duck-celebrating" decorative />

<!--
Thanks for having me. I'll be in the Q&A channel.
-->
