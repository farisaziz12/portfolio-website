<script setup lang="ts">
import { computed } from 'vue'
import { parallelState } from './performance'
const props = defineProps<{ step: number }>()
const rows = computed(() => parallelState(props.step))
</script>
<template>
  <figure class="parallel-viz performance-viz" :data-step="step">
    <div class="parallel-head"><b>5,000 Users</b><span>1,000 Per Request</span></div>
    <div v-for="row in rows" :key="row.id" class="request-row" :class="{ failed: row.failed, retained: row.retained }">
      <b>Request {{ row.id }}</b><div class="request-lane"><div class="request-progress" :key="`${step}-${row.id}`" :class="{ run: row.run, waiting: step === 0 }" /><i v-if="row.failed" class="failure-mark">×</i></div>
      <span>{{ step === 0 ? 'Ready' : step === 1 ? 'Sent' : step === 2 ? (row.failed ? 'Failed' : 'Success') : row.run ? 'Retry Sent' : 'Kept Result' }}</span>
    </div>
    <div class="parallel-choice">{{ ['Five Independent Requests', 'Start Together · The UI Is Loading', 'Three Results Kept · Two Failures', 'Retry ALL Five Requests', 'Retry ONLY The Two Failed Requests'][step] }}</div>
  </figure>
</template>
<style scoped>
.parallel-viz { width: 100%; }.parallel-head { display: flex; align-items: baseline; gap: 30px; margin-bottom: 25px; }.parallel-head b { font-size: 42px; color: var(--faris-text-blue); }.parallel-head span { font-size: 24px; color: var(--faris-muted); }.request-row { display: grid; grid-template-columns: 170px 1fr 150px; gap: 25px; align-items: center; height: 63px; font-size: 22px; }.request-lane { height: 12px; position: relative; background: var(--faris-border); border-radius: 6px; }.request-progress { height: 100%; background: var(--faris-text-blue); border-radius: inherit; transform-origin: left; }.request-progress.waiting { transform: scaleX(0); }.request-progress.run { animation: request-send 650ms ease-out both; }.failed .request-progress { background: #a4510e; }.failure-mark { position: absolute; right: -6px; top: -16px; font-size: 35px; font-style: normal; color: #a4510e; background: var(--faris-bg); line-height: 40px; }.retained .request-progress { opacity: .45; }.parallel-choice { margin-top: 30px; font-size: 27px; font-weight: 650; }
.parallel-head { margin-bottom: 18px; }
.request-row { height: 52px; }
.parallel-choice { margin-top: 20px; }
@keyframes request-send { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce), print { .request-progress.run { animation: none; } }
</style>
