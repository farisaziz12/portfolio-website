<script setup lang="ts">
import { computed } from 'vue'
import { resolveFarisConfig, type FarisSlideConfig } from '../lib/config'

const props = defineProps<{
  layout: 'cover' | 'statement' | 'code' | 'section' | 'content'
  page: number
  themeConfig?: Record<string, unknown>
  slideConfig?: FarisSlideConfig
}>()

const config = computed(() => resolveFarisConfig(
  props.themeConfig,
  props.slideConfig,
  props.page,
))
const pageLabel = computed(() => String(props.page).padStart(2, '0'))
</script>

<template>
  <div
    class="slidev-layout faris-slide"
    :class="`faris-slide--${layout}`"
    :data-faris-mode="config.mode"
    :data-faris-background="config.background"
    :data-faris-cover="layout === 'cover' ? config.coverVariant : undefined"
  >
    <div class="faris-slide__accent" aria-hidden="true" />

    <main class="faris-slide__content">
      <slot />
    </main>

    <footer v-if="layout !== 'cover'" class="faris-slide__footer" aria-label="Slide information">
      <a href="https://faziz-dev.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-transform: none; text-decoration: none">faziz-dev.com</a>
      <span aria-hidden="true">{{ pageLabel }}</span>
    </footer>
  </div>
</template>
