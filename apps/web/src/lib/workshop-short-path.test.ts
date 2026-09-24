import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  isReservedWorkshopShortPath,
  normalizeWorkshopShortPath,
  workshopAttendUrl,
  workshopShortUrl,
} from 'shared'

describe('workshop short path', () => {
  it('normalizes and rejects reserved / invalid paths', () => {
    assert.equal(normalizeWorkshopShortPath('Survive'), 'survive')
    assert.equal(normalizeWorkshopShortPath('/survive/'), 'survive')
    assert.equal(normalizeWorkshopShortPath('about'), null)
    assert.equal(normalizeWorkshopShortPath('talks'), null)
    assert.equal(normalizeWorkshopShortPath('bad path'), null)
    assert.equal(normalizeWorkshopShortPath('has.dot'), null)
    assert.equal(isReservedWorkshopShortPath('admin'), true)
  })

  it('builds short and attend URLs', () => {
    assert.equal(workshopShortUrl('survive'), 'https://faziz-dev.com/survive')
    assert.equal(
      workshopAttendUrl('react-alicante-2026-9241'),
      'https://faziz-dev.com/workshops/attend/react-alicante-2026-9241'
    )
  })
})
