export const prerender = false

import type { APIRoute } from 'astro'
import { InviteConfirmationEmail } from '../../emails/InviteConfirmationEmail'
import { InviteAdminEmail } from '../../emails/InviteAdminEmail'
import { env, getFrom, isEmailConfigured, sendOrLog } from '../../lib/email'

// Where speaking invitations land. Defaults to faris@zurichjs.com; INVITE_INBOX env
// overrides for staging / preview environments.
const INBOX = env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM = getFrom('Invite Form')

interface InvitePayload {
  name?: string
  email?: string
  event?: string
  date?: string
  location?: string
  format?: string
  size?: string
  message?: string
}

export const POST: APIRoute = async ({ request }) => {
  let payload: InvitePayload
  try {
    payload = (await request.json()) as InvitePayload
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { name, email, event, date, location, format, size, message } = payload

  if (!name?.trim() || !email?.trim() || !event?.trim()) {
    return new Response(
      JSON.stringify({ error: 'Name, email, and event are required.' }),
      { status: 400 }
    )
  }
  // Minimal sanity check on email shape
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return new Response(JSON.stringify({ error: 'Email looks invalid.' }), { status: 400 })
  }

  if (!isEmailConfigured() || !FROM) {
    console.error('Invite endpoint not fully configured — missing one of: RESEND_API_KEY, RESEND_FROM_EMAIL')
    // Still return 200 so the form shows success — log so we can recover manually.
    return new Response(JSON.stringify({ success: true, warning: 'email-disabled' }), { status: 200 })
  }

  const subject = `Speaking invite · ${event}`
  const text = `New speaking invitation\n\nFrom: ${name} <${email}>\nEvent: ${event}\nDate: ${date || '–'}\nLocation: ${location || '–'}\nFormat: ${format || '–'}\nAudience size: ${size || '–'}\n\n${message || '(no additional details)'}\n`

  // 1) Notification to Faris — primary critical path. Failure → 502.
  const adminRes = await sendOrLog({
    context: 'invite:admin',
    from: FROM,
    to: INBOX,
    replyTo: email,
    subject,
    text,
    react: InviteAdminEmail({
      name: name.trim(),
      email: email.trim(),
      event: event.trim(),
      date: date?.trim(),
      location: location?.trim(),
      format: format?.trim(),
      size: size?.trim(),
      message: message?.trim(),
    }),
  })
  if (!adminRes.ok) {
    return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 })
  }

  // 2) Confirmation to the submitter — best-effort. Logged but never blocks success.
  const firstName = name.trim().split(/\s+/)[0]
  await sendOrLog({
    context: 'invite:confirm',
    from: FROM,
    to: email,
    subject: `Thanks · I'll reply within two days`,
    react: InviteConfirmationEmail({ name: firstName, event: event.trim() }),
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
