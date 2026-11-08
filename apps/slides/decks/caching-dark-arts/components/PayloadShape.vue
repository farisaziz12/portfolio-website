<script setup lang="ts">
defineProps<{ step: number }>()
// Illustrative variation, not measured birthday frequencies.
const monthHeights = [58, 71, 82, 65, 76, 60, 87, 73, 68, 80, 63, 75]
</script>
<template>
  <figure class="payload-viz performance-viz" :data-step="step">
    <div class="payload-records"><h2>Full User Records</h2><div class="record-stack" :class="{ collapsed: step >= 1 }"><div v-for="n in 8" :key="n" class="record" :style="{ '--i': n }"><span>ID</span><span>Name</span><span class="birthday">Birthday</span><span>…</span></div></div><p>5,000 Records</p></div>
    <div class="payload-arrow" :class="{ active: step >= 1 }">→<small>Group By Month</small></div>
    <div class="payload-result" :class="{ shown: step >= 1 }"><h2>Birthday Counts</h2><div class="month-chart"><i v-for="(height, i) in monthHeights" :key="i" :style="{ height: `${height}%`, '--i': i + 1 }" /></div><p>12 Monthly Counts</p><div v-if="step >= 2" class="payload-response"><b>Small Response</b><span>Counts + Total → Browser</span></div></div>
  </figure>
</template>
<style scoped>
.payload-viz { display: grid; grid-template-columns: 1fr 190px 1fr; gap: 28px; width: 100%; min-height: 370px; align-items: start; }.payload-viz h2 { font-size: 27px; margin: 0 0 25px; }.payload-viz p { font-size: 24px; margin-top: 20px; }
.record-stack { position: relative; height: 225px; }.record { position: absolute; top: calc((var(--i) - 1) * 25px); left: calc((var(--i) - 1) * 4px); width: 315px; height: 46px; border: 1px solid var(--faris-border); border-radius: 4px; background: var(--faris-bg); display: flex; gap: 20px; align-items: center; padding: 10px 14px; font-size: 16px; transition: opacity 360ms ease, transform 480ms ease; }.birthday { color: var(--faris-text-blue); font-weight: 650; }.collapsed .record { transform: translateY(calc((8 - var(--i)) * 9px)); opacity: .3; }.collapsed .record:last-child { opacity: 1; }
.payload-arrow { font-size: 66px; text-align: center; color: var(--faris-muted); padding-top: 110px; }.payload-arrow.active { color: var(--faris-text-blue); }.payload-arrow small { display: block; font-size: 20px; }
.payload-result { opacity: .15; transition: opacity 320ms ease; }.payload-result.shown { opacity: 1; }.month-chart { display: flex; gap: 9px; height: 225px; align-items: end; border-bottom: 2px solid var(--faris-border); }.month-chart i { flex: 1; background: var(--faris-text-blue); transform: scaleY(0); transform-origin: bottom; transition: transform 500ms ease; transition-delay: calc(var(--i) * 18ms); }.shown .month-chart i { transform: scaleY(1); }.payload-response { border-left: 4px solid var(--faris-brand-yellow); padding-left: 18px; animation: payload-arrive 420ms ease both; }.payload-response b { display: block; font-size: 27px; }.payload-response span { font-size: 20px; color: var(--faris-muted); }
@keyframes payload-arrive { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce), print { .record,.payload-result,.month-chart i { transition: none; }.payload-response { animation: none; } }
</style>
