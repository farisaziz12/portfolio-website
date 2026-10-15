<script setup lang="ts">
import FarisSlideFrame from '../components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame
    layout="cover"
    :page="$page"
    :theme-config="$slidev.themeConfigs"
    :slide-config="$frontmatter.faris"
  >
    <div class="faris-cover">
      <div class="faris-cover__copy">
        <div class="faris-cover__body">
          <slot />
        </div>
        <div class="faris-cover__meta">
          <slot name="meta" />
        </div>
      </div>

      <div class="faris-cover__visual">
        <slot name="visual" />
      </div>
    </div>
  </FarisSlideFrame>
</template>
