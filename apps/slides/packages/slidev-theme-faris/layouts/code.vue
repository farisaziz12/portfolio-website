<script setup lang="ts">
import FarisSlideFrame from '../components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame
    layout="code"
    :page="$page"
    :theme-config="$slidev.themeConfigs"
    :slide-config="$frontmatter.faris"
  >
    <div class="faris-code">
      <header class="faris-code__header">
        <div class="faris-kicker">
          <slot name="kicker" />
        </div>
        <div class="faris-code__title">
          <slot name="title" />
        </div>
      </header>

      <div class="faris-code__sample">
        <slot />
      </div>

      <div class="faris-annotation faris-code__annotation">
        <slot name="annotation" />
      </div>
    </div>
  </FarisSlideFrame>
</template>
