import test from 'node:test'
import assert from 'node:assert/strict'
import { architecture, clicks } from '../decks/caching-dark-arts/components/architecture.ts'

test('each architecture begins with exactly the previous completed diagram', () => {
  for (const [before, after] of [['client', 'bff'], ['bff', 'query'], ['query', 'prefetch']])
    assert.deepEqual(architecture(after, 0), architecture(before, clicks[before]))
})
test('familiar nodes stay anchored; only mapping moves from client to server', () => {
  const initial = architecture('client', 11).nodes
  for (const variant of ['bff', 'query', 'prefetch']) {
    const nodes = architecture(variant, clicks[variant]).nodes
    for (const previous of initial.filter(n => n.id !== 'map')) {
      const retained = nodes.find(n => n.id === previous.id)
      assert.ok(retained)
      assert.deepEqual([retained.x, retained.y], [previous.x, previous.y])
    }
  }
  assert.equal(architecture('bff', 1).nodes.find(n => n.id === 'map').x, 242)
  assert.equal(architecture('bff', 2).nodes.find(n => n.id === 'map').x, 580)
})
test('native steps add BFF, payload, query state, prefetch and hydration in order', () => {
  assert.deepEqual(architecture('client', 0).nodes.map(n => n.id), ['ui'])
  assert.equal(architecture('client', 1).nodes.length, 2)
  assert.ok(architecture('bff', 1).nodes.some(n => n.id === 'bff'))
  assert.ok(!architecture('bff', 2).nodes.some(n => n.id === 'payload'))
  assert.ok(architecture('bff', 3).nodes.some(n => n.id === 'payload'))
  assert.equal(architecture('query', 1).nodes.find(n => n.id === 'state').label, 'Query Cache')
  assert.ok(architecture('query', 2).cacheRoute)
  assert.ok(architecture('query', 3).queryRetry)
  assert.ok(!architecture('prefetch', 0).prefetch)
  assert.ok(architecture('prefetch', 1).prefetch)
  assert.equal(architecture('prefetch', 2).nodes.find(n => n.id === 'payload').label, 'Query State')
  assert.equal(architecture('prefetch', 2).nodes.find(n => n.id === 'payload').detail, 'Per Request')
  assert.equal(architecture('prefetch', 3).edges.find(n => n.id === 'outbound').label, 'Client Fallback')
  assert.equal(architecture('prefetch', 3).edges.find(n => n.id === 'result').label, 'Hydrate')
  assert.ok(architecture('prefetch', 4).timeout)
})
test('snapshots are reversible, bounded, deterministic and uniquely identified', () => {
  for (const variant of Object.keys(clicks)) {
    const forward = Array.from({ length: clicks[variant] + 1 }, (_, i) => architecture(variant, i))
    for (let i = clicks[variant]; i >= 0; i--) {
      assert.deepEqual(architecture(variant, i), forward[i])
      for (const type of ['nodes', 'edges']) assert.equal(new Set(forward[i][type].map(n => n.id)).size, forward[i][type].length)
    }
    assert.deepEqual(architecture(variant, -1), architecture(variant, 0))
    assert.deepEqual(architecture(variant, 100), architecture(variant, clicks[variant]))
  }
})
