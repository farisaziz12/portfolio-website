export const prerender = false

import type { APIRoute } from 'astro'
import { sanityFetch } from '../../../lib/sanity/client'
import { workshopAttendSectionQuery } from '../../../lib/sanity/queries'

/**
 * Lazy-load one workshop section body.
 * Same trust model as before: knowing the attend token unlocks materials.
 */
export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token')?.trim()
  const sectionKey = url.searchParams.get('sectionKey')?.trim()

  if (!token || !sectionKey) {
    return new Response(JSON.stringify({ error: 'token and sectionKey required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }

  try {
    const result = await sanityFetch<{
      section: {
        _key: string
        emoji?: string
        title: string
        sectionFeedbackUrl?: string
        content?: unknown[]
      } | null
    } | null>(workshopAttendSectionQuery, { token, sectionKey }).catch(() => null)

    if (!result?.section) {
      return new Response(JSON.stringify({ error: 'Section not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      })
    }

    return new Response(
      JSON.stringify({
        section: {
          _key: result.section._key,
          emoji: result.section.emoji,
          title: result.section.title,
          sectionFeedbackUrl: result.section.sectionFeedbackUrl,
          content: result.section.content || [],
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Section bodies change rarely; short CDN/browser cache is fine.
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (err) {
    console.error('[workshop/section] GET failed:', err)
    return new Response(
      JSON.stringify({
        error: 'Internal error',
        detail: err instanceof Error ? err.message : 'unknown',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      }
    )
  }
}
