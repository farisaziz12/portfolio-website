import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getAccessStatus, type WorkshopInstance } from './workshop-access.ts'

function localNoon(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

const workshopDay = localNoon(2026, 9, 20)

const instance: WorkshopInstance = {
  workshopDate: workshopDay.toISOString(),
  accessDurationDays: 7,
  forceClose: false,
}

describe('getAccessStatus', () => {
  it('is upcoming before the workshop date', () => {
    assert.equal(getAccessStatus(instance, localNoon(2026, 9, 19)), 'upcoming')
  })

  it('is open on the workshop date', () => {
    assert.equal(getAccessStatus(instance, localNoon(2026, 9, 20)), 'open')
  })

  it('stays open through the access window after the workshop day', () => {
    assert.equal(getAccessStatus(instance, localNoon(2026, 9, 26)), 'open')
  })

  it('is closed once the access window ends', () => {
    assert.equal(getAccessStatus(instance, new Date(2026, 8, 27, 0, 0, 0, 0)), 'closed')
  })

  it('is force-closed even during the open window', () => {
    assert.equal(
      getAccessStatus({ ...instance, forceClose: true }, localNoon(2026, 9, 20)),
      'force-closed'
    )
  })
})
