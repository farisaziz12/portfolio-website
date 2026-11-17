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
Faris Aziz · Staff Software Engineer · [gap: Smallpdf / Netlify line]

::visual::
<FarisBadge />

<!--
Target 0:30.
Hi, I'm Faris. I've worked on Smallpdf's frontend for [gap: years], a React codebase that turns 13 this year.
This is not a migration success story with a clean before and after. It's about how a small team keeps changing a very old, very busy React app without breaking the things that pay for it.
-->

---
layout: code
---

::kicker::
A small change

::title::
# Where does this land?

::default::

```diff
- import { parseResponse } from 'api/legacy'
+ import { request } from 'api/fetch'
```

::annotation::
Simplified names. The plans fetch still runs on a deprecated 2017 helper.

<!--
Target 1:00.
This is a real change waiting in our checkout code, with simplified names. The plans fetch, the thing that decides which prices you see, still goes through an API helper from 2017. Its response functions are marked deprecated. Everything newer uses a typed fetch wrapper.
In a greenfield app, swapping one for the other is a five-minute change.
Here's the catch. The old helper turns responses into a fixed set of named errors: not found, unsubscribed, internal server error. The new wrapper has one generic network error. So the real question is not whether it compiles. It's who, somewhere in checkout, is quietly branching on "unsubscribed". [Verify before saying: does any caller actually branch on a named error?]
That question is the whole talk.
-->

---
layout: content
---

::kicker::
The system

::title::
# Smallpdf, 13 years in

::default::
<div class="nr-grid2">
<div class="nr-card nr-stat"><p class="nr-num">13 years</p><p class="nr-detail">of React in production</p></div>
<div class="nr-card nr-stat"><p class="nr-num">Tens of millions</p><p class="nr-detail">of monthly users</p></div>
<div class="nr-card nr-stat"><p class="nr-num">Tens of millions</p><p class="nr-detail">in annual revenue</p></div>
<div class="nr-card nr-stat"><p class="nr-num">5 developers</p><p class="nr-detail">across 3 squads</p></div>
</div>

<!--
Target 0:50.
Quick context. Smallpdf is a document tool many of you have probably used at least once.
The React app is 13 years old. Tens of millions of people use it every month, and it carries tens of millions in annual revenue.
The frontend is owned by five developers across three squads, each with their own roadmap.
[gap: confirm every figure can be said publicly]
-->

---
layout: statement
class: nr-statement
---

::kicker::
And the safety net?

::default::
<div class="nr-stack">
<v-clicks>

No dedicated QA.

No automated tests.

Limited observability.

</v-clicks>
</div>

::annotation::
Meanwhile, several generations of React, state, data fetching and tooling are all live at once.

<!--
Target 0:50. One click per line.
No dedicated QA. No automated test suite to lean on. And observability that tells us when something is badly broken, but not when something is quietly wrong.
I'm not saying this to complain. Plenty of successful products look like this. It just changes what being careful has to mean.
-->

---
layout: content
---

::kicker::
What's in there: the code I own

::title::
# Every era is still in production

::default::
<div class="nr-table nr-table--dense">

| Layer | Oldest | Middle | Newest |
|---|---|---|---|
| Components | A class error boundary | HOC hydration wrappers | Hooks, ~180 files |
| State | Hand-written reducers | redux-saga | Context + useReducer, Redux hooks, one RTK slice |
| Data fetching | 2017 response helper, one XHR upload | Saga select / put | Typed fetch wrapper, React Query v4 |
| Rendering | | styled-components, ~90 files | Pre-hydration scripts, ~17 files |

</div>

::caption::
One checkout touches a hand-written reducer, a saga, a Context store and React Query at once.

<!--
Target 1:00.
This is just the part of the codebase I've worked in since 2024: about 470 files, nearly all of them in the money path. Auth and the subscription dialog, checkout and payments, account pages, the plans and pricing service, the header, and our A/B experiment service.
Read it across. One class component left, the error boundary around payment. A dialog state machine written as a hand-rolled reducer, about 640 lines. A saga that still handles redirects after payment and login. A brand-new Context store for the payment form running next to Redux. And React Query for the newest calls.
My area has the widest state spread in the app. None of this is a moral failing. It's what 13 years of shipping looks like.
Counts are approximate, from a read-only scan of files I've touched (2026-11-17).
-->


---
layout: content
---

::kicker::
Why not just rewrite?

::title::
# Rewrite, upgrade or migrate

::default::
<div class="nr-table">

| Option | Touches | Revenue risk | Fits 5 devs? |
|---|---|---|---|
| Rewrite | Everything | High, for a long time | No |
| Big-bang upgrade | Every generation at once | High, all at once | No |
| Progressive migration | One path at a time | Bounded per change | Yes |

</div>

::caption::
The roadmap doesn't pause while you migrate.

<!--
Target 1:00.
Every legacy talk gets this question, so let's get it out of the way.
A rewrite means two products for a year or more, and we don't have the people for two.
A big-bang upgrade moves every generation at once, with no tests to tell us what broke.
Progressive migration is slower on paper, but the risk of each step is small enough to reason about. And the squads still have product goals the whole time.
Concrete example of why the upgrade isn't a version bump: we're on React 16.14. Our pre-hydration scripts change the server-rendered HTML before React hydrates, so the header shows the right plan with no layout shift. React 16 tolerates a DOM it didn't render. React 18's hydrateRoot treats those differences as errors and re-renders on the client, so the system built to prevent layout shift would bring it back. (Follows from how 18 handles mismatches; not run under 18.) And a package-manager setting, legacy peer deps, has been quietly hiding which libraries already disagree with us.
-->

---
layout: section
---

::kicker::
01

::default::
# Build the mental model

Before you change anything.

::visual::
<FarisIllustration name="faris-thinking" decorative />

<!--
Target 0:10. First part: how to understand the thing before touching it.
-->

---
layout: content
---

::kicker::
Read legacy as evidence

::title::
# Weird code is a hypothesis to test

::default::
<div class="nr-grid2">
<div class="nr-card"><h3>Deprecated paths</h3><p class="nr-detail">A helper marked deprecated in 2017, still behind the plans fetch.</p></div>
<div class="nr-card"><h3>Partial migrations</h3><p class="nr-detail">Payment-methods service v2 has ~54 importers. v1 still has one.</p></div>
<div class="nr-card"><h3>Undocumented assumptions</h3><p class="nr-detail">Scripts that edit server HTML, trusting React 16 to tolerate it.</p></div>
<div class="nr-card"><h3>Edge cases</h3><p class="nr-detail">Often a customer workflow someone once fixed for a reason.</p></div>
</div>

<!--
Target 1:10.
The instinct with old code is to judge it. Resist that.
Every card here is from our checkout code. A helper marked deprecated years ago still decides how plan prices load. A v1 service with exactly one importer left: is that one caller a mistake, or the only path some customers still take? Pre-hydration scripts that quietly assume React will accept a DOM it didn't render. Nobody wrote that assumption down. We found it by asking why the upgrade was scary.
[gap: one real story where "dead" code turned out to matter, and how we found out.]
So we treat every odd bit as a hypothesis: something protects something. Our job is to find out what before we delete it.
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
<div v-click="1"><p class="nr-label">Entry</p><p class="nr-detail">Usage limit or upgrade button</p></div>
<span class="nr-arrow">→</span>
<div v-click="1"><p class="nr-label">Guards</p><p class="nr-detail">Login, A/B test, geo pricing, plan rules</p></div>
<span class="nr-arrow">→</span>
<div v-click="2"><p class="nr-label">State</p><p class="nr-detail">Redux, a Context store, Query cache</p></div>
<span class="nr-arrow">→</span>
<div v-click="2"><p class="nr-label">Data</p><p class="nr-detail">2017 helper, typed fetch, React Query</p></div>
<span class="nr-arrow">→</span>
<div v-click="3"><p class="nr-label">Render</p><p class="nr-detail">Hooks, styled components, a class error boundary</p></div>
<span class="nr-arrow">→</span>
<div v-click="3"><p class="nr-label">Effects</p><p class="nr-detail">3 payment SDKs, 3DS, analytics, saga redirect</p></div>
</div>

::caption::
About six generations in one purchase. Write the path down before the diff.

<!--
Target 1:20. Three clicks, two steps each.
Reading one file tells you very little in a codebase like ours. What matters is the path. Here's one: a user hits a usage limit, opens checkout and subscribes.
Entry: the limit or an upgrade button dispatches an "open" action into the dialog's hand-written reducer. The header already showed their plan before React even loaded, thanks to pre-hydration scripts.
Guards: log in or sign up first, A/B experiment assignment, geo-IP picks the pricing country and currency, then plan availability and overrides.
State: three stores at once. Redux for the dialog and plans, a separate Context store for the payment form, and React Query's cache for payment methods and the price preview.
Data: plans through the 2017 helper, most calls through the typed wrapper, previews through React Query.
Render: hooks and styled-components, wrapped in a class-based error boundary.
Effects: three payment providers' SDKs, 3D Secure challenges, analytics events, and after payment a saga handles the redirect back.
About six generations, in one purchase. That written path is the first deliverable, before any diff, and it's what we hand to the AI later.
-->

---
layout: content
---

::kicker::
Before touching a line

::title::
# Four questions per change

::default::
<div class="nr-rows">
<div class="nr-row nr-q"><p class="nr-n">1</p><div><p>Who reaches this path, and how?</p><p class="nr-sub">Traffic, entry points, embeds, old URLs</p></div></div>
<div class="nr-row nr-q"><p class="nr-n">2</p><div><p>What does it read and write?</p><p class="nr-sub">Stores, local storage, cookies, query params</p></div></div>
<div class="nr-row nr-q"><p class="nr-n">3</p><div><p>How would it fail silently?</p><p class="nr-sub">No error, just a wrong result</p></div></div>
<div class="nr-row nr-q"><p class="nr-n">4</p><div><p>Who pays if it breaks?</p><p class="nr-sub">Users, revenue, support load</p></div></div>
</div>

<!--
Target 1:00.
These four are our minimum before any change that touches shared code.
The third one matters most for us. With limited observability, loud failures are the easy ones. The expensive ones are quiet: a price in the wrong format, a conversion event that stops firing, a file that downloads but is subtly wrong.
-->

---
layout: section
---

::kicker::
02

::default::
# Constrain the context

AI-assisted investigation you can actually trust.

::visual::
<FarisIllustration name="duck-curious" decorative />

<!--
Target 0:10. Second part: where AI agents fit, and where they don't.
-->

---
layout: statement
class: nr-statement nr-no-annotation
---

::kicker::
The rule

::default::
# Give the agent a task, **not the repo.**

A 13-year-old codebase holds several right answers to every question. With all of it in context, an agent picks one and sounds sure.

<!--
Target 0:50.
This was our biggest lesson. When we pointed agents at the whole codebase, they found patterns, but often the wrong era's pattern, and they presented it with total confidence.
[gap: a real case where the agent suggested the old pattern.]
How often a pattern appears in the repo says nothing about whether it's current. So we stopped asking open questions and started handing over scoped tasks.
-->

---
layout: content
---

::kicker::
The context pack

::title::
# Five things every agent session gets

::default::
<div class="nr-rows">
<div class="nr-row" v-click="1"><p class="nr-label">Modules</p><p>Only the files on the path you mapped.</p></div>
<div class="nr-row" v-click="2"><p class="nr-label">Interfaces</p><p>Props, store shapes, API contracts where modules meet.</p></div>
<div class="nr-row" v-click="3"><p class="nr-label">Assumptions</p><p>What you believe, stated so it can be challenged.</p></div>
<div class="nr-row" v-click="4"><p class="nr-label">Prod evidence</p><p>Logs, traces, analytics events, real payloads.</p></div>
<div class="nr-row" v-click="5"><p class="nr-label">Non-goals</p><p>What must not change: URLs, tracking, behaviour.</p></div>
</div>

<!--
Target 1:20. One click per row.
Modules: only the files on the path we mapped in part one.
Interfaces: the contracts where modules meet, so the agent doesn't have to guess them.
Assumptions: written as claims, so the agent can try to break them.
Production evidence: real logs and payloads, with personal data removed, because the code alone doesn't tell you what actually happens.
And non-goals, which matter most: what the agent must not touch, rename or "improve".
-->

---
layout: content
class: nr-prompt
---

::kicker::
In practice

::title::
# A scoped investigation prompt

::default::

```md
Task:        List callers of the legacy helper and the errors each handles.
Scope:       plans service, subscription dialog, checkout services
Interfaces:  legacy named errors, typed wrapper error (attached)
Assumptions: no caller branches on "unsubscribed". Verify or refute.
Evidence:    error-tracking samples for the plans fetch (PII removed)
Non-goals:   no refactors, no renames, no new dependencies
Output:      table: caller, errors handled, behaviour on new wrapper
```

::caption::
Example prompt for the slide 2 migration. Names generalised.

<!--
Target 1:10.
This is the prompt for the change from the start of the talk. Notice what it asks for: a table, not a patch. The agent compares two generations of the same helper and tells us which callers would behave differently.
The assumption is written so it can be proven wrong. If one caller does branch on "unsubscribed", that's exactly the path we map and protect first.
Then we ask for characterization tests that pin today's behaviour before anything moves.
[Optional: swap in the exact prompt you used, if you ran it.]
-->


---
layout: content
---

::kicker::
Who does what

::title::
# Agents investigate. Humans decide what ships.

::default::
<div class="nr-grid2">
<div class="nr-card">
<p class="nr-label">Agents</p>
<ul>
<li>Targeted code discovery</li>
<li>Comparing patterns across eras</li>
<li>Drafting characterization tests</li>
<li>Checking a diff against the map</li>
</ul>
</div>
<div class="nr-card" v-click>
<p class="nr-label">Humans</p>
<ul>
<li>Is this safe to release?</li>
<li>Rollout size and timing</li>
<li>What counts as a regression</li>
<li>The rollback call</li>
</ul>
</div>
</div>

<!--
Target 1:00. One click for the human column.
Agents are very good at the reading-heavy work: finding callers, comparing two implementations, drafting tests that capture current behaviour.
They are not accountable for production. Release safety stays with a person who knows the traffic, the revenue impact and the rollback plan. With no QA team, that judgment is the safety net.
-->

---
layout: section
---

::kicker::
03

::default::
# Size the risk

Blast radius, infrastructure cost, and migrating in steps.

::visual::
<FarisIllustration name="faris-thinking" decorative />

<!--
Target 0:10. Last part: deciding how careful to be, and how to move.
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
<div class="nr-card"><h3>Ship behind a flag</h3><p class="nr-detail">Merge, verify yourself, move on.</p></div>
<div class="nr-card"><h3>Pair review</h3><p class="nr-detail">Dry-run data, storage and URL changes.</p></div>
<p class="nr-label">Most users</p>
<div class="nr-card"><h3>Staged rollout</h3><p class="nr-detail">Ramp while watching metrics named up front.</p></div>
<div class="nr-card nr-hot"><h3>Split it</h3><p class="nr-detail">Highest risk. Break it down until each part is reversible.</p></div>
</div>

<!--
Target 1:10.
Without tests we can't make every change equally safe, so we decide how much ceremony each one deserves. Two questions: how many users does this reach, and how hard is it to undo?
Most changes land top left and should move fast. The bottom right is where we don't ship as-is. Anything touching payments, stored user data or public URLs gets split until every piece can be rolled back.
[gap: one change we split this way.]
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
<p class="nr-term">1 extra request per view</p>
<p class="nr-op">×</p>
<p class="nr-term">[gap] views per month</p>
<p class="nr-op">=</p>
<p class="nr-term">[gap] requests, every month</p>
</div>
<div class="nr-grid3">
<div class="nr-card"><h3>A fetch on mount</h3><p class="nr-detail">Paid again by every session that mounts it.</p></div>
<div class="nr-card"><h3>A heavier hot route</h3><p class="nr-detail">Paid in egress and in load time.</p></div>
<div class="nr-card"><h3>A per-user cache key</h3><p class="nr-detail">Hit rate drops, origin load rises.</p></div>
</div>

::caption::
Put the number in the PR description, before review.

<!--
Target 1:10.
[gap: a real, shareable traffic number. An order of magnitude is enough.]
Frontend engineers rarely see the infrastructure bill, but at our traffic a single extra request on a common page is not free. Same for a few extra kilobytes on a hot route, or a cache key that suddenly varies per user.
We now ask for the multiplication in the PR. It takes a minute and it changes the conversation in review.
-->

---
layout: content
---

::kicker::
Progressive migration

::title::
# One path at a time

::default::
<div class="nr-steps">
<div v-click="1"><p class="nr-label">01</p><h3>Characterize</h3><p class="nr-detail">Pin today's behaviour with tests or recorded outputs.</p></div>
<span class="nr-arrow">→</span>
<div v-click="2"><p class="nr-label">02</p><h3>Isolate</h3><p class="nr-detail">Put an adapter between callers and code.</p></div>
<span class="nr-arrow">→</span>
<div v-click="3"><p class="nr-label">03</p><h3>Flag</h3><p class="nr-detail">Old and new side by side.</p></div>
<span class="nr-arrow">→</span>
<div v-click="4"><p class="nr-label">04</p><h3>Ramp</h3><p class="nr-detail">[gap: stages] with evidence at each step.</p></div>
<span class="nr-arrow">→</span>
<div v-click="5"><p class="nr-label">05</p><h3>Delete</h3><p class="nr-detail">Remove the old path. Update the map.</p></div>
</div>

::caption::
Step five is the one teams skip. Skipping it is how you get 13 years of layers.

<!--
Target 1:20. One click per step.
Characterize: before changing anything, capture what it does today. This is where agents help most, drafting tests from the behaviour we observed.
Isolate it behind an adapter so callers don't care which version runs. Flag it. Ramp it with real evidence, not gut feel.
Then delete the old path and update the map. That last step is the one everybody skips, and it's exactly how a codebase ends up with every era still in production.
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
<div class="nr-row nr-take"><p class="nr-n">1</p><p>Map the execution path before you change it.</p></div>
<div class="nr-row nr-take"><p class="nr-n">2</p><p>Give agents a scoped task, not the repo.</p></div>
<div class="nr-row nr-take"><p class="nr-n">3</p><p>Size each change by reach, reversibility and cost. Then ship in steps.</p></div>
</div>

<!--
Target 1:00.
If you remember three things. One: understand the path before you touch it, and write it down.
Two: AI is a great investigator when you give it a narrow task and the right evidence, and a confident guesser when you don't.
Three: decide how careful to be per change, put a number on the cost, and move one path at a time.
None of this needs a rewrite or a QA team. It needs discipline.
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
Target 0:30.
Thanks for having me. Slides are at [gap: link]. I'll be in the Q&A channel after this, and I'd love to hear how other teams handle legacy React without a safety net.
-->
