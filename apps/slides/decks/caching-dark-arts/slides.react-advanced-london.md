---
# Edition: React Advanced London 2026, published at /slides/built-for-turbulence/.
# Slides 1, 2, 15, 42 and 58 are edited copies. Every other slide is
# imported from slides.md, so fixes there reach this edition. See EDITIONS.md.
theme: faris
colorSchema: dark
title: "Built for Turbulence: Architecting Full-Stack Web Experiences That Hold Up in Any Environment"
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
# Built For Turbulence

Architecting **Full-Stack** Web Experiences That Hold Up In **Any Environment**

::meta::
Faris Aziz · ZurichJS Co-Founder · Staff Product Engineer

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

**Co-Founder @ ZurichJS**<br>Staff Product Engineer. Worked With Smallpdf, Navro, Fiit, Discovery, GCN & Eurosport

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
<li><strong>Stripe</strong>: Community Builder</li>
</ul>

</div>
<img src="/media/speaker-montage.jpg" alt="Faris speaking and meeting with developer communities" />
</div>

---
src: ./slides.md#3-14
---

---
layout: statement
sourceSlide: 15
faris:
  mode: dark
---

# Why is a **smooth UX** so hard when **data fetching** gets complicated?

<!--
Source page 15. Wording restored at Faris's request.
-->

---
src: ./slides.md#16-41
---

---
layout: statement
sourceSlide: 45
class: website-skin website-illustrated
faris:
  mode: dark
---

# The Data Source

An API Returns A <strong>List Of Users</strong> With <strong>All Their Data</strong>, <strong>1,000 Records</strong> At A Time. Any More Breaks Our <strong>SLA</strong> Due To DB Query Speed.

The Backend Can’t Prioritize A <strong>New Endpoint</strong> Or A <strong>Data Warehouse</strong> For Our Needs.

<div class="website-character"><FarisIllustration name="faris-thinking" decorative /></div>

<!--
Source page 45. 
-->

---
src: ./slides.md#43-57
---


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
<p v-else>On A Bad Day, Both: <strong>80–200 ms</strong></p>

<!--
What happens on mobile? The first two rows are examples. The mobile rows show the range of UK operators' median times, not the fastest and slowest times for every user.
[click] For 4G, those medians were 18–23 ms in the six months to March 2025.
[click] For 5G, they were 15–21 ms. The times overlap. 5G does not always win.
[click] Here they are together, slowed down so every trip is visible. The motion keeps their order, not their exact timing ratios. These were not all measured in the same test.
[click] A slow connection might take 80–200 ms in this example. That is an assumption, not a typical mobile range. Distance and busy networks can add delay.
-->

---
src: ./slides.md#59-109
---
