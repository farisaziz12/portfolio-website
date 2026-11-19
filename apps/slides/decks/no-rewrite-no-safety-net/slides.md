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

Navigating 13 Years Of React At Scale

::meta::
Faris Aziz · Senior Software Engineer @ Netlify

::visual::
<FarisBadge />

<!--
Hi, I'm Faris.
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
Senior Software Engineer at Netlify. Before that, Smallpdf, where I worked on checkout, payments and subscriptions. Everything in this talk comes from that codebase.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
The React We Hear About

::default::
# `<Activity>`

React 19.2

<!--
Activity, from React 19.2. Hide part of the tree, keep its state, pause its effects.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
The React We Hear About

::default::
# `useEffectEvent`

React 19.2

<!--
useEffectEvent. Read the latest props inside an effect without adding them to the dependency array.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
The React We Hear About

::default::
# React **Compiler**

Stable Since October 2025

<!--
And the React Compiler. Automatic memoization at build time. Worth learning, all of it.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# What If You’re On **React 16?**

<!--
But what if you can't use any of it? What if the codebase you ship every day is 13 years old and on React 16? redux-saga all over the place, and many paths into the same views.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

::kicker::
Smallpdf

::default::
# 13 Years

Tens Of Millions Of Users A Month

<!--
Smallpdf. 13 years of React in production, tens of millions of users a month. [Confirm the figure is OK to say publicly.]
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

::kicker::
Every Release

::default::
# ~50,000

Users Within 30 Minutes

<!--
Ship something, and about 50,000 people see it in the next half hour.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

::kicker::
The Team

::default::
# 5

Developers Across Three Squads

<!--
Five developers. Three squads. Three roadmaps.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
13 Years Of Requirements

::default::
# Accounts Migrated **More Than Once**

<!--
The way accounts work has changed more than once. The old assumptions are still in the code.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
13 Years Of Requirements

::default::
# Web Views Inside **Mobile Apps**

Shared With The Web

<!--
Some screens run inside the mobile apps as web views, and they're the same views as the web. Change one for the browser and you've changed it for app versions nobody has to update.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
13 Years Of Requirements

::default::
# Every Browser. **Safari’s Storage Limits.**

<!--
It has to work everywhere, including Safari, which limits local storage and can clear it. That matters for the next part.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
A/B Tests

::default::
# Closing A Test **Doesn’t End It**

New Users Stop. Existing Segments Stay.

<!--
We ran A/B tests in versions. When you close a test, new users stop entering it, but the people already in it often have to keep their variant. Old variants stay live long after the test is "done".
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
A/B Tests

::default::
# Assignment Lives In **localStorage**

<!--
And the assignment lives in local storage. So what happens when someone logs in on a new browser, or Safari clears their storage? The assignment is gone. They could see a different checkout, or a different price.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
A/B Tests

::default::
# Derive It **From The Account**

<!--
The fix is a heuristic. If a user already pays through a specific payment gateway, that flag on their account tells you which experience they were in. Rebuild the assignment from the account, and they see the same thing on every browser. None of this is documented. It's in the code.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No Safety Net

::default::
# No Unit, Integration Or **End-To-End Tests**

<!--
Now the safety net. No unit tests. No integration tests. No end-to-end tests.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No Safety Net

::default::
# Datadog: **2 Weeks** Of Data

Bug Started 3 Weeks Ago? It’s Gone.

<!--
Keeping data longer than two weeks cost too much, so retention is capped at two weeks. If a bug started three weeks ago and nobody caught it in time, the data that would explain it is gone.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No Safety Net

::default::
# Errors In **TrackJS**

Limited Filtering. Limited Querying.

<!--
No Sentry. Frontend errors go to TrackJS, which is hard to filter or query.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
No Safety Net

::default::
# Analytics: **Redshift + Metabase**

<!--
No off-the-shelf analytics either. Events go into our own Redshift database and we query them in Metabase. Every question is a SQL query someone has to write.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# The Documentation **Is The Code**

<!--
And no docs beyond the code. So how do you work safely in this?
-->

---
layout: content
---

::kicker::
My Area Of The Codebase

::title::
# Every Era Is **Still In Production**

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
Only my area: checkout, payments, subscriptions, the header. One checkout touches a hand-written reducer, a saga, a Context store and React Query at the same time.
-->

---
layout: content
---

::kicker::
Why Not Just Upgrade?

::title::
# Why We’re Still On **React 16**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Hydration</p><p>Scripts edit server HTML before React loads. React 16 tolerates it.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">React 18</p><p>Treats that mismatch as an error and re-renders on the client.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Packages</p><p>One npm setting hides which libraries already disagree.</p></div>
</div>

<!--
[click] Our anti-layout-shift system edits the server-rendered HTML before React hydrates. React 16 accepts a DOM it didn't render. [click] React 18 treats those differences as errors and re-renders, so the layout shift comes back. Reasoned from React 18's behaviour, not tested. [click] And legacy-peer-deps hides which libraries already disagree with us. A rewrite isn't an option either. Five developers can't run two products.
-->

---
layout: section
---

::kicker::
01

::default::
# Build The Mental Model

When Is It Safe To Delete Code?

::visual::
<FarisIllustration name="faris-thinking" decorative />

---
layout: content
---

::kicker::
Many Paths Into The Same Views

::title::
# Three Checkouts, **One Job**

::default::
<div class="nr-doors">
<div class="nr-doors__in">
<div class="nr-card" v-click="1"><h3>Mobile Web View</h3></div>
<div class="nr-card" v-click="2"><h3>Marketing Emails</h3></div>
<div class="nr-card" v-click="3"><h3>UTM Landing Pages</h3></div>
</div>
<p class="nr-doors__arrow">→</p>
<div class="nr-card nr-target"><h3>Subscribe</h3><p class="nr-detail">Three implementations in one codebase.</p></div>
</div>

<!--
[click] One checkout for the mobile web view. [click] One reached from marketing emails. [click] One behind landing pages with different UTM tags. Same job, three implementations, all live in the same codebase.
-->

---
layout: content
---

::kicker::
Reconstruct The Execution Path

::title::
# Follow **One Checkout**

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
[click] A user hits a usage limit. Log in first, A/B assignment, geo-IP picks the currency. [click] State in Redux, a Context store and React Query's cache. Data through the 2017 helper, the typed wrapper and React Query. [click] Hooks inside a class error boundary. Then payment SDKs, 3D Secure, analytics, and a saga handles the redirect. About six generations of React patterns in one purchase. Write the path down before you write a diff.
-->

---
layout: content
---

::kicker::
Before Deleting

::title::
# Check **Five Things**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Code</p><p>No importers, no routes, no dynamic lookups.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Traffic</p><p>Nothing in Redshift. Not just the last two weeks.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Errors</p><p>Nothing reaching TrackJS from that path.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Apps</p><p>No app version or web view still calling it.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Links</p><p>No email or campaign still pointing to it.</p></div>
</div>

<!--
[click] Nothing imports it, including dynamic lookups. [click] Datadog only has two weeks, so check Redshift. [click] Nothing in TrackJS. [click] Old app versions can call a web view for years. [click] Marketing emails stay in inboxes forever. All five clean? Delete it behind a flag first.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Not Urgent?

::default::
# Mark It Deprecated. **Add An Event.**

<!--
If it's not urgent, don't guess. Mark it deprecated in the code and fire a deprecation event when that path runs. Watch it for a few weeks. The trend tells you the risk of removing it.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Simpler Code

::default::
# Fewer Branches, **Fewer Events**

Events Aren’t Free At Millions Of Users

<!--
Lower cyclomatic complexity pays off here. Every branch is another path you'd need an event on to know whether it's used. And you can't put events everywhere: at millions of users, every event costs real money.
-->

---
layout: section
---

::kicker::
02

::default::
# Constrain The Context

Where Does AI Help?

::visual::
<FarisIllustration name="duck-curious" decorative />

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# Give The Agent A Task, **Not The Repo**

<!--
A 13-year-old codebase has several right answers to every question. Give an agent all of it and it picks one and sounds sure. How often a pattern appears says nothing about whether it's current. [Real example of an agent picking the old pattern, if you have one.]
-->

---
layout: content
---

::kicker::
The Context Pack

::title::
# Every Session Gets **Five Things**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Modules</p><p>Only the files on the path you mapped.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Interfaces</p><p>Props, store shapes, API contracts.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Assumptions</p><p>Written down, so they can be proven wrong.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Evidence</p><p>Event data, TrackJS errors, real payloads.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Non-goals</p><p>What must not change.</p></div>
</div>

<!--
[click] The files on the path you mapped. [click] The contracts at the edges. [click] Your assumptions, written as claims to break. [click] Real production evidence, personal data removed. [click] And what it must not touch, rename or tidy up.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Evidence For Agents

::default::
# An MCP Server **For Redshift**

Every Event Table, Queryable By Agents

<!--
One of the most useful things we built. An internal MCP server on our Redshift database, so an agent can query every event table. Evidence stops being a screenshot you paste in.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
Every Pull Request

::default::
# Which Events Does **This Touch?**

A CLAUDE.md Rule Checks The Numbers

<!--
Then a rule in AGENTS.md or CLAUDE.md: for a pull request, find the frontend events on the hot paths it touches, and pull their numbers. Every change comes with its real usage attached.
-->

---
layout: content
class: nr-prompt
---

::kicker::
In Practice

::title::
# Find **Every Door**

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
Example Prompt. Names Generalised.

<!--
It asks for a table, not a patch. And the assumption can be wrong: if the agent finds a fourth door, that's the best result of the day.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Agents Investigate. **Humans Ship.**

<!--
Agents do the reading: callers, comparisons, draft tests. They aren't on call. With no QA team, the person who decides it's safe to release is the safety net.
-->

---
layout: section
---

::kicker::
03

::default::
# Migrate While It’s Hot

What Breaks If I Change This?

::visual::
<FarisIllustration name="faris-thinking" decorative />

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

::kicker::
Story Time

::default::
# US **Sales Tax**

<!--
A real one. We needed to support US sales tax.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
US Sales Tax

::default::
# Price Math Lived **In The Frontend**

<!--
The backend sent plan amounts. The frontend did the rest: adding, multiplying, previewing what a subscription change would cost.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
US Sales Tax

::default::
# Tax Moved The Preview **To The Server**

<!--
You can't calculate sales tax like that in the browser. So the price preview for a subscription change had to come from the server. A new path for the most sensitive number in the product.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
US Sales Tax

::default::
# US And Australia **First**

Everyone Else Waited

<!--
We only turned it on where compliance required it: the US and Australia. The rest of the world stayed on the old path while we checked the funnel, ran A/B tests, and looked at conversion, free trials and friction.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

::kicker::
One Small Form Change

::default::
# -11%

Conversion From A Country Selector And Postal Code

<!--
Here's why. Adding a country selector and a postal code field reduced conversion by 11%. If a market makes 10 million dollars, that's about a million at risk from two form fields. You have to find a way to recover that before it goes everywhere. [What did you do to recover it? Add if you can share. The orchestrating-payments notes attribute an 11% drop to adding first and last name: make the two decks agree.]
-->

---
layout: content
---

::kicker::
Applied To The Three Checkouts

::title::
# Same Moves, **Bigger Surface**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Front door</p><p>Every entry point calls one facade. Strangler fig.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Run both</p><p>New checkout behind the same interface, compared in Redshift.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">One door</p><p>Ramp per entry point. Mobile web view last.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Delete</p><p>When a door is fully moved, remove the old path.</p></div>
</div>

<!--
We never merged the three checkouts. They all still lived in the codebase when I left. But the tax rollout is the pattern. [click] One front door: every entry point calls a single facade. Martin Fowler calls it the strangler fig. [click] Build the new checkout behind the same interface and compare it in Redshift. [click] Ramp one entry point at a time, the mobile web view last because old app versions stay out there. [click] Then delete. That's the step teams skip, and skipping it is how you end up with 13 years of layers.
-->

---
layout: content
---

::kicker::
Incremental AI

::title::
# Where AI Fits **At Each Step**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Map</p><p>Find every door, and the A/B logic behind each.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Characterize</p><p>Draft tests that pin today's behaviour.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Move callers</p><p>Small, reviewable PRs onto the facade.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Compare</p><p>Query old vs new through the Redshift MCP.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Delete</p><p>Watch the deprecation event reach zero.</p></div>
</div>

<!--
[click] Map every door. [click] Draft characterization tests. That's how a codebase with no tests gets some: one migration at a time. [click] Move callers in small PRs. [click] Compare old and new through the Redshift MCP. [click] Watch the deprecation events until it's safe to delete.
-->

---
layout: content
---

::kicker::
Take This Home

::title::
# Three **Habits**

::default::
<div class="nr-rows">
<div class="nr-row nr-take"><p class="nr-n">1</p><p>Map every path before you change anything.</p></div>
<div class="nr-row nr-take"><p class="nr-n">2</p><p>Give agents a task and real data, not the repo.</p></div>
<div class="nr-row nr-take"><p class="nr-n">3</p><p>One front door, both paths live, then delete.</p></div>
</div>

<!--
Map the paths first. Give agents narrow tasks and real event data. Migrate while it's live, one door at a time, and actually delete the old code.
-->

---
layout: cover
faris:
  coverVariant: speaker
---

# Thank **You**

faziz-dev.com · [gap: social handle]

::meta::
Slides: [gap: short link] · Questions in [gap: Q&A channel]

::visual::
<FarisIllustration name="duck-celebrating" decorative />

<!--
Thanks for having me. See you in the Q&A channel.
-->
