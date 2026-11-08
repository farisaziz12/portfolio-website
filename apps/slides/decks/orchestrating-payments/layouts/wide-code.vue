<script setup lang="ts">
import FarisSlideFrame from '../../../packages/slidev-theme-faris/components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame class="payments-wide-code" layout="code" :page="$page" :theme-config="$slidev.themeConfigs" :slide-config="$frontmatter.faris">
    <div class="payments-content__grid">
      <header class="payments-content__title"><slot name="title" /></header>
      <div class="faris-code__sample"><slot /></div>
      <div class="payments-caption">Illustrative code · application interfaces omitted</div>
    </div>
  </FarisSlideFrame>
</template>
