export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { sanityFetch } from '../../../lib/sanity/client'
import { upcomingEventsQuery } from '../../../lib/sanity/queries'
import { DigestEmail } from '../../../emails/DigestEmail'
import groq from 'groq'

const resend = import.meta.env.RESEND_API_KEY ? new Resend(import.meta.env.RESEND_API_KEY) : null
const AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID

const recentBlogPostsQuery = groq`
  *[_type == "blogPost" && published == true] | order(publishedAt desc) [0...3] {
    title,
    "slug": slug.current,
    excerpt
  }
`

export const POST: APIRoute = async ({ cookies, request }) => {
  if (cookies.get('admin_session')?.value !== 'valid') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  if (!resend || !AUDIENCE_ID) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 })
  }

  const { introText } = await request.json()

  const [events, posts] = await Promise.all([
    sanityFetch<any[]>(upcomingEventsQuery).catch(() => []),
    sanityFetch<any[]>(recentBlogPostsQuery).catch(() => []),
  ])

  // Get all contacts
  const contactsRes = await resend.contacts.list({ audienceId: AUDIENCE_ID })
  if (contactsRes.error || !contactsRes.data) {
    return new Response(JSON.stringify({ error: 'Failed to fetch contacts' }), { status: 500 })
  }

  const contacts = contactsRes.data.data.filter((c: any) => !c.unsubscribed)
  if (contacts.length === 0) {
    return new Response(JSON.stringify({ error: 'No active subscribers' }), { status: 400 })
  }

  const emailEvents = events.slice(0, 5).map((e: any) => ({
    title: e.title,
    conference: e.conference,
    date: e.date,
    slug: e.slug,
    city: e.location?.city,
    country: e.location?.country,
  }))

  const emailPosts = posts.map((p: any) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
  }))

  const results = await Promise.allSettled(
    contacts.map((contact: any) =>
      resend.emails.send({
        from: 'Faris Aziz <hello@faziz-dev.com>',
        to: contact.email,
        subject: "What's coming up — events, talks, and more",
        react: DigestEmail({ introText, events: emailEvents, posts: emailPosts }),
      })
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return new Response(JSON.stringify({ success: true, sent, failed, total: contacts.length }), { status: 200 })
}
