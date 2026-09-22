import { WorkshopWelcomeEmail } from '../emails/WorkshopWelcomeEmail'
import { GeneralSubscribeConfirmEmail } from '../emails/GeneralSubscribeConfirmEmail'
import { sanityFetch } from './sanity/client'
import { workshopInstanceByTokenQuery } from './sanity/queries'
import { env, getFrom, resend, sendOrLog } from './email'

const GLOBAL_AUDIENCE_ID = env('RESEND_AUDIENCE_ID')
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
    }
  } catch (err) {
    console.error(`Failed to add contact to ${context} audience ${audienceId}:`, err)
  }
}

export type SubscribeInput = {
  name?: string
  email: string
  source: string
  /** Workshop instance access token (attend URL). Preferred for workshop-attend. */
  instanceToken?: string
  /** Legacy field — attend gate historically sent the token as instanceSlug. */
  instanceSlug?: string
  event?: string
}

export type SubscribeResult =
  | { ok: true }
  | { ok: false; status: number; error: string }

/**
 * Shared subscribe core used by /api/workshop/subscribe and /api/workshop/session.
 * Workshop-attend lookups resolve by **token**, not Sanity slug.
 */
export async function subscribeContact(input: SubscribeInput): Promise<SubscribeResult> {
  const { name, email, source, event } = input
  const instanceToken = (input.instanceToken || input.instanceSlug || '').trim()

  if (!email || !source) {
    return { ok: false, status: 400, error: 'Missing required fields' }
  }

  if (!resend) {
    console.error('RESEND_API_KEY is not set')
    return { ok: false, status: 500, error: 'Email service not configured' }
  }

  const firstName = name?.split(' ')[0] || ''
  const lastName = name?.split(' ').slice(1).join(' ') || ''

  let instanceAudienceId: string | undefined
  let instanceTitle = event || 'Workshop'
  let attendToken = instanceToken

  if (source === 'workshop-attend' && instanceToken) {
    const instance = await sanityFetch<WorkshopInstanceLookup | null>(workshopInstanceByTokenQuery, {
      token: instanceToken,
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
    if (instance?.token) {
      attendToken = instance.token
    }
  }

  const audienceWrites: Promise<void>[] = []
  if (GLOBAL_AUDIENCE_ID) {
    audienceWrites.push(addContactToAudience(GLOBAL_AUDIENCE_ID, email, firstName, lastName, 'global'))
  }
  if (instanceAudienceId && instanceAudienceId !== GLOBAL_AUDIENCE_ID) {
    audienceWrites.push(
      addContactToAudience(instanceAudienceId, email, firstName, lastName, `workshop:${attendToken}`)
    )
  }

  let emailPromise: Promise<unknown> = Promise.resolve()
  if (!FROM) {
    console.warn('RESEND_FROM_EMAIL not set — skipping welcome email')
  } else if (source === 'workshop-attend' && attendToken) {
    emailPromise = sendOrLog({
      context: 'workshop:welcome',
      from: FROM,
      to: email,
      subject: `You're in: ${event || instanceTitle} materials`,
      react: WorkshopWelcomeEmail({
        name: firstName,
        event: event || '',
        workshopTitle: instanceTitle,
        attendUrl: `https://faziz-dev.com/workshops/attend/${attendToken}`,
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
  return { ok: true }
}
