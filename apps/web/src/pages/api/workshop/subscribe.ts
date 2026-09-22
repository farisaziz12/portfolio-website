export const prerender = false

import type { APIRoute } from 'astro'
import { subscribeContact } from '../../../lib/workshop-subscribe'

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const result = await subscribeContact({
    name: typeof body.name === 'string' ? body.name : undefined,
    email: typeof body.email === 'string' ? body.email : '',
    source: typeof body.source === 'string' ? body.source : '',
    instanceToken:
      typeof body.instanceToken === 'string'
        ? body.instanceToken
        : typeof body.instanceSlug === 'string'
          ? body.instanceSlug
          : undefined,
    instanceSlug: typeof body.instanceSlug === 'string' ? body.instanceSlug : undefined,
    event: typeof body.event === 'string' ? body.event : undefined,
  })

  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), { status: result.status })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
