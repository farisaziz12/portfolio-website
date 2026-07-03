export const prerender = false

import type { APIRoute } from 'astro'
import { ContactConfirmationEmail } from '../../emails/ContactConfirmationEmail'
import { ContactAdminEmail } from '../../emails/ContactAdminEmail'
import { env, getFrom, isEmailConfigured, sendOrLog } from '../../lib/email'

// Where general contact messages (incl. full-time role inquiries) land.
// Defaults to faris@zurichjs.com; CONTACT_INBOX (or INVITE_INBOX) overrides.
const INBOX = env('CONTACT_INBOX') || env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM = getFrom('Website Contact')

const TOPICS: Record<string, string> = {
  role: 'Full-time role',
  speaking: 'Speaking',
  consulting: 'Consulting',
  mentorship: 'Mentorship',
  other: 'Something else',
}

interface ContactPayload {
  name?: string
  email?: string
  topic?: string
  company?: string
  message?: string
}

export const POST: APIRoute = async ({ request }) => {
  let payload: ContactPayload
  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { name, email, topic, company, message } = payload
  const topicLabel = TOPICS[topic || ''] || TOPICS.other

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(
      JSON.stringify({ error: 'Name, email, and a message are required.' }),
      { status: 400 }
    )
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return new Response(JSON.stringify({ error: 'Email looks invalid.' }), { status: 400 })
  }

  if (!isEmailConfigured() || !FROM) {
    console.error('Contact endpoint not fully configured — missing one of: RESEND_API_KEY, RESEND_FROM_EMAIL')
    return new Response(JSON.stringify({ success: true, warning: 'email-disabled' }), { status: 200 })
  }

  const subject = `Contact · ${topicLabel} · ${name}`
  const text =
    `New contact message\n\n` +
    `From: ${name} <${email}>\n` +
    `Topic: ${topicLabel}\n` +
    `Company: ${company || '—'}\n\n` +
    `Message:\n${message}\n`

  // 1) Notification to Faris — primary critical path. Failure → 502.
  const adminRes = await sendOrLog({
    context: 'contact:admin',
    from: FROM,
    to: INBOX,
    replyTo: email,
    subject,
    text,
    react: ContactAdminEmail({
      name: name.trim(),
      email: email.trim(),
      topic: topicLabel,
      company: company?.trim() || undefined,
      message: message.trim(),
    }),
  })
  if (!adminRes.ok) {
    return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 })
  }

  // 2) Confirmation to the submitter — best-effort. Logged but never blocks success.
  const firstName = name.trim().split(/\s+/)[0]
  await sendOrLog({
    context: 'contact:confirm',
    from: FROM,
    to: email,
    subject: `Thanks — I'll reply within two days`,
    react: ContactConfirmationEmail({ name: firstName }),
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
