---
theme: faris
colorSchema: dark
title: "Caching, Payloads, and Other Dark Arts"
author: Faris Aziz
aspectRatio: 16/9
canvasWidth: 1280
fonts:
  provider: none
themeConfig:
  farisMode: dark
  farisBackground: none
transition: view-transition
drawings:
  enabled: false
layout: cover
class: caching-cover website-skin website-cover
faris:
  mode: dark
  background: arc
sourceSlide: 1
---
# Caching, Payloads, And Other Dark Arts

**Optimizing** UX In **Suboptimal** Conditions

::meta::
Faris Aziz · Staff Software Engineer @ Smallpdf

::visual::
<FarisIllustration name="faris-speaking" />

<!--
Amazon found that every 100 ms of added page load time cost them 1% in sales. For context, 1% of Amazon's 2006 revenue was around $107 million. Using 2024 net sales of $638 billion, it would be about $6.4 billion.
-->

---
layout: content
sourceSlide: 2
class: caching-bio-slide
faris:
  mode: dark
---

::title::
# Who Am **I?**

::default::
<div class="caching-bio">
<div class="caching-bio__copy">

**Staff Frontend Engineer @ Smallpdf**

<h2>Experience</h2>
<ul class="caching-bio__experience">
<li>Connected TV</li>
<li>Monetization & Growth</li>
<li>FinTech</li>
<li>Fitness Tech</li>
<li>Web Performance</li>
<li>Engineering Leadership</li>
</ul>

<h2>Community & Open Source</h2>
<ul class="caching-bio__community">
<li><strong>Raycast</strong>: Open Source</li>
<li><strong>ZurichJS</strong>: Co-Founder</li>
<li><strong>Stripe</strong>: Community Builder</li>
</ul>

</div>
<img src="/media/speaker-montage.jpg" alt="Faris speaking and meeting with developer communities" />
</div>

---
layout: statement
sourceSlide: 3
class: website-skin website-illustrated
faris:
  mode: dark
---

# **Setting The Stage**

<div class="website-character website-character--duck"><FarisIllustration name="duck-curious" decorative /></div>

<!--
Source page 3. 
-->

---
layout: none
sourceSlide: 4
class: slidev-layout faris-slide caching-photo
faris:
  mode: dark
---

<img src="/media/traffic.png" alt="Congested urban road filled with cars, buses and motorbikes" />

<!--
Potholes, unmaintained roads, floods.
-->

---
layout: statement
sourceSlide: 5
faris:
  mode: dark
---

# **620,000 Miles**

<!--
Built for heat, humidity, dust, bad roads and cheap fuel.
Survives infrequent oil changes and mixed driving habits.
Simple, over-engineered parts that tolerate poor servicing.
Millions of taxis and family cars running well past 300,000 km.
It prioritizes reliability over perfection.
-->

---
layout: statement
sourceSlide: 6
class: website-skin website-illustrated
faris:
  mode: dark
---

# **Localhost** Vs.<br>**The Real World**

<div class="website-character"><FarisIllustration name="faris-thinking" decorative /></div>

<!--
Source page 6. 
-->

---
layout: statement
sourceSlide: 7
faris:
  mode: dark
---

# **Localhost**

<!--
Source page 7. 
-->

---
layout: statement
sourceSlide: 8
faris:
  mode: dark
---

# **Stable** Network.<br>**Great** Bandwidth.

<!--
Source page 8. 
-->

---
layout: statement
sourceSlide: 9
faris:
  mode: dark
---

# **Single** User.<br>**Ideal** Environment.

<!--
Source page 9. 
-->

---
layout: statement
sourceSlide: 10
faris:
  mode: dark
---

# **The Real World**

<!--
Source page 10. 
-->

---
layout: statement
sourceSlide: 11
faris:
  mode: dark
---

# **High** Latency.<br>**Unreliable** Networks.

<!--
Source page 11. 
-->

---
layout: statement
sourceSlide: 12
faris:
  mode: dark
---

# **Mixed** Devices.<br>**Throttled** CPUs.

<!--
Source page 12. 
-->

---
layout: statement
sourceSlide: 13
faris:
  mode: dark
---

# **Partial** Caches.<br>**Stale** Data. **Flaky** APIs.

<!--
Source page 13. 
-->

---
layout: statement
sourceSlide: 14
faris:
  mode: dark
---

# The **Problem**

<!--
Source page 14. 
-->

---
layout: statement
sourceSlide: 15
faris:
  mode: dark
---

# What challenges do developers face in creating a seamless user experience due to **complex data fetching** and **management**?

<!--
Source page 15. Wording restored at Faris's request.
-->

---
layout: statement
class: caching-question
faris:
  mode: dark
sourceSlide: 16
---
# How Can We Build **Optimal** Solutions In **Suboptimal** Conditions?

---
layout: statement
sourceSlide: 17
faris:
  mode: dark
---

# Why **Bother**?

<!--
Source page 17. 
-->

---
layout: statement
sourceSlide: 18
faris:
  mode: dark
---

# **0–2** Seconds

The “Golden Window”

<!--
Pages that load within this golden window have the highest conversion rates.
-->

---
layout: statement
sourceSlide: 19
faris:
  mode: dark
---

# Response Times:<br>**Three** Important Limits

<!--
Source page 19. 
-->

---
layout: content
sourceSlide: 20
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# **0.1** Seconds

::default::
<ResponseTimeDemo example="instant" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
It Feels <strong>Instant</strong>

<!--
Around a tenth of a second, the response feels immediate. These are useful guidelines, not exact cutoffs for everyone.
[click] The pointer clicks the box. It responds after 100 ms. There is barely a gap between the action and the result.
-->

---
layout: content
sourceSlide: 21
class: caching-motion-slide
clicks: 2
faris:
  mode: dark
---

::title::
<h1 v-if="$clicks < 2"><strong>1</strong> Second</h1>
<h1 v-else>Greater Than <strong>1 Sec</strong></h1>

::default::
<ResponseTimeDemo example="flow" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<span v-if="$clicks < 2">Keep Your <strong>Train Of Thought</strong></span>
<span v-else>The Text Falls Behind. <strong>You Lose Your Place.</strong></span>

<!--
Think about typing when you already know what you want to say. One second is a general response-time guideline; typing needs much faster feedback.
[click] The text keeps up with your fingers. You can concentrate on the sentence.
[click] It starts smoothly, then the screen falls three seconds behind. You keep typing, wonder whether it worked, and repeat the last letter. The text catches up with extra letters. Now you stop and backspace to fix them. You were thinking about the sentence; now you are thinking about the input. This is a simulated example, not a measured reaction time. We can move on at any time.
-->

---
layout: content
sourceSlide: 22
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# **10** Seconds

::default::
<ResponseTimeDemo example="wait" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<strong>Search.</strong> Wait. <strong>Find Your Place Again.</strong>

<!--
At around ten seconds, keeping attention on the task gets difficult.
[click] Search for failed payments. The results take ten seconds to arrive, and the pointer drifts away. When they appear, pause, reread the query, then scan the results to find your place again. This is an example of the feeling, not a claim that everyone loses focus at the same instant. We can move on at any time.
-->

---
layout: statement
sourceSlide: 23
faris:
  mode: dark
---

# 32%

Increase In Bounce Probability As Page Load Goes From **1 To 3 Seconds**.

<!--
Source: https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/page-load-time-statistics/
-->

---
layout: statement
sourceSlide: 24
faris:
  mode: dark
---

# 123%

Increase In Bounce Probability As Page Load Goes From **1 To 10 Seconds**.

<!--
Source: https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/page-load-time-statistics/
-->

---
layout: statement
sourceSlide: 28
faris:
  mode: dark
---

# API Types

<!--
Source page 28. 
-->

---
layout: statement
sourceSlide: 29
faris:
  mode: dark
---

# **Public** APIs

For Example: The Star Wars API

<!--
Black box APIs. No control, subject to breaking changes, and hoping they follow SemVer.
-->

---
layout: statement
sourceSlide: 30
faris:
  mode: dark
---

# A **Black Box**

<!--
Source page 30. 
-->

---
layout: statement
sourceSlide: 31
faris:
  mode: dark
---

# **No Control**

<!--
Source page 31. 
-->

---
layout: statement
sourceSlide: 32
faris:
  mode: dark
---

# Subject To<br>**Breaking Changes**

<!--
Source page 32. 
-->

---
layout: statement
sourceSlide: 33
faris:
  mode: dark
---

# **Hoping** They Follow<br>**Semantic Versioning**

<!--
Source page 33. 
-->

---
layout: statement
sourceSlide: 34
faris:
  mode: dark
---

# **Internal** APIs

Designed For Internal Consumers

<!--
Can be freestyle, with limited adherence to REST design principles, maybe even lacking authentication.
-->

---
layout: statement
sourceSlide: 35
faris:
  mode: dark
---

# **Freestyle**

<!--
Source page 35. 
-->

---
layout: statement
sourceSlide: 36
faris:
  mode: dark
---

# **Limited Adherence**<br>To **REST** Principles

<!--
Source page 36. 
-->

---
layout: statement
sourceSlide: 37
faris:
  mode: dark
---

# Maybe Even **Lacking**<br>**Authentication**

<!--
Source page 37. 
-->

---
layout: statement
sourceSlide: 38
faris:
  mode: dark
---

# **Partner / Product** APIs

Sold As A Product. Designed For Third-Party Consumers.

<!--
You have to follow deprecation policies and SemVer. It needs to be designed for widespread compatibility over internal optimization.
Be careful how much pressure you are putting on that system.
-->

---
layout: statement
sourceSlide: 39
faris:
  mode: dark
---

# **Deprecation Policies**

<!--
Source page 39. 
-->

---
layout: statement
sourceSlide: 40
faris:
  mode: dark
---

# **Semantic Versioning**

<!--
Source page 40. 
-->

---
layout: statement
sourceSlide: 41
faris:
  mode: dark
---

# **Widespread** Compatibility<br>Over **Internal** Optimization

<!--
Source page 41. 
-->

---
layout: statement
sourceSlide: 42
faris:
  mode: dark
---

# Time To Put Our<br>Tech Lead Hat On

<!--
Source page 42. 
-->

---
layout: statement
sourceSlide: 43
faris:
  mode: dark
---

# We Got A **Jira** Ticket!

<!--
Source page 43. 
-->

---
layout: statement
sourceSlide: 44
faris:
  mode: dark
---

# The Scenario

Build A Dashboard Chart Showing The <strong>Birthday Distribution</strong> Of The Top <strong>5,000 Users</strong>.

<!--
Source page 44. 
-->

---
layout: statement
sourceSlide: 45
class: website-skin website-illustrated
faris:
  mode: dark
---

# The Data Source

An API Returns A <strong>List Of Users</strong> With <strong>All Their Data</strong>.

<div class="website-character"><FarisIllustration name="faris-thinking" decorative /></div>

<!--
Source page 45. 
-->

---
layout: content
sourceSlide: 47
class: caching-flow-slide
clicks: 11
---
::title::
# Client-Side Fetching

::default::
<ClientRequestFlow :step="$clicks" />

::caption::
<p v-if="$clicks === 0">First, We Start With A UI</p>
<p v-else-if="$clicks === 1"><strong>5,000 Records</strong> ÷ 1,000 Per Request = <strong>5 Parallel Requests</strong></p>
<p v-else-if="$clicks === 2">The Requests Are In Flight. The UI Is <strong>Loading</strong></p>
<p v-else-if="$clicks === 3">On Success, <strong>Map The Data</strong> Client Side</p>
<p v-else-if="$clicks === 4">Put The Mapped Data In <strong>React State</strong></p>
<p v-else-if="$clicks === 5">React <strong>Renders The UI</strong></p>
<p v-else-if="$clicks === 6">An Effect/State Bug Can <strong>Start All Five Requests Again</strong></p>
<p v-else-if="$clicks === 7">If A Request Fails, We Need <strong>Custom Retry Logic</strong></p>
<p v-else-if="$clicks === 8">One Option: Retry <strong>ALL Requests</strong></p>
<p v-else-if="$clicks === 9">Or Retry <strong>ONLY The Failed Requests</strong></p>
<p v-else-if="$clicks === 10">Retry The Requests And <strong>Keep Loading</strong></p>
<p v-else>Mapping, State And Retry Logic All Live In The Client</p>

<!--
First, we start with a UI.
[click] We need 5,000 records. This API returns at most 1,000 per request, so we make five requests in parallel. We cannot change the upstream API, but we can add our own BFF. QUANTITY = 5 means five upstream requests, not five users.
[click] While those requests are in flight, the UI enters a loading state.
[click] If they succeed, we map the data client side.
[click] We put that data in React state.
[click] React renders the UI.
[click] But if we get our state updates or useEffect dependencies wrong, we can start the whole journey again. Follow the dashed loop from Render UI back to five API requests. This is conditional: a normal render does not inherently refetch. A state update that changes a fetching Effect's dependencies can rerun that Effect.
[click] Otherwise, a request can fail. Now we need a custom retry mechanism. Too many requests can also hit a 429, depending on the API's rate limits.
[click] We could retry ALL of the requests, including any that already succeeded.
[click] Or keep the successful results and retry ONLY the failed requests. That needs custom per-request bookkeeping.
[click] Either way, we retry the selected requests and keep loading until we have the result.
[click] That is the client-side flow: mapping, state, refetch prevention and retry behavior all live here.

The 5,000/1,000 limits are the case-study scenario supplied by Faris, not a universal API limit.
React caveat: https://react.dev/reference/react/useEffect#my-effect-keeps-re-running-in-an-infinite-cycle
-->

---
layout: content
class: caching-code
faris:
  mode: dark
sourceSlide: 48
---
::title::
# Client-Side Fetching

::default::
<div class="faris-code__sample">

```ts
const { data, isLoading, error } = useFetchData(async ({
  signal, setData,
}) => {
  const response = await getFakeData(true, Number(QUANTITY), signal);

  const birthdayCountsByMonth = getBirthdaysByMonth(response);
  const chartData = mapChartData(birthdayCountsByMonth);

  setData({
    data: response,
    chartData,
    total: response.length,
  });
});
```

</div>

---
layout: statement
sourceSlide: 49
faris:
  mode: dark
class: caching-demo-intro website-skin website-illustrated
demoIntroFor: 50
---

# Demo 1

Client-Side Fetching

<div class="website-character"><FarisIllustration name="faris-speaking" decorative /></div>

---
layout: none
class: slidev-layout faris-slide caching-video
title: "Demo 1: Client-side fetching"
sourceSlide: 50
---
<SlidevVideo autoplay muted controls playsinline preload="auto" poster="/media/demo-1-poster.jpg" printPoster="/media/demo-1-print.jpg" aria-label="Recorded Demo 1: Client-side fetching">
  <source src="/media/demo-1.mp4" type="video/mp4" />
  <p>Video Unavailable. <a href="/media/demo-1.mp4">Open The Local Recording</a>.</p>
</SlidevVideo>

<!--
Playback recovery: use the audience window's video controls; presenter playback is independent. If browser playback fails, open the local file /media/demo-1.mp4. The PDF contains a still frame.
-->

---
layout: content
sourceSlide: 51
summarizesSources: [51, 52, 53, 54, 55, 56]
class: solution-summary
faris:
  mode: dark
---

::title::
# Current State: **Client-Side Fetching**

::default::
<div class="solution-facts" :class="{ 'summary-arrive': $nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext) }">
<section class="solution-fact solution-fact--payload">
<span class="solution-label">Payload</span>
<div class="solution-value"><strong>~1.58 MB</strong></div>
<p>Around <strong>80% Unused</strong><br>In This Demo</p>
</section>
<section class="solution-fact solution-fact--requests">
<span class="solution-label">Requests</span>
<div class="solution-value"><b>5</b> Parallel</div>
<p>From The Browser</p>
</section>
<section class="solution-fact solution-fact--cache">
<span class="solution-label">Caching</span>
<div class="solution-value">None</div>
<p>Built Into This Implementation</p>
</section>
<section class="solution-fact solution-fact--retry">
<span class="solution-label">Recovery</span>
<div class="solution-value">Custom <strong>Retry</strong></div>
<p>Our Code To Test And Maintain</p>
</section>
<section class="solution-fact solution-fact--state">
<span class="solution-label">State</span>
<div class="solution-value"><strong>We</strong> Manage It</div>
<p>Shared State And Staleness</p>
</section>
<section class="solution-fact solution-fact--mapping">
<span class="solution-label">Data Mapping</span>
<div class="solution-value">In The <strong>Browser</strong></div>
<p>Before Rendering The Chart</p>
</section>
</div>

::caption::
The Browser Does <strong>The Heavy Lifting</strong>.

<!--
Demo 1 recap, combining source pages 51–56. Five parallel requests retrieve the
5,000 records in this case study. The ~1.58 MB payload and around 80% unused
data describe this demo, not a universal payload size or independently measured
benchmark. Payload shape is not optimized for the chart's state or caching.
This implementation has no application/query cache; that does not mean browsers
lack HTTP caching. We own retry logic, tests, maintenance and bug fixes.
We also manage shared/global state and data staleness. Mapping happens client
side and may need memoization. These are the existing factors combined, not
new claims about every client-side application. No extra clicks.
-->

---
layout: statement
sourceSlide: 57
class: caching-number-question
faris:
  mode: dark
---

# 14 **KB**

<!--
Ask the audience: what is significant about 14 KB? Pause for answers before advancing to the explanation.
Once they answer: this was the common advice for how much data you can push over a new TCP connection before the receiver has to send back an acknowledgment. It became popular in the HTTP/1.0 and HTTP/1.1 days; HTTP/2 still runs on TCP, and QUIC uses a similar initial window.
-->

---
layout: content
sourceSlide: 58
faris:
  mode: dark
---

::title::
# 14 KB: One **Initial Congestion Window**

::default::
<img class="caching-source-image" src="/media/congestion-14kb.png" alt="Original three-panel illustration: a 14 kB website sent within one initial window" />

::caption::
Roughly <strong>Ten TCP Segments</strong> On A New Connection<br>Depends On Transport And Server Settings

<!--
For a new TCP connection, ten segments with a 1,460-byte MSS allow 14,600 bytes initially. This is a transport example, not a universal JSON or page-size budget. Compression, protocol overhead, connection reuse and other traffic on the connection affect the comparison.
1. The sender pushes one initial window worth of data.
2. It cannot send more until it gets an ACK from the receiver.
3. The ACK travels back over the network.
4. Once the ACK arrives, the congestion window grows and the sender continues.
-->

---
layout: content
sourceSlide: 59
faris:
  mode: dark
---

::title::
# One More Round Trip

::default::
<img class="caching-source-image" src="/media/congestion-15kb.png" alt="Original five-panel illustration: a 15 kB website waits another round trip for its remaining data" />

::caption::
New TCP Connection · Simplified Ten-Segment Example

<!--
The difference between 14 KB and 15 KB can be 500 to 600 ms. In the angusjf.com example, a 14 KB page loads maybe 612 ms faster than a 15 KB page, while the difference between 15 KB and 16 KB is trivial.
-->

---
layout: statement
sourceSlide: 60
faris:
  mode: dark
---

# 14 **KB**

A **TCP Example**,<br>Not A Target.

<!--
Source page 60. The 14 KB shorthand comes from ten TCP segments. At 1,460 bytes per segment, ten is 14,600 bytes; 32 is 46,720 bytes (about 46 KB as a rough talking figure, 46.7 decimal kB). This is transport data, not a guaranteed usable application payload budget.

Larger CDN windows are documented, but 46 KB is not a current CDN-wide default. Cloudflare's 2021 signature experiment used 30 packets. The 2018 IETF CDN measurements include 32-segment windows and substantial variation. A single researcher's August 2026 measurements report roughly 10 to 78 segments across sampled CDN endpoints, including about 48 for Cloudflare; these are path-specific observations, not provider guarantees or an independently reproduced benchmark. Cloudflare's 2025 analysis also emphasizes heterogeneous paths and ongoing initial-window tuning. Do not confuse its congestion window at slow-start exit with the initial window.
-->

---
layout: statement
extension: cdn-initial-window
faris:
  mode: dark
---

# Modern CDNs Can<br>**Start Much Larger**

**~46 KB**, For Example.

<span class="caching-context">Windows Vary. <strong>Measure Yours.</strong><br>It Depends On The Infrastructure.</span>

<!--
The ~46 KB figure illustrates a 32-segment TCP initial window, not a current default across modern CDNs. Historical CDN measurements document this configuration; recent endpoint measurements show continued variation. See the preceding slide's notes and sources.md for dated evidence. Measure the actual CDN, route and transport configuration rather than assume a fixed application payload allowance.
-->

---
layout: statement
sourceSlide: 62
faris:
  mode: dark
---

# The Stall

<!--
Source page 62. 
-->

---
layout: statement
sourceSlide: 63
faris:
  mode: dark
---

# A Stall Can Cost<br>**Another RTT**

In This Simplified New-Connection Example

<!--
Waiting for acknowledgements can add another round trip in this example. Loss, congestion, connection setup and transport behavior can change the total delay.
-->

---
layout: statement
sourceSlide: 64
faris:
  mode: dark
---

# RTT **Depends**<br>**On The User**

<!--
Source page 64. 
-->

---
layout: content
sourceSlide: 65
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# Connected By **Ethernet**

::default::
<LatencyRace :stage="1" :step="$clicks" />

::caption::
<strong>1–5 ms</strong> In This Example

<!--
By Ethernet, I mean the cable connecting the device to the network. The server can be elsewhere. This example assumes a fast 1–5 ms round trip for the whole request. Ethernet alone does not guarantee that time.
[click] The request goes out and the response comes back. The motion is slowed so we can follow it on a large screen. Use the numbers for the actual example times.
-->

---
layout: content
sourceSlide: 66
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# Over **Broadband**

::default::
<LatencyRace :stage="2" :step="$clicks" />

::caption::
<strong>30–70 ms</strong> In This Example

<!--
Here is a broadband example at 30–70 ms. You can use Ethernet with broadband too. These rows show two example request times, not separate kinds of network or a measured comparison.
[click] This request takes longer to come back. The motion is slowed for visibility. The numbers show the example times; the animation does not show their exact ratio.
-->

---
layout: content
sourceSlide: 67
class: caching-motion-slide
clicks: 4
faris:
  mode: dark
---

::title::
# What About **4G And 5G?**

::default::
<LatencyRace :stage="4" :step="$clicks" />

::caption::
<p v-if="$clicks === 0"><strong>Mobile Connections</strong></p>
<p v-else-if="$clicks === 1"><strong>4G: 18–23 ms</strong></p>
<p v-else-if="$clicks === 2"><strong>5G: 15–21 ms</strong></p>
<p v-else-if="$clicks === 3">The Times <strong>Overlap</strong></p>
<p v-else>Slow Connection Example: <strong>80–200 ms</strong></p>

<!--
What happens on mobile? The first two rows are examples. The mobile rows show the range of UK operators' median times, not the fastest and slowest times for every user.
[click] For 4G, those medians were 18–23 ms in the six months to March 2025.
[click] For 5G, they were 15–21 ms. The times overlap. 5G does not always win.
[click] Here they are together, slowed down so every trip is visible. The motion keeps their order, not their exact timing ratios. These were not all measured in the same test.
[click] A slow connection might take 80–200 ms in this example. That is an assumption, not a typical mobile range. Distance and busy networks can add delay.
-->

---
layout: statement
sourceSlide: 68
faris:
  mode: dark
---

# Get The Critical Rendering Payload Under The **Initial Congestion Window**

<!--
Source page 68. 
-->

---
layout: statement
sourceSlide: 69
faris:
  mode: dark
---

# **Backend For Frontend**

A Transformation Bridge. An Aggregation Proxy.

<!--
Source page 69. 
-->

---
layout: statement
sourceSlide: 70
faris:
  mode: dark
---

# **Adapt** To The Platform

<!--
The BFF pattern lets us create backend services that cater to each platform's unique requirements, data formats and interaction patterns, leading to better UX and more efficient resource usage.
-->

---
layout: statement
sourceSlide: 71
faris:
  mode: dark
---

# **Separate Concerns**

<!--
By delegating data aggregation and transformation to the proxy, the BFF pattern keeps a clear separation of concerns between frontend and backend development.
-->

---
layout: statement
sourceSlide: 72
faris:
  mode: dark
---

# **Optimize Performance**

<!--
With a dedicated backend for each frontend, the BFF can optimize data aggregation, transformation and caching, resulting in reduced latency, smaller payloads and better overall performance.
-->

---
layout: content
sourceSlide: 73
faris:
  mode: dark
class: caching-code
---

::title::
# A **Slimmed Payload**

::default::
<div class="faris-code__sample">

```jsonc
{
  "buckets": [
    { "label": "January",  "count": 385 },
    { "label": "February", "count": 418 },
    { "label": "March",    "count": 432 }
    // Remaining months omitted
  ],
  "totalUsers": 5000
}
```

</div>

::caption::
Slimmed Response

---
layout: content
sourceSlide: 74
class: caching-flow-slide
clicks: 5
faris:
  mode: dark
---

::title::
# Move The Work Into A BFF

::default::
<ServerRequestFlow variant="bff" :step="$clicks" />

::caption::
<p v-if="$clicks === 0">The Client Flow We Already Know</p>
<p v-else-if="$clicks === 1">Add A <strong>BFF</strong>. The Browser Sends <strong>One Request</strong></p>
<p v-else-if="$clicks === 2">Move The Same <strong>Mapping Work</strong> Onto The Server</p>
<p v-else-if="$clicks === 3">Send A <strong>Small Payload</strong> Back To The Existing UI</p>
<p v-else-if="$clicks === 4">Loading And <strong>Custom Retry</strong> Still Need Handling</p>
<p v-else>One Client Request. Five Upstream Requests. <strong>Server-Side Mapping</strong></p>

<!--
Start with the completed client architecture. Do not explain the same nodes again.
[click] Insert the Next.js BFF. The browser makes one request; the BFF fans out to the same five upstream requests.
[click] Move the mapping node to the server. The work still exists, but no longer runs in the browser.
[click] Return only the shaped payload. The existing React state and render steps stay in place.
[click] Loading and failure handling remain. Custom retry now calls the BFF. Retrying only failed upstream requests needs a deliberate BFF contract; a client retry alone does not provide that. Effect/state mistakes can still refetch. Upstream rate limits still apply.
[click] Recap the BFF version. Keep this full architecture as the starting point for the Query version.
-->

---
layout: content
class: caching-code caching-code-morph
faris:
  mode: dark
sourceSlide: 75
summarizesSources: [75, 76]
clicks: 1
---
::title::
<h1 v-if="$clicks === 0">Before: Mapping In The <strong>Client</strong></h1>
<h1 v-else>After: One Request to <strong>Proxy</strong></h1>

::default::
<div class="faris-code__sample">

````md magic-move {duration: 800}
```ts
const { data, isLoading, error } = useFetchData(async ({
  signal, setData,
}) => {
  const response = await getFakeData(true, Number(QUANTITY), signal);

  const birthdayCountsByMonth = getBirthdaysByMonth(response);
  const chartData = mapChartData(birthdayCountsByMonth);

  setData({ data: response, chartData, total: response.length });
});
```

```ts
const { data, isLoading, error } = useFetchData(async ({
  signal, setData,
}) => {
  const res = await fetch(`/api/birthdays?quantity=${QUANTITY}`, { signal });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const payload = await res.json();

  setData(payload);
});
```
````

</div>

<!--
Before: the client fetches the full records, maps them and stores the chart data.
[click] Keep the same hook and state setter. Fetch the shaped response from the BFF instead. The mapping has moved to the server. HTTP errors still throw and cancellation still reaches fetch.
-->

---
layout: content
sourceSlide: 80
class: caching-motion-slide
clicks: 2
faris:
  mode: dark
---
::title::
# Return The **Minimum Viable Values**

::default::
<PayloadShape :step="$clicks" />

::caption::
<p v-if="$clicks === 0">The Chart Needs <strong>Birthdays</strong>, Not Every User Field</p>
<p v-else-if="$clicks === 1"><strong>Aggregate On The Server</strong> Into Monthly Counts</p>
<p v-else>Send The <strong>Small Response</strong>. Keep The Full Records Off The Client</p>

<!--
The stack represents the full records; the repeated blocks are schematic, not byte-proportional or measured birthday frequencies.
[click] Group birthdays into twelve monthly counts on the server.
[click] Return counts and total to the browser. The following demo provides the actual payload evidence.
-->

---
layout: statement
sourceSlide: 81
faris:
  mode: dark
class: caching-demo-intro website-skin website-illustrated
demoIntroFor: 82
---

# Demo 2

BFF With Optimized Payload

<div class="website-character website-character--duck"><FarisIllustration name="duck-curious" decorative /></div>

---
layout: none
class: slidev-layout faris-slide caching-video
title: "Demo 2: BFF With Optimized Payload"
sourceSlide: 82
---
<SlidevVideo autoplay muted controls playsinline preload="auto" poster="/media/demo-2-poster.jpg" printPoster="/media/demo-2-print.jpg" aria-label="Recorded Demo 2: BFF With Optimized Payload">
  <source src="/media/demo-2.mp4" type="video/mp4" />
  <p>Video Unavailable. <a href="/media/demo-2.mp4">Open The Local Recording</a>.</p>
</SlidevVideo>

<!--
Playback recovery: use the audience window's video controls; presenter playback is independent. If browser playback fails, open the local file /media/demo-2.mp4. The PDF contains a still frame.
-->

---
layout: content
sourceSlide: 83
summarizesSources: [77, 78, 79, 83]
class: solution-summary
faris:
  mode: dark
---

::title::
# Current State: **BFF**

::default::
<div class="solution-facts" :class="{ 'summary-arrive': $nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext) }">
<section class="solution-fact solution-fact--payload">
<span class="solution-label">Payload</span>
<div class="solution-value"><strong>~300 Bytes</strong></div>
<p>Only <strong>Chart Data</strong><br>In This Demo</p>
</section>
<section class="solution-fact solution-fact--requests">
<span class="solution-label">Requests</span>
<div class="solution-value"><b>1</b> To The Proxy</div>
<p>5 Upstream Requests Remain</p>
</section>
<section class="solution-fact solution-fact--cache">
<span class="solution-label">Caching</span>
<div class="solution-value">None</div>
<p>Still No Application Cache</p>
</section>
<section class="solution-fact solution-fact--retry">
<span class="solution-label">Recovery</span>
<div class="solution-value">Custom Retry</div>
<p>One Client Request To Handle</p>
</section>
<section class="solution-fact solution-fact--state">
<span class="solution-label">State</span>
<div class="solution-value">We Manage It</div>
<p>Shared State And Staleness</p>
</section>
<section class="solution-fact solution-fact--mapping">
<span class="solution-label">Data Mapping</span>
<div class="solution-value">In The <strong>Proxy</strong></div>
<p>UI And Mapping Code Separated</p>
</section>
</div>

::caption::
Less Data. Less Client Work. <strong>Same State And Retry Responsibilities.</strong>

<!--
Combines the BFF factors from sources 77–79 with the demo payload at source 83.
The ~300-byte figure describes the shaped response in this demo, not a universal
payload or independent measurement. The browser sends one request to the proxy;
the proxy still makes five upstream requests. One client request simplifies
client failure handling, but does not isolate upstream failures automatically.
Custom retry and application state/staleness management remain. Retrying only
failed upstream requests requires a deliberate BFF contract and bookkeeping.
This version adds no application/query cache; HTTP caching is a separate matter.
Mapping now lives at the proxy, separating UI and mapping responsibilities.
Deployment and server maintenance are still our responsibility.
-->

---
layout: statement
sourceSlide: 84
faris:
  mode: dark
---

# **Network Bandwidth**

Payload: <strong>1.58 MB</strong>

<!--
We are looking at download time purely based on network speed. Latency is variable, so it sits in a fixed cost instead.
Assumed third-party API fetch latency: 100 ms (varies with the API and network conditions).
Assumed proxy processing time: 100 ms.
Total additional overhead: about 200 ms.
-->

---
layout: content
sourceSlide: 85
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# Downloading The **Large Payload**

::default::
<TransferRace :bytes="1580000" :stage="1" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<strong>Wi-Fi · ~90 Mbps</strong> · About 340 ms With The Assumed Fixed Cost

<!--
Constant-rate model, not a benchmark. Decimal 1.58 MB at 90 Mbps takes 140.4 ms to transfer, plus an assumed 200 ms fixed cost. A full bar means the whole payload arrived.
[click] Transfer the same payload. The fixed cost happens before the fill starts.
-->

---
layout: content
sourceSlide: 86
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# The Same Payload On **4G**

::default::
<TransferRace :bytes="1580000" :stage="2" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<strong>~25 Mbps</strong> · About 700 ms With The Same Fixed Cost

<!--
Keep Wi-Fi in place. The chosen 25 Mbps rate gives 505.6 ms of payload transfer plus 200 ms fixed cost. This is an example rate, not a universal 4G speed.
[click] Compare both transfers from the same start.
-->

---
layout: content
sourceSlide: 87
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# A Slow Connection **Magnifies The Payload**

::default::
<TransferRace :bytes="1580000" :stage="3" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<strong>3G · ~2 Mbps</strong> · About 6,500 ms In This Model

<!--
The original 2 Mbps scenario gives 6,320 ms transfer plus 200 ms fixed cost. This is not a claim about current 3G availability. Rates are assumed constant, ignoring protocol dynamics.
[click] Launch all three. The slow path takes longer for exactly the same number of bytes. Navigation never waits for it.
-->

---
layout: statement
sourceSlide: 88
faris:
  mode: dark
---

# **Network Bandwidth**

Payload: <strong>300 Bytes</strong>

<!--
Source page 88. 
-->

---
layout: content
sourceSlide: 89
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# Downloading The **Small Payload**

::default::
<TransferRace :bytes="300" :stage="1" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<strong>~200–210 ms</strong> · The Fixed Cost Now Dominates

<!--
The same fixed-cost model with 300 decimal bytes: payload transfer takes about 0.027 ms at 90 Mbps. Do not mistake the assumed 200 ms fixed cost for a measured network RTT.
[click] Most of the total time is the fixed wait; the tiny payload follows almost immediately.
-->

---
layout: content
sourceSlide: 90
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# Small Payload. **Less Transfer Time.**

::default::
<TransferRace :bytes="300" :stage="2" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<strong>4G · ~25 Mbps</strong> · Still About 200–210 ms In This Model

<!--
At the chosen 25 Mbps rate the 300-byte transfer takes 0.096 ms, plus the same assumed fixed cost.
[click] Compare the two connections. Both are dominated by the fixed cost.
-->

---
layout: content
sourceSlide: 91
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# **Fewer Bytes** Help The Slow Path Too

::default::
<TransferRace :bytes="300" :stage="3" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
<strong>3G · ~2 Mbps</strong> · Still About 200–210 ms In This Model

<!--
At 2 Mbps, 300 bytes take 1.2 ms to transfer, plus 200 ms fixed cost. The point is the reduced sensitivity to the chosen transfer rate, not a promise that every mobile request takes 200 ms.
[click] Launch all three. With very little data to move, their modeled totals are close.
Transfer time is tiny at any realistic network speed. Latency plus server time dominates, so everything clusters around 200 ms.
-->

---
layout: statement
sourceSlide: 92
faris:
  mode: dark
---

# **Ingress** Vs. Egress

<!--
Source page 92. 
-->

---
layout: content
sourceSlide: 93
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# **Ingress**

::default::
<BoundaryTraffic direction="ingress" :step="$clicks" />

::caption::
Data Coming <strong>Into</strong> The BFF

<!--
Keep the perspective fixed on the BFF. We are following response data here, not drawing the request leg.
[click] The upstream API returns full records. Data entering the BFF is ingress.
-->

---
layout: content
sourceSlide: 94
class: caching-motion-slide
clicks: 1
faris:
  mode: dark
---

::title::
# **Egress**

::default::
<BoundaryTraffic direction="egress" :step="$clicks" />

::caption::
Data Going <strong>Out Of</strong> The BFF

<!--
Keep the same BFF in view. The incoming leg stays visible from the previous slide.
[click] After shaping the data, the BFF sends monthly counts to the browser. Data leaving the BFF is egress. We describe direction from the BFF's perspective; the browser receives that same response. The drawing does not represent packet count, throughput or billing policy.
-->

---
layout: statement
sourceSlide: 95
faris:
  mode: dark
---

# **FaaS** Vs. IaaS

<!--
Function as a Service and Infrastructure as a Service.
-->

---
layout: content
sourceSlide: 96
class: proxy-bandwidth
clicks: 2
faris:
  mode: dark
---

::title::
# **Function As A Service**

::default::
<ProxyCapacity host="lambda" :step="$clicks" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
Download Time Only. Starting The Server And Waiting For The API Take Extra Time.

<!--
[click] Add the 25 Mbps client example beside the slower 2 Mbps connection.
[click] Add Lambda last. These are ideal transfer estimates, not measured speedups. Show the proxy downloading and trimming the payload before sending it to the browser.
AWS Lambda's default network quota is 625 Mbps per execution environment, not per request or a promised API download rate. For decimal 1.58 MB, bytes times eight divided by bits per second gives 20.224 ms at 625 Mbps, 505.6 ms at 25 Mbps and 6,320 ms at 2 Mbps. These are ideal transfer-only estimates, not measured request latency. The 200 ms assumption on the earlier download slides is not included here. Startup, upstream processing, TCP/TLS, contention and mapping take additional time. The upstream must be able to supply the data fast enough. Put the BFF near the API where possible. The original payload still crosses into the proxy, but only the shaped result crosses the client's slower connection. The demo's approximate byte counts are retained, not new wire measurements. Measure cold and warm requests in the actual deployment. Faster networking alone does not prove a lower total bill.
-->

---
layout: content
sourceSlide: 97
class: proxy-bandwidth
faris:
  mode: dark
---

::title::
# **Infrastructure As A Service**

::default::
<ProxyCapacity host="ec2" :step="2" :active="$nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext)" />

::caption::
Download Time Only. Requests Share The Server’s Network Capacity.

<!--
AWS lists c5.large baseline bandwidth as 0.75 Gbps, or 750 Mbps. Use the baseline rather than its up-to-10-Gbps burst figure. Specifications cover inbound and outbound traffic, with additional flow and path limits. At 750 Mbps, decimal 1.58 MB takes 16.853 ms in an ideal transfer-only model. This is instance capacity shared by requests, not measured API throughput. The upstream, route, connections and load can reduce the achieved rate. Client rates are the same illustrative assumptions as the earlier slides. The proxy downloads and maps the full response, then sends about 300 bytes of chart data in this demo. An already-running process can avoid a new process startup, but boot, scale-out, operations and compute still cost time or money. Smaller browser responses reduce transferred bytes on that leg. Upstream egress, cross-zone traffic, NAT and proxy compute can still cost money, so this is not a claim of lower total cloud spend.
-->

---
layout: content
sourceSlide: 100
class: caching-flow-slide
clicks: 4
faris:
  mode: dark
---

::title::
# Let TanStack Query Manage Server State

::default::
<ServerRequestFlow variant="query" :step="$clicks" />

::caption::
<p v-if="$clicks === 0">The Same BFF, Upstream Requests And Small Payload</p>
<p v-else-if="$clicks === 1">Let <strong>TanStack Query</strong> Own The Client Cache</p>
<p v-else-if="$clicks === 2"><strong>Reuse Fresh Data</strong>. Refetch When Needed</p>
<p v-else-if="$clicks === 3">The Query Manages <strong>Loading, Errors And Retry</strong></p>
<p v-else><strong>No New Request On A Fresh Hit.</strong> The API Limit Still Exists.</p>

<!--
Start with the completed BFF diagram. The server path is already familiar.
[click] Replace manually managed React server state with the Query cache. The BFF, upstream API and payload do not change.
[click] Fresh cached results can render without a new fetch. A missing result, stale data or an explicit refetch can still need the BFF according to configuration; stale does not mean every render fetches. Existing data can stay visible during a background fetch.
[click] Query owns loading/error/data state and configured retries with backoff. Retrying the query calls the BFF again; selective upstream retry is not automatic. Persistence requires separate setup.
[click] Set a global QueryClient defaultOptions.queries.staleTime of 5 * 60 * 1000. Assume the same key already has successful cached data. Repeated fresh hits avoid new requests, so those hits cannot receive a new 429. This reduces the symptom, not the API rate limit itself. Cache misses, invalidation, explicit refetch, different keys and other users can still send requests and hit that limit. Freshness is measured from the data update, not restarted by each cache read. Cache retention is separate. The next prefetch diagram restores the full request path because misses and refetches still matter.
-->

---
layout: content
sourceSlide: 101
faris:
  mode: dark
class: caching-code caching-code-morph
clicks: 1
---

::title::
<h1 v-if="$clicks === 0">Before: One Request to <strong>Proxy</strong></h1>
<h1 v-else>After: Let <strong>Query</strong> Manage The State</h1>

::default::
<div class="faris-code__sample">

````md magic-move {duration: 800}
```ts
const { data, isLoading, error } = useFetchData(async ({
  signal, setData,
}) => {
  const res = await fetch(`/api/birthdays?quantity=${QUANTITY}`, { signal });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const payload = await res.json();

  setData(payload);
});
```

```ts
const { data, isFetching, error } = useQuery({
  queryKey: ["faker", QUANTITY],

  queryFn: async ({ signal }) => {
    const res = await fetch(`/api/birthdays?quantity=${QUANTITY}`, { signal });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return res.json();
  },
});
```
````

</div>

<!--
Start with the same BFF snippet shown earlier. QUANTITY is still 5, the number of upstream requests requested through the BFF.
[click] Keep the same fetch, HTTP error handling and cancellation signal. Query receives the returned data instead of calling setData. The key identifies the data and quantity. This query inherits the five-minute global staleTime shown on the preceding slide; no per-query override. isFetching includes background requests. Query manages request state and configured retries, but upstream rate limits still apply. useFetchData remains an illustrative helper from the original example.
-->

---
layout: content
sourceSlide: 103
class: caching-motion-slide
clicks: 3
faris:
  mode: dark
---
::title::
# **Cache Hits** Take The Short Path

::default::
<CacheJourney :step="$clicks" />

::caption::
<p v-if="$clicks < 2">A Missing Result Still Needs A <strong>Fetch</strong></p>
<p v-else-if="$clicks === 2">The Same Query Key Can <strong>Reuse Fresh Data</strong></p>
<p v-else><strong>Freshness And Refetch Triggers</strong> Depend On Configuration</p>

<!--
Start with no matching cached result for this query key.
[click] A cache miss uses the query function to fetch, then stores the returned result in the Query cache.
[click] With fresh matching data, reuse the cached result. No remote fetch is needed for this fresh-hit scenario.
[click] Stale does not mean missing. Existing data can remain visible while a configured trigger refetches. Query data is stale by default unless staleTime is configured; persistence and offline behavior need additional setup.
-->

---
layout: content
sourceSlide: 105
summarizesSources: [102, 104, 105]
faris:
  mode: dark
class: solution-summary
---

::title::
# Current State: **BFF + TanStack Query**

::default::
<div class="solution-facts" :class="{ 'summary-arrive': $nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext) }">
<section class="solution-fact solution-fact--payload">
<span class="solution-label">Payload</span>
<div class="solution-value">~300 Bytes</div>
<p>Only Chart Data<br>In This Demo</p>
</section>
<section class="solution-fact solution-fact--requests">
<span class="solution-label">Requests</span>
<div class="solution-value"><b>0</b> On A Fresh Hit</div>
<p>Otherwise, 1 To The Proxy</p>
</section>
<section class="solution-fact solution-fact--cache">
<span class="solution-label">Caching</span>
<div class="solution-value"><strong>Query</strong></div>
<p><strong>Reuse Fresh Data</strong><br>Control Refetching</p>
</section>
<section class="solution-fact solution-fact--retry">
<span class="solution-label">Recovery</span>
<div class="solution-value"><strong>Built-In Retries</strong></div>
<p>Configurable Backoff<br>Custom <strong>Jitter</strong></p>
</section>
<section class="solution-fact solution-fact--state">
<span class="solution-label">State</span>
<div class="solution-value"><strong>Query Manages It</strong></div>
<p>Loading, Errors And Data</p>
</section>
<section class="solution-fact solution-fact--mapping">
<span class="solution-label">Data Mapping</span>
<div class="solution-value">In The Proxy</div>
<p>Same Small Response</p>
</section>
</div>

::caption::
Same BFF. <strong>Less Fetching. Less State To Manage.</strong>

<!--
Combines the Query factors from sources 102, 104 and 105 after the retained cache-hit animation.
The payload and proxy mapping stay the same. A fresh matching cache hit needs no network request in this example. A miss or configured refetch still calls the BFF, which still makes five upstream requests. Freshness depends on staleTime; invalidation, explicit refetch and configured triggers can cause requests. Query manages server-state data, loading and errors, not every piece of UI state. Retries and backoff are configurable and upstream rate limits still apply. Jitter adds randomness to retry delays so clients do not all retry together. Add it with a custom retryDelay function; it is not part of the currently documented default backoff. This is an available configuration, not something implemented in the preceding snippet. HTTP failures must throw as shown in the code. The ~300-byte payload is the existing demo figure, not a new measurement. Persistence and offline behavior require separate setup. The five-minute global staleTime in the preceding explanation controls freshness, not cache retention. Control refetching and manage data staleness without the earlier custom Effect/state loop.

Personal reminder: jitter might be under discussion as a potential default for TanStack Query v6 (Faris's recollection). Not a confirmed roadmap commitment; check the discussion before presenting it as planned.
-->

---
layout: statement
sourceSlide: 106
faris:
  mode: dark
---

# But We Can Go<br>**One Step** Further…

<!--
Source page 106. 
-->

---
layout: content
sourceSlide: 107
class: caching-motion-slide
clicks: 3
faris:
  mode: dark
---

::title::
# Start The Journey On The **Server**

::default::
<PrefetchTimeline :step="$clicks" />

::caption::
<p v-if="$clicks < 2">Client Fetching Adds A Request <strong>After Hydration</strong></p>
<p v-else-if="$clicks === 2">Server Fetching Can <strong>Delay The First Byte</strong></p>
<p v-else>Hydrate Fresh Data To <strong>Avoid The Extra Client Fetch</strong></p>

<!--
Both lanes start with the same full-page navigation. Widths are a schematic sequence, not measured timing or a promise of equal total duration.
[click] Without server prefetch, the browser receives HTML, hydrates, then starts the data request. The chart remains loading until that request finishes.
[click] getServerSideProps starts after navigation reaches the server. Fetching there moves work into the response path and can increase time to first byte. It does not move work before user intent.
[click] On success, HTML carries dehydrated request-scoped Query state. The browser hydrates with the same key and a positive staleTime, avoiding an immediate client fetch while data is fresh. The bytes still reach the browser. On timeout or error, return without that result and let the client fetch. Overall time depends on deployment and actual work.
-->

---
layout: content
sourceSlide: 108
class: caching-flow-slide
clicks: 5
faris:
  mode: dark
---

::title::
# Prefetch On The Server. Recover On The Client.

::default::
<ServerRequestFlow variant="prefetch" :step="$clicks" />

::caption::
<p v-if="$clicks === 0">The Same <strong>Query Cache And BFF</strong></p>
<p v-else-if="$clicks === 1">After Navigation, <strong>Race The Fetch Against A Timeout</strong></p>
<p v-else-if="$clicks === 2">Keep Query State <strong>Per Request</strong>, Then Dehydrate</p>
<p v-else-if="$clicks === 3"><strong>Hydrate The Client Cache</strong>. Render With Initial Data</p>
<p v-else-if="$clicks === 4">Timeout Wins: <strong>Abort The Fetch</strong>. Let The Client Recover</p>
<p v-else><strong>Prefetch And Hydrate</strong>, With The Existing Client Path As Fallback</p>

<!--
Start with the completed Query architecture. Keep all the already explained blocks visible.
[click] Add server prefetch after the navigation request. Faris's createPrefetch helper uses Promise.race to choose between fetch completion and a timeout. The helper explicitly cancels the request when the timeout wins; Promise.race alone does not cancel the losing operation.
[click] Store a successful result in a new request-scoped QueryClient, then dehydrate it. This is not a persistent cache shared between visitors. The payload still crosses to the browser.
[click] Hydrate the existing client Query cache. React can render with initial data. The cache's configured freshness/refetch behavior still matters.
[click] On timeout, the helper aborts the outstanding request and returns without that result. On error, it also falls back. The client then uses the existing loading and Query fetch/retry path. Cancellation must reach the actual fetch via its signal; aborting a BFF request does not by itself prove the BFF stopped every upstream task. The failure path is an alternative, not the next step after successful hydration.
[click] Recap the accumulated architecture. No new upstream service or second client cache is necessary.
-->

---
layout: content
sourceSlide: 109
faris:
  mode: dark
class: caching-code caching-prefetch-code
---

::title::
# Prefetch, But Don’t Wait Forever

::default::
<div class="faris-code__sample prefetch-travel" :style="{ viewTransitionName: $nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext) ? 'prefetch-code' : 'none' }">

```ts
export const getServerSideProps = async () => {
  const prefetch = createPrefetch(new QueryClient(), 2_500);

  await prefetch.optionalQuery([QUERY_KEY, QUANTITY], async ({ signal }) => {
    const url = `${BIRTHDAYS_API_URL}?quantity=${QUANTITY}`;
    const res = await fetch(url, { signal });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });

  const dehydratedState = prefetch.dehydrate();
  return { props: { dehydratedState } };
};
```

</div>

<!--
QUANTITY = 5 means five upstream requests. The shown 2,500 ms budget is the existing code example, not a universal timeout or a recovered setting for every recording. BIRTHDAYS_API_URL is a trusted, server-configured absolute BFF URL, not a URL derived from user input. In a shared Next.js deployment, call a shared server data function instead of your own HTTP endpoint where practical.
The revised callback contract receives the helper's AbortSignal and passes it to fetch. Faris confirms the helper uses Promise.race and cancellation. Its original implementation/signature is not in this repository. On success it must clear the timeout and dehydrate only successful data. On timeout it must abort the fetch and omit failed/cancelled data. The client uses the same key and a positive staleTime inside a HydrationBoundary.
-->

---
layout: content
extension: prefetch-query-match
class: caching-code caching-hydration-pair
clicks: 2
faris:
  mode: dark
---

::title::
# Same Key. **Client Fetch As Fallback.**

::default::
<div class="hydration-pair" :data-step="$clicks">
<section class="hydration-server">
<h2>Server · getServerSideProps</h2>
<div class="prefetch-travel" :style="{ viewTransitionName: $nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext) ? 'prefetch-code' : 'none' }">

```ts
export const getServerSideProps = async () => {
  const prefetch = createPrefetch(
    new QueryClient(), 2_500
  );
  await prefetch.optionalQuery(
    [QUERY_KEY, QUANTITY],
    fetchBirthdaysOnServer
  );
  const dehydratedState = prefetch.dehydrate();
  return { props: { dehydratedState } };
};
```

</div>
</section>
<section class="hydration-client">
<h2>Client · useQuery</h2>

```ts
const { data, isPending, error } =
  useQuery({
    queryKey: [QUERY_KEY, QUANTITY],
    queryFn: fetchBirthdaysOnClient,
    staleTime: 5 * 60 * 1000,
  });

if (isPending) return <Loading />;

if (error) return <ErrorMessage />;

return <BirthdayChart data={data} />;
```

</section>
</div>

<!--
Illustrative excerpts, not a full Next.js file. QUERY_KEY and QUANTITY have identical serializable values on server and client. The extracted fetch functions retain the prior example's HTTP checks and AbortSignal handling; the server uses a configured absolute URL or shared server function, and the client calls the BFF with quantity=QUANTITY. QUANTITY still means five upstream requests.
Pages Router wiring: create one stable browser QueryClient under QueryClientProvider and wrap the page in HydrationBoundary with state={pageProps.dehydratedState}. Hydration restores successful server query data before the consuming useQuery runs. The explicit five-minute staleTime matches our earlier global example; it is not the library default.
The optional helper omits a timed-out or failed prefetch result. With default successful-query dehydration, no entry for that key is sent. If the browser also has no usable cached data, an enabled useQuery starts its normal fetch when mounted, subject to network availability. This is a new client fetch, not detection that the server owed it data, not a hydration mismatch, and not a resumed server request. Existing browser cache can still supply data; stale data can render and refetch in the background. Normal configured retries apply if the client request fails. With fresh hydrated data and default refetch settings, no mount fetch is needed.
[click] Shift attention from server prefetch to the normal client useQuery.
[click] Spotlight the matching query-key lines. This is how hydrated data is found; without data for that key, the client follows its normal fetching path.
-->

---
layout: statement
sourceSlide: 113
faris:
  mode: dark
class: caching-demo-intro website-skin website-illustrated
demoIntroFor: 114
---

# Demo 3

Server Prefetching With TanStack Query

<div class="website-character"><FarisIllustration name="faris-speaking" decorative /></div>

---
layout: none
class: slidev-layout faris-slide caching-video
title: "Demo 3: Server prefetching with TanStack Query"
sourceSlide: 114
---
<SlidevVideo autoplay muted controls playsinline preload="auto" poster="/media/demo-3-poster.jpg" printPoster="/media/demo-3-print.jpg" aria-label="Recorded Demo 3: Server prefetching with TanStack Query">
  <source src="/media/demo-3.mp4" type="video/mp4" />
  <p>Video Unavailable. <a href="/media/demo-3.mp4">Open The Local Recording</a>.</p>
</SlidevVideo>

<!--
Playback recovery: use the audience window's video controls; presenter playback is independent. If browser playback fails, open the local file /media/demo-3.mp4. The recording opens on the ZurichJS website, as shown in the original PDF. No inferred trimming is applied.
-->

---
layout: content
sourceSlide: 110
summarizesSources: [110, 111, 112]
class: solution-summary
faris:
  mode: dark
---

::title::
# Current State: **Server Prefetch**

::default::
<div class="solution-facts" :class="{ 'summary-arrive': $nav.currentPage === $page && ['slide', 'presenter'].includes($renderContext) }">
<section class="solution-fact"><span class="solution-label">Payload</span><div class="solution-value">Same Small Data</div><p>Included In The Initial Response</p></section>
<section class="solution-fact"><span class="solution-label">Requests</span><div class="solution-value"><strong>No Extra Fetch</strong></div><p>While Hydrated Data Is Fresh</p></section>
<section class="solution-fact"><span class="solution-label">Caching</span><div class="solution-value"><strong>Prefetch + Hydrate</strong></div><p>Same Query Key On Both Sides</p></section>
<section class="solution-fact"><span class="solution-label">Recovery</span><div class="solution-value"><strong>Client Fallback</strong></div><p>On Server Error Or Timeout</p></section>
<section class="solution-fact"><span class="solution-label">Server Wait</span><div class="solution-value"><strong>2.5 Sec Limit</strong></div><p>Helper Aborts On Timeout</p></section>
<section class="solution-fact"><span class="solution-label">Trade-Off</span><div class="solution-value">Later First Byte</div><p>Pages Router Waits For Prefetch</p></section>
</div>

::caption::
Pages Router · <strong>Fetch Earlier. Reuse The Result.</strong>

<!--
Combines source factors 110–112 after Demo 3. This is the getServerSideProps Pages Router example, not a claim that every server rendering approach waits for all data.
Promise.race chooses the result or timeout; the helper explicitly aborts the request. The 2.5 seconds is this example's optional-fetch budget, not a cap on the entire response time. Use a per-request server QueryClient, dehydrate successful data, and hydrate with matching keys and suitable staleTime. A fresh result avoids an immediate duplicate client fetch. Errors/timeouts omit that result and retain the client loading/fetch/retry path. Data bytes and upstream work still exist; server prefetch can delay the first byte. Query cache retention is separate from freshness.
-->

---
layout: content
class: caching-motion-slide
extension: router-transition
clicks: 1
faris:
  mode: dark
---

::title::
# Taking The Server Model **Further**

::default::
<RouterTransition :step="$clicks" />

::caption::
<p v-if="$clicks === 0">Our Demo Uses <strong>Pages Router</strong></p>
<p v-else>With <strong>App Router</strong>, Ready Parts Can Arrive First</p>

<!--
The implementation just demonstrated uses Pages Router and getServerSideProps. Its optional server prefetch waits for success or the timeout before returning props.
[click] Introduce an alternative App Router design, not an automatic migration or a claim that this demo already uses it. Server Components and Suspense let the ready shell stream while slower sections wait. The following diagram explains the flow. Streaming and partial prerendering are distinct; this transition does not assume a prerendered shell or Cache Components configuration.
-->

---
layout: content
class: caching-motion-slide
extension: app-router-streaming
clicks: 3
faris:
  mode: dark
---

::title::
# Show The **Shell**. Stream The Rest.

::default::
<StreamingShell :step="$clicks" />

::caption::
<p v-if="$clicks === 0">App Router · Start The Promise <strong>On The Server</strong></p>
<p v-else-if="$clicks === 1"><strong>Send The Shell</strong>. Show Loading UI For Slow Sections</p>
<p v-else-if="$clicks === 2">The Chart Is Ready. <strong>Stream It In</strong></p>
<p v-else><strong>Each Section Arrives When Ready</strong>. The Rest Does Not Wait</p>

<!--
Optional next step, not the implementation in Demo 3. In App Router, start an async operation in a Server Component without awaiting it above all of the page. Pass its promise to a Client Component and read it with React use inside Suspense, or await it in an async Server Component under Suspense. React/Next stream rendered output and the resolved result through their protocol, not a raw JavaScript promise object as ordinary JSON.
[click] Send available shell HTML and Suspense fallback UI while the data is pending. Ready Client Components can hydrate when their code is available; this is not a guarantee of instant interactivity or zero hydration work. Server Components themselves do not hydrate.
[click] The birthday query resolves. Its content replaces the chart fallback while the activity section remains pending.
[click] The independent activity section resolves and replaces its fallback. Sequence is schematic, not measured timing. TanStack Query can also integrate pending-query dehydration with streaming, but requires the documented setup; that code is not demonstrated here.
-->

---
layout: statement
sourceSlide: 115
faris:
  mode: dark
---

# What About<br>**Real-World** Results?

<!--
Source page 115. 
-->

---
layout: none
sourceSlide: 116
class: slidev-layout faris-slide caching-photo
faris:
  mode: dark
---

<img src="/media/in-flight-demo.jpg" alt="Faris showing the client-side fetching demo on a laptop during a flight" />

---
layout: none
sourceSlide: 117
class: slidev-layout faris-slide caching-photo
faris:
  mode: dark
---

<img src="/media/flight-map.jpg" alt="Airplane seat display showing the flight position near Maine" />

---
layout: none
sourceSlide: 118
class: slidev-layout faris-slide caching-photo
faris:
  mode: dark
---

<img src="/media/flight-speedtest.png" alt="Original speed test: 4.87 Mbps down, 1.73 Mbps up, idle ping 927 ms" />

---
layout: statement
sourceSlide: 119
faris:
  mode: dark
---

# Couldn’t The Backend Just Have Made That Endpoint?

Instead Of Jumping Through All Those Engineering Hoops…

<!--
Source page 119. Rhetorical objection from the original talk; not a quotation attributed to a real person.
-->

---
layout: statement
sourceSlide: 120
faris:
  mode: dark
---

# **Yes.**<br>If We Can Change It

In This Scenario, We Cannot Change The **Upstream API**.

<!--
Source page 120. 
-->

---
layout: statement
sourceSlide: 121
faris:
  mode: dark
---

# Be **Pragmatic**

<!--
Source page 121. 
-->

---
layout: statement
sourceSlide: 122
faris:
  mode: dark
---

# **But Also…**

<!--
Source page 122. 
-->

---
layout: statement
sourceSlide: 123
faris:
  mode: dark
---

# Be **Curious**

<!--
Source page 123. 
-->

---
layout: statement
sourceSlide: 124
faris:
  mode: dark
---

# Be **Creative**

<!--
Source page 124. 
-->

---
layout: content
sourceSlide: 125
class: website-skin
faris:
  mode: dark
---

::title::
# **Thank You!**

::default::
<div class="caching-closing">
<div class="caching-contact">
<p class="caching-connect-cta">Connect With Me</p>
<a href="https://faziz-dev.com/connect" target="_blank" rel="noopener noreferrer"><img class="caching-qr" src="/media/connect-qr.png" alt="Scan to visit faziz-dev.com/connect" /></a>
<p>@farisaziz12</p>
</div>
<div class="caching-closing-badge"><FarisIllustration name="duck-celebrating" /></div>
<img class="caching-closing-photo" src="/media/speaker-montage.jpg" alt="Faris with the developer community" />
</div>
