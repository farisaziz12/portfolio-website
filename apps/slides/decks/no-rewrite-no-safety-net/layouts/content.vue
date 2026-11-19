<script setup lang="ts">
import FarisSlideFrame from '../../../packages/slidev-theme-faris/components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame class="nr-content" layout="content" :page="$page" :theme-config="$slidev.themeConfigs" :slide-config="$frontmatter.faris">
    <div class="nr-content__grid">
      <header class="nr-content__title">
        <div class="faris-kicker"><slot name="kicker" /></div>
        <slot name="title" />
      </header>
      <section class="nr-content__body"><slot /></section>
      <div class="nr-caption"><slot name="caption" /></div>
    </div>
  </FarisSlideFrame>
</template>
