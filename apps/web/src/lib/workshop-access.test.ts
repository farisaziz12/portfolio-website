import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getAccessPhase, isLiveEnded, type WorkshopInstance } from './workshop-access.ts'

const alicante: WorkshopInstance = {
  workshopDate: '2026-09-20T22:00:00.000Z',
  accessDurationDays: 30,
  forceClose: false,
  liveEndedAt: null,
}

const duringDay = new Date('2026-09-20T18:00:00.000Z')
const afterEod = new Date('2026-09-22T17:37:00.000Z')

describe('isLiveEnded / getAccessPhase', () => {
  it('is live during the workshop calendar day when liveEndedAt is unset', () => {
    assert.equal(isLiveEnded(alicante, duringDay), false)
    assert.equal(getAccessPhase(alicante, duringDay), 'live')
  })

  it('auto-ends after the workshop calendar day even if liveEndedAt is already null', () => {
    assert.equal(isLiveEnded(alicante, afterEod), true)
    assert.equal(getAccessPhase(alicante, afterEod), 'readonly')
  })

  it('reopen (liveKeepOpen) restores live after EOD while materials remain open', () => {
    const reopened = { ...alicante, liveEndedAt: null, liveKeepOpen: true }
    assert.equal(isLiveEnded(reopened, afterEod), false)
    assert.equal(getAccessPhase(reopened, afterEod), 'live')
  })

  it('unsetting liveEndedAt alone does not reopen after EOD', () => {
    const cleared = { ...alicante, liveEndedAt: null, liveKeepOpen: false }
    assert.equal(getAccessPhase(cleared, afterEod), 'readonly')
  })

  it('explicit End live still wins during the workshop day', () => {
    const ended = {
      ...alicante,
      liveEndedAt: '2026-09-20T16:00:00.000Z',
      liveKeepOpen: false,
    }
    assert.equal(getAccessPhase(ended, duringDay), 'readonly')
  })

  it('reopen after an explicit end restores live during the workshop day', () => {
    const reopened = { ...alicante, liveEndedAt: null, liveKeepOpen: true }
    assert.equal(getAccessPhase(reopened, duringDay), 'live')
  })
})
