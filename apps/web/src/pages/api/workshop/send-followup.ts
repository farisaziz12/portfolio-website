export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { sanityFetch } from '../../../lib/sanity/client'
import { writeClient } from '../../../lib/sanity/client'
import { workshopInstanceForFollowUpQuery } from '../../../lib/sanity/queries'
import { WorkshopFollowUpEmail } from '../../../emails/WorkshopFollowUpEmail'

const resend = import.meta.env.RESEND_API_KEY ? new Resend(import.meta.env.RESEND_API_KEY) : null

interface Attendee {
  name: string
  email: string
  subscribedAt: string
}

interface FollowUpInstance {
  _id: string
  title: string
  event: string
  overallFeedbackUrl?: string
  attendees?: Attendee[]
  followUpSentAt?: string
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const session = cookies.get('admin_session')?.value
  if (session !== 'valid') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  if (!resend) {
    return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 })
  }

  const { instanceId } = await request.json()

  const instance = await sanityFetch<FollowUpInstance | null>(
    workshopInstanceForFollowUpQuery,
    { instanceId }
  )

  if (!instance) {
    return new Response(JSON.stringify({ error: 'Instance not found' }), { status: 404 })
  }

  if (instance.followUpSentAt) {
    return new Response(JSON.stringify({ error: 'Follow-up already sent' }), { status: 409 })
  }

  if (!instance.attendees || instance.attendees.length === 0) {
    return new Response(JSON.stringify({ error: 'No attendees' }), { status: 400 })
  }

  const results = await Promise.allSettled(
    instance.attendees.map((attendee) =>
      resend.emails.send({
        from: 'Faris Aziz <hello@faziz-dev.com>',
        to: attendee.email,
        subject: `Thanks for joining ${instance.event}`,
        react: WorkshopFollowUpEmail({
          name: attendee.name.split(' ')[0],
          workshopTitle: instance.title,
          event: instance.event,
          feedbackUrl: instance.overallFeedbackUrl,
        }),
      })
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  await writeClient
    .patch(instance._id)
    .set({ followUpSentAt: new Date().toISOString() })
    .commit()
    .catch((err) => console.error('Failed to set followUpSentAt:', err))

  return new Response(JSON.stringify({ success: true, sent, failed }), { status: 200 })
}
