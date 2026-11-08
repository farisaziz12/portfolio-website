import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveFarisConfig } from '../packages/slidev-theme-faris/lib/config.ts'

test('P1 defaults stay unchanged and use the badge cover', () => {
  assert.deepEqual(resolveFarisConfig(undefined, undefined, 1), {
    mode: 'auto', background: 'none', coverVariant: 'badge',
  })
})

test('slide mode and background override deck defaults', () => {
  assert.deepEqual(resolveFarisConfig(
    { farisMode: 'light', farisBackground: 'arc' },
    { mode: 'dark', background: 'none', coverVariant: 'speaker' }, 2,
  ), { mode: 'dark', background: 'none', coverVariant: 'speaker' })
})

test('invalid cover option warns once and falls back', (t) => {
  const warning = t.mock.method(console, 'warn', () => {})
  for (let repeat = 0; repeat < 2; repeat++)
    assert.equal(resolveFarisConfig({}, { coverVariant: 'unrecognized' }, 3).coverVariant, 'badge')
  assert.equal(warning.mock.callCount(), 1)
})
