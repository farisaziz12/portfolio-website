<script setup lang="ts">
defineProps<{ poster: string; title: string }>()
</script>

<template>
  <figure class="payment-demo">
    <img :src="poster" :alt="`${title}: still from the original recording`">
    <figcaption><strong>Video demo placeholder</strong><span>{{ title }}</span></figcaption>
  </figure>
</template>
