<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { responseTiming, typingFrames, type ResponseExample } from './response-time'
import SearchWaitDemo from './SearchWaitDemo.vue'

const props = defineProps<{ example: ResponseExample; step: number; active: boolean }>()
const timing = computed(() => responseTiming(props.example, props.step))
const frames = computed(() => typingFrames(props.step))
const staticFrame = computed(() => props.step === 2
  ? frames.value.find(frame => frame.at === 7400)!
  : frames.value[frames.value.length - 1])
const play = ref(false)
// Only forward clicks play. Deep links, previews and reverse clicks show a
// readable snapshot. Leaving the slide removes every animation immediately.
watch([() => timing.value.step, () => props.active], ([step, current], [previous, wasCurrent]) => {
  play.value = current && wasCurrent && step > previous
}, { flush: 'sync' })
const styles = computed(() => ({
  '--wait': `${timing.value.delay}ms`,
  '--action': `${timing.value.actionAt}ms`,
  '--done': `${timing.value.doneAt}ms`,
  '--distracted': `${timing.value.actionAt + 1800}ms`,
}))
const explanation = computed(() => props.example === 'instant'
  ? 'A click gets a response after 0.1 seconds.'
  : `A task moves back and forth, then saves in ${timing.value.delay / 1000} seconds. ${timing.value.interrupted ? 'The wait interrupts the workflow.' : 'The workflow continues.'}`)
</script>

<template>
  <figure v-if="example === 'flow'" :key="`typing-${timing.step}`" class="typing-demo" :class="{ play }" :data-step="timing.step"
    role="img" :aria-label="timing.step === 2 ? 'Typing starts smoothly. The screen falls three seconds behind. The typist repeats letters, pauses, then uses backspace to correct them.' : 'Typing appears promptly on screen, keeping the train of thought.'">
    <div class="typing-snapshot" aria-hidden="true">
      <div class="typing-row"><span>Typed</span><code>{{ staticFrame.typed || ' ' }}</code></div>
      <div class="typing-row screen-row"><span>On Screen</span><code>{{ staticFrame.screen || ' ' }}<i /></code></div>
      <div class="typing-feedback"><kbd>{{ staticFrame.key === '⌫' ? '⌫ Backspace' : staticFrame.key === ' ' ? 'Space' : staticFrame.key || ' ' }}</kbd><strong>{{ staticFrame.status }}</strong></div>
    </div>
    <div v-for="(frame, i) in frames" :key="frame.at" class="typing-frame" :class="{ last: i === frames.length - 1 }"
      :data-at="frame.at" :style="{ '--at': `${frame.at}ms`, '--span': `${frame.duration}ms` }" aria-hidden="true">
      <div class="typing-row"><span>Typed</span><code>{{ frame.typed || ' ' }}</code></div>
      <div class="typing-row screen-row"><span>On Screen</span><code>{{ frame.screen || ' ' }}<i /></code></div>
      <div class="typing-feedback"><kbd>{{ frame.key === '⌫' ? '⌫ Backspace' : frame.key === ' ' ? 'Space' : frame.key || ' ' }}</kbd><strong>{{ frame.status }}</strong></div>
    </div>
  </figure>
  <SearchWaitDemo v-else-if="example === 'wait'" :key="`search-${timing.step}`" :play="play" :started="timing.step > 0" :timing="timing" />
  <figure v-else :key="`${example}-${timing.step}`" class="response-demo" :class="{ play, started: timing.step > 0, interrupted: timing.interrupted, instant: example === 'instant' }"
    :data-step="timing.step" :data-delay="timing.delay" :style="styles" role="img" :aria-label="explanation">
    <div class="interaction" aria-hidden="true">
      <template v-if="example === 'instant'">
        <div class="instant-task"><span class="tick-box"><span class="tick">✓</span></span><b>Ready To Present</b></div>
        <div class="instant-result">Done</div>
        <svg class="pointer instant-pointer" viewBox="0 0 32 40"><path d="M3 2L27 23L16 24L11 35Z" /></svg>
      </template>
      <template v-else>
        <div class="board-head"><b>Draft</b><b>Ready</b></div>
        <div class="track"><div /><div /></div>
        <div class="task"><span class="grip">⠿</span>Plan The Demo</div>
        <div class="next-task">Write The Intro</div>
        <div class="save">Save</div>
        <svg class="pointer workflow-pointer" viewBox="0 0 32 40"><path d="M3 2L27 23L16 24L11 35Z" /></svg>
        <svg v-if="timing.interrupted" class="pointer distracted-pointer" viewBox="0 0 32 40"><path d="M3 2L27 23L16 24L11 35Z" /></svg>
        <div v-else class="next-focus">Next</div>
      </template>
    </div>
    <div class="response-copy" aria-hidden="true">
      <div class="duration">{{ timing.delay / 1000 }}<span> {{ timing.delay === 1000 ? 'Second' : 'Seconds' }}</span></div>
      <div class="status"><span class="ready">Ready</span><span class="saving">Saving…</span><span class="saved">{{ example === 'instant' ? 'Done' : 'Saved' }}</span></div>
      <div v-if="example !== 'instant'" class="wait-track"><i /></div>
      <div v-if="timing.interrupted" class="thought">Where Was I?</div>
      <div v-else class="thought good">{{ example === 'instant' ? 'Feels Instant' : 'Keep Going' }}</div>
    </div>
  </figure>
</template>

<style scoped>
.typing-demo { position: relative; width: 100%; height: 330px; border-block: 2px solid var(--faris-border); }
.typing-snapshot, .typing-frame { position: absolute; inset: 0; padding: 25px 0; }
.typing-frame { visibility: hidden; }
.typing-row { display: grid; grid-template-columns: 180px 1fr; align-items: center; min-height: 95px; }
.typing-row>span { font-size: 25px; color: var(--faris-muted); }
.typing-row code { font-family: var(--faris-font-mono, monospace); font-size: 38px; white-space: pre; background: none; padding: 0; color: var(--faris-fg); }
.screen-row code { color: var(--faris-text-blue); }
.screen-row i { display: inline-block; height: .95em; width: 3px; background: currentColor; vertical-align: -.08em; margin-left: 5px; }
.typing-feedback { display: flex; align-items: center; gap: 32px; margin: 25px 0 0 180px; font-size: 28px; }
.typing-feedback kbd { min-width: 64px; padding: 6px 14px; border: 2px solid var(--faris-border); border-bottom-width: 4px; border-radius: 5px; text-align: center; font-family: inherit; font-size: 23px; }
.typing-feedback strong { color: var(--faris-text-blue); font-weight: 650; }
@media screen and (prefers-reduced-motion: no-preference) {
  .typing-demo.play .typing-snapshot { visibility: hidden; }
  .typing-demo.play .typing-frame { animation: typing-frame var(--span) step-end var(--at); }
  .typing-demo.play .typing-frame.last { animation: typing-last 1ms step-end var(--at) forwards; }
}
@keyframes typing-frame { from { visibility: visible; } to { visibility: hidden; } }
@keyframes typing-last { from, to { visibility: visible; } }
.response-demo { width: 100%; display: grid; grid-template-columns: 740px 1fr; gap: 50px; align-items: center; }
.interaction { height: 320px; position: relative; border-top: 2px solid var(--faris-border); border-bottom: 2px solid var(--faris-border); }
.board-head { display: grid; grid-template-columns: 1fr 1fr; padding: 22px 24px; font-size: 23px; color: var(--faris-muted); }
.track { position: absolute; left: 20px; right: 20px; top: 82px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.track>div { height: 76px; border: 2px dashed var(--faris-border); border-radius: 8px; }
.task { position: absolute; left: 20px; top: 82px; width: 335px; height: 76px; display: flex; align-items: center; gap: 16px; padding: 0 22px; border: 2px solid var(--faris-text-blue); border-radius: 8px; background: var(--faris-bg); font-size: 27px; font-weight: 650; }
.grip { color: var(--faris-text-blue); font-size: 32px; }
.next-task { position: absolute; top: 188px; left: 44px; font-size: 26px; color: var(--faris-muted); }
.save { position: absolute; right: 22px; bottom: 22px; width: 120px; padding: 10px 0; text-align: center; background: var(--faris-text-blue); color: var(--faris-bg); border-radius: 6px; font-size: 24px; font-weight: 650; }
.pointer { position: absolute; width: 30px; height: 38px; fill: var(--faris-fg); stroke: var(--faris-bg); stroke-width: 2px; z-index: 2; }
.workflow-pointer { left: 88px; top: 138px; }
.duration { color: var(--faris-text-blue); font-size: 66px; font-weight: 780; line-height: 1; white-space: nowrap; }
.duration span { font-size: 23px; font-weight: 500; }
.status { position: relative; height: 38px; margin-top: 26px; font-size: 27px; }
.status>span { position: absolute; inset: 0; }
.saving, .saved { opacity: 0; }
.wait-track { height: 5px; margin-top: 14px; background: var(--faris-border); }
.wait-track i { display: block; height: 100%; width: 100%; background: var(--faris-text-blue); transform: scaleX(0); transform-origin: left; }
.thought { font-size: 29px; font-weight: 680; margin-top: 32px; opacity: 0; }
.interrupted .thought { color: #9c4a13; }
.distracted-pointer { left: 570px; top: 185px; opacity: 0; }
.next-focus { position: absolute; top: 189px; left: 285px; font-size: 23px; font-weight: 650; color: var(--faris-text-blue); opacity: 0; }
.instant-task { position: absolute; top: 110px; left: 54px; display: flex; align-items: center; gap: 26px; font-size: 36px; }
.tick-box { width: 48px; height: 48px; display: grid; place-items: center; border: 3px solid var(--faris-text-blue); border-radius: 8px; }
.tick { color: var(--faris-text-blue); opacity: 0; }
.instant-result { position: absolute; top: 204px; left: 128px; font-size: 26px; color: var(--faris-text-blue); opacity: 0; }
.instant-pointer { left: 72px; top: 142px; }
/* Static snapshots are the default for deep links, print and reduced motion. */
.started .task { transform: translateX(365px); }
.started .workflow-pointer { transform: translate(0px, 60px); }
.started .ready { opacity: 0; }
.started .saved, .started .thought, .started .next-focus, .started .tick, .started .instant-result { opacity: 1; }
.started .wait-track i { transform: scaleX(1); }
.started.interrupted .workflow-pointer { opacity: 0; }
.started.interrupted .distracted-pointer { opacity: 1; }
@media screen and (prefers-reduced-motion: no-preference) {
  .play .task { animation: task-drag 1900ms ease-in-out both; }
  .play .workflow-pointer { animation: cursor-work 2200ms ease-in-out both, cursor-next 250ms ease var(--done) forwards; }
  .play.interrupted .workflow-pointer { opacity: 1; animation: cursor-work 2200ms ease-in-out both, vanish 1ms linear var(--distracted) forwards; }
  .play .ready { opacity: 1; animation: vanish 1ms linear var(--action) forwards; }
  .play .saving { animation: appear 1ms linear var(--action) forwards, vanish 1ms linear var(--done) forwards; }
  .play .saved, .play .good, .play .next-focus, .play .tick, .play .instant-result { opacity: 0; animation: appear 1ms linear var(--done) forwards; }
  .play .wait-track i { transform: scaleX(0); animation: progress var(--wait) linear var(--action) forwards; }
  .play.interrupted .thought { opacity: 0; animation: appear 200ms ease var(--distracted) forwards; }
  .play.interrupted .distracted-pointer { opacity: 0; animation: distracted 900ms ease var(--distracted) forwards; }
  .play .instant-pointer { animation: quick-click 400ms ease both; }
}
@keyframes task-drag { 0%, 18% { transform: translateX(0); } 44%, 53% { transform: translateX(365px); } 75%, 80% { transform: translateX(0); } 100% { transform: translateX(365px); } }
@keyframes cursor-work { 0%, 15% { transform: translate(0, 0); } 38%, 46% { transform: translate(365px, 0); } 65%, 69% { transform: translate(0, 0); } 86% { transform: translate(365px, 0); } 100% { transform: translate(555px, 125px); } }
@keyframes cursor-next { from { transform: translate(555px,125px); } to { transform: translate(0,60px); } }
@keyframes quick-click { 0% { transform: translate(75px, 65px); } 85% { transform: translate(0,0); } 95% { transform: scale(.82); } 100% { transform: scale(1); } }
@keyframes distracted { from { opacity: 1; transform: translate(73px,78px); } to { opacity: 1; transform: translate(0,0); } }
@keyframes appear { to { opacity: 1; } }
@keyframes vanish { to { opacity: 0; } }
@keyframes progress { to { transform: scaleX(1); } }
</style>
