<script setup lang="ts">
/**
 * Visible draft placeholder for a number or chart that is not sourced yet.
 * `id` matches the gap key in outline.md and sources.md. Remove every
 * DataGap before the deck is presented.
 */
defineProps<{
  id: string
  label: string
  chart?: boolean
}>()
</script>

<template>
  <span class="conf-gap" :class="{ 'conf-gap--chart': chart }">
    <span class="conf-gap__id">{{ id }}</span>
    <span class="conf-gap__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.conf-gap {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  padding: 6px 16px;
  border: 3px dashed var(--faris-brand-orange);
  border-radius: 10px;
  font-size: 0.6em;
  line-height: 1.2;
  vertical-align: middle;
  letter-spacing: normal;
  font-weight: 600;
}
.conf-gap--chart {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  width: 100%;
  font-size: 28px;
}
.conf-gap__id { font-weight: 800; color: var(--faris-brand-orange); letter-spacing: 0.04em; }
.conf-gap__label { color: var(--faris-fg); font-weight: 600; }
</style>
