export const prerender = false

import type { APIRoute } from 'astro'
import { WorkshopWelcomeEmail } from '../../../emails/WorkshopWelcomeEmail'
import { GeneralSubscribeConfirmEmail } from '../../../emails/GeneralSubscribeConfirmEmail'
import { sanityFetch } from '../../../lib/sanity/client'
import { workshopInstanceBySlugQuery } from '../../../lib/sanity/queries'
import { env, getFrom, resend, sendOrLog } from '../../../lib/email'

const GLOBAL_AUDIENCE_ID = env('RESEND_AUDIENCE_ID')

// `from` address is env-driven so we don't hardcode a sender domain in source.
// Set RESEND_FROM_EMAIL to a verified Resend sender (e.g. "noreply@yourdomain.com").
const FROM = getFrom('Faris Aziz')

interface WorkshopInstanceLookup {
  _id: string
  title?: string
  event?: string
  slug?: string
  token?: string
  resendAudienceId?: string
}

async function addContactToAudience(
  audienceId: string,
  email: string,
  firstName: string,
  lastName: string,
  context: string
) {
  if (!resend) return
  try {
    const r = await resend.contacts.create({
      audienceId,
      email,
      firstName,
      lastName,
      unsubscribed: false,
    })
    if (r.error) {
      console.error(`Resend contact error (${context} audience ${audienceId}):`, r.error)
    } else {
      console.log(`Contact added to ${context} audience ${audienceId}:`, r.data)
    }
  } catch (err) {
    console.error(`Failed to add contact to ${context} audience ${audienceId}:`, err)
  }
}

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
  const lastName = name?.split(' ').slice(1).join(' ') || ''

  // Look up the workshop instance server-side so we never trust a client-supplied audience ID.
  let instanceAudienceId: string | undefined
  let instanceTitle = event || 'Workshop'
  if (source === 'workshop-attend' && instanceSlug) {
    const instance = await sanityFetch<WorkshopInstanceLookup | null>(workshopInstanceBySlugQuery, {
      slug: instanceSlug,
    }).catch((err) => {
      console.error('Failed to look up workshopInstance for subscribe:', err)
      return null
    })
    if (instance?.resendAudienceId) {
      instanceAudienceId = instance.resendAudienceId
    }
    if (instance?.title) {
      instanceTitle = instance.title
    }
  }

  // Write the contact to both audiences in parallel.
  const audienceWrites: Promise<void>[] = []
  if (GLOBAL_AUDIENCE_ID) {
    audienceWrites.push(addContactToAudience(GLOBAL_AUDIENCE_ID, email, firstName, lastName, 'global'))
  }
  if (instanceAudienceId && instanceAudienceId !== GLOBAL_AUDIENCE_ID) {
    audienceWrites.push(
      addContactToAudience(instanceAudienceId, email, firstName, lastName, `workshop:${instanceSlug}`)
    )
  }

  // Send the appropriate welcome email — only if a FROM is configured.
  let emailPromise: Promise<unknown> = Promise.resolve()
  if (!FROM) {
    console.warn('RESEND_FROM_EMAIL not set — skipping welcome email')
  } else if (source === 'workshop-attend' && instanceSlug) {
    emailPromise = sendOrLog({
      context: 'workshop:welcome',
      from: FROM,
      to: email,
      subject: `You're in — ${event || instanceTitle} materials`,
      react: WorkshopWelcomeEmail({
        name: firstName,
        event: event || '',
        workshopTitle: instanceTitle,
        repoUrl: '',
        attendUrl: `https://faziz-dev.com/workshops/attend/${instanceSlug}`,
      }),
    })
  } else if (source === 'website') {
    emailPromise = sendOrLog({
      context: 'workshop:subscribe-confirm',
      from: FROM,
      to: email,
      subject: "You're on the list",
      react: GeneralSubscribeConfirmEmail({ name: firstName || undefined }),
    })
  }

  await Promise.allSettled([...audienceWrites, emailPromise])

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
