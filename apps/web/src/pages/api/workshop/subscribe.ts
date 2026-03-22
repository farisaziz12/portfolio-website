export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { WorkshopWelcomeEmail } from '../../../emails/WorkshopWelcomeEmail'
import { GeneralSubscribeConfirmEmail } from '../../../emails/GeneralSubscribeConfirmEmail'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const { name, email, source, instanceSlug, event } = body

  if (!email || !source) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  try {
    await resend.contacts.create({
      audienceId: import.meta.env.RESEND_AUDIENCE_ID,
      email,
      firstName: name?.split(' ')[0] || '',
      lastName: name?.split(' ').slice(1).join(' ') || '',
      unsubscribed: false,
    })

    // Send appropriate confirmation email
    if (source === 'workshop-attend' && instanceSlug) {
      await resend.emails.send({
        from: 'Faris Aziz <hello@faziz-dev.com>',
        to: email,
        subject: `You're in — ${event || 'Workshop'} materials`,
        react: WorkshopWelcomeEmail({
          name: name?.split(' ')[0] || '',
          event: event || '',
          workshopTitle: event || 'Workshop',
          repoUrl: '',
          attendUrl: `https://faziz-dev.com/workshops/attend/${instanceSlug}`,
        }),
      })
    } else if (source === 'website') {
      await resend.emails.send({
        from: 'Faris Aziz <hello@faziz-dev.com>',
        to: email,
        subject: "You're on the list 🎉",
        react: GeneralSubscribeConfirmEmail({
          name: name?.split(' ')[0] || undefined,
        }),
      })
    }

    console.log('New subscriber:', { email, source, instanceSlug, event })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('Resend error:', err)
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), { status: 500 })
  }
}
