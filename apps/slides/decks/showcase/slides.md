---
theme: faris
title: Faris Slides · First visual checkpoint
author: Faris Aziz
info: |
  Paired light and dark examples for the first Faris Slides review.
mdc: true
aspectRatio: 16/9
canvasWidth: 1280
transition: fade
fonts:
  provider: none
themeConfig:
  farisMode: auto
  farisBackground: none
layout: cover
faris:
  mode: light
  background: arc
---

# Modern frontend architecture

Patterns that survive production.

::meta::
Faris Aziz · Staff Software Engineer

::visual::
<FarisBadge />

---
layout: cover
faris:
  mode: dark
  background: arc
---

# Modern frontend architecture

Patterns that survive production.

::meta::
Faris Aziz · Staff Software Engineer

::visual::
<FarisBadge />

---
layout: statement
faris:
  mode: light
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

---
layout: code
faris:
  mode: dark
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
