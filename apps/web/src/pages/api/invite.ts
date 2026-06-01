export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { InviteConfirmationEmail } from '../../emails/InviteConfirmationEmail'

// Read runtime env via process.env first, falling back to import.meta.env for local
// `astro dev`. On Vercel, non-public vars referenced through import.meta.env get inlined
// at build time and end up undefined at runtime — so process.env is the reliable source
// for the deployed serverless functions. This is why form submissions were silently
// hitting the "email-disabled" branch below instead of actually sending.
const env = (key: string): string | undefined => process.env[key] ?? import.meta.env[key]

const apiKey = env('RESEND_API_KEY')
const resend = apiKey ? new Resend(apiKey) : null

// Where speaking invitations land. Defaults to faris@zurichjs.com; INVITE_INBOX env
// overrides for staging / preview environments.
const INBOX = env('INVITE_INBOX') || 'faris@zurichjs.com'
const FROM_EMAIL = env('RESEND_FROM_EMAIL')
const FROM = FROM_EMAIL ? `Invite Form <${FROM_EMAIL}>` : null

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

  if (!resend || !FROM) {
    console.error('Invite endpoint not fully configured — missing one of: RESEND_API_KEY, RESEND_FROM_EMAIL')
    // Still return 200 so the form shows success — log so we can recover manually.
    return new Response(JSON.stringify({ success: true, warning: 'email-disabled' }), { status: 200 })
  }

  const subject = `Speaking invite · ${event}`
  const text = `New speaking invitation\n\nFrom: ${name} <${email}>\nEvent: ${event}\nDate: ${date || '—'}\nLocation: ${location || '—'}\nFormat: ${format || '—'}\nAudience size: ${size || '—'}\n\n${message || '(no additional details)'}\n`

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,system-ui,sans-serif;background:#0A0C10;color:#F3F5F8;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#151A23;border:1px solid #232B36;border-radius:14px;padding:28px;">
    <p style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#6A7686;margin:0 0 10px;">Speaking invite</p>
    <h1 style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:22px;font-weight:600;color:#F3F5F8;margin:0 0 16px;">${esc(event)}</h1>
    <p style="color:#A9B4C2;margin:0 0 20px;">From <b style="color:#F3F5F8;">${esc(name)}</b> &lt;<a style="color:#6AA1FF;" href="mailto:${esc(email)}">${esc(email)}</a>&gt;</p>
    <table style="width:100%;font-size:14px;color:#A9B4C2;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6A7686;width:120px;">Date</td><td style="color:#F3F5F8;">${esc(date) || '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#6A7686;">Location</td><td style="color:#F3F5F8;">${esc(location) || '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#6A7686;">Format</td><td style="color:#F3F5F8;">${esc(format) || '—'}</td></tr>
      <tr><td style="padding:6px 0;color:#6A7686;">Audience size</td><td style="color:#F3F5F8;">${esc(size) || '—'}</td></tr>
    </table>
    <p style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6A7686;margin:24px 0 6px;">Message</p>
    <p style="color:#F3F5F8;white-space:pre-wrap;line-height:1.55;margin:0;">${esc(message) || '(no additional details)'}</p>
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
      console.error('Invite notification send failed:', res.error)
      return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 })
    }
  } catch (err) {
    console.error('Invite notification exception:', err)
    return new Response(JSON.stringify({ error: 'Email delivery failed' }), { status: 502 })
  }

  // 2) Confirmation to the submitter — best-effort. Logged but never blocks success.
  const firstName = name.trim().split(/\s+/)[0]
  try {
    const confirmRes = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Thanks — I'll reply within two days`,
      react: InviteConfirmationEmail({ name: firstName, event: event.trim() }),
    })
    if (confirmRes.error) console.error('Invite confirmation send failed:', confirmRes.error)
  } catch (err) {
    console.error('Invite confirmation exception:', err)
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
