export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = import.meta.env.RESEND_API_KEY ? new Resend(import.meta.env.RESEND_API_KEY) : null
const AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID

export const GET: APIRoute = async ({ cookies }) => {
  if (cookies.get('admin_session')?.value !== 'valid') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  if (!resend || !AUDIENCE_ID) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 })
  }

  const res = await resend.contacts.list({ audienceId: AUDIENCE_ID })
  if (res.error || !res.data) {
    return new Response(JSON.stringify({ error: 'Failed to fetch contacts' }), { status: 500 })
  }

  const contacts = res.data.data.map((c: any) => ({
    id: c.id,
    email: c.email,
    firstName: c.first_name || '',
    lastName: c.last_name || '',
    unsubscribed: c.unsubscribed,
    createdAt: c.created_at,
  }))

  const active = contacts.filter((c: any) => !c.unsubscribed)
  const unsubscribed = contacts.filter((c: any) => c.unsubscribed)

  return new Response(JSON.stringify({
    total: contacts.length,
    active: active.length,
    unsubscribed: unsubscribed.length,
    contacts,
  }), { status: 200 })
}
