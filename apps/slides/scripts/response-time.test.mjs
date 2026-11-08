import test from 'node:test'
import assert from 'node:assert/strict'
import { responseTiming, typingFrames } from '../decks/caching-dark-arts/components/response-time.ts'

test('response examples preserve real waits after the simulated action', () => {
  for (const [example, step, delay] of [['instant',1,100], ['flow',1,1000], ['flow',2,3000], ['wait',1,10000]]) {
    const result = responseTiming(example, step)
    assert.equal(result.delay, delay)
    assert.equal(result.doneAt - result.actionAt, delay)
    assert.equal(result.interrupted, delay > 1000)
  }
})
test('response examples have finite reversible click states', () => {
  assert.equal(responseTiming('wait', 1).actionAt, 400)
  assert.equal(responseTiming('wait', 1).doneAt, 10400)
  assert.deepEqual(responseTiming('flow', 100), responseTiming('flow', 2))
  assert.deepEqual(responseTiming('instant', -1), responseTiming('instant', 0))
  assert.deepEqual(responseTiming('wait', 2), responseTiming('wait', 1))
})

test('typing starts in sync before the delayed text falls behind', () => {
  const frames = typingFrames(2)
  const at = time => frames.findLast(frame => frame.at <= time)
  assert.equal(at(1600).typed, "Let's ship ")
  assert.equal(at(1600).screen, at(1600).typed)
  assert.equal(at(3100).typed, "Let's ship the demo")
  assert.equal(at(3100).screen, "Let's ship ")
  assert.equal(at(4800).screen, "Let's ship t")
  assert.equal(at(6620).screen, "Let's ship the demooo")
})
test('confused typing repeats letters then corrects them with backspace', () => {
  const frames = typingFrames(2)
  assert.equal(frames.find(f => f.at === 3200).status, 'Did That Work?')
  const corrections = frames.filter(f => [7400, 7640].includes(f.at))
  assert.equal(corrections.length, 2)
  assert.ok(corrections.every(f => f.key === '⌫' && f.status === 'Backspace To Fix It'))
  const last = frames.at(-1)
  assert.equal(last.typed, "Let's ship the demo")
  assert.equal(last.screen, last.typed)
  assert.equal(last.status, 'Where Was I?')
})
test('typing frames are finite, ordered and reversible', () => {
  for (const step of [0, 1, 2]) {
    const frames = typingFrames(step)
    assert.ok(frames.every((f, i) => f.duration > 0 && (!i || f.at > frames[i - 1].at)))
    assert.ok(frames.at(-1).at <= 8200)
  }
  const smooth = typingFrames(1)
  assert.equal(smooth.at(-1).typed, smooth.at(-1).screen)
  assert.equal(smooth.at(-1).status, 'Keep Going')
  assert.deepEqual(typingFrames(-1), typingFrames(0))
  assert.deepEqual(typingFrames(100), typingFrames(2))
})
