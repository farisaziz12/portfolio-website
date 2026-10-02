export const prerender = false

import type { APIRoute } from 'astro'
import { ContactConfirmationEmail } from '../../emails/ContactConfirmationEmail'
import { ContactAdminEmail } from '../../emails/ContactAdminEmail'
import { env, getFrom, isEmailConfigured, sendOrLog } from '../../lib/email'
import { getProfile } from '../../lib/sanity/v3'
import { EMAIL_RE, LIMITS, clean, inquiryRef, json, tooLong } from '../../lib/inquiry'

// Where general contact messages (incl. full-time role inquiries) land.
// Defaults to faris@zurichjs.com; CONTACT_INBOX (or INVITE_INBOX) overrides.
const INBOX = env('CONTACT_INBOX') || env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM = getFrom('Website Contact')

const TOPICS: Record<string, string> = {
  role: 'Full-time role',
  speaking: 'Speaking',
  press: 'Podcast or press',
  consulting: 'Consulting',
  mentorship: 'Mentorship',
  other: 'Something else',
}

/**
 * Same response contract as /api/invite: 200 `{ ok, ref, confirmationSent }` only
 * once Resend accepted the admin notification; 400 invalid; 503 not-configured;
 * 502 delivery-failed. `name` is optional (the V3 form asks for email + message).
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
  const company = clean(payload.company)
  const message = clean(payload.message)
  const topicLabel = TOPICS[clean(payload.topic)] || TOPICS.other

  const missing = [!EMAIL_RE.test(email) && 'email', !message && 'message'].filter(Boolean) as string[]
  const long = tooLong({
    name: [name, LIMITS.short],
    email: [email, LIMITS.email],
    company: [company, LIMITS.short],
    message: [message, LIMITS.long],
  })
  if (missing.length || long.length) {
    return json({ error: 'invalid', fields: [...missing, ...long] }, 400)
  }

  if (!isEmailConfigured() || !FROM) {
    console.error('[contact] not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL; message NOT stored')
    return json({ error: 'not-configured' }, 503)
  }

  const ref = inquiryRef()
  const who = name || email
  const subject = `Contact · ${topicLabel} · ${who} · ${ref}`
  const text =
    `New contact message (${ref})\n\n` +
    `From: ${name ? `${name} <${email}>` : email}\n` +
    `Topic: ${topicLabel}\n` +
    `Company: ${company || '–'}\n\n` +
    `Message:\n${message}\n`

  // 1) Notification to Faris: the message only counts as stored once Resend accepts this.
  const adminRes = await sendOrLog({
    context: 'contact:admin',
    from: FROM,
    to: INBOX,
    replyTo: email,
    subject,
    text,
    react: ContactAdminEmail({
      name: who,
      email,
      topic: topicLabel,
      company: company || undefined,
      message: `${message}\n\nRef: ${ref}`,
    }),
  })
  if (!adminRes.ok) {
    return json({ error: 'delivery-failed' }, 502)
  }

  // 2) Confirmation to the submitter: best-effort, reported but never blocks success.
  const { replyTime } = await getProfile()
  const confirm = await sendOrLog({
    context: 'contact:confirm',
    from: FROM,
    to: email,
    subject: `Thanks · I'll reply within ${replyTime}`,
    react: ContactConfirmationEmail({ name: name ? name.split(/\s+/)[0] : undefined, replyTime }),
  })

  return json({ ok: true, success: true, ref, confirmationSent: confirm.ok })
}
