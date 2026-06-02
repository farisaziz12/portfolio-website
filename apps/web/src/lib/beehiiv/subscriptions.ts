import { beehiivFetch } from './client'
import type { BeehiivSubscription, BeehiivSubscriptionInput, BeehiivSingleResponse } from './types'

// Wraps POST /publications/{publicationId}/subscriptions.
// We always pass reactivate_existing=true so a previously-unsubscribed person can
// re-join with the same form, and send_welcome_email=true so Beehiiv handles the
// double-opt-in flow. No transactional confirm email is sent from our side.
export async function subscribe(input: BeehiivSubscriptionInput) {
  const body: Record<string, unknown> = {
    email: input.email,
    reactivate_existing: true,
    send_welcome_email: true,
  }
  if (input.source) body.utm_source = input.source
  if (input.utmMedium) body.utm_medium = input.utmMedium
  if (input.utmCampaign) body.utm_campaign = input.utmCampaign
  if (input.referringSite) body.referring_site = input.referringSite

  return beehiivFetch<BeehiivSingleResponse<BeehiivSubscription>>({
    method: 'POST',
    path: '/publications/{publicationId}/subscriptions',
    body,
    context: `subscribe:${input.source || 'unknown'}`,
  })
}
