export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { WorkshopWelcomeEmail } from '../../../emails/WorkshopWelcomeEmail'
import { GeneralSubscribeConfirmEmail } from '../../../emails/GeneralSubscribeConfirmEmail'

const AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID
const apiKey = import.meta.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

export const POST: APIRoute = async ({ request }) => {
  const { name, email, source, instanceSlug, event } = await request.json()

  if (!email || !source) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  if (!resend) {
    console.error('RESEND_API_KEY is not set')
    return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 })
  }

  const firstName = name?.split(' ')[0] || ''

  const contactPromise = AUDIENCE_ID
    ? resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        firstName,
        lastName: name?.split(' ').slice(1).join(' ') || '',
        unsubscribed: false,
      }).then((r) => {
        if (r.error) console.error('Resend contact error:', r.error)
        else console.log('Contact created:', r.data)
      }).catch((err) => console.error('Failed to create contact:', err))
    : Promise.resolve()

  let emailPromise: Promise<void> = Promise.resolve()
  if (source === 'workshop-attend' && instanceSlug) {
    emailPromise = resend.emails.send({
      from: 'Faris Aziz <hello@faziz-dev.com>',
      to: email,
      subject: `You're in — ${event || 'Workshop'} materials`,
      react: WorkshopWelcomeEmail({
        name: firstName,
        event: event || '',
        workshopTitle: event || 'Workshop',
        repoUrl: '',
        attendUrl: `https://faziz-dev.com/workshops/attend/${instanceSlug}`,
      }),
    }).then((r) => { console.log('Welcome email sent:', r) })
      .catch((err) => console.error('Failed to send email:', err))
  } else if (source === 'website') {
    emailPromise = resend.emails.send({
      from: 'Faris Aziz <hello@faziz-dev.com>',
      to: email,
      subject: "You're on the list",
      react: GeneralSubscribeConfirmEmail({ name: firstName || undefined }),
    }).then((r) => { console.log('Confirm email sent:', r) })
      .catch((err) => console.error('Failed to send email:', err))
  }

  await Promise.allSettled([contactPromise, emailPromise])

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
