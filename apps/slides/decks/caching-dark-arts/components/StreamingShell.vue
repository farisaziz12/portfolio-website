<script setup lang="ts">
defineProps<{ step: number; prerender?: boolean }>()
</script>
<template>
  <div class="stream-demo" :data-step="step">
    <div class="stream-server">
      <span class="stream-label">{{ prerender ? (step ? 'At Request Time' : 'Before The Request') : 'Server Component' }}</span>
      <h2>{{ prerender ? (step ? 'Fetch Dynamic Data' : 'Prepare The Shell') : 'Start The Fetch' }}</h2>
      <p>{{ prerender ? (step ? 'Reuse The Prepared Shell' : 'Prerender The Shared UI') : 'Let The Page Continue' }}</p>
      <div class="stream-job" :class="{ done: step >= 2 }"><span>Birthday Counts</span><b>{{ step >= 2 ? 'Ready' : prerender && !step ? 'At Request Time' : 'Fetching…' }}</b></div>
      <div class="stream-job" :class="{ done: step >= 3 }"><span>Recent Activity</span><b>{{ step >= 3 ? 'Ready' : prerender && !step ? 'At Request Time' : 'Fetching…' }}</b></div>
      <p class="stream-small">{{ prerender ? 'Dynamic Data Loads At Request Time' : 'Read The Promise Inside Suspense' }}</p>
    </div>
    <div class="stream-bridge" aria-hidden="true"><span :class="{ sent: step >= 1 }">Shell →</span><span :class="{ sent: step >= 2 }">Chart →</span><span :class="{ sent: step >= 3 }">Activity →</span></div>
    <div class="stream-browser" :class="{ visible: step >= 1 || prerender }">
      <div class="stream-browser-bar"><i /><i /><i /><span>Birthday Dashboard</span></div>
      <nav><b>Birthdays</b><span>Overview · Settings</span></nav>
      <p class="stream-status">{{ step >= 1 ? 'Shell Visible · Ready UI Can Hydrate' : prerender ? 'Prerendered Shell + Loading UI' : 'Waiting For The Shell' }}</p>
      <div class="stream-slot" :class="{ ready: step >= 2 }">
        <div v-if="step < 2" class="stream-placeholder">Loading Chart…</div>
        <div v-else class="stream-chart"><i v-for="(height, i) in [45, 68, 55, 82, 64, 90, 73, 61]" :key="i" :style="{ height: `${height}%` }" /></div>
      </div>
      <div class="stream-slot stream-activity" :class="{ ready: step >= 3 }">
        <span v-if="step < 3" class="stream-placeholder">Loading Activity…</span>
        <span v-else>Recent Activity Is Ready</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.stream-demo { display: grid; grid-template-columns: 360px 130px 1fr; gap: 25px; width: 100%; align-items: center; }
.stream-server { border: 2px solid var(--faris-brand-yellow); border-radius: 12px; padding: 24px; }
.stream-label { color: var(--faris-brand-yellow); font-size: 17px; }
h2 { font-size: 28px; margin: 14px 0; }
p { font-size: 22px; margin: 16px 0 24px; }
.stream-job { border-top: 1px solid var(--faris-border); padding: 18px 0; font-size: 20px; }
.stream-job b { display: block; margin-top: 7px; color: var(--faris-muted); }
.stream-job.done b { color: var(--faris-text-blue); }
.stream-small { color: var(--faris-muted); font-size: 18px; margin-bottom: 0; }
.stream-bridge { display: grid; gap: 40px; font-size: 21px; color: var(--faris-text-blue); }
.stream-bridge span { opacity: .15; transform: translateX(-16px); transition: opacity 650ms ease, transform 650ms ease; }
.stream-bridge .sent { opacity: 1; transform: translateX(0); }
.stream-browser { border: 2px solid var(--faris-border); border-radius: 12px; overflow: hidden; opacity: .15; transition: opacity 650ms ease; }
.stream-browser.visible { opacity: 1; }
.stream-browser-bar { display: flex; gap: 7px; padding: 14px 18px; border-bottom: 1px solid var(--faris-border); font-size: 16px; color: var(--faris-muted); }
.stream-browser-bar i { width: 9px; height: 9px; border-radius: 50%; background: var(--faris-muted); margin-top: 5px; }
.stream-browser-bar span { margin-left: 12px; }
nav { display: flex; justify-content: space-between; padding: 22px 20px 6px; gap: 15px; font-size: 22px; }
nav span { font-size: 17px; color: var(--faris-muted); }
.stream-status { font-size: 17px; color: var(--faris-text-blue); margin: 14px 20px; }
.stream-slot { margin: 20px; border: 2px dashed var(--faris-border); border-radius: 6px; height: 150px; display: grid; place-items: center; }
.stream-slot.ready { border-style: solid; border-color: var(--faris-text-blue); }
.stream-placeholder { color: var(--faris-muted); font-size: 20px; }
.stream-chart { display: flex; align-items: end; gap: 14px; width: 90%; height: 120px; animation: stream-arrive 700ms ease both; }
.stream-chart i { flex: 1; background: var(--faris-text-blue); }
.stream-activity { height: 70px; font-size: 21px; }
.stream-activity.ready span { animation: stream-arrive 700ms ease both; }
@keyframes stream-arrive { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce), print { *, *::before { animation: none !important; transition: none !important; } }
</style>
