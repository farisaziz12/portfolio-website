import { Resend } from 'resend'
import type { CreateEmailOptions, CreateEmailResponse } from 'resend'

// Read runtime env via process.env first, falling back to import.meta.env for local
// `astro dev`. On Vercel, non-public vars referenced through import.meta.env get inlined
// at build time and end up undefined at runtime — so process.env is the reliable source
// for the deployed serverless functions. This is why form submissions were silently
// hitting the "email-disabled" branch in the API routes instead of actually sending.
export const env = (key: string): string | undefined =>
  process.env[key] ?? (import.meta.env as Record<string, string | undefined>)[key]

const apiKey = env('RESEND_API_KEY')
const FROM_EMAIL = env('RESEND_FROM_EMAIL')

export const resend: Resend | null = apiKey ? new Resend(apiKey) : null

export function getFrom(label: string): string | null {
  return FROM_EMAIL ? `${label} <${FROM_EMAIL}>` : null
}

export function isEmailConfigured(): boolean {
  return Boolean(resend && FROM_EMAIL)
}

type SendArgs = CreateEmailOptions & {
  context: string
}

type SendOutcome =
  | { ok: true; data: CreateEmailResponse['data'] }
  | { ok: false; error: unknown }

// Send and log. Caller decides whether a failure is fatal — if so, check `outcome.ok`
// and return the appropriate HTTP error. The two-stage pattern in invite.ts /
// mentorship.ts is: critical admin notification (return 502 on !ok) followed by
// best-effort submitter confirmation (ignore !ok).
export async function sendOrLog({ context, ...args }: SendArgs): Promise<SendOutcome> {
  if (!resend) {
    console.error(`[email:${context}] resend client not initialized — RESEND_API_KEY missing`)
    return { ok: false, error: new Error('resend-not-configured') }
  }
  try {
    const res = await resend.emails.send(args)
    if (res.error) {
      console.error(`[email:${context}] send failed:`, res.error)
      return { ok: false, error: res.error }
    }
    return { ok: true, data: res.data }
  } catch (err) {
    console.error(`[email:${context}] exception:`, err)
    return { ok: false, error: err }
  }
}
