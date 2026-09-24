import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  resolveWorkshopShortcut,
  shortcutKeywords,
  terminalWorkshopRoutes,
  workshopShortcuts,
  type WorkshopShortcutInstance,
} from './workshop-shortcuts.ts'

function localNoon(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

const alicante: WorkshopShortcutInstance = {
  event: 'React Alicante 2026',
  token: 'react-alicante-2026-9241',
  workshopDate: localNoon(2026, 9, 20).toISOString(),
  accessDurationDays: 30,
  forceClose: false,
}

const duringAccess = localNoon(2026, 9, 24)

describe('shortcutKeywords', () => {
  it('keeps the words that name one conference', () => {
    assert.deepEqual(shortcutKeywords('React Alicante 2026'), ['alicante'])
    assert.deepEqual(shortcutKeywords('CityJS London 2026'), ['cityjs', 'london'])
    assert.deepEqual(shortcutKeywords('WhatTheStack 2026'), ['whatthestack'])
  })

  it('drops years, short words, and generic conference words', () => {
    assert.deepEqual(shortcutKeywords('React Summit US 2026'), [])
  })

  it('folds accents so the keyword is typeable', () => {
    assert.deepEqual(shortcutKeywords('JSConf Málaga'), ['jsconf', 'malaga'])
  })
})

describe('workshopShortcuts', () => {
  it('maps a conference keyword to the live session', () => {
    assert.deepEqual(workshopShortcuts([alicante], duringAccess).alicante, {
      token: 'react-alicante-2026-9241',
      event: 'React Alicante 2026',
    })
  })

  it('still maps before the session opens', () => {
    assert.equal(
      workshopShortcuts([alicante], localNoon(2026, 9, 1)).alicante?.token,
      'react-alicante-2026-9241'
    )
  })

  it('forgets a workshop once its access window closes', () => {
    assert.deepEqual(workshopShortcuts([alicante], localNoon(2026, 11, 1)), {})
  })

  it('forgets a force-closed workshop', () => {
    assert.deepEqual(workshopShortcuts([{ ...alicante, forceClose: true }], duringAccess), {})
  })

  it('skips instances with no access token', () => {
    assert.deepEqual(workshopShortcuts([{ ...alicante, token: undefined }], duringAccess), {})
  })

  it('gives a shared keyword to the session that is already open', () => {
    const upcoming: WorkshopShortcutInstance = {
      event: 'CityJS London 2027',
      token: 'cityjs-london-2027-abcd',
      workshopDate: localNoon(2027, 4, 15).toISOString(),
      accessDurationDays: 30,
      forceClose: false,
    }
    const open: WorkshopShortcutInstance = {
      event: 'CityJS Athens 2026',
      token: 'cityjs-athens-2026-wxyz',
      workshopDate: localNoon(2026, 9, 23).toISOString(),
      accessDurationDays: 30,
      forceClose: false,
    }
    const shortcuts = workshopShortcuts([upcoming, open], duringAccess)
    assert.equal(shortcuts.cityjs?.token, 'cityjs-athens-2026-wxyz')
    assert.equal(shortcuts.london?.token, 'cityjs-london-2027-abcd')
    assert.equal(shortcuts.athens?.token, 'cityjs-athens-2026-wxyz')
  })
})

describe('resolveWorkshopShortcut', () => {
  it('resolves a keyword to the access token', () => {
    assert.equal(
      resolveWorkshopShortcut('alicante', [alicante], duringAccess),
      'react-alicante-2026-9241'
    )
  })

  it('ignores case and stray whitespace', () => {
    assert.equal(
      resolveWorkshopShortcut(' Alicante ', [alicante], duringAccess),
      'react-alicante-2026-9241'
    )
  })

  it('returns null for an unknown keyword', () => {
    assert.equal(resolveWorkshopShortcut('geneva', [alicante], duringAccess), null)
  })

  it('never resolves a keyword to itself', () => {
    const selfNamed: WorkshopShortcutInstance = { ...alicante, token: 'alicante' }
    assert.equal(resolveWorkshopShortcut('alicante', [selfNamed], duringAccess), null)
  })
})

describe('terminalWorkshopRoutes', () => {
  it('routes the keyword URL, not the access token', () => {
    assert.deepEqual(terminalWorkshopRoutes([alicante], duringAccess), {
      alicante: {
        path: '/workshops/attend/alicante',
        note: 'opening React Alicante 2026 workshop materials…',
      },
    })
  })

  it('exposes no token to the client', () => {
    const serialized = JSON.stringify(terminalWorkshopRoutes([alicante], duringAccess))
    assert.equal(serialized.includes('react-alicante-2026-9241'), false)
  })
})
