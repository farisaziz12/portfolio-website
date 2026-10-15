<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveIllustration, type IllustrationName } from '../lib/illustrations'

const props = defineProps<{ name: IllustrationName; alt?: string; decorative?: boolean }>()
const illustration = computed(() => resolveIllustration(props.name))
const failed = ref(false)
watch(() => props.name, () => { failed.value = false })
</script>

<template>
  <img
    v-if="illustration && !failed"
    class="faris-illustration"
    :data-illustration="name"
    :src="illustration.src"
    :alt="decorative ? '' : (alt ?? illustration.alt)"
    :aria-hidden="decorative ? true : undefined"
    :width="illustration.width"
    :height="illustration.height"
    @error="failed = true"
  />
  <span v-else class="faris-illustration__missing" role="img" :aria-label="`Unavailable illustration: ${name}`">
    Unavailable illustration: {{ name }}
  </span>
</template>

<style scoped>
.faris-illustration { display: block; width: 100%; max-width: 100%; height: auto; }
.faris-illustration__missing { display: block; color: var(--faris-fg); border: 2px dashed currentColor; padding: 12px; }
</style>
