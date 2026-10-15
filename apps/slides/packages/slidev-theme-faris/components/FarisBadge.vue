<script setup lang="ts">
import badgeUrl from '../assets/brand/original-badge.png'

withDefaults(defineProps<{
  alt?: string
}>(), {
  alt: 'Faris Aziz illustrated badge',
})
</script>

<template>
  <img class="faris-badge" :src="badgeUrl" :alt="alt">
</template>
