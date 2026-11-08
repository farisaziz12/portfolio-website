<script setup lang="ts">
import { computed } from 'vue'

/**
 * Small deck-local SVG bar chart. Real DOM text, no chart library.
 * Bars named in `highlight` use the brand blue; the rest stay neutral.
 */
const props = defineProps<{
  bars: { label: string; value: number; display?: string }[]
  highlight?: string[]
  highlightIndex?: number[]
  label: string
}>()

const width = 1000
const height = 380
const top = 44
const bottom = 48
const gap = 18

const layout = computed(() => {
  const max = Math.max(...props.bars.map(bar => bar.value), 1)
  const slot = width / props.bars.length
  const barWidth = slot - gap
  const plot = height - top - bottom
  return props.bars.map((bar, index) => {
    const h = (bar.value / max) * plot
    return {
      ...bar,
      x: index * slot + gap / 2,
      y: top + plot - h,
      w: barWidth,
      h,
      center: index * slot + slot / 2,
      strong: props.highlight?.includes(bar.label) || props.highlightIndex?.includes(index) || false,
    }
  })
})
</script>

<template>
  <svg class="conf-bar-chart" :viewBox="`0 0 ${width} ${height}`" role="img" :aria-label="label">
    <g v-for="(bar, index) in layout" :key="index">
      <rect
        :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h" rx="6"
        :class="bar.strong ? 'conf-bar-chart__bar--strong' : 'conf-bar-chart__bar'"
      />
      <text :x="bar.center" :y="bar.y - 12" text-anchor="middle" class="conf-bar-chart__value" :class="{ 'is-strong': bar.strong }">
        {{ bar.display ?? bar.value }}
      </text>
      <text :x="bar.center" :y="height - 14" text-anchor="middle" class="conf-bar-chart__label">
        {{ bar.label }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.conf-bar-chart { width: 100%; height: auto; max-height: 360px; display: block; }
.conf-bar-chart__bar { fill: var(--faris-border); }
.conf-bar-chart__bar--strong { fill: var(--faris-brand-blue); }
.conf-bar-chart__value { fill: var(--faris-muted); font-size: 24px; font-weight: 650; font-family: var(--faris-font-body); }
.conf-bar-chart__value.is-strong { fill: var(--faris-text-blue); font-weight: 800; }
.conf-bar-chart__label { fill: var(--faris-fg); font-size: 24px; font-family: var(--faris-font-body); }
</style>
