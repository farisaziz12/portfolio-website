<script setup lang="ts">
import NetworkIcon from './NetworkIcon.vue'
defineProps<{ step: number }>()
</script>
<template>
  <figure class="cache-viz performance-viz" :data-step="step">
    <div class="cache-nodes"><div><NetworkIcon name="browser" /><b>UI</b></div><div :class="{ focus: step >= 2 }"><NetworkIcon name="cache" /><b>Query Cache</b><small>{{ step >= 3 ? 'Stale Result Available' : step >= 2 ? 'Fresh Result Available' : 'No Matching Result' }}</small></div><div><NetworkIcon name="server" /><b>BFF / API</b></div></div>
    <div class="cache-paths">
      <div class="cache-long" :class="{ visible: step >= 1, quiet: step >= 2 }"><span>Miss: Fetch, Then Store</span><div :key="`miss-${step}`" class="cache-line" :class="{ draw: step === 1 }" /></div>
      <div class="cache-short" :class="{ visible: step >= 2 }"><span>Fresh Hit: Reuse</span><div :key="`hit-${step}`" class="cache-line" :class="{ draw: step === 2 }" /></div>
      <div class="cache-refetch" :class="{ visible: step >= 3 }"><span>Stale Data Can Stay Visible During A Refetch</span><div :key="`stale-${step}`" class="cache-line" :class="{ draw: step === 3 }" /></div>
    </div>
    <p>Cache The <strong>Optimized Payload</strong> With A <strong>Strategy That Fits</strong></p>
  </figure>
</template>
<style scoped>
.cache-viz { width: 100%; }.cache-nodes { display: grid; grid-template-columns: repeat(3,1fr); text-align: center; }.cache-nodes>div { display: flex; flex-direction: column; align-items: center; gap: 12px; }.cache-nodes svg { width: 66px; height: 66px; color: var(--faris-text-blue); }.cache-nodes b { font-size: 29px; }.cache-nodes small { font-size: 18px; color: var(--faris-muted); }.cache-nodes .focus svg { background: #faeab4; color: #856000; border-radius: 5px; }
.cache-paths { margin: 30px 16.666%; height: 190px; position: relative; }.cache-paths>div { opacity: 0; position: absolute; transition: opacity 260ms ease; }.cache-paths .visible { opacity: 1; }.cache-paths .quiet { opacity: .38; }.cache-paths span { display: block; font-size: 20px; margin-bottom: 8px; }.cache-long { top: 0; width: 100%; }.cache-short { top: 65px; width: 50%; }.cache-refetch { top: 130px; width: 100%; }.cache-line { border-top: 4px solid var(--faris-text-blue); transform-origin: left; position: relative; }.cache-short .cache-line { border-color: #856000; transform-origin: right; }.cache-refetch .cache-line { border-top-style: dashed; }.cache-line:after { content: '→'; position: absolute; font-size: 27px; top: -23px; right: -4px; color: var(--faris-text-blue); }.cache-short .cache-line:after { content: '←'; left: -4px; right: auto; color: #856000; }.cache-line.draw { animation: cache-draw 620ms ease both; }.cache-viz p { font-size: 26px; margin: 20px 0 0; }
@keyframes cache-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce), print { .cache-paths>div { transition: none; }.cache-line.draw { animation: none; } }
</style>
