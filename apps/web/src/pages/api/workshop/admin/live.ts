export const prerender = false

import type { APIRoute } from 'astro'
import { queryWorkshopRoster } from '../../../../lib/posthog-query'
import { sanityFetch } from '../../../../lib/sanity/client'
import { workshopInstanceByTokenQuery } from '../../../../lib/sanity/queries'
import { getSanityWriteClient } from '../../../../lib/sanity/write-client'
import { getAccessPhase, getCloseDate } from '../../../../lib/workshop-access'
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionCookie,
} from '../../../../lib/workshop-session'
import type { WorkshopRosterRow } from '../../../../lib/posthog-query'

interface InstanceRow {
  _id: string
  title?: string
  event?: string
  token?: string
  workshopDate: string
  accessDurationDays: number
  forceClose: boolean
  liveEndedAt?: string | null
  sections?: { _key: string; title: string; emoji?: string }[]
}

function requireAdmin(cookies: { get: (name: string) => { value: string } | undefined }) {
  return verifyAdminSessionCookie(cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

/** Live roster snapshot for /admin/live. */
export const GET: APIRoute = async ({ cookies, url }) => {
  if (!requireAdmin(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const token = url.searchParams.get('token')?.trim()
  if (!token) {
    return new Response(JSON.stringify({ error: 'token required' }), { status: 400 })
  }

  const instance = await sanityFetch<InstanceRow | null>(workshopInstanceByTokenQuery, { token }).catch(
    () => null
  )
  if (!instance) {
    return new Response(JSON.stringify({ error: 'Workshop not found' }), { status: 404 })
  }

  const phase = getAccessPhase(instance)
  const closeDate = getCloseDate(instance)
  const roster =
    phase === 'live'
      ? await queryWorkshopRoster(token)
      : { rows: [] as WorkshopRosterRow[] }

  return new Response(
    JSON.stringify({
      phase,
      title: instance.title,
      event: instance.event,
      token: instance.token || token,
      liveEndedAt: instance.liveEndedAt || null,
      closeDateISO: closeDate.toISOString(),
      onlineCount: roster.rows.filter((r: WorkshopRosterRow) => r.focused).length,
      totalRecent: roster.rows.length,
      rows: roster.rows,
      rosterError: 'error' in roster ? roster.error : undefined,
    }),
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}

/** End live session → materials stay open as readonly. */
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!requireAdmin(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  let body: { token?: string; action?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const token = body.token?.trim()
  if (!token) {
    return new Response(JSON.stringify({ error: 'token required' }), { status: 400 })
  }

  const action = body.action || 'end-live'
  if (action !== 'end-live' && action !== 'reopen-live') {
    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 })
  }

  const instance = await sanityFetch<InstanceRow | null>(workshopInstanceByTokenQuery, { token }).catch(
    () => null
  )
  if (!instance) {
    return new Response(JSON.stringify({ error: 'Workshop not found' }), { status: 404 })
  }

  const writeClient = getSanityWriteClient()
  if (!writeClient) {
    return new Response(
      JSON.stringify({
        error: 'SANITY_API_TOKEN required to end/reopen live (Editor+ token with write access)',
      }),
      { status: 500 }
    )
  }

  try {
    if (action === 'end-live') {
      await writeClient.patch(instance._id).set({ liveEndedAt: new Date().toISOString() }).commit()
    } else {
      await writeClient.patch(instance._id).unset(['liveEndedAt']).commit()
    }
  } catch (err) {
    console.error('[workshop/admin/live] Sanity patch failed:', err)
    return new Response(JSON.stringify({ error: 'Failed to update workshop instance' }), { status: 502 })
  }

  return new Response(JSON.stringify({ success: true, action }), { status: 200 })
}
