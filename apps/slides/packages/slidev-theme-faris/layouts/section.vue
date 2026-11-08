<script setup lang="ts">
import FarisSlideFrame from '../components/FarisSlideFrame.vue'
</script>

<template>
  <FarisSlideFrame layout="section" :page="$page" :theme-config="$slidev.themeConfigs" :slide-config="$frontmatter.faris">
    <div class="faris-section">
      <div class="faris-section__copy">
        <div class="faris-kicker"><slot name="kicker" /></div>
        <div class="faris-section__body"><slot /></div>
      </div>
      <div class="faris-section__visual"><slot name="visual" /></div>
    </div>
  </FarisSlideFrame>
</template>
