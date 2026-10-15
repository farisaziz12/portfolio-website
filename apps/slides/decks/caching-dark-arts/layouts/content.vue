<script setup lang="ts">
import FarisSlideFrame from '../../../packages/slidev-theme-faris/components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame class="caching-content" layout="content" :page="$page" :theme-config="$slidev.themeConfigs" :slide-config="$frontmatter.faris">
    <div class="caching-content__grid">
      <header class="caching-content__title"><slot name="title" /></header>
      <section class="caching-content__body"><slot /></section>
      <footer v-if="$slots.caption" class="caching-caption"><slot name="caption" /></footer>
    </div>
  </FarisSlideFrame>
</template>
