<script setup lang="ts">
defineProps<{ step: number }>()
</script>
<template>
  <figure class="prefetch-viz performance-viz" :data-step="step">
    <div class="timeline-axis"><b>Navigation</b><span>Elapsed Time</span></div>
    <div class="timeline-row">
      <b>Client Fetch</b>
      <div class="timeline-track" :class="{ complete: step >= 1 }">
        <div class="segment server" style="left:0;width:18%">Server</div>
        <div class="segment" style="left:18%;width:14%">HTML</div>
        <div class="segment" style="left:32%;width:20%">Hydrate</div>
        <div class="segment fetch" style="left:52%;width:32%" :class="{ fill: step >= 1 }">Fetch Data</div>
        <span class="first-byte" style="left:18%">First Byte</span>
        <span v-if="step >= 1" class="chart-ready">Chart<br>Ready</span>
      </div>
    </div>
    <div class="timeline-row" :class="{ muted: step < 2 }">
      <b>Server Prefetch</b>
      <div class="timeline-track" :class="{ complete: step >= 3 }">
        <div class="segment server fetch" style="left:0;width:50%" :class="{ fill: step >= 2 }">Server + Fetch Data</div>
        <div class="segment" style="left:50%;width:14%">HTML</div>
        <div class="segment" style="left:64%;width:20%">Hydrate</div>
        <span class="first-byte" style="left:50%">First Byte</span>
        <span v-if="step >= 3" class="chart-ready">Chart<br>Ready</span>
      </div>
    </div>
    <p class="timeline-takeaway" :class="{ revealed: step >= 3 }">No Extra Client Fetch While The Hydrated Data Is Fresh</p>
    <figcaption>Both Start After Navigation. Server Work Can Delay The First Byte.</figcaption>
  </figure>
</template>
<style scoped>
.prefetch-viz { width: 100%; margin: 0; }
.timeline-axis { margin-left: 230px; display: flex; justify-content: space-between; font-size: 21px; color: var(--faris-muted); margin-bottom: 24px; border-bottom: 1px solid var(--faris-border); padding-bottom: 12px; }
.timeline-axis b { color: var(--faris-brand-yellow); }
.timeline-row { display: grid; grid-template-columns: 210px 1fr; gap: 20px; align-items: start; height: 132px; }
.timeline-row > b { font-size: 25px; padding-top: 8px; }
.timeline-track { position: relative; height: 98px; border-left: 2px solid var(--faris-brand-yellow); }
.segment { position: absolute; top: 0; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 1px solid var(--faris-border); }
.server { border-color: var(--faris-brand-yellow); }
.fetch { overflow: hidden; isolation: isolate; }
.fetch::before { content: ''; position: absolute; inset: 0; background: #17688f; z-index: -1; transform: scaleX(0); transform-origin: left; transition: transform 760ms ease-in-out; }
.fetch.fill::before { transform: scaleX(1); }
.first-byte { position: absolute; top: 56px; font-size: 18px; color: var(--faris-brand-yellow); border-left: 1px dashed currentColor; padding: 4px 0 0 8px; }
.chart-ready { position: absolute; top: 0; left: 87%; font-size: 21px; line-height: 1.2; color: var(--faris-brand-yellow); animation: prefetch-ready 280ms ease both; }
.complete .segment:not(.fetch) { background: color-mix(in srgb, var(--faris-text-blue) 12%, transparent); }
.muted { opacity: .24; }
.timeline-takeaway { font-size: 26px; margin: 5px 0 18px; visibility: hidden; }
.timeline-takeaway.revealed { visibility: visible; }
.prefetch-viz figcaption { font-size: 20px; color: var(--faris-muted); }
@keyframes prefetch-ready { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce), print { .fetch::before { transition: none; }.chart-ready { animation: none; } }
</style>
