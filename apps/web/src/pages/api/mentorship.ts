export const prerender = false

import type { APIRoute } from 'astro'
import { MentorshipConfirmationEmail } from '../../emails/MentorshipConfirmationEmail'
import { MentorshipAdminEmail } from '../../emails/MentorshipAdminEmail'
import { env, getFrom, isEmailConfigured, sendOrLog } from '../../lib/email'
import { getProfile } from '../../lib/sanity/v3'
import { EMAIL_RE, LIMITS, clean, inquiryRef, json, tooLong } from '../../lib/inquiry'

// Where mentorship inquiries land. Defaults to faris@zurichjs.com; MENTORSHIP_INBOX
// (or INVITE_INBOX) env overrides for staging / preview environments.
const INBOX = env('MENTORSHIP_INBOX') || env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM = getFrom('Mentorship Inquiry')

/**
 * Same response contract as /api/invite and /api/contact: 200 `{ ok, ref, confirmationSent }`
 * only once Resend accepted the admin notification; 400 invalid; 503 not-configured
 * (never a silent success); 502 delivery-failed.
 */
export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'invalid', message: 'Invalid JSON' }, 400)
  }

  const name = clean(payload.name)
  const email = clean(payload.email)
  const goals = clean(payload.goals)
  const currency = clean(payload.currency)
  const budget = clean(payload.budget)
  const timeline = clean(payload.timeline)
  const cadence = clean(payload.cadence)
  const message = clean(payload.message)

  const missing = [!name && 'name', !EMAIL_RE.test(email) && 'email', !goals && 'goals'].filter(Boolean) as string[]
  const long = tooLong({
    name: [name, LIMITS.short],
    email: [email, LIMITS.email],
    goals: [goals, LIMITS.long],
    currency: [currency, LIMITS.short],
    budget: [budget, LIMITS.short],
    timeline: [timeline, LIMITS.short],
    cadence: [cadence, LIMITS.short],
    message: [message, LIMITS.long],
  })
  if (missing.length || long.length) {
    return json({ error: 'invalid', fields: [...missing, ...long] }, 400)
  }

  if (!isEmailConfigured() || !FROM) {
    console.error('[mentorship] not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL; inquiry NOT stored')
    return json({ error: 'not-configured' }, 503)
  }

  const ref = inquiryRef()
  const currencyLabel = currency.toUpperCase()
  const budgetLine = budget ? (currencyLabel ? `${budget} (${currencyLabel}/month)` : budget) : ''
  const subject = `Mentorship inquiry · ${name} · ${ref}`
  const text =
    `New mentorship inquiry (${ref})\n\n` +
    `From: ${name} <${email}>\n` +
    `Budget: ${budgetLine || '–'}\n` +
    `Timeline: ${timeline || '–'}\n` +
    `Preferred cadence: ${cadence || '–'}\n\n` +
    `Goals:\n${goals}\n\n` +
    `${message ? `Additional notes:\n${message}\n` : ''}`

  // 1) Notification to Faris: the inquiry only counts as stored once Resend accepts this.
  const adminRes = await sendOrLog({
    context: 'mentorship:admin',
    from: FROM,
    to: INBOX,
    replyTo: email,
    subject,
    text,
    react: MentorshipAdminEmail({
      name,
      email,
      budgetLine: budgetLine || undefined,
      timeline: timeline || undefined,
      cadence: cadence || undefined,
      goals,
      message: [message, `Ref: ${ref}`].filter(Boolean).join('\n\n'),
    }),
  })
  if (!adminRes.ok) {
    return json({ error: 'delivery-failed' }, 502)
  }

  // 2) Confirmation to the submitter: best-effort, reported but never blocks success.
  const { replyTime } = await getProfile()
  const confirm = await sendOrLog({
    context: 'mentorship:confirm',
    from: FROM,
    to: email,
    subject: `Thanks · I'll reply within ${replyTime}`,
    react: MentorshipConfirmationEmail({ name: name.split(/\s+/)[0], replyTime }),
  })

  return json({ ok: true, success: true, ref, confirmationSent: confirm.ok })
}
