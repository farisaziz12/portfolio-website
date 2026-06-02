export const prerender = false

import type { APIRoute } from 'astro'
import { MentorshipConfirmationEmail } from '../../emails/MentorshipConfirmationEmail'
import { MentorshipAdminEmail } from '../../emails/MentorshipAdminEmail'
import { env, getFrom, isEmailConfigured, sendOrLog } from '../../lib/email'

// Where mentorship inquiries land. Defaults to faris@zurichjs.com; MENTORSHIP_INBOX
// (or INVITE_INBOX) env overrides for staging / preview environments.
const INBOX = env('MENTORSHIP_INBOX') || env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM = getFrom('Mentorship Inquiry')

interface MentorshipPayload {
  name?: string
  email?: string
  goals?: string
  currency?: string
  budget?: string
  timeline?: string
  cadence?: string
  message?: string
}

export const POST: APIRoute = async ({ request }) => {
  let payload: MentorshipPayload
  try {
    payload = (await request.json()) as MentorshipPayload
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { name, email, goals, currency, budget, timeline, cadence, message } = payload
  const currencyLabel = currency ? currency.toUpperCase() : ''
  const budgetLine = budget ? (currencyLabel ? `${budget} (${currencyLabel}/month)` : budget) : ''

  if (!name?.trim() || !email?.trim() || !goals?.trim()) {
    return new Response(
      JSON.stringify({ error: 'Name, email, and goals are required.' }),
      { status: 400 }
    )
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return new Response(JSON.stringify({ error: 'Email looks invalid.' }), { status: 400 })
  }

  if (!isEmailConfigured() || !FROM) {
    console.error('Mentorship endpoint not fully configured — missing one of: RESEND_API_KEY, RESEND_FROM_EMAIL')
    return new Response(JSON.stringify({ success: true, warning: 'email-disabled' }), { status: 200 })
  }

  const subject = `Mentorship inquiry · ${name}`
  const text =
    `New mentorship inquiry\n\n` +
    `From: ${name} <${email}>\n` +
    `Budget: ${budgetLine || '—'}\n` +
    `Timeline: ${timeline || '—'}\n` +
    `Preferred cadence: ${cadence || '—'}\n\n` +
    `Goals:\n${goals}\n\n` +
    `${message ? `Additional notes:\n${message}\n` : ''}`

  // 1) Notification to Faris — primary critical path. Failure → 502.
  const adminRes = await sendOrLog({
    context: 'mentorship:admin',
    from: FROM,
    to: INBOX,
    replyTo: email,
    subject,
    text,
    react: MentorshipAdminEmail({
      name: name.trim(),
      email: email.trim(),
      budgetLine: budgetLine || undefined,
      timeline: timeline?.trim() || undefined,
      cadence: cadence?.trim() || undefined,
      goals: goals.trim(),
      message: message?.trim() || undefined,
    }),
  })
  if (!adminRes.ok) {
    return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 })
  }

  // 2) Confirmation to the submitter — best-effort. Logged but never blocks success.
  const firstName = name.trim().split(/\s+/)[0]
  await sendOrLog({
    context: 'mentorship:confirm',
    from: FROM,
    to: email,
    subject: `Thanks — I'll reply within two days`,
    react: MentorshipConfirmationEmail({ name: firstName }),
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
