<script setup lang="ts">
import { computed } from 'vue'
import { latencyState } from './performance'
import NetworkIcon from './NetworkIcon.vue'
const props = defineProps<{ stage: number; step: number }>()
const rows = computed(() => latencyState(props.stage, props.step))
</script>
<template>
  <figure class="latency-viz performance-viz" :data-step="step">
    <div class="latency-head"><span>Connection</span><span>Request / Response</span><span>Round Trip Time (ms)</span></div>
    <div v-for="(row, i) in rows" :key="row.name" class="latency-row" :class="{ stressed: row.stress }">
      <div class="network-label"><NetworkIcon :name="row.icon" /><div><b>{{ row.name }}</b><small>{{ row.stress ? 'Slow Connection Example' : row.context }}</small></div></div>
      <div class="journey"><i class="endpoint" /><div class="journey-wire" /><NetworkIcon name="server" class="server-icon" />
        <i v-if="row.run" :key="`${stage}-${step}-${i}`" class="roundtrip" :style="{ animationDuration: `${row.duration}ms` }" />
      </div>
      <div class="rtt-chart"><div class="rtt-grid" /><i class="rtt-range" :style="{ left: `${row.low / 2}%`, width: `${(row.high - row.low) / 2}%` }" /><span class="rtt-value">{{ row.low }}–{{ row.high }} ms</span></div>
    </div>
    <div class="latency-axis"><span v-for="tick in [0, 50, 100, 150, 200]" :key="tick">{{ tick }}</span></div>
    <div class="performance-key"><span class="request-key">● Request</span><span class="response-key">● Response</span><span>Motion Slowed For Visibility</span></div>
  </figure>
</template>
<style scoped>
.latency-viz { width: 100%; align-self: stretch; padding-top: 12px; }
.latency-head, .latency-row { display: grid; grid-template-columns: 300px 230px 1fr; gap: 24px; }
.latency-head { font-size: 18px; color: var(--faris-muted); padding-bottom: 16px; }
.latency-row { height: 70px; align-items: center; }
.network-label { display: flex; gap: 18px; align-items: center; }
.network-label svg { width: 44px; height: 44px; color: var(--faris-text-blue); flex-shrink: 0; }
b { font-size: 27px; } small { display: block; font-size: 16px; color: var(--faris-muted); margin-top: 3px; }
.journey { position: relative; height: 42px; margin-right: 20px; }
.journey-wire { position: absolute; height: 2px; background: var(--faris-border); top: 20px; left: 0; right: 0; }
.endpoint { position: absolute; left: -3px; top: 17px; width: 8px; height: 8px; border-radius: 50%; background: var(--faris-text-blue); }
.server-icon { position: absolute; right: -22px; top: 4px; width: 32px; height: 32px; background: var(--faris-bg); color: var(--faris-muted); }
.roundtrip { position: absolute; top: 15px; width: 12px; height: 12px; border: 1px solid var(--faris-fg); border-radius: 50%; left: 0; background: var(--faris-brand-yellow); animation: latency-trip linear both; }
@keyframes latency-trip { 0% { left: 0; background: var(--faris-text-blue); } 49% { left: calc(100% - 18px); background: var(--faris-text-blue); } 50% { left: calc(100% - 18px); background: var(--faris-brand-yellow); } 100% { left: 0; background: var(--faris-brand-yellow); } }
.rtt-chart { position: relative; height: 48px; margin-right: 128px; }
.rtt-grid { position: absolute; inset: 0; border-left: 1px solid var(--faris-border); border-right: 1px solid var(--faris-border); background: repeating-linear-gradient(to right, transparent 0, transparent calc(25% - 1px), var(--faris-border) calc(25% - 1px), var(--faris-border) 25%); opacity: .7; }
.rtt-range { position: absolute; height: 14px; top: 17px; background: var(--faris-text-blue); min-width: 2px; border-radius: 3px; transition: left 360ms ease, width 360ms ease; }
.rtt-value { position: absolute; left: calc(100% + 14px); top: 10px; width: 115px; font-size: 23px; font-weight: 650; white-space: nowrap; }
.stressed .rtt-range { background: #a4510e; }
.latency-axis { margin-left: 578px; margin-right: 128px; display: flex; justify-content: space-between; font-size: 16px; color: var(--faris-muted); }
.performance-key { display: flex; gap: 30px; font-size: 17px; margin-top: 20px; color: var(--faris-muted); }
.request-key { color: var(--faris-text-blue); }.response-key { color: #806000; }
@media (prefers-reduced-motion: reduce), print { .roundtrip { animation: none; } .rtt-range { transition: none; } }
</style>
