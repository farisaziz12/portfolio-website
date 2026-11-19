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
I'm a Senior Software Engineer at Netlify. Before that I was at Smallpdf, working on checkout, payments and subscriptions. Everything in this talk comes from that codebase.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# We Come To Conferences To Learn **The Newest React**

<!--
We come to events like this one to learn what's new in React. And there's a lot of it.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# `<Activity>`

Hide Part Of The UI And Keep Its State, With Its Effects Paused Until It Comes Back. New In React 19.2.

<!--
Activity lets you hide part of the tree and keep its state, with its effects paused.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# `useEffectEvent`

Read The Latest Props And State Inside An Effect Without Adding Them To The Dependency Array. Also React 19.2.

<!--
useEffectEvent finally gives us a clean way to read fresh props inside an effect without adding them to the dependency array.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# React **Compiler**

Automatic Memoization At Build Time, So You Stop Sprinkling useMemo And useCallback Everywhere. Stable Since October 2025.

<!--
And the React Compiler is stable. No more useMemo and useCallback everywhere.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Then On Monday, We Go Back To **The Codebase We Actually Have**

<!--
Then the conference ends, and on Monday most of us go back to a codebase where we can't use any of it.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# What If That Codebase Is 13 Years Old And Still On **React 16?**

<!--
What do you do when the app you ship every day is 13 years old and still on React 16? React 16.14, to be exact.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# That Was My Day Job At **Smallpdf**

13 Years Of React In Production, Used By Tens Of Millions Of People Every Single Month

<!--
That was my day job at Smallpdf. 13 years of React in production, used by tens of millions of people every month.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Whenever We Shipped, Around **50,000 People** Saw It Within Half An Hour

<!--
So any change, good or bad, reached about 50,000 people in the first 30 minutes.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# And There Were **Five Of Us**

Five Developers Spread Across Three Squads, Each With Their Own Roadmap And Priorities

<!--
And the frontend was five developers, spread across three squads, each with its own roadmap.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# We Had No Unit Tests, No Integration Tests And **No End-To-End Tests**

<!--
Now the safety net. There wasn't one. No unit tests, no integration tests, no end-to-end tests.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Our Logs **Disappeared After Two Weeks**

Keeping Them Longer In Datadog Cost Too Much, So A Bug That Started Three Weeks Ago Left No Evidence Behind

<!--
Datadog retention was capped at two weeks, because keeping data longer cost too much. So if a bug started three weeks ago and nobody caught it in time, the evidence was already gone.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Errors Went To **TrackJS**, Which Is Hard To Filter Or Query

<!--
We didn't use Sentry. Frontend errors went to TrackJS, which is useful, but very limited when you want to filter or ask questions.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# And Analytics Lived In **Our Own Redshift Database**

Every Question About How People Used The Product Meant Someone Writing SQL In Metabase

<!--
No off-the-shelf analytics either. Events went into our own Redshift database and we queried them through Metabase. Every question meant someone writing SQL.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# The Only Documentation Was **The Code Itself**

<!--
And beyond the code, there were no docs. Let me show you what that means in practice.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Let Me Tell You About **A YAML File**

<!--
Story time.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# I Got **One Indent** Wrong

<!--
I was editing a YAML config file and got the indentation wrong. One level.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Nothing Was **Validating** That File

<!--
Nothing validated that file. No schema, no test, no check in the pipeline. So it shipped.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Our Japanese And South Korean Sites Were **Down For 45 Minutes**

<!--
And our Japanese and South Korean websites were broken for 45 minutes. From one indent.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# So How Do You Change Anything **Safely** In A Codebase Like This?

<!--
That's the question for the rest of this talk. No rewrite, no safety net. How do you keep changing it without breaking the things that pay for it?
-->

---
layout: section
---

::kicker::
01

::default::
# Understand What You’re Touching

::visual::
<FarisIllustration name="faris-thinking" decorative />

---
layout: statement
class: nr-statement nr-no-annotation
---

# Some Data Comes Through **redux-saga**, Some Through **TanStack Query**

Older Features Fetch Through Sagas Into Redux, Newer Ones Use TanStack Query, And Plenty Sit Somewhere In Between

<!--
First, you have patterns fighting each other. Older features fetch through sagas into Redux. Newer ones use TanStack Query. And a lot of features sit somewhere in between.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# So You Maintain **Two Stores** While You Migrate

Redux For The Upgrade Dialog, A Context Store For The Payment Form, And TanStack Query For Everything Newer

<!--
So while you migrate, you maintain both. In checkout, the dialog state lives in Redux, the payment form has its own Context store, and payment methods and price previews live in TanStack Query's cache. One feature, three places where the truth might be.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Custom Pre-Hydration Tooling Was **Baked Into How We Rendered**

Our Server HTML Came From An Express-Based Setup, So Moving To React 18 Was Never Going To Be A Simple Version Bump

<!--
And why not just upgrade React? A lot of custom pre-hydration tooling was baked into the solution, with server HTML generated by an Express-based setup. Scripts adjust that HTML before React hydrates, to avoid layout shift, and React 16 tolerates a DOM it didn't render. React 18 treats those mismatches as errors and re-renders on the client. So React 18 was a non-trivial migration, not a version bump. On top of that, legacy-peer-deps hides which libraries already disagree with us.
-->

---
layout: content
---

::title::
# You May End Up With **Three Parts** Building The Same Experience

::default::
<div class="nr-doors">
<div class="nr-doors__in">
<div class="nr-card" v-click="1"><h3>Upgrade Dialog</h3><p class="nr-detail">~80 ways to open it</p></div>
<div class="nr-card" v-click="2"><h3>Native-App Checkout</h3><p class="nr-detail">Handoff from desktop, iOS, Android</p></div>
<div class="nr-card" v-click="3"><h3>Renewal</h3><p class="nr-detail">Three variants of its own</p></div>
</div>
<p class="nr-doors__arrow">→</p>
<div class="nr-card nr-target"><h3>Shared Payment Core</h3><p class="nr-detail">~150 files. Not every flow uses all of it.</p></div>
</div>

<!--
[click] The upgrade dialog: about 60 places open it, through about 80 different triggers. Marketing emails and landing pages land here too, with a coupon in the link. [click] A separate checkout page for when the desktop or mobile apps hand off to the web. [click] And renewal, with three variants of its own. They all lean on a shared payment core, and the oldest renewal variants still go around it.
-->

---
layout: content
---

::title::
# Follow One Checkout **From Start To Finish**

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
Reading one file tells you nothing here. You have to follow the path. [click] A user hits a usage limit. They log in, get an A/B assignment, and geo-IP picks their currency. [click] State lives in Redux, a Context store and TanStack Query. Data comes through an old 2017 helper, a typed fetch wrapper and TanStack Query. [click] Hooks render it, inside a class error boundary. Then one of five payment SDKs, 3D Secure, analytics, and a saga handles the redirect. Write that path down before you write a diff.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Then Let An Agent **Instrument That Path**

Place Analytics Events Along Each Step, Then Compare Them Against Redshift Through Our MCP Server

<!--
Reconstructing the path is only half of it. You can also have an agent place analytics events along that path, then use our MCP server to compare what those events show against the data in Redshift. Now you know which steps people actually take, not just which ones exist in the code.
-->
---
layout: statement
class: nr-statement nr-no-annotation
---

# And Then There Are **The A/B Tests**

Around 20 Experiments Defined In The Code, Many Of Them Sitting Right Inside The Checkout

<!--
And on top of all that, A/B tests. Around 20 experiments were defined in the code, and many of them were in checkout.
-->

---
layout: content
---

::title::
# One A/B Test Can Be In **Several States At Once**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Running</p><p>New users get a variant at random.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Closed</p><p>No new users join, but existing users keep their variant.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Versioned</p><p>A new version can’t reshuffle people from the old one.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Shipped</p><p>The winner becomes the default. The code stays.</p></div>
</div>

<!--
Ending a test isn't one switch. [click] While it runs, new users get a variant at random. [click] When you close it, new users stop joining, but the people already in it often have to keep what they saw. [click] Tests had versions, and a new version had to remember everyone from the earlier ones. [click] And when a variant won, it became the default, but the code was often still there. A couple of tests had shipped to 100% and were still referenced.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Assignments Were Stored **In The Browser**

So Logging In On A New Browser Could Show You A Different Checkout, Or Even A Different Price

<!--
Assignment happened in the browser, at random, and lived in local storage. Nothing on the account, nothing on the server. So a user who logged in on a new browser could see a different checkout, or a different price, from last time.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# So We Rebuilt The Variant **From The Account**

Account Flags, Like Which Payment Gateway Someone Already Uses, Told Us Which Experience They Had Seen

<!--
So for anything that had to stay consistent, we leaned on the account. If a user already paid through a particular payment gateway, that told us which experience they'd been in, and we could give them the same one on every browser. None of this was documented. It was in the code.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Changing Who Sees A Test **Meant Shipping Code**

There Was No Remote Switch, So Every Rollout Or Rollback Reached 50,000 People Within Half An Hour

<!--
There was no remote flag service. To roll a test out to more people, or switch it off, you changed the code and deployed. And a deploy reached 50,000 people in half an hour.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# And Safari Users **Never Saw A Test** At All

Safari Clears Storage After Seven Days, So Those Users Always Got The Default Experience

<!--
Safari clears writable storage after seven days without a visit. So Safari users, and anyone without local storage, always got the default and never entered an experiment. The code didn't say why. You find rules like this by reading it.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# Is This Code Dead, Or Is Someone **Still Using It?**

<!--
With all of that in place, the most common question was the simplest one. Can I delete this?
-->

---
layout: content
---

::title::
# Five Things I Check **Before Deleting Anything**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Code</p><p>Nothing imports it, routes to it or looks it up by name.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Traffic</p><p>Nothing in Redshift, going back further than two weeks.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Errors</p><p>Nothing from that path is reaching TrackJS.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Apps</p><p>No version of the native apps still sends people there.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Links</p><p>No email or campaign still points to it.</p></div>
</div>

<!--
[click] Nothing imports it, including lookups by name. [click] No traffic in Redshift, and not just in the last two weeks, because that's all Datadog has. [click] No errors from that path. [click] Old versions of the apps stay installed for years. [click] And marketing emails sit in inboxes forever.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# When You’re Not Sure, **Mark It Deprecated And Watch**

<!--
If it's not urgent, don't guess. Mark it deprecated, and fire an event whenever that path still runs. Then watch it go down over time.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

# 857

Deprecated Tags In The Codebase, With One Event Telling Us Whether Those Paths Still Run

<!--
There were about 857 deprecated tags. Since 2021, one generic "deprecated functionality used" event, with a typed reason, tracked whether those paths still ran. When usage reaches zero, you delete.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

# ~75%

Of The Branches In Our Checkout Code Fire No Analytics Event And Log Nothing At All

<!--
A rough scan of the checkout code found about 316 conditional branches, and around three quarters had no analytics or log call. Many are just rendering. Some are errors and early returns that leave no trace at all.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# But At Millions Of Users, **Tracking Everything Isn’t Free**

<!--
And you can't fix that by putting events everywhere. At millions of users, every event costs real money. The better fix is fewer branches. Lower complexity means fewer paths you need to measure at all.
-->

---
layout: section
---

::kicker::
02

::default::
# Where Does **AI** Fit In?

::visual::
<FarisIllustration name="duck-curious" decorative />

---
layout: statement
class: nr-statement nr-no-annotation
---

# Give An Agent The Whole Repo And It Picks **One Pattern** And Sounds Sure

<!--
A 13-year-old codebase has several right answers to every question. Saga or TanStack Query? Old helper or new wrapper? Give an agent all of it, and it picks one and sounds certain. How often a pattern appears says nothing about whether it's current.
-->

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# So Give It **A Task**, Not The Repo

<!--
So we stopped asking open questions and started handing over narrow tasks.
-->

---
layout: content
---

::title::
# What Every Agent Session **Gets From Us**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Modules</p><p>Only the files on the path we mapped.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Interfaces</p><p>Props, store shapes and API contracts.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Assumptions</p><p>Written down, so they can be proven wrong.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Evidence</p><p>Event data, TrackJS errors, real payloads.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Non-goals</p><p>What it must not change.</p></div>
</div>

<!--
[click] The files on the path. [click] The contracts at the edges. [click] Our assumptions, written as claims it can break. [click] Real production evidence, with personal data removed. [click] And what it must not touch, rename or tidy up.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# We Built An MCP Server So Agents Could **Query Our Analytics**

<!--
One of the most useful things we built. An internal MCP server on our Redshift database, so an agent could look at every event table itself. Evidence stopped being a screenshot someone pasted in.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Every Pull Request Gets Checked For **Analytics Changes**

<!--
Our CLAUDE.md files are strict about analytics. Ask the human whether tracking is needed. Never delete a permanent event; deprecate it, with a link to the PR that removed the feature. Never repurpose a field. And a review agent flags any event change that the PR description doesn't mention. With the MCP server, you can then look at how much traffic those events actually carry.
-->

---
layout: content
class: nr-prompt
---

::title::
# Find **Every Door**

::default::

```md
Task:        Find every entry point that opens a checkout.
Scope:       upgrade triggers, app handoff, renewal, link params
Assumptions: every marketing link opens the upgrade dialog. Verify.
Evidence:    checkout-open events by source, last 90 days (Redshift MCP)
Non-goals:   no refactors, no renames, no new dependencies
Output:      table: entry point, checkout used, A/B logic, traffic share
```


<!--
This is the shape of prompt that works for us. It asks for a table, not a patch. And the assumption is there to be proven wrong. If the agent finds a way in we didn't know about, that's the best result of the day.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Agents Do The Reading. **People Decide What Ships.**

<!--
Agents are good at the reading: finding callers, comparing implementations, drafting tests. They aren't on call. With no QA team, the person who decides a change is safe to release is the safety net.
-->

---
layout: section
---

::kicker::
03

::default::
# Changing It While **It’s Live**

::visual::
<FarisIllustration name="faris-thinking" decorative />

---
layout: statement
class: nr-statement nr-no-annotation
faris:
  background: arc
---

# Time For Another Story: **US Sales Tax**

<!--
One more story. We needed to support US sales tax.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Our Prices Were Calculated **In The Browser**

<!--
The backend sent the plan amounts. The frontend did the rest: adding, multiplying, and previewing what a subscription change would cost.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Sales Tax Had To Be Calculated **On The Server**

<!--
You can't do sales tax like that in the browser. So the price preview had to come from the server. A new path for the most sensitive number in the product.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# So We Only Turned It On Where **The Law Required It**

The US And Australia Went First, While The Rest Of The World Stayed On The Old Path

<!--
We turned it on only where compliance required it: the US and Australia.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Everyone Else Waited While We **Watched The Funnel**

<!--
The rest of the world stayed on the old path while we ran A/B tests and watched conversion, free trials and friction.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

# -11%

That’s What Adding A Country Selector And A Postal Code Field Did To Conversion

<!--
Here's why we waited. Adding a country selector and a postal code field reduced conversion by 11%.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# In A $10M Market, That’s **A Million Dollars**

<!--
If a market makes 10 million dollars a year, that's about a million dollars from two form fields.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# So Plan How You’ll **Win It Back** Before It Goes Everywhere

<!--
We did win it back, through other initiatives that are a story of their own. The point is the order. Know what a change costs before it ships everywhere, and plan the work that keeps revenue stable.
-->

---
layout: content
---

::title::
# The Work Moved Between Two Teams, And **AI Kept The Context**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Handoffs</p><p>Context dumps of where things stood.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Paths</p><p>Flagging every path the change had touched.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Patterns</p><p>Reconciling how each team solved the same thing.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Migration</p><p>Moving data fetching over to TanStack Query.</p></div>
</div>

<!--
This is where AI earned its place. The work moved between two teams. [click] Context dumps of where things stood, so the next team didn't start from zero. [click] Flagging every path the change had touched. [click] Reconciling patterns where the two teams had solved the same thing differently. [click] And migrating the data fetching we touched over to TanStack Query.
-->

---
layout: content
---

::title::
# The Same Approach Works For **The Three Checkouts**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">One way in</p><p>The shared payment core is the start of one.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Run both</p><p>Two subscription APIs already run side by side.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Move one</p><p>The oldest renewal variants are still outside it.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Delete</p><p>Remove the old path once nobody uses it.</p></div>
</div>

<!--
We never finished merging the three checkouts. But the same approach applies. [click] Put one way in, in front of all of them. Martin Fowler calls this the strangler fig. [click] Run the old and new paths side by side and compare. [click] Move one entry point at a time. [click] And then delete.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Deleting Is The Step **Everyone Skips**

<!--
And deleting is the step everyone skips.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

# 4.7 Years

Between Moving 100% Of Users To A New Payment Platform And Deleting The Old Platform’s Fallbacks

<!--
One payment-platform migration reached 100% of users. The last fallbacks to the old platform were removed about 4.7 years later. That's how you end up with 13 years of layers.
-->

---
layout: content
---

::title::
# Where AI Helps **At Each Step**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Map</p><p>Find every way in, and the A/B logic behind each.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Pin down</p><p>Draft tests that capture what the code does today.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Move</p><p>Small, reviewable PRs, one caller at a time.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Compare</p><p>Query old against new through the MCP server.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Delete</p><p>Watch the deprecation event reach zero.</p></div>
</div>

<!--
AI doesn't do the migration for you. It does the slow parts of each step. [click] Finding every way in. [click] Drafting tests that pin down today's behaviour, which is how a codebase with no tests starts to get some: one migration at a time. [click] Moving callers in small PRs. [click] Comparing old and new with real event data. [click] And watching the deprecation events until it's safe to delete.
-->

---
layout: content
---

::title::
# If You Take **Three Things** Home

::default::
<div class="nr-rows">
<div class="nr-row nr-take"><p class="nr-n">1</p><p>Follow the path before you change anything.</p></div>
<div class="nr-row nr-take"><p class="nr-n">2</p><p>Give agents a narrow task and real data, not the whole repo.</p></div>
<div class="nr-row nr-take"><p class="nr-n">3</p><p>Ship where you must, measure, then move the rest. And delete.</p></div>
</div>

<!--
Follow the path before you touch it. Give agents a narrow task and real data. And change things while they're live: ship where you have to, measure what it costs, move the rest, and actually delete the old code.
-->

---
layout: content
class: nr-closing-slide
---

::title::
# **Thank You!**

::default::
<div class="nr-closing">
<div class="nr-contact">
<p class="nr-connect-cta">Connect With Me</p>
<a href="https://faziz-dev.com/connect" target="_blank" rel="noopener noreferrer"><img class="nr-qr" src="/media/connect-qr.png" alt="Scan to visit faziz-dev.com/connect" /></a>
<p>@farisaziz12</p>
</div>
<div class="nr-closing-badge"><FarisIllustration name="duck-celebrating" /></div>
</div>
<img class="nr-closing-photo" src="/media/speaker-montage.jpg" alt="Faris with the developer community" />

<!--
Thanks for having me.
-->
