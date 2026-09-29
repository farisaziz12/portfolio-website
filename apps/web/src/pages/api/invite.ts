export const prerender = false

import type { APIRoute } from 'astro'
import { InviteConfirmationEmail } from '../../emails/InviteConfirmationEmail'
import { InviteAdminEmail } from '../../emails/InviteAdminEmail'
import { env, getFrom, isEmailConfigured, sendOrLog } from '../../lib/email'
import { EMAIL_RE, LIMITS, clean, inquiryRef, json, tooLong } from '../../lib/inquiry'
import { kindDef, toKind } from '../../lib/invite-kinds'

// Where invitations land. Defaults to faris@zurichjs.com; INVITE_INBOX env
// overrides for staging / preview environments.
const INBOX = env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM = getFrom('Invite Form')

/**
 * Responses (the form shows success ONLY on 200):
 * - 200 `{ ok: true, ref, confirmationSent }` — admin notification accepted by Resend.
 * - 400 `{ error: 'invalid', fields: [...] }` — validation.
 * - 503 `{ error: 'not-configured' }` — RESEND_API_KEY / RESEND_FROM_EMAIL missing. Nothing stored.
 * - 502 `{ error: 'delivery-failed' }` — Resend rejected the admin notification. Nothing stored.
 */
export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'invalid', message: 'Invalid JSON' }, 400)
  }

  const kind = toKind(clean(payload.kind) || clean(payload.format)) ?? 'other'
  const kindLabel = kindDef(kind).label
  const name = clean(payload.name)
  const email = clean(payload.email)
  // `what` is the dynamic third field; `event` kept for older clients.
  const what = clean(payload.what) || clean(payload.event)
  const when = clean(payload.when) || clean(payload.date)
  const audience = clean(payload.audience) || clean(payload.size)
  const message = clean(payload.message)

  const missing = [!name && 'name', !EMAIL_RE.test(email) && 'email', !what && 'what'].filter(Boolean) as string[]
  const long = tooLong({
    name: [name, LIMITS.short],
    email: [email, LIMITS.email],
    what: [what, LIMITS.line],
    when: [when, LIMITS.short],
    audience: [audience, LIMITS.short],
    message: [message, LIMITS.long],
  })
  if (missing.length || long.length) {
    return json({ error: 'invalid', fields: [...missing, ...long] }, 400)
  }

  if (!isEmailConfigured() || !FROM) {
    // Fail loudly: a success screen here would lose the inquiry.
    console.error('[invite] not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL; inquiry NOT stored')
    return json({ error: 'not-configured' }, 503)
  }

  const ref = inquiryRef()
  const subject = `Invite · ${kindLabel} · ${what} · ${ref}`
  const text =
    `New invitation (${ref})\n\n` +
    `From: ${name} <${email}>\n` +
    `For: ${kindLabel}\n` +
    `What: ${what}\n` +
    `When: ${when || '–'}\n` +
    `Audience: ${audience || '–'}\n\n` +
    `${message || '(nothing else added)'}\n`

  // 1) Notification to Faris: the inquiry only counts as stored once Resend accepts this.
  const adminRes = await sendOrLog({
    context: 'invite:admin',
    from: FROM,
    to: INBOX,
    replyTo: email,
    subject,
    text,
    react: InviteAdminEmail({
      name,
      email,
      event: what,
      date: when || undefined,
      format: kindLabel,
      size: audience || undefined,
      message: [message, `Ref: ${ref}`].filter(Boolean).join('\n\n'),
    }),
  })
  if (!adminRes.ok) {
    return json({ error: 'delivery-failed' }, 502)
  }

  // 2) Confirmation to the submitter: best-effort, reported but never blocks success.
  const confirm = await sendOrLog({
    context: 'invite:confirm',
    from: FROM,
    to: email,
    subject: `Thanks · I'll reply within two working days`,
    react: InviteConfirmationEmail({ name: name.split(/\s+/)[0], event: what }),
  })

  return json({ ok: true, success: true, ref, confirmationSent: confirm.ok })
}
