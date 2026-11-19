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

Hide Part Of The UI Without Losing Its State. New In React 19.2.

<!--
Activity lets you hide part of the tree and keep its state, with its effects paused.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# `useEffectEvent`

Read The Latest Props Inside An Effect Without Adding Them As Dependencies. Also React 19.2.

<!--
useEffectEvent finally gives us a clean way to read fresh props inside an effect without adding them to the dependency array.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# React **Compiler**

Memoises Components At Build Time, So You Write Less useMemo And useCallback. Stable Since October 2025.

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

13 Years Of React In Production, Used By Tens Of Millions Of People A Month

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

Five Developers Across Three Squads, Each With Its Own Roadmap

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
layout: statement
class: nr-statement nr-no-annotation
---

# If You Replace Every Plank Of A Ship, One At A Time, **Is It Still The Same Ship?**

The Ship Of Theseus

<!--
There's an old thought experiment, the Ship of Theseus. If you replace every plank of a ship, one at a time, is it still the same ship? That's the goal. You should be able to rebuild your ship as many times as you want, and the people on board are none the wiser. They get the same availability the whole time. You never get to take it out of the water.
-->

---
layout: content
---

::title::
# Ships Also Have **Bulkheads**

::default::
<div class="nr-shipwrap">
<svg viewBox="0 0 1000 300" class="nr-ship" aria-label="A ship hull divided into five compartments"><path d="M0 232 Q25 222 50 232 T100 232 T150 232 T200 232 T250 232 T300 232 T350 232 T400 232 T450 232 T500 232 T550 232 T600 232 T650 232 T700 232 T750 232 T800 232 T850 232 T900 232 T950 232 T1000 232" fill="none" stroke="#68bce3" stroke-width="3" opacity="0.6"/><path d="M380 80 L380 40 L620 40 L620 80 M560 40 L560 12 L600 12 L600 40" fill="none" stroke="#f8f4eb" stroke-width="5" stroke-linejoin="round"/><path d="M40 80 L960 80 L900 262 L100 262 Z" fill="#191a1d" stroke="#f8f4eb" stroke-width="6" stroke-linejoin="round"/><path d="M220 80 L220 262 M400 80 L400 262 M580 80 L580 262 M760 80 L760 262" stroke="#f8f4eb" stroke-width="5"/></svg>
<div v-click="1"><svg viewBox="0 0 1000 300" class="nr-ship nr-ship__water" aria-label="Water fills only the localisation compartment"><rect x="583" y="150" width="174" height="109" fill="#68bce3" opacity="0.75"/><path d="M583 150 Q605 140 627 150 T670 150 T713 150 T757 150" fill="none" stroke="#f8f4eb" stroke-width="3"/></svg></div>
<div class="nr-ship__labels"><span>Checkout</span><span>Accounts</span><span>Pricing</span><span>Localisation</span><span>A/B Tests</span></div>
</div>
<p class="nr-ship__caption" v-click="2">If One Compartment Floods, The Others Stay Dry</p>

::caption::
The Bulkhead Pattern, From Release It! By Michael T. Nygard

<!--
Ships gave software another idea. A ship's hull is split into compartments by bulkheads, so one leak doesn't sink the whole ship. In software, the bulkhead pattern isolates parts of a system so a failure in one stays in one. [click] Remember the YAML file? One wrong indent, and localisation flooded for two markets. [click] The goal is that when one compartment floods, the rest of the ship stays up. Checkout keeps taking payments while you fix the leak.
-->
---
layout: section
---

::kicker::
01

::default::
# Understand What You’re Dealing With

And How To Build An Effective Mental Model

::visual::
<FarisIllustration name="faris-thinking" decorative />

---
layout: statement
class: nr-statement nr-no-annotation
---

# Everyone, **Draw A Mode Of Transport**

<!--
Whenever I run a workshop, I start with an exercise. I ask everyone to draw a mode of transport. That's it. Almost nobody asks me what I mean. Part of that is social: you don't usually question the instructor.
-->

---
layout: content
---

::title::
# I Usually Get A Shoe, A Rocket And A Bicycle, **All In The Same Default Blue**

::default::
<div class="nr-doodles">
<div v-click="1"><svg viewBox="0 0 200 120" class="nr-doodle" aria-label="A blue doodle of a shoe"><path d="M20 98 Q18 60 48 56 L78 56 Q98 34 118 50 L150 74 Q186 78 186 94 L186 100 L20 100 Z" fill="none" stroke="#1a73e8" stroke-width="6" stroke-linejoin="round"/><path d="M84 58 L96 72 M98 52 L110 66 M112 50 L122 62" stroke="#1a73e8" stroke-width="5" stroke-linecap="round"/><path d="M20 88 L186 88" stroke="#1a73e8" stroke-width="4"/></svg><p>A Shoe</p></div>
<div v-click="2"><svg viewBox="0 0 120 200" class="nr-doodle" aria-label="A blue doodle of a rocket"><path d="M60 10 Q96 52 90 140 L30 140 Q24 52 60 10 Z" fill="none" stroke="#1a73e8" stroke-width="6" stroke-linejoin="round"/><circle cx="60" cy="72" r="14" fill="none" stroke="#1a73e8" stroke-width="5"/><path d="M31 108 L10 160 L32 142 M89 108 L110 160 L88 142" fill="none" stroke="#1a73e8" stroke-width="6" stroke-linejoin="round"/><path d="M44 146 Q60 192 76 146" fill="none" stroke="#1a73e8" stroke-width="5" stroke-linecap="round"/></svg><p>A Rocket</p></div>
<div v-click="3"><svg viewBox="0 0 220 140" class="nr-doodle" aria-label="A blue doodle of a bicycle"><circle cx="50" cy="100" r="34" fill="none" stroke="#1a73e8" stroke-width="6"/><circle cx="170" cy="100" r="34" fill="none" stroke="#1a73e8" stroke-width="6"/><path d="M50 100 L95 46 L150 46 L170 100 M95 46 L112 100 L50 100 M112 100 L150 46 M84 34 L106 34 M95 46 L95 34 M150 46 L146 28 L162 28" fill="none" stroke="#1a73e8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg><p>A Bicycle</p></div>
</div>

<!--
[click] Someone draws a shoe. [click] Someone draws a rocket. [click] Someone draws a bicycle. And because everyone opens Google AutoDraw and nobody changes the colour, they're all the same default blue. Same instruction, completely different pictures.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Small Teams Can End Up **Drawing Different Pictures** Of The Same System

Five Developers And Three Squads, With Little Time To Agree On How Things Work

<!--
That's what working on a codebase like this can feel like. Small, nimble teams don't have much time to coordinate. You end up in a bit of a silo, and everyone has their own picture of how checkout works.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# And The Agent Working Next To You **Is Drawing One Too**

<!--
And now there's one more person drawing: the agent working alongside you. If you don't give it the same picture, it'll draw its own. Probably a rocket.
-->

---
layout: content
---

::title::
# So Keep Asking Questions **Until The Pictures Match**

::default::
<div class="nr-funnel">
<p v-click="1" style="--w:100%">What do you mean by a mode of transport?</p>
<p v-click="2" style="--w:86%">Does it have four wheels?</p>
<p v-click="3" style="--w:72%">Is it a car?</p>
<p v-click="4" style="--w:58%">Is it a Toyota Prius?</p>
<p v-click="5" style="--w:44%">Is it silver?</p>
<p v-click="6" style="--w:30%">Which year?</p>
</div>

<!--
So you learn to ask yourself the questions, out loud, with your team and with your agent. [click] What do you actually mean? [click] Four wheels? [click] A car? [click] Which car? [click] What colour? [click] Which model year? You keep going until the picture in everyone's head is the same.
-->

---
layout: content
---

::title::
# Now Everyone Draws **The Same Car**

::default::
<div class="nr-cars">
<div><svg viewBox="0 0 240 120" class="nr-car" aria-label="A silver car"><path d="M14 86 L14 66 Q18 56 44 52 L76 30 Q86 24 110 24 L150 24 Q166 26 182 46 L214 52 Q228 56 228 70 L228 86 Z" fill="#c9ccd1" stroke="#3a3d42" stroke-width="4" stroke-linejoin="round"/><path d="M84 50 L102 32 L126 32 L126 50 Z M136 50 L136 32 L156 32 L172 50 Z" fill="#8fa3b5" stroke="#3a3d42" stroke-width="3"/><circle cx="62" cy="88" r="18" fill="#2b2d31" stroke="#3a3d42" stroke-width="3"/><circle cx="184" cy="88" r="18" fill="#2b2d31" stroke="#3a3d42" stroke-width="3"/><circle cx="62" cy="88" r="7" fill="#c9ccd1"/><circle cx="184" cy="88" r="7" fill="#c9ccd1"/></svg><p>You</p></div>
<div v-click="1"><svg viewBox="0 0 240 120" class="nr-car" aria-label="A silver car"><path d="M14 86 L14 66 Q18 56 44 52 L76 30 Q86 24 110 24 L150 24 Q166 26 182 46 L214 52 Q228 56 228 70 L228 86 Z" fill="#c9ccd1" stroke="#3a3d42" stroke-width="4" stroke-linejoin="round"/><path d="M84 50 L102 32 L126 32 L126 50 Z M136 50 L136 32 L156 32 L172 50 Z" fill="#8fa3b5" stroke="#3a3d42" stroke-width="3"/><circle cx="62" cy="88" r="18" fill="#2b2d31" stroke="#3a3d42" stroke-width="3"/><circle cx="184" cy="88" r="18" fill="#2b2d31" stroke="#3a3d42" stroke-width="3"/><circle cx="62" cy="88" r="7" fill="#c9ccd1"/><circle cx="184" cy="88" r="7" fill="#c9ccd1"/></svg><p>Your Team</p></div>
<div v-click="2"><svg viewBox="0 0 240 120" class="nr-car" aria-label="A silver car"><path d="M14 86 L14 66 Q18 56 44 52 L76 30 Q86 24 110 24 L150 24 Q166 26 182 46 L214 52 Q228 56 228 70 L228 86 Z" fill="#c9ccd1" stroke="#3a3d42" stroke-width="4" stroke-linejoin="round"/><path d="M84 50 L102 32 L126 32 L126 50 Z M136 50 L136 32 L156 32 L172 50 Z" fill="#8fa3b5" stroke="#3a3d42" stroke-width="3"/><circle cx="62" cy="88" r="18" fill="#2b2d31" stroke="#3a3d42" stroke-width="3"/><circle cx="184" cy="88" r="18" fill="#2b2d31" stroke="#3a3d42" stroke-width="3"/><circle cx="62" cy="88" r="7" fill="#c9ccd1"/><circle cx="184" cy="88" r="7" fill="#c9ccd1"/></svg><p>Your Agent</p></div>
</div>

<!--
And then everyone draws the same car. [click] Your team. [click] And your agent. That's the mental model we're after for the codebase. So let's draw the picture of our checkout.
-->
---
layout: statement
class: nr-statement nr-no-annotation
---

# Some Data Comes Through **redux-saga**, Some Through **TanStack Query**

Older Features Fetch Through Sagas Into Redux, Newer Ones Use TanStack Query, And Some Use Both

<!--
First, you have patterns fighting each other. Older features fetch through sagas into Redux. Newer ones use TanStack Query. And a lot of features sit somewhere in between.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# So You End Up Maintaining **More Than One Store** While You Migrate

Redux For The Upgrade Dialog, A Context Store For The Payment Form, And The TanStack Query Cache For Newer Data

<!--
So while you migrate, you maintain both. In checkout, the dialog state lives in Redux, the payment form has its own Context store, and payment methods and price previews live in TanStack Query's cache. One feature, three places where the truth might be.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# Custom Pre-Hydration Tooling Was **Baked Into How We Rendered**

Server HTML Came From An Express-Based Setup, So Moving To React 18 Meant Reworking How Every Page Hydrates

<!--
And why not just upgrade React? A lot of custom pre-hydration tooling was baked into the solution, with server HTML generated by an Express-based setup. Scripts adjust that HTML before React hydrates, to avoid layout shift, and React 16 tolerates a DOM it didn't render. React 18 treats those mismatches as errors and re-renders on the client. Take that with a grain of salt, though: it's based on how React 18 handles mismatches, and we never actually ran it. So React 18 was a non-trivial migration. On top of that, legacy-peer-deps hides which libraries already disagree with us.
-->

---
layout: statement
class: nr-quote nr-no-annotation
---

# “The single worst strategic mistake that any software company can make: They decided to rewrite the code from scratch.”

Joel Spolsky, Things You Should Never Do, Part I. Collected In Joel On Software (2004)

<!--
So why not just rewrite it? Joel Spolsky wrote about Netscape doing exactly that, and called it the single worst strategic mistake a software company can make. That's his opinion, and it's a strong one. But with five developers and a product that has to keep earning, a rewrite was never on the table for us.
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

# An Agent Can Add Analytics Events **Along That Path**

Then Compare What They Record Against Redshift Through Our MCP Server

<!--
Reconstructing the path is only half of it. You can also have an agent place analytics events along that path, then use our MCP server to compare what those events show against the data in Redshift. Now you know which steps people actually take.
-->
---
layout: statement
class: nr-statement nr-no-annotation
---

# And Then There Are **The A/B Tests**

Around 20 Experiments Defined In The Code, Many Of Them In Checkout

<!--
And on top of all that, A/B tests. Around 20 experiments were defined in the code, and many of them were in checkout.
-->

---
layout: content
---

::title::
# And Each Of Those Tests Was **In A Different State**

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Running</p><p>New users still get a variant at random.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Closed</p><p>No new users join, but the people already in it keep their variant.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Versioned</p><p>A new version can’t reshuffle the people from an earlier one.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Hardening</p><p>Code paths harden as we confirm whether the variant or the original rolls out fully.</p></div>
</div>

<!--
With around 20 tests in the code, each one was somewhere different in its life. [click] Some were still running, putting new users into a variant at random. [click] Some were closed: no new users joined, but the people already in them had to keep what they saw. [click] Some had versions, and a new version had to remember everyone from the earlier ones. [click] And some were being hardened: as we confirmed whether the variant or the original should roll out fully, that code path became the permanent one. A couple had shipped to 100% and were still referenced.
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

# Why On Earth Would You Do That **In Local Storage?**

Most Of Our Users Don’t Pay, And Every API Call We Make For Them Costs Money. Local Storage Has Drawbacks, But It Saved A Lot.

<!--
You might be asking why on earth we'd keep this in local storage. Because most of our users don't pay, and every API call we make on their behalf costs money. At tens of millions of users, storing and fetching an assignment on the server for every visitor adds up. Local storage has real drawbacks, as you're about to see, but the cost savings were significant.
-->
---
layout: statement
class: nr-statement nr-no-annotation
---

# So We Used Account Flags To Work Out **Who Had Been In A Test**

Heuristics, Like Which Payment Gateway Someone Already Pays Through, Tell You Whether They Were Segmented At Some Point

<!--
So for anything that had to stay consistent, we used heuristics and flags on the account to work out whether someone had been segmented at some point. If a user already paid through a particular payment gateway, they had been in that payment experience, so we could keep showing it to them on any browser. None of this was documented. It was in the code.
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
class: nr-quote nr-no-annotation
---

# “With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.”

Hyrum’s Law. From Software Engineering At Google (2020)

<!--
Hyrum's Law. With enough users, every observable behaviour of your system is something somebody depends on, whatever you promised. At tens of millions of users, that includes the old marketing link, the app version nobody updated, and the A/B variant someone got two years ago.
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
[click] Nothing imports it, including lookups by name. [click] No traffic in Redshift, going back further than the two weeks Datadog keeps. [click] No errors from that path. [click] Old versions of the apps stay installed for years. [click] And marketing emails sit in inboxes forever.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# When You’re Not Sure, **Mark It Deprecated And Watch**

<!--
If it's not urgent, mark it deprecated, and fire an event whenever that path still runs. Then watch it go down over time.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

# 857

Things Marked Deprecated, And One Event That Fires Whenever Any Of Them Is Still Used

<!--
There were about 857 deprecated tags. Since 2021, one generic "deprecated functionality used" event, with a typed reason, tracked whether those paths still ran. When usage reaches zero, you delete.
-->

---
layout: statement
class: nr-metric nr-no-annotation
---

# ~75%

Of Checkout Branches Have No Analytics Event Or Log

<!--
A rough scan of the checkout code found about 316 conditional branches, and around three quarters had no analytics or log call. Many are just rendering. Some are errors and early returns that leave no trace at all.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# And At Millions Of Users, **Every Event Costs Money**

<!--
Putting events everywhere would get expensive fast. At millions of users, every event costs real money. The better fix is fewer branches. Lower complexity means fewer paths you need to measure at all.
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
layout: code
class: nr-code-tight
---

::title::
# How We Scope **An Agent’s Prompt**

::default::

```md {1-2|4-6|8-9|11-12|14-15|all}
## Task
Find every path that shows a price preview.

## Context you can use
- checkout dialog, payment core, both stores
- Redshift MCP: price preview events, 90 days

## Assumptions to check
- previews only come from TanStack Query

## Do not
- refactor, rename or touch the 2017 helper

## Leave breadcrumbs
- NOTES.md: files read, paths found, questions
```

<!--
A 13-year-old codebase has several right answers to every question. Give an agent the whole repo and it picks one pattern and sounds sure. So the prompt does the scoping. [click] One task. [click] The only context it can use: the parts of the checkout on the path, the stores involved, and real event data through the MCP server. [click] Assumptions it has to check. [click] What it must not touch. [click] And breadcrumbs: write down what it read, what it found and what it couldn't answer, so the next session, or the next person, starts from there.
-->

---
layout: content
---

::title::
# What Goes Into A Session, **And What Comes Out**

::default::
<div class="nr-agent">
<div class="nr-agent__col">
<p class="nr-label">Context in</p>
<div class="nr-chip" v-click="1">Files on the mapped path</div>
<div class="nr-chip" v-click="1">Store shapes and API contracts</div>
<div class="nr-chip" v-click="1">Event data from the Redshift MCP</div>
<div class="nr-chip" v-click="1">Assumptions to check</div>
<div class="nr-chip" v-click="1">What it must not touch</div>
</div>
<p class="nr-doors__arrow" v-click="2">→</p>
<div class="nr-card nr-target nr-agent__core" v-click="2"><h3>Agent Session</h3><p class="nr-detail">Reads, follows the path, checks the numbers</p></div>
<p class="nr-doors__arrow" v-click="3">→</p>
<div class="nr-agent__col">
<p class="nr-label">Breadcrumbs out</p>
<div class="nr-chip" v-click="3">Files it read</div>
<div class="nr-chip" v-click="3">Paths it found</div>
<div class="nr-chip" v-click="3">Assumptions it proved wrong</div>
<div class="nr-chip" v-click="3">Events to add or check</div>
<div class="nr-chip" v-click="3">Open questions for a human</div>
</div>
</div>

<!--
[click] What goes in is small on purpose: the files on the path, the contracts, real event data, the assumptions and the no-go list. [click] The session reads, follows the path and checks the numbers. [click] And what comes out is a trail: which files it read, which paths it found, which assumptions turned out wrong, which events to add, and the questions only a person can answer. That trail is what made handing work between sessions, and later between teams, actually work.
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
This is the shape of prompt that works for us. It asks for a table of findings. And the assumption is there to be proven wrong. If the agent finds a way in we didn't know about, that's the best result of the day.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

# A Person Still **Decides What Ships**

Agents Find Callers, Compare Implementations And Draft Tests. Release Decisions Stay With Someone Who Knows The Traffic.

<!--
Agents are good at the reading: finding callers, comparing implementations, drafting tests. With no QA team, the person who decides a change is safe to release is the safety net.
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

# Another Story: **Adding US Sales Tax**

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

Drop In Conversion After Adding A Country Selector And A Postal Code Field

<!--
We waited because adding a country selector and a postal code field reduced conversion by 11%.
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

# Plan How To **Recover That Revenue** Before Rolling Out Further

<!--
We did win it back, through other initiatives that are a story of their own. The point is the order. Know what a change costs before it ships everywhere, and plan the work that keeps revenue stable.
-->

---
layout: content
---

::title::
# The Work Moved Between Two Teams, And **AI Helped With The Handover**

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

# Deleting The Old Code Rarely **Makes It Onto The Roadmap**

<!--
Deleting the old code once nothing uses it rarely makes it onto anyone's roadmap. And skipping it is how you end up with 13 years of layers.
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
AI helps with the slow parts of each step. [click] Finding every way in. [click] Drafting tests that pin down today's behaviour, which is how a codebase with no tests starts to get some: one migration at a time. [click] Moving callers in small PRs. [click] Comparing old and new with real event data. [click] And watching the deprecation events until it's safe to delete.
-->

---
layout: content
---

::title::
# If You Take **Three Things** Home

::default::
<div class="nr-rows">
<div class="nr-row nr-take"><p class="nr-n">1</p><p>Follow the path before you change anything.</p></div>
<div class="nr-row nr-take"><p class="nr-n">2</p><p>Give agents a narrow task and real production data.</p></div>
<div class="nr-row nr-take"><p class="nr-n">3</p><p>Roll out where you have to, measure the impact, then migrate the rest and delete the old code.</p></div>
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
