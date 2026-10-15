<script setup lang="ts">
import NetworkIcon from './NetworkIcon.vue'
defineProps<{ direction: 'ingress' | 'egress'; step: number }>()
</script>

<template>
  <figure class="boundary-traffic performance-viz" :data-step="step" :data-direction="direction">
    <svg viewBox="0 0 1152 390" role="img" :aria-label="direction === 'ingress' ? 'Ingress: API response data enters the BFF.' : 'Egress: the shaped response leaves the BFF for the browser. Incoming API data remains visible.'">
      <rect class="system-boundary" x="426" y="35" width="300" height="320" rx="12" />
      <text class="boundary-label" x="576" y="76">Our Server</text>

      <g class="traffic-lane incoming" :class="{ active: direction === 'egress' || step >= 1, running: direction === 'ingress' && step >= 1 }">
        <path class="track" d="M218 182H518" />
        <path class="arrow" d="M506 172L518 182L506 192" />
        <text class="lane-label" x="355" y="141">Ingress</text>
        <g v-if="direction === 'ingress' && step >= 1" aria-hidden="true">
          <circle v-for="n in 3" :key="n" class="packet" cx="218" cy="182" r="6" :style="{ animationDelay: `${(n - 1) * 110}ms` }" />
        </g>
      </g>
      <g class="traffic-lane outgoing" :class="{ active: direction === 'egress' && step >= 1, running: direction === 'egress' && step >= 1 }">
        <path class="track" d="M634 182H934" />
        <path class="arrow" d="M922 172L934 182L922 192" />
        <text class="lane-label" x="797" y="141">Egress</text>
        <g v-if="direction === 'egress' && step >= 1" aria-hidden="true">
          <circle v-for="n in 3" :key="n" class="packet" cx="634" cy="182" r="6" :style="{ animationDelay: `${(n - 1) * 110}ms` }" />
        </g>
      </g>

      <g class="endpoint" data-node="api">
        <NetworkIcon name="server" x="110" y="152" width="60" height="60" />
        <text class="node-label" x="140" y="255">Upstream API</text>
        <text class="detail" x="140" y="288">Full Records</text>
      </g>
      <g class="endpoint" data-node="bff">
        <NetworkIcon name="server" x="546" y="152" width="60" height="60" />
        <text class="node-label" x="576" y="255">BFF</text>
        <text class="detail" x="576" y="288">Shape The Response</text>
      </g>
      <g class="endpoint" data-node="browser">
        <NetworkIcon name="browser" x="982" y="152" width="60" height="60" />
        <text class="node-label" x="1012" y="255">Browser</text>
        <text class="detail" x="1012" y="288">Monthly Counts</text>
      </g>
    </svg>
    <figcaption>Response Data, Viewed From The BFF</figcaption>
  </figure>
</template>

<style scoped>
.boundary-traffic { width: 100%; margin: 0; }
.boundary-traffic > svg { display: block; width: 100%; height: auto; overflow: visible; }
.boundary-traffic text { text-anchor: middle; fill: currentColor; }
.system-boundary { fill: none; stroke: var(--faris-muted); stroke-width: 2; stroke-dasharray: 7 7; }
.boundary-label { font-size: 22px; font-weight: 650; }
.endpoint { color: var(--faris-fg); }
.node-label { font-size: 28px; font-weight: 720; }
.detail { font-size: 21px; fill: var(--faris-muted) !important; }
.traffic-lane { color: var(--faris-muted); }
.lane-label { font-size: 24px; font-weight: 700; }
.track, .arrow { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.track { stroke-dasharray: 5 9; }
.incoming.active { color: var(--faris-text-blue); }
.outgoing.active { color: #896400; }
.active .track { stroke-dasharray: none; }
.running .track { animation: boundary-draw 700ms ease-out both; stroke-dasharray: 300; }
.packet { fill: currentColor; opacity: 0; animation: boundary-packet 760ms cubic-bezier(.3,.1,.35,1) both; }
.boundary-traffic figcaption { text-align: center; font-size: 21px; color: var(--faris-muted); margin-top: 8px; }
@keyframes boundary-draw { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }
@keyframes boundary-packet { 0% { opacity: 0; transform: translateX(0); } 12% { opacity: 1; } 88% { opacity: 1; } 100% { opacity: 0; transform: translateX(300px); } }
@media (prefers-reduced-motion: reduce), print {
  .running .track, .packet { animation: none; }
  .packet { display: none; }
}
</style>
