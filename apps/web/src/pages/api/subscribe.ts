export const prerender = false

import type { APIRoute } from 'astro'
import { subscribe } from '../../lib/beehiiv/subscriptions'
import { isBeehiivConfigured } from '../../lib/beehiiv/client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Valid `source` values map 1:1 to utm_source on the Beehiiv subscription so we
// can attribute signups per surface in the Beehiiv dashboard. Keep this allowlist
// tight — silently coerce anything unknown to 'website'.
const VALID_SOURCES = new Set([
  'home',
  'subscribe-page',
  'newsletter-archive',
  'blog-cta',
  'footer',
  'website',
])

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string; source?: string }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 })
  }

  const source = body.source && VALID_SOURCES.has(body.source) ? body.source : 'website'

  // Graceful fallback: when the env isn't wired up yet, still show success on the
  // form rather than surfacing a 500 to the user. Mirrors the email-disabled
  // pattern used elsewhere — log the warning so we notice in Vercel logs.
  if (!isBeehiivConfigured()) {
    console.warn('[api/subscribe] beehiiv not configured — skipping subscription')
    return new Response(
      JSON.stringify({ success: true, warning: 'newsletter-disabled' }),
      { status: 200 }
    )
  }

  const res = await subscribe({ email, source })

  if (!res.ok) {
    // Beehiiv returns 400 for already-subscribed addresses on some publication
    // configurations. From the user's POV that's a success — they're on the list.
    // Treat anything that looks like a duplicate as success.
    const looksLikeDuplicate = /already|exists|duplicat/i.test(res.error)
    if (looksLikeDuplicate) {
      return new Response(JSON.stringify({ success: true, alreadySubscribed: true }), { status: 200 })
    }
    return new Response(
      JSON.stringify({ error: 'Subscription failed', detail: res.error }),
      { status: 502 }
    )
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
