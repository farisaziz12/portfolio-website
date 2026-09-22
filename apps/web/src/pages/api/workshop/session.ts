export const prerender = false

import type { APIRoute } from 'astro'
import { sanityFetch } from '../../../lib/sanity/client'
import { workshopInstanceByTokenQuery } from '../../../lib/sanity/queries'
import { getAccessStatus, getCloseDate } from '../../../lib/workshop-access'
import { subscribeContact } from '../../../lib/workshop-subscribe'
import {
  WORKSHOP_SESSION_COOKIE,
  createWorkshopSessionCookie,
  verifyWorkshopSessionCookie,
  workshopCookieOptions,
} from '../../../lib/workshop-session'

interface InstanceRow {
  _id: string
  title?: string
  event?: string
  token?: string
  workshopDate: string
  accessDurationDays: number
  forceClose: boolean
}

/** Resume session from cookie for a given attend token. */
export const GET: APIRoute = async ({ cookies, url }) => {
  const token = url.searchParams.get('token')?.trim()
  if (!token) {
    return new Response(JSON.stringify({ error: 'token required' }), { status: 400 })
  }

  const session = verifyWorkshopSessionCookie(cookies.get(WORKSHOP_SESSION_COOKIE)?.value, token)
  if (!session) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 200 })
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: { name: session.name, email: session.email },
    }),
    { status: 200 }
  )
}

/** Gate submit: Resend subscribe + signed httpOnly session cookie. */
export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { name?: string; email?: string; token?: string; event?: string; consent?: boolean }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const name = body.name?.trim() || ''
  const email = body.email?.trim().toLowerCase() || ''
  const token = body.token?.trim() || ''
  const event = body.event?.trim() || ''

  if (!name || !email || !token) {
    return new Response(JSON.stringify({ error: 'name, email, and token are required' }), {
      status: 400,
    })
  }

  const instance = await sanityFetch<InstanceRow | null>(workshopInstanceByTokenQuery, { token }).catch(
    () => null
  )
  if (!instance) {
    return new Response(JSON.stringify({ error: 'Workshop not found' }), { status: 404 })
  }

  const status = getAccessStatus(instance)
  if (status !== 'open') {
    return new Response(JSON.stringify({ error: 'Workshop materials are not available' }), {
      status: 403,
    })
  }

  const subscribeResult = await subscribeContact({
    name,
    email,
    source: 'workshop-attend',
    instanceToken: token,
    event: event || instance.event,
  })
  if (!subscribeResult.ok) {
    return new Response(JSON.stringify({ error: subscribeResult.error }), {
      status: subscribeResult.status,
    })
  }

  const closeDate = getCloseDate(instance)
  const maxAgeSec = Math.max(60, Math.floor((closeDate.getTime() - Date.now()) / 1000))
  const expEpochSec = Math.floor(closeDate.getTime() / 1000)
  const cookieValue = createWorkshopSessionCookie({
    token,
    email,
    name,
    expEpochSec,
  })

  if (!cookieValue) {
    return new Response(
      JSON.stringify({ error: 'Session secret not configured (WORKSHOP_SESSION_SECRET or ADMIN_PASSWORD)' }),
      { status: 500 }
    )
  }

  cookies.set(WORKSHOP_SESSION_COOKIE, cookieValue, workshopCookieOptions(maxAgeSec))

  return new Response(
    JSON.stringify({
      success: true,
      user: { name, email },
    }),
    { status: 200 }
  )
}
