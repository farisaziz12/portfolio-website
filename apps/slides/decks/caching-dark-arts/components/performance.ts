// Presentation examples, not a benchmark engine. All durations are bounded CSS
// animations; native Slidev clicks select the complete, reversible snapshot.
export const latencyProfiles = [
  { name: 'Ethernet', icon: 'ethernet', low: 1, high: 5, context: 'Wired Connection Example' },
  { name: 'Broadband', icon: 'router', low: 30, high: 70, context: 'Internet Connection Example' },
  { name: '4G', icon: 'tower', low: 18, high: 23, context: 'UK Operator Medians' },
  { name: '5G', icon: 'tower', low: 15, high: 21, context: 'UK Operator Medians' },
] as const
export const rates = [90, 25, 2] as const
export const networkNames = ['Wi-Fi', '4G', '3G'] as const
export function clampStep(step: number, max: number) { return Math.min(max, Math.max(0, Math.floor(step || 0))) }
export function latencyState(stage: number, rawStep: number) {
  const step = clampStep(rawStep, stage === 4 ? 4 : 1)
  const count = stage === 4 ? Math.min(4, 2 + step) : stage
  return latencyProfiles.slice(0, count).map((profile, i) => {
    const stress = stage === 4 && step === 4 && i >= 2
    const low = stress ? 80 : profile.low, high = stress ? 200 : profile.high
    const run = step > 0 && (stage < 4 ? i === stage - 1 : step >= 3 || i === 1 + step)
    // Give even the fastest trip time to be seen on a projector. This shared
    // offset preserves ordering, but playback is no longer a ratio-scale race.
    return { ...profile, low, high, run, stress, duration: 1200 + (low + high) / 2 * 20 }
  })
}
export function transfer(bytes: number, mbps: number) {
  const payloadMs = bytes * 8 / (mbps * 1_000_000) * 1000
  return { payloadMs, totalMs: 200 + payloadMs, waitAnimationMs: 200, fillAnimationMs: payloadMs }
}
export function parallelState(rawStep: number) {
  const step = clampStep(rawStep, 4)
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    failed: step >= 2 && (i === 1 || i === 4),
    run: step === 1 || step === 3 || (step === 4 && (i === 1 || i === 4)),
    retained: step === 4 && i !== 1 && i !== 4,
  }))
}
