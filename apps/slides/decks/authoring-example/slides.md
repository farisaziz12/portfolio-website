---
theme: faris
title: Faris Slides · Authoring example
author: Faris Aziz
aspectRatio: 16/9
canvasWidth: 1280
fonts:
  provider: none
themeConfig:
  farisMode: light
  farisBackground: arc
layout: cover
---

# Modern frontend architecture

Patterns that survive production.

::meta::
Faris Aziz · Staff Software Engineer

::visual::
<FarisBadge />

<!--
One-minute fixture walkthrough: this cover is reused from the approved showcase.
This is a tooling example, not a researched conference talk.
-->

---
layout: statement
faris:
  mode: dark
  background: none
---

# The frontend reaches far beyond the interface

<v-click>

It carries product logic into platform and delivery decisions.

</v-click>

::kicker::
Architecture

::annotation::
Systems thinking, not screens

<!--
Spend one minute on the claim as an opinion about scope, not a measured result.
Reveal the supporting sentence with ArrowRight, then go back to verify reversal.
Transition: the cache example shows one such policy decision at a boundary.
-->

---
layout: code
faris:
  mode: light
  background: arc
---

::kicker::
Boundary design

::title::
# Cache at the edge

::default::

```ts {2-4|6-9|all}
export async function loadProduct(id: string) {
  const cached = await productCache.get(id)
  if (cached)
    return cached

  const product = await catalog.getProduct(id)
  await productCache.set(id, product, {
    ttl: 60,
  })

  return product
}
```

::annotation::
Keep policy close to the boundary

<!--
Two-minute illustrative walkthrough. First show the hit path, then miss/write,
then the complete function. productCache and catalog are assumed interfaces.
The fixture assumes cached products are truthy objects and ttl is in seconds.
This does not establish a deployment location, production cache policy, error
handling, invalidation or concurrent request behavior. No benchmark is claimed.
-->
