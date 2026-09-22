import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildWorkshopRosterHogql,
  parseRosterFocused,
  parseRosterSectionKey,
} from './workshop-roster.ts'

describe('parseRosterFocused', () => {
  it('treats explicit true/1 as focused', () => {
    assert.equal(parseRosterFocused(true), true)
    assert.equal(parseRosterFocused(1), true)
    assert.equal(parseRosterFocused('1'), true)
    assert.equal(parseRosterFocused('true'), true)
    assert.equal(parseRosterFocused('True'), true)
  })

  it('does not treat the string false as focused (Boolean("false") would)', () => {
    assert.equal(parseRosterFocused(false), false)
    assert.equal(parseRosterFocused(0), false)
    assert.equal(parseRosterFocused('0'), false)
    assert.equal(parseRosterFocused('false'), false)
    assert.equal(parseRosterFocused('False'), false)
    assert.equal(parseRosterFocused(null), false)
    assert.equal(parseRosterFocused(undefined), false)
    assert.equal(parseRosterFocused(''), false)
  })
})

describe('parseRosterSectionKey', () => {
  it('keeps real keys and drops empty/null sentinels', () => {
    assert.equal(parseRosterSectionKey('abc'), 'abc')
    assert.equal(parseRosterSectionKey(''), null)
    assert.equal(parseRosterSectionKey(null), null)
    assert.equal(parseRosterSectionKey('null'), null)
  })
})

describe('buildWorkshopRosterHogql', () => {
  it('uses the GROUP BY argMax shape that previously returned rows', () => {
    const q = buildWorkshopRosterHogql("abc'123")
    assert.match(q, /argMax\(toString\(properties\.focused\), timestamp\)/)
    assert.match(q, /properties\.instance = 'abc\\'123'/)
    assert.match(q, /INTERVAL 2 MINUTE/)
    assert.doesNotMatch(q, /row_number/)
    assert.doesNotMatch(q, /toBool/)
    assert.doesNotMatch(q, /toString\(properties\.instance\)/)
  })
})
