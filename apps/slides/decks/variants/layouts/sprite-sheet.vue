<script setup lang="ts">
import FarisSlideFrame from '../../../packages/slidev-theme-faris/components/FarisSlideFrame.vue'
import FarisIllustration from '../../../packages/slidev-theme-faris/components/FarisIllustration.vue'
const sprites = ['faris-speaking', 'faris-thinking', 'duck-curious', 'duck-celebrating'] as const
</script>

<template>
  <FarisSlideFrame layout="section" :page="$page" :theme-config="$slidev.themeConfigs" :slide-config="$frontmatter.faris">
    <div class="sprite-sheet">
      <header><h1>Character poses</h1><p>Approved likenesses · Cleaned, reusable PNG sprites</p></header>
      <div class="sprite-sheet__poses">
        <figure v-for="name in sprites" :key="name">
          <div><FarisIllustration :name="name" /></div>
          <figcaption>{{ name }}</figcaption>
        </figure>
      </div>
      <p class="sprite-sheet__note">Both avatars retain the official ZurichJS chest mark</p>
    </div>
  </FarisSlideFrame>
</template>

<style scoped>
.sprite-sheet { height: 100%; display: grid; grid-template-rows: auto 1fr auto; padding-bottom: 64px; }
.sprite-sheet h1 { font-size: 56px; }
.sprite-sheet header p { font-size: 22px; margin-top: 16px; }
.sprite-sheet__poses { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; align-items: center; }
.sprite-sheet figure { margin: 0; min-width: 0; }
.sprite-sheet figure > div { height: 310px; display: flex; align-items: end; }
.sprite-sheet figcaption { margin-top: 24px; font-size: 18px; color: var(--faris-fg); text-align: center; }
.sprite-sheet .sprite-sheet__note { font-size: 18px; }
</style>
