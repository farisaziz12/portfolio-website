export type ResponseExample = 'instant' | 'flow' | 'wait'

// Delays are authored examples in real milliseconds, not a network benchmark.
export function responseTiming(example: ResponseExample, rawStep: number) {
  const step = Math.min(example === 'flow' ? 2 : 1, Math.max(0, Math.floor(rawStep || 0)))
  const delay = example === 'instant' ? 100 : example === 'wait' ? 10000 : step === 2 ? 3000 : 1000
  const actionAt = example === 'flow' ? 2200 : 400
  return { step, delay, actionAt, doneAt: actionAt + delay, interrupted: delay > 1000 }
}

export function typingFrames(rawStep: number) {
  const step = Math.min(2, Math.max(0, Math.floor(rawStep || 0)))
  const events: { at: number; kind: 'typed' | 'screen' | 'status'; key: string }[] = []
  const type = (text: string, start: number, lag: number) => {
    Array.from(text).forEach((key, i) => {
      const at = start + i * 120
      events.push({ at, kind: 'typed', key }, { at: at + lag, kind: 'screen', key })
    })
  }
  if (step) {
    type("Let's ship ", 300, 70)
    type('the demo', 1800, step === 2 ? 3000 : 70)
    if (step === 2) {
      events.push({ at: 2100, kind: 'status', key: 'Text Falls Behind' })
      events.push({ at: 3200, kind: 'status', key: 'Did That Work?' })
      type('oo', 3500, 3000)
      events.push({ at: 6750, kind: 'status', key: 'Too Many Letters' })
      for (const at of [7400, 7640]) {
        events.push({ at, kind: 'typed', key: '⌫' }, { at: at + 70, kind: 'screen', key: '⌫' })
      }
      events.push({ at: 8200, kind: 'status', key: 'Where Was I?' })
    } else events.push({ at: 3000, kind: 'status', key: 'Keep Going' })
  }
  let typed = '', screen = '', key = '', status = step ? 'Keeps Up' : 'Ready To Type'
  const frames = [{ at: 0, typed, screen, key, status }]
  for (const event of events.sort((a, b) => a.at - b.at)) {
    if (event.kind === 'status') status = event.key
    else if (event.kind === 'typed') {
      key = event.key
      typed = key === '⌫' ? typed.slice(0, -1) : typed + key
      if (key === '⌫') status = 'Backspace To Fix It'
    } else screen = event.key === '⌫' ? screen.slice(0, -1) : screen + event.key
    frames.push({ at: event.at, typed, screen, key, status })
  }
  return frames.map((frame, i) => ({ ...frame, duration: (frames[i + 1]?.at ?? frame.at + 1) - frame.at }))
}
