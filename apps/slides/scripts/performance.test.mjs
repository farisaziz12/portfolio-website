import test from 'node:test'
import assert from 'node:assert/strict'
import { latencyState, transfer, parallelState } from '../decks/caching-dark-arts/components/performance.ts'

test('latency lanes accumulate without conflating scenarios and operator medians', () => {
  assert.deepEqual(latencyState(4, 0).map(r => r.name), ['Ethernet', 'Broadband'])
  assert.deepEqual(latencyState(4, 1).map(r => r.name), ['Ethernet', 'Broadband', '4G'])
  assert.equal(latencyState(1, 0)[0].icon, 'ethernet')
  assert.equal(latencyState(1, 0)[0].context, 'Wired Connection Example')
  assert.equal(latencyState(4, 2).length, 4)
  assert.deepEqual(latencyState(4, 3).map(r => [r.low, r.high]), [[1, 5], [30, 70], [18, 23], [15, 21]])
  assert.deepEqual(latencyState(4, 4).slice(2).map(r => [r.low, r.high]), [[80, 200], [80, 200]])
  for (const row of latencyState(4, 4)) assert.equal(row.duration, 1200 + (row.low + row.high) / 2 * 20)
  assert.deepEqual(latencyState(4, 100), latencyState(4, 4))
  assert.deepEqual(latencyState(4, -1), latencyState(4, 0))
})
test('latency motion is visible on a large screen without reversing speed order', () => {
  const rows = latencyState(4, 3)
  assert.equal(latencyState(1, 1)[0].duration, 1260)
  const ordered = [...rows].sort((a, b) => (a.low + a.high) - (b.low + b.high))
  for (let i = 1; i < ordered.length; i++) assert.ok(ordered[i].duration > ordered[i - 1].duration)
  for (const row of [...rows, ...latencyState(4, 4)]) assert.ok(row.duration >= 1200 && row.duration <= 4000)
})
test('download model separates fixed cost from decimal-byte transfer', () => {
  assert.equal(transfer(1580000, 2).totalMs, 6520)
  assert.equal(transfer(300, 2).totalMs, 201.2)
  assert.ok(Math.abs(transfer(1580000, 90).totalMs - 340.444444) < .001)
  assert.equal(transfer(1580000, 2).fillAnimationMs, 6320)
  assert.equal(transfer(300, 90).waitAnimationMs, 200)
  for (const bytes of [300, 1580000]) for (const rate of [2, 25, 90]) {
    const row = transfer(bytes, rate)
    assert.equal(row.waitAnimationMs + row.fillAnimationMs, row.totalMs)
  }
})
test('retry-all repeats successes; selective retry retains successful results', () => {
  assert.equal(parallelState(1).filter(r => r.run).length, 5)
  assert.deepEqual(parallelState(2).filter(r => r.failed).map(r => r.id), [2, 5])
  assert.equal(parallelState(3).filter(r => r.run).length, 5)
  assert.deepEqual(parallelState(4).filter(r => r.run).map(r => r.id), [2, 5])
  assert.deepEqual(parallelState(4).filter(r => r.retained).map(r => r.id), [1, 3, 4])
})
