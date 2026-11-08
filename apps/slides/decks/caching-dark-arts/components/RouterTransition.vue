<script setup lang="ts">
defineProps<{ step: number }>()
</script>

<template>
  <div class="router-stage" :class="{ flipped: step > 0 }">
    <div class="router-card">
      <section class="router-face router-pages" :aria-hidden="step > 0">
        <p class="router-eyebrow">This Demo</p>
        <h2>Pages Router</h2>
        <p class="router-api">getServerSideProps</p>
        <div class="router-flow"><span>Server Prefetch</span><b>→</b><span>Wait Or Timeout</span><b>→</b><span>Send The Page</span></div>
      </section>
      <section class="router-face router-app" :aria-hidden="step === 0">
        <p class="router-eyebrow">Next Step</p>
        <h2>App Router</h2>
        <p class="router-api">Server Components + Suspense</p>
        <div class="router-flow"><span>Start The Fetch</span><b>→</b><span>Send The Shell</span><b>→</b><span>Stream The Rest</span></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.router-stage { width: 100%; perspective: 1800px; padding: 20px 0; }
.router-card { width: 100%; height: 365px; position: relative; transform-style: preserve-3d; transition: transform 1100ms cubic-bezier(.22,.7,.18,1); }
.flipped .router-card { transform: rotateY(-180deg); }
.router-face { position: absolute; inset: 0; border: 2px solid var(--faris-text-blue); border-radius: 18px; background: var(--faris-surface, #101010); backface-visibility: hidden; padding: 36px 40px; text-align: center; }
.router-app { transform: rotateY(180deg); border-color: var(--faris-brand-yellow); }
.router-eyebrow { font-size: 20px; color: var(--faris-muted); margin: 0 0 8px; }
h2 { font-size: 64px; line-height: 1.1; color: var(--faris-text-blue); margin: 0; }
.router-app h2 { color: var(--faris-brand-yellow); }
.router-api { margin: 12px 0 34px; font-size: 23px; }
.router-flow { display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 22px; }
.router-flow span { border: 1px solid var(--faris-border); padding: 18px 22px; border-radius: 8px; }
.router-flow b { color: var(--faris-text-blue); }
.router-app .router-flow b { color: var(--faris-brand-yellow); }
@media (prefers-reduced-motion: reduce), print { .router-card { transition: none; } }
</style>
