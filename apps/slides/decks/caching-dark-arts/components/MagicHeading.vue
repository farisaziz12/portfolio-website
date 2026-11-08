<script setup lang="ts">
const props = withDefaults(defineProps<{ group?: string }>(), { group: '0' })
</script>
<template><h1 class="magic-object" :style="{ viewTransitionName: `caching-heading-${props.group}` }"><slot /></h1></template>
<style>
.disable-view-transition .magic-object { view-transition-name: none !important; }
::view-transition { pointer-events: none; }
/* A gentle start and landing, without delaying the next navigation input. */
::view-transition-group(*) { animation-duration: 760ms; animation-timing-function: cubic-bezier(.45,0,.25,1); }
::view-transition-group(root) { animation-duration: 320ms; }
::view-transition-old(*), ::view-transition-new(*) { animation-duration: 320ms; animation-timing-function: ease-in-out; }
/* Only the outgoing heading softens; incoming content stays crisp. */
::view-transition-old(caching-heading-0) {
  animation: caching-heading-blur-out 280ms ease-out both;
}
@keyframes caching-heading-blur-out {
  from { opacity: 1; filter: blur(0); }
  to { opacity: 0; filter: blur(3px); }
}
@media (prefers-reduced-motion: reduce), print {
  .magic-object { view-transition-name: none !important; }
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 0s !important; }
}
</style>
