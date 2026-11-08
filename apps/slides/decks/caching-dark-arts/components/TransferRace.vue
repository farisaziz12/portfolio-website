<script setup lang="ts">
import { computed } from 'vue'
import { transfer, rates, networkNames } from './performance'
import NetworkIcon from './NetworkIcon.vue'
const props = defineProps<{ bytes: number; stage: number; step: number; active?: boolean }>()
const motionName = (index: number) => props.active ? `transfer-${props.bytes}-${index}` : 'none'
const rows = computed(() => rates.slice(0, props.stage).map((rate, i) => ({ rate, name: networkNames[i], ...transfer(props.bytes, rate) })))
const times = computed(() => props.bytes > 300 ? ['~340 ms', '~700 ms', '~6,500 ms'] : ['~200–210 ms', '~200–210 ms', '~200–210 ms'])
</script>
<template>
  <figure class="transfer-viz performance-viz" :data-step="step">
    <div class="transfer-heading"><b>{{ bytes > 300 ? '1.58 MB' : '300 Bytes' }}</b><span>The Same Payload On Every Connection</span></div>
    <div v-for="(row, i) in rows" :key="row.name" class="transfer-row" :style="{ viewTransitionName: motionName(i) }">
      <div class="transfer-network"><NetworkIcon :name="i === 0 ? 'router' : 'tower'" /><div><b>{{ row.name }}</b><small>~{{ row.rate }} Mbps</small></div></div>
      <div class="transfer-track"><div class="transfer-fill" :key="`${bytes}-${stage}-${step}-${i}`" :class="{ animate: step > 0, empty: step === 0 && i === stage - 1 }" :style="{ animationDuration: `${row.fillAnimationMs}ms`, animationDelay: `${row.waitAnimationMs}ms` }" /></div>
      <div class="transfer-time">{{ times[i] }}<small>Total Time In This Model</small></div>
    </div>
    <div class="transfer-note">200 ms Fixed Cost + Payload Transfer</div>
    <div class="transfer-detail">Estimated Download Time At A Steady Speed</div>
  </figure>
</template>
<style scoped>
.transfer-viz { width: 100%; }
.transfer-heading { display: flex; align-items: baseline; gap: 30px; margin-bottom: 32px; }.transfer-heading b { font-size: 52px; color: var(--faris-text-blue); letter-spacing: -2px; }.transfer-heading span { font-size: 23px; color: var(--faris-muted); }
.transfer-row { display: grid; grid-template-columns: 220px 1fr 230px; gap: 30px; align-items: center; height: 91px; }
.transfer-network { display: flex; align-items: center; gap: 20px; }.transfer-network svg { width: 42px; height: 42px; color: var(--faris-text-blue); }.transfer-network b { font-size: 27px; }small { display: block; font-size: 17px; color: var(--faris-muted); }
.transfer-track { height: 34px; border: 1.5px solid var(--faris-border); border-radius: 3px; overflow: hidden; background: color-mix(in srgb, var(--faris-border) 22%, transparent); }
.transfer-fill { height: 100%; background: var(--faris-text-blue); transform-origin: left; transform: scaleX(1); }.transfer-fill.empty { transform: scaleX(0); }.transfer-fill.animate { animation: transfer-fill linear both; }
.transfer-time { font-size: 30px; font-weight: 650; }.transfer-time small { font-weight: 450; margin-top: 5px; }
.transfer-note { font-size: 24px; margin-top: 32px; }.transfer-detail { font-size: 17px; color: var(--faris-muted); margin-top: 10px; }
.transfer-heading { margin-bottom: 18px; }
.transfer-row { height: 76px; }
.transfer-note { margin-top: 20px; }
@keyframes transfer-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce), print { .transfer-fill.animate { animation: none; } }
.disable-view-transition .transfer-row { view-transition-name: none !important; }
@media (prefers-reduced-motion: reduce), print { .transfer-row { view-transition-name: none !important; } }
</style>
<style>
::view-transition-new(transfer-1580000-1):only-child,
::view-transition-new(transfer-1580000-2):only-child,
::view-transition-new(transfer-300-1):only-child,
::view-transition-new(transfer-300-2):only-child {
  animation: transfer-row-slot 760ms cubic-bezier(.45,0,.25,1) both;
}
@keyframes transfer-row-slot {
  from { opacity: 0; transform: translateY(35px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
