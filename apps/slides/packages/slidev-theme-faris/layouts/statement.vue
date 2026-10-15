<script setup lang="ts">
import FarisSlideFrame from '../components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame
    layout="statement"
    :page="$page"
    :theme-config="$slidev.themeConfigs"
    :slide-config="$frontmatter.faris"
  >
    <div class="faris-statement">
      <div class="faris-kicker">
        <slot name="kicker" />
      </div>
      <div class="faris-statement__body">
        <slot />
      </div>
      <div class="faris-annotation">
        <slot name="annotation" />
      </div>
    </div>
  </FarisSlideFrame>
</template>
