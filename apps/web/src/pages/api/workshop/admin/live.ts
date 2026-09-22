export const prerender = false

import type { APIRoute } from 'astro'
import { queryWorkshopRoster, type WorkshopRosterRow } from '../../../../lib/posthog-query'
import { sanityFetch } from '../../../../lib/sanity/client'
import { workshopInstanceByTokenQuery } from '../../../../lib/sanity/queries'
import { getSanityWriteClient } from '../../../../lib/sanity/write-client'
import { getAccessPhase, getCloseDate } from '../../../../lib/workshop-access'
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionCookie,
} from '../../../../lib/workshop-session'

interface InstanceRow {
  _id: string
  title?: string
  event?: string
  token?: string
  workshopDate: string
  accessDurationDays: number
  forceClose: boolean
  liveEndedAt?: string | null
}

function requireAdmin(cookies: { get: (name: string) => { value: string } | undefined }) {
  return verifyAdminSessionCookie(cookies.get(ADMIN_SESSION_COOKIE)?.value)
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

/** Live roster snapshot for /admin/live. */
export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    if (!requireAdmin(cookies)) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const token = url.searchParams.get('token')?.trim()
    if (!token) {
      return json({ error: 'token required' }, 400)
    }

    const instance = await sanityFetch<InstanceRow | null>(workshopInstanceByTokenQuery, {
      token,
    }).catch((err) => {
      console.error('[workshop/admin/live] Sanity lookup failed:', err)
      return null
    })
    if (!instance) {
      return json({ error: 'Workshop not found' }, 404)
    }

    const phase = getAccessPhase({
      workshopDate: instance.workshopDate,
      accessDurationDays: instance.accessDurationDays ?? 7,
      forceClose: Boolean(instance.forceClose),
      liveEndedAt: instance.liveEndedAt,
    })
    const closeDate = getCloseDate({
      workshopDate: instance.workshopDate,
      accessDurationDays: instance.accessDurationDays ?? 7,
      forceClose: Boolean(instance.forceClose),
      liveEndedAt: instance.liveEndedAt,
    })

    let rows: WorkshopRosterRow[] = []
    let rosterError: string | undefined
    if (phase === 'live') {
      const roster = await queryWorkshopRoster(token)
      rows = roster.rows
      rosterError = roster.error
    }

    return json({
      phase,
      title: instance.title,
      event: instance.event,
      token: instance.token || token,
      liveEndedAt: instance.liveEndedAt || null,
      closeDateISO: closeDate.toISOString(),
      onlineCount: rows.filter((r) => r.focused).length,
      totalRecent: rows.length,
      rows,
      rosterError,
    })
  } catch (err) {
    console.error('[workshop/admin/live] GET failed:', err)
    return json(
      {
        error: 'Internal error',
        detail: err instanceof Error ? err.message : 'unknown',
      },
      500
    )
  }
}

/** End live session → materials stay open as readonly. */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    if (!requireAdmin(cookies)) {
      return json({ error: 'Unauthorized' }, 401)
    }

    let body: { token?: string; action?: string }
    try {
      body = (await request.json()) as typeof body
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }

    const token = body.token?.trim()
    if (!token) {
      return json({ error: 'token required' }, 400)
    }

    const action = body.action || 'end-live'
    if (action !== 'end-live' && action !== 'reopen-live') {
      return json({ error: 'Unknown action' }, 400)
    }

    const instance = await sanityFetch<InstanceRow | null>(workshopInstanceByTokenQuery, {
      token,
    }).catch((err) => {
      console.error('[workshop/admin/live] Sanity lookup failed:', err)
      return null
    })
    if (!instance) {
      return json({ error: 'Workshop not found' }, 404)
    }

    const writeClient = getSanityWriteClient()
    if (!writeClient) {
      return json(
        {
          error: 'SANITY_API_TOKEN required to end/reopen live (Editor+ token with write access)',
        },
        500
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
      return json({ error: 'Failed to update workshop instance' }, 502)
    }

    return json({ success: true, action })
  } catch (err) {
    console.error('[workshop/admin/live] POST failed:', err)
    return json(
      {
        error: 'Internal error',
        detail: err instanceof Error ? err.message : 'unknown',
      },
      500
    )
  }
}
