<script setup lang="ts">
import { computed, useId } from 'vue'
import { architecture, clicks, type Variant } from './architecture'
const props = withDefaults(defineProps<{ variant?: Variant; step?: number }>(), { variant: 'client' })
const model = computed(() => architecture(props.variant, props.step ?? clicks[props.variant]))
const id = `architecture-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
const roles = ['client', 'server', 'api', 'risk'] as const
const icons: Record<string, string> = {
  window: 'M2 3H26V23H2Z M2 9H26 M10 27H18 M14 23V27',
  server: 'M2 2H26V12H2Z M2 18H26V28H2Z M7 7H9 M7 23H9 M15 7H22 M15 23H22',
  clock: 'M14 2A12 12 0 1 0 14 26A12 12 0 1 0 14 2 M14 7V14L20 18',
  map: 'M8 3H2V25H8 M20 3H26V25H20 M9 14H20 M15 9L20 14L15 19',
  cache: 'M3 4H25V26H3Z M7 9H21 M7 15H17 M7 21H21',
  check: 'M2 3H26V25H2Z M2 9H26 M7 17L12 22L22 13',
  retry: 'M24 9A11 11 0 1 0 25 20 M24 2V10H16',
}
</script>

<template>
  <figure class="architecture-flow" :class="{ 'fresh-cache-demo': variant === 'query' && step === 4 }" :data-variant="variant" :data-step="step ?? clicks[variant]">
    <div class="architecture-legend" aria-label="Diagram Legend">
      <span class="client"><i />Browser</span><span class="server"><i />Server / BFF</span>
      <span class="api"><i />Upstream API</span><span class="risk"><i />Failure / Recovery</span>
    </div>
    <svg viewBox="0 0 1200 506" role="img" :aria-labelledby="`${id}-title`">
      <title :id="`${id}-title`">{{ variant }} architecture, step {{ step ?? clicks[variant] }}. {{ model.nodes.map(n => `${n.label}: ${n.detail}`).join('. ') }}</title>
      <defs><marker v-for="role in roles" :id="`${id}-${role}`" :key="role" :class="role" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="currentColor" stroke-width="1.8" /></marker></defs>
      <g v-if="variant === 'query' && step === 4" class="cache-setting">
        <text x="16" y="26" class="cache-setting-title">Global Default: Fresh For 5 Minutes</text>
        <text x="16" y="58" class="cache-setting-code">defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } }</text>
        <text x="16" y="87" class="cache-setting-note">Same Query · Data Already Cached</text>
      </g>
      <g v-for="edge in model.edges" :key="edge.id" class="connection" :class="[edge.role, { current: edge.current, dashed: edge.dashed }]" :data-edge="edge.id" :data-current="edge.current">
        <path class="wire" :d="edge.d" :marker-end="`url(#${id}-${edge.role})`" />
        <path v-if="edge.current" :key="`${edge.id}-${model.step}`" class="signal" :d="edge.d" pathLength="1" />
        <text v-if="edge.label" class="wire-label" :x="edge.x" :y="edge.y">{{ edge.label }}</text>
      </g>
      <g v-for="node in model.nodes" :key="node.id" class="architecture-node" :class="[node.role, { current: node.current }]" :data-node="node.id" :data-current="node.current" :style="{ transform: `translate(${node.x}px, ${node.y}px)` }">
        <rect class="node-surface" :width="node.w" height="68" rx="8" />
        <path class="node-accent" d="M0 18V50" />
        <path class="node-icon" :d="icons[node.icon]" transform="translate(14 19) scale(.8)" />
        <text class="node-title" x="48" y="29">{{ node.label }}</text>
        <text class="node-detail" x="48" y="51">{{ node.detail }}</text>
      </g>
      <g v-if="!model.queryRetry && model.nodes.some(n => n.id === 'retry')" class="retry-options">
        <rect v-if="variant === 'client' && (step === 8 || step === 9)" :x="step === 8 ? 886 : 996" y="424" :width="step === 8 ? 94 : 146" height="28" rx="4" />
        <text x="932" y="444" :class="{ selected: variant === 'client' && step === 8 }">ALL</text>
        <text x="1069" y="444" :class="{ selected: variant === 'client' && step === 9 }">ONLY FAILED</text>
      </g>
      <g v-if="variant === 'query' && step === 4" class="cache-hit-route client">
        <path class="cache-hit-wire" d="M180 146H210V414H242" :marker-end="`url(#${id}-client)`" />
        <path v-for="n in 3" :key="n" class="cache-hit-pulse" d="M180 146H210V414H242 M242 414H180" pathLength="1" :style="{ animationDelay: `${(n - 1) * 650}ms` }" />
        <text x="238" y="300" class="cache-hit-label">Fresh Cache Hit</text>
        <text x="886" y="374" class="cache-hit-outcome">No Request</text>
        <text x="886" y="405" class="cache-hit-outcome">No 429 On This Hit</text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.architecture-flow { margin: 0; width: 100%; height: 100%; display: flex; flex-direction: column; --arch-client: #17688f; --arch-server: #856000; --arch-api: #326f5c; --arch-risk: #9a4c0a; }
.client { --role: var(--arch-client); --wash: #e1eef5; color: var(--role); }
.server { --role: var(--arch-server); --wash: #faeab4; color: var(--role); }
.api { --role: var(--arch-api); --wash: #e0eee9; color: var(--role); }
.risk { --role: var(--arch-risk); --wash: #fbe4ca; color: var(--role); }
.architecture-legend { display: flex; gap: 42px; align-items: center; font-size: 18px; font-weight: 550; padding: 2px 16px 8px; }
.architecture-legend span { display: inline-flex; gap: 10px; align-items: center; }
.architecture-legend i { width: 16px; height: 16px; border: 2px solid currentColor; border-radius: 3px; background: var(--wash); }
.architecture-legend .risk i { height: 0; width: 25px; border: 0; border-top: 2px dashed currentColor; }
svg { width: 100%; flex: 1; min-height: 0; overflow: visible; }
text { font-family: var(--faris-font-sans); stroke: none; }
.architecture-node { transition: transform 480ms cubic-bezier(.22,.61,.36,1); }
.node-surface { fill: var(--faris-bg); stroke: color-mix(in srgb, var(--role) 50%, var(--faris-bg)); stroke-width: 1.6; transition: fill 220ms ease, stroke 220ms ease; }
.node-accent { stroke: var(--role); stroke-width: 4; stroke-linecap: round; }
.node-icon { stroke: var(--role); stroke-width: 1.8; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.node-title { fill: var(--faris-fg); font-size: 21px; font-weight: 700; letter-spacing: -.4px; }
.node-detail { fill: var(--faris-muted); font-size: 16px; }
.current .node-surface { fill: var(--wash); stroke: var(--role); stroke-width: 2.4; }
.architecture-node.current { animation: architecture-focus 220ms ease both; }
.architecture-flow[data-variant="bff"][data-step="1"] [data-node="bff"] {
  animation: bff-arrive 700ms cubic-bezier(.22,.61,.36,1) both;
}
@keyframes bff-arrive {
  from { opacity: 0; translate: 0 42px; }
  to { opacity: 1; translate: 0 0; }
}
.current .node-title { fill: #0f0f10; }
.current .node-detail { fill: #45423d; }
.connection { color: var(--role); }
.wire { fill: none; stroke: var(--role); stroke-opacity: .5; stroke-width: 1.8; stroke-linejoin: round; }
.dashed .wire { stroke-dasharray: 5 5; }
.current .wire { stroke-opacity: 1; stroke-width: 2.4; }
.wire-label { text-anchor: middle; font-size: 17px; font-weight: 550; fill: var(--role); paint-order: stroke; stroke: var(--faris-bg); stroke-width: 7px; stroke-linejoin: round; }
.signal { fill: none; stroke: var(--role); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0; animation: architecture-draw 600ms cubic-bezier(.22,.61,.36,1) both; }
.retry-options text { fill: var(--arch-risk); font-size: 17px; font-weight: 650; text-anchor: middle; }
.retry-options rect { fill: #f4c63a; }
.retry-options .selected { text-decoration: underline; text-decoration-thickness: 2px; fill: #0f0f10; font-weight: 800; }
@keyframes architecture-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes architecture-focus { from { opacity: .4; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .architecture-node, .node-surface { transition: none; animation: none; } .signal { animation: none; } }
@media print { .architecture-node, .node-surface { transition: none; animation: none; } .signal { animation: none; } }
.cache-setting-title { fill: var(--faris-brand-yellow); font-size: 23px; font-weight: 700; }
.cache-setting-code { fill: var(--faris-fg); font-family: var(--faris-font-mono); font-size: 20px; }
.cache-setting-note { fill: var(--faris-muted); font-size: 17px; }
.cache-hit-wire { fill: none; stroke: var(--arch-client); stroke-width: 2.5; }
.cache-hit-pulse { fill: none; stroke: var(--faris-brand-yellow); stroke-width: 5; stroke-linecap: round; stroke-dasharray: .12 .88; opacity: 0; animation: cache-hit-travel 650ms ease-in-out both; }
.cache-hit-label { fill: var(--arch-client); font-size: 19px; font-weight: 700; }
.cache-hit-outcome { fill: var(--faris-brand-yellow); font-size: 21px; font-weight: 700; animation: cache-hit-result 600ms ease 1800ms both; }
.fresh-cache-demo [data-edge="failure"], .fresh-cache-demo [data-edge="retry-loop"], .fresh-cache-demo [data-node="retry"] { opacity: 0; animation: cache-risk-away 1800ms ease both; }
.fresh-cache-demo [data-edge="outbound"], .fresh-cache-demo [data-edge="fanout"], .fresh-cache-demo [data-edge="refetch"] { opacity: .2; transition: opacity 700ms ease; }
@keyframes cache-hit-travel { 0% { stroke-dashoffset: 1; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes cache-risk-away { 0%, 45% { opacity: 1; } 100% { opacity: 0; } }
@keyframes cache-hit-result { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce), print {
  .fresh-cache-demo [data-edge], .fresh-cache-demo [data-node], .cache-hit-pulse, .cache-hit-outcome { animation: none !important; transition: none !important; }
}
@media (prefers-reduced-motion: reduce), print {
  .architecture-flow[data-variant="bff"][data-step="1"] [data-node="bff"] { animation: none; }
}
</style>
