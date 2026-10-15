<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ host: 'lambda' | 'ec2'; step: number; active?: boolean }>()
const cards = computed(() => [
  { id: 'slow', label: 'Slow Client', rate: '2 Mbps', note: 'Example Connection', time: '6.32 Sec', icon: 'M5 4H23V30H5Z M11 26H17', shown: true },
  { id: 'client', label: 'Client', rate: '25 Mbps', note: 'Example Connection', time: '~506 ms', icon: 'M2 4H30V24H2Z M10 30H22 M16 24V30', shown: props.host === 'ec2' || props.step >= 1 },
  { id: props.host, label: props.host === 'lambda' ? 'AWS Lambda' : 'EC2 c5.large', rate: props.host === 'lambda' ? '625 Mbps' : '750 Mbps', note: props.host === 'lambda' ? 'Default Network Limit' : 'Baseline Network Capacity', time: props.host === 'lambda' ? '~20 ms' : '~17 ms', icon: 'M2 3H30V14H2Z M2 20H30V31H2Z M7 8H10 M7 25H10 M17 8H25 M17 25H25', shown: props.host === 'ec2' || props.step >= 2 },
])
const motionName = (id: string, shown: boolean) => shown && props.active ? `capacity-${id}` : 'none'
</script>
<template>
  <div class="capacity-viz">
    <p class="capacity-payload">The Same <strong>1.58 MB</strong> Download</p>
    <div class="capacity-cards">
      <section v-for="(card, i) in cards" :key="card.id" class="capacity-card" :class="[card.id, { shown: card.shown, fresh: card.shown && (i === 2 || (host === 'lambda' && i === step)) }]" :style="{ viewTransitionName: motionName(card.id, card.shown) }" :aria-hidden="!card.shown">
        <svg viewBox="0 0 34 34" aria-hidden="true"><path :d="card.icon" /></svg>
        <h2>{{ card.label }}</h2>
        <p class="capacity-rate">{{ card.rate }}</p>
        <p class="capacity-note">{{ card.note }}</p>
        <b class="capacity-time">{{ card.time }}</b>
        <span class="capacity-estimate">Estimated Transfer Time</span>
      </section>
    </div>
    <div class="capacity-path" :class="{ shown: host === 'ec2' || step >= 2 }">
      <span>API</span><b>1.58 MB →</b><span class="capacity-proxy">Proxy<br><small>Trim The Data</small></span><b>~300 Bytes →</b><span>Browser</span>
    </div>
  </div>
</template>
<style scoped>
.capacity-viz { width: 100%; }
.capacity-payload { margin: 0 0 20px; font-size: 25px; }
.capacity-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.capacity-card { --capacity-color: #f4ac72; visibility: hidden; padding: 22px 26px; border: 2px solid var(--faris-border); border-top: 5px solid var(--capacity-color); border-radius: 10px; }
.capacity-card.shown { visibility: visible; }
.capacity-card.client { --capacity-color: var(--faris-text-blue); }
.capacity-card.lambda, .capacity-card.ec2 { --capacity-color: var(--faris-brand-yellow); background: color-mix(in srgb, var(--faris-brand-yellow) 7%, var(--faris-bg)); }
.capacity-card svg { width: 36px; height: 36px; color: var(--capacity-color); fill: none; stroke: currentColor; stroke-width: 1.8; }
.capacity-card h2 { font-size: 29px; margin: 10px 0 14px; }
.capacity-rate { font-size: 32px; font-weight: 700; color: var(--capacity-color); margin: 0; }
.capacity-note { font-size: 18px; color: var(--faris-muted); margin: 6px 0 22px; }
.capacity-time { display: block; font-size: 50px; line-height: 1.1; color: var(--capacity-color); }
.capacity-estimate { display: block; font-size: 17px; color: var(--faris-muted); margin-top: 8px; }
.capacity-path { visibility: hidden; display: flex; justify-content: center; align-items: center; gap: 28px; margin-top: 24px; font-size: 25px; }
.capacity-path.shown { visibility: visible; }
.capacity-path b { color: var(--faris-text-blue); font-size: 23px; }
.capacity-proxy { border: 2px solid var(--faris-brand-yellow); border-radius: 8px; padding: 8px 26px; text-align: center; }
.capacity-proxy small { display: block; font-size: 17px; color: var(--faris-muted); }
@media screen and (prefers-reduced-motion: no-preference) {
  .capacity-card.fresh { animation: capacity-enter 700ms cubic-bezier(.22,.61,.36,1) both; }
}
@keyframes capacity-enter { from { opacity: 0; translate: 0 24px; } to { opacity: 1; translate: 0 0; } }
.disable-view-transition .capacity-card { view-transition-name: none !important; }
@media (prefers-reduced-motion: reduce), print { .capacity-card { view-transition-name: none !important; } }
</style>
<style>
::view-transition-new(capacity-ec2):only-child {
  animation: capacity-server-slot 760ms cubic-bezier(.45,0,.25,1) both;
}
@keyframes capacity-server-slot {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
