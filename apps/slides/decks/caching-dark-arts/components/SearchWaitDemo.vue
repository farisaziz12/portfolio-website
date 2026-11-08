<script setup lang="ts">
import type { responseTiming } from './response-time'

defineProps<{ play: boolean; started: boolean; timing: ReturnType<typeof responseTiming> }>()
</script>

<template>
  <figure class="search-demo" :class="{ play, started }"
    :style="{ '--search-at': `${timing.actionAt}ms`, '--results-at': `${timing.doneAt}ms`, '--wait': `${timing.delay}ms` }"
    role="img" aria-label="Search for failed payments. Wait ten seconds as the pointer drifts away. When results arrive, reread the query and scan the results to find your place again.">
    <div class="search-window" aria-hidden="true">
      <div class="search-field"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><span>failed payments</span><b>Search</b></div>
      <div class="search-prompt">Find The Payment That Failed</div>
      <div class="search-loading"><i />Searching…</div>
      <div class="search-results">
        <div><span>Payment 1042</span><strong>Failed</strong></div>
        <div class="search-match"><span>Payment 1048</span><strong>Failed</strong></div>
        <div><span>Payment 1051</span><strong>Failed</strong></div>
      </div>
      <svg class="search-pointer" viewBox="0 0 32 40">
        <path class="search-arrow" d="M3 2L27 23L16 24L11 35Z"/>
        <path class="search-hand" d="M10 23V5C10 1 16 1 16 5V17C16 13 21 13 21 17V19C21 15 26 16 26 20C29 18 31 21 30 25L28 33L25 37H14L9 31L3 24C1 20 5 18 8 21Z"/>
      </svg>
    </div>
    <div class="search-beats" aria-hidden="true">
      <div class="search-beat search-beat--query"><b>1</b><strong>Search</strong></div>
      <div class="search-beat search-beat--wait"><b>2</b><span><strong>Wait</strong><small>10 Seconds</small></span></div>
      <div class="search-beat search-beat--return"><b>3</b><strong>Find Your<br>Place Again</strong></div>
      <p class="search-thought">What Was I Looking For?</p>
    </div>
  </figure>
</template>

<style scoped>
.search-demo { display: grid; grid-template-columns: 740px 1fr; gap: 46px; width: 100%; align-items: center; }
.search-window { position: relative; height: 340px; border-block: 2px solid var(--faris-border); }
.search-field { position: absolute; inset: 22px 18px auto; display: flex; align-items: center; gap: 18px; height: 62px; padding-left: 18px; border: 2px solid var(--faris-text-blue); border-radius: 8px; font-size: 27px; }
.search-field svg { width: 25px; fill: none; stroke: var(--faris-text-blue); stroke-width: 2; }
.search-field b { margin-left: auto; height: 100%; padding: 10px 22px; background: var(--faris-text-blue); color: var(--faris-bg); border-radius: 0 5px 5px 0; cursor: pointer; }
.search-prompt { position: absolute; top: 153px; left: 70px; font-size: 29px; color: var(--faris-muted); }
.search-loading { position: absolute; top: 164px; left: 245px; display: flex; align-items: center; gap: 18px; font-size: 28px; opacity: 0; }
.search-loading i { width: 29px; height: 29px; border: 3px solid var(--faris-border); border-top-color: var(--faris-text-blue); border-radius: 50%; }
.search-results { position: absolute; top: 106px; left: 18px; right: 18px; opacity: 0; }
.search-results>div { display: flex; justify-content: space-between; padding: 12px 24px; border-bottom: 1px solid var(--faris-border); font-size: 25px; }
.search-results strong { color: var(--faris-text-blue); font-size: 23px; }
.search-pointer { position: absolute; left: 610px; top: 61px; width: 30px; height: 38px; fill: var(--faris-fg); stroke: var(--faris-bg); stroke-width: 2; pointer-events: none; }
.search-arrow { opacity: 0; }
.started .search-arrow { opacity: 1; }
.started .search-hand { opacity: 0; }
.search-beats { display: grid; gap: 25px; }
.search-beat { display: flex; gap: 16px; align-items: baseline; color: var(--faris-muted); font-size: 27px; line-height: 1.2; }
.search-beat>b { font-size: 20px; }
.search-beat strong { font-weight: 700; }
.search-beat small { display: block; font-size: 21px; margin-top: 8px; }
.search-beat--query { color: var(--faris-text-blue); }
.search-thought { font-size: 23px; line-height: 1.35; margin: 0; visibility: hidden; }
/* Readable completed scene for reverse navigation, deep links and export. */
.started .search-prompt { opacity: 0; }
.started .search-results { opacity: 1; }
.started .search-pointer { transform: translate(-280px, 140px); }
.started .search-match { background: var(--faris-surface); }
.started .search-beat--return { color: var(--faris-text-blue); }
.started .search-thought { visibility: visible; }
@media screen and (prefers-reduced-motion: no-preference) {
  .play .search-hand { opacity: 1; animation: search-hide 1ms 520ms forwards; }
  .play .search-arrow { opacity: 0; animation: search-show 1ms 520ms forwards; }
  .play .search-prompt { opacity: 1; animation: search-hide 1ms var(--search-at) forwards; }
  .play .search-loading { animation: search-show 1ms var(--search-at) forwards, search-hide 1ms var(--results-at) forwards; }
  .play .search-loading i { animation: search-spin 1200ms linear var(--search-at) 9; }
  .play .search-results { opacity: 0; animation: search-show 200ms ease var(--results-at) forwards; }
  .play .search-pointer { animation: search-drift var(--results-at) ease-in-out both, search-reorient 3500ms ease-in-out var(--results-at) forwards; }
  .play .search-field { animation: search-reread 3500ms ease var(--results-at); }
  .play .search-match { background: transparent; animation: search-select 3500ms ease var(--results-at) forwards; }
  .play .search-beat--wait { animation: search-emphasis 1ms var(--search-at) forwards; }
  .play .search-beat--return { color: var(--faris-muted); animation: search-emphasis 1ms var(--results-at) forwards; }
  .play .search-thought { visibility: hidden; animation: search-thought 1ms var(--results-at) forwards; }
}
@keyframes search-show { to { opacity: 1; } }
@keyframes search-hide { to { opacity: 0; } }
@keyframes search-spin { to { transform: rotate(360deg); } }
@keyframes search-emphasis { to { color: var(--faris-text-blue); } }
@keyframes search-thought { to { visibility: visible; } }
@keyframes search-drift {
  0%, 5% { transform: translate(0, 0); }
  50%, 100% { transform: translate(44px, 228px); }
}
@keyframes search-reorient {
  0%, 12% { transform: translate(44px, 228px); }
  40%, 58% { transform: translate(-360px, 0); }
  78% { transform: translate(-280px, 88px); }
  100% { transform: translate(-280px, 140px); }
}
@keyframes search-reread { 30%, 60% { box-shadow: 0 0 0 4px var(--faris-text-blue); } }
@keyframes search-select { 0%, 85% { background: transparent; } 100% { background: var(--faris-surface); } }
</style>
