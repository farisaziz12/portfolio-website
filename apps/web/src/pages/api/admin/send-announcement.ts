export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { sanityFetch } from '../../../lib/sanity/client'
import { EventAnnouncementEmail } from '../../../emails/EventAnnouncementEmail'

const resend = import.meta.env.RESEND_API_KEY ? new Resend(import.meta.env.RESEND_API_KEY) : null
const AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID

const eventByIdQuery = `*[_type == "event" && _id == $eventId][0] {
  _id, title, "slug": slug.current, conference, date, location
}`

export const POST: APIRoute = async ({ cookies, request }) => {
  if (cookies.get('admin_session')?.value !== 'valid') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  if (!resend || !AUDIENCE_ID) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 })
  }

  const { eventId, personalNote } = await request.json()

  const event = await sanityFetch<any>(eventByIdQuery, { eventId })
  if (!event) {
    return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 })
  }

  // Get all contacts from audience
  const contactsRes = await resend.contacts.list({ audienceId: AUDIENCE_ID })
  if (contactsRes.error || !contactsRes.data) {
    return new Response(JSON.stringify({ error: 'Failed to fetch contacts' }), { status: 500 })
  }

  const contacts = contactsRes.data.data.filter((c: any) => !c.unsubscribed)
  if (contacts.length === 0) {
    return new Response(JSON.stringify({ error: 'No active subscribers' }), { status: 400 })
  }

  const results = await Promise.allSettled(
    contacts.map((contact: any) =>
      resend.emails.send({
        from: 'Faris Aziz <hello@faziz-dev.com>',
        to: contact.email,
        subject: `New event: ${event.title} at ${event.conference}`,
        react: EventAnnouncementEmail({
          eventTitle: event.title,
          conference: event.conference,
          date: event.date,
          city: event.location?.city,
          country: event.location?.country,
          slug: event.slug,
          personalNote,
        }),
      })
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return new Response(JSON.stringify({ success: true, sent, failed, total: contacts.length }), { status: 200 })
}
