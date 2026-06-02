export const prerender = false

import type { APIRoute } from 'astro'
import { WorkshopFollowUpEmail } from '../../../emails/WorkshopFollowUpEmail'
import { sanityFetch } from '../../../lib/sanity/client'
import { workshopInstanceBySlugQuery } from '../../../lib/sanity/queries'
import { env, getFrom, resend, sendOrLog } from '../../../lib/email'

const FROM = getFrom('Faris Aziz')
const ADMIN_PASSWORD = env('ADMIN_PASSWORD')

interface WorkshopInstanceLookup {
  _id: string
  title?: string
  event?: string
  slug?: string
  token?: string
  resendAudienceId?: string
}

// Shape of contacts returned by `resend.contacts.list({ audienceId })`. The SDK's
// types vary by version, so we keep this loose.
interface ResendContact {
  id?: string
  email?: string
  first_name?: string | null
  last_name?: string | null
  unsubscribed?: boolean
}

interface FollowUpPayload {
  instanceSlug?: string
  feedbackUrl?: string
  dryRun?: boolean
}

export const POST: APIRoute = async ({ request }) => {
  // Auth — Bearer ADMIN_PASSWORD (same secret as /admin).
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!ADMIN_PASSWORD || token !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  let payload: FollowUpPayload
  try {
    payload = (await request.json()) as FollowUpPayload
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { instanceSlug, feedbackUrl, dryRun } = payload
  if (!instanceSlug?.trim()) {
    return new Response(JSON.stringify({ error: 'instanceSlug required' }), { status: 400 })
  }

  if (!resend || !FROM) {
    return new Response(
      JSON.stringify({ error: 'Email service not configured (RESEND_API_KEY or RESEND_FROM_EMAIL missing)' }),
      { status: 500 }
    )
  }

  // Resolve the workshop instance server-side — never trust client-supplied audience IDs.
  const instance = await sanityFetch<WorkshopInstanceLookup | null>(workshopInstanceBySlugQuery, {
    slug: instanceSlug,
  }).catch((err) => {
    console.error('[follow-up] Sanity lookup failed:', err)
    return null
  })

  if (!instance) {
    return new Response(JSON.stringify({ error: 'Workshop instance not found' }), { status: 404 })
  }
  if (!instance.resendAudienceId) {
    return new Response(
      JSON.stringify({ error: 'Workshop instance has no resendAudienceId configured' }),
      { status: 400 }
    )
  }

  const workshopTitle = instance.title || 'the workshop'
  const eventName = instance.event || instance.title || 'the workshop'

  // Fetch contacts in the audience. Resend's list endpoint returns all (no pagination
  // surfaced in the SDK at v6) — for very large audiences this would need batching,
  // but realistic workshop sizes (≤ a few hundred) fit in a single call.
  let contacts: ResendContact[] = []
  try {
    const listRes = await resend.contacts.list({ audienceId: instance.resendAudienceId })
    if (listRes.error) {
      console.error('[follow-up] Resend list error:', listRes.error)
      return new Response(JSON.stringify({ error: 'Failed to list audience contacts' }), { status: 502 })
    }
    // SDK shape: { data: { data: ResendContact[] } }
    const raw = (listRes.data as unknown as { data?: ResendContact[] })?.data ?? []
    contacts = raw.filter((c) => c.email && !c.unsubscribed)
  } catch (err) {
    console.error('[follow-up] Resend list exception:', err)
    return new Response(JSON.stringify({ error: 'Failed to list audience contacts' }), { status: 502 })
  }

  if (dryRun) {
    return new Response(
      JSON.stringify({
        dryRun: true,
        wouldSend: contacts.length,
        workshopTitle,
        event: eventName,
        recipients: contacts.map((c) => c.email),
      }),
      { status: 200 }
    )
  }

  // Send sequentially-batched to be polite to Resend (no documented hard rate limit
  // at low volumes, but parallel blasts can trip soft limits).
  let sent = 0
  let failed = 0
  for (const contact of contacts) {
    if (!contact.email) continue
    const firstName = contact.first_name?.trim() || ''
    const res = await sendOrLog({
      context: `follow-up:${instance.slug}`,
      from: FROM,
      to: contact.email,
      subject: `Thanks for joining ${eventName} — quick feedback?`,
      react: WorkshopFollowUpEmail({
        name: firstName,
        workshopTitle,
        event: eventName,
        feedbackUrl: feedbackUrl?.trim() || undefined,
      }),
    })
    if (res.ok) sent++
    else failed++
  }

  return new Response(JSON.stringify({ sent, failed, total: contacts.length }), { status: 200 })
}
