<script setup lang="ts">
import FarisSlideFrame from '../../../packages/slidev-theme-faris/components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame class="payments-content" layout="content" :page="$page" :theme-config="$slidev.themeConfigs" :slide-config="$frontmatter.faris">
    <div class="payments-content__grid">
      <header class="payments-content__title"><slot name="title" /></header>
      <section class="payments-content__body"><slot /></section>
      <div class="payments-caption"><slot name="caption" /></div>
    </div>
  </FarisSlideFrame>
</template>
