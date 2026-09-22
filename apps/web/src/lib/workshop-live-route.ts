import { queryWorkshopRoster, type WorkshopRosterRow } from './posthog-query'
import { getSanityWriteClient } from './sanity/write-client'
import { getAccessPhase, getCloseDate, type WorkshopInstance } from './workshop-access'

export type LiveAdminInstance = {
  _id: string
  title: string
  event: string
  token: string
  workshopDate: string
  accessDurationDays: number
  forceClose: boolean
  liveEndedAt?: string | null
  liveKeepOpen?: boolean | null
  sections?: { _key: string; title: string; emoji?: string }[]
}

export type LiveSnapshot = {
  phase: string
  title: string
  event: string
  token: string
  liveEndedAt: string | null
  liveKeepOpen: boolean
  closeDateISO: string
  onlineCount: number
  totalRecent: number
  rows: WorkshopRosterRow[]
  rosterError?: string
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

export function accessInputFromInstance(instance: LiveAdminInstance): WorkshopInstance {
  return {
    workshopDate: instance.workshopDate,
    accessDurationDays: instance.accessDurationDays ?? 7,
    forceClose: Boolean(instance.forceClose),
    liveEndedAt: instance.liveEndedAt,
    liveKeepOpen: Boolean(instance.liveKeepOpen),
  }
}

export async function buildLiveSnapshot(instance: LiveAdminInstance): Promise<LiveSnapshot> {
  const access = accessInputFromInstance(instance)
  const phase = getAccessPhase(access)
  const closeDate = getCloseDate(access)

  let rows: WorkshopRosterRow[] = []
  let rosterError: string | undefined
  if (phase === 'live') {
    const roster = await queryWorkshopRoster(instance.token)
    rows = roster.rows
    rosterError = roster.error
  }

  return {
    phase,
    title: instance.title,
    event: instance.event,
    token: instance.token,
    liveEndedAt: instance.liveEndedAt || null,
    liveKeepOpen: Boolean(instance.liveKeepOpen),
    closeDateISO: closeDate.toISOString(),
    onlineCount: rows.filter((r) => r.focused).length,
    totalRecent: rows.length,
    rows,
    rosterError,
  }
}

export type LiveActionResult =
  | {
      ok: true
      action: 'end-live' | 'reopen-live'
      liveEndedAt: string | null
      liveKeepOpen: boolean
    }
  | { ok: false; status: number; error: string }

export async function applyLiveAction(instanceId: string, action: string): Promise<LiveActionResult> {
  if (action !== 'end-live' && action !== 'reopen-live') {
    return { ok: false, status: 400, error: 'Unknown action' }
  }

  const writeClient = getSanityWriteClient()
  if (!writeClient) {
    return {
      ok: false,
      status: 500,
      error: 'SANITY_API_TOKEN required to end/reopen live (Editor+ token with write access)',
    }
  }

  if (action === 'end-live') {
    const liveEndedAt = new Date().toISOString()
    await writeClient.patch(instanceId).set({ liveEndedAt }).unset(['liveKeepOpen']).commit()
    return { ok: true, action, liveEndedAt, liveKeepOpen: false }
  }

  await writeClient.patch(instanceId).unset(['liveEndedAt']).set({ liveKeepOpen: true }).commit()
  return { ok: true, action, liveEndedAt: null, liveKeepOpen: true }
}
