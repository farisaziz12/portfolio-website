<script setup lang="ts">
import FarisSlideFrame from '../../../packages/slidev-theme-faris/components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame class="seniority-media" layout="content" :page="$page" :theme-config="$slidev.themeConfigs" :slide-config="$frontmatter.faris">
    <figure class="seniority-media__figure"><slot /></figure>
  </FarisSlideFrame>
</template>
