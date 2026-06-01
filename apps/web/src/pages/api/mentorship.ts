export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { MentorshipConfirmationEmail } from '../../emails/MentorshipConfirmationEmail'

// Read runtime env via process.env first, falling back to import.meta.env for local
// `astro dev`. On Vercel, non-public vars referenced through import.meta.env get inlined
// at build time and end up undefined at runtime — so process.env is the reliable source
// for the deployed serverless functions. This is why form submissions were silently
// hitting the "email-disabled" branch below instead of actually sending.
const env = (key: string): string | undefined => process.env[key] ?? import.meta.env[key]

const apiKey = env('RESEND_API_KEY')
const resend = apiKey ? new Resend(apiKey) : null

// Where mentorship inquiries land. Defaults to faris@zurichjs.com; MENTORSHIP_INBOX
// (or INVITE_INBOX) env overrides for staging / preview environments.
const INBOX = env('MENTORSHIP_INBOX') || env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM_EMAIL = env('RESEND_FROM_EMAIL')
const FROM = FROM_EMAIL ? `Mentorship Inquiry <${FROM_EMAIL}>` : null

function esc(value: unknown): string {
  if (value == null) return ''
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] as string))
}

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

  if (!resend || !FROM) {
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

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,system-ui,sans-serif;background:#0A0C10;color:#F3F5F8;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#151A23;border:1px solid #232B36;border-radius:14px;padding:28px;">
    <p style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#6A7686;margin:0 0 10px;">Mentorship inquiry</p>
    <h1 style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:22px;font-weight:600;color:#F3F5F8;margin:0 0 16px;">${esc(name)}</h1>
    <p style="color:#A9B4C2;margin:0 0 20px;"><a style="color:#6AA1FF;" href="mailto:${esc(email)}">${esc(email)}</a></p>
    <table style="width:100%;font-size:14px;color:#A9B4C2;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6A7686;width:140px;">Budget</td><td style="color:#F3F5F8;">${esc(budgetLine) || '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#6A7686;">Timeline</td><td style="color:#F3F5F8;">${esc(timeline) || '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#6A7686;">Preferred cadence</td><td style="color:#F3F5F8;">${esc(cadence) || '—'}</td></tr>
    </table>
    <p style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6A7686;margin:24px 0 6px;">Goals</p>
    <p style="color:#F3F5F8;white-space:pre-wrap;line-height:1.55;margin:0;">${esc(goals)}</p>
    ${message ? `
    <p style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6A7686;margin:24px 0 6px;">Additional notes</p>
    <p style="color:#F3F5F8;white-space:pre-wrap;line-height:1.55;margin:0;">${esc(message)}</p>
    ` : ''}
    <p style="color:#6A7686;font-size:12px;margin:28px 0 0;">Reply directly — this email's reply-to is set to the sender.</p>
  </div>
</body></html>`

  // 1) Notification to Faris — primary critical path. Failure → 502.
  try {
    const res = await resend.emails.send({
      from: FROM,
      to: INBOX,
      replyTo: email,
      subject,
      text,
      html,
    })
    if (res.error) {
      console.error('Mentorship notification send failed:', res.error)
      return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 })
    }
  } catch (err) {
    console.error('Mentorship notification exception:', err)
    return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 })
  }

  // 2) Confirmation to the submitter — best-effort. Logged but never blocks success.
  const firstName = name.trim().split(/\s+/)[0]
  try {
    const confirmRes = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Thanks — I'll reply within two days`,
      react: MentorshipConfirmationEmail({ name: firstName }),
    })
    if (confirmRes.error) console.error('Mentorship confirmation send failed:', confirmRes.error)
  } catch (err) {
    console.error('Mentorship confirmation exception:', err)
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
