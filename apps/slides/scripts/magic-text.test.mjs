import { test } from 'node:test'
import assert from 'node:assert/strict'
import { characterKeys } from '../decks/caching-dark-arts/components/magic-text.ts'

test('grapheme transition names are unique and stable across slides', () => {
  const chars = characterKeys('Cache Cache 👨‍💻 é')
  assert.equal(new Set(chars.map(c => c.name)).size, chars.length)
  assert.equal(chars.map(c => c.text).join(''), 'Cache Cache 👨‍💻 é')
  assert.equal(chars.filter(c => c.text === '👨‍💻').length, 1)
  assert.deepEqual(characterKeys('Cache'), chars.slice(0, 5))
  assert.notEqual(characterKeys('A', '0')[0].name, characterKeys('A', '1')[0].name)
})

test('emphasis boundaries share the heading occurrence counter', () => {
  const counts = new Map()
  const first = characterKeys('Cache', '0', counts)
  const second = characterKeys('Cache', '0', counts)
  assert.notEqual(first[0].name, second[0].name)
})
