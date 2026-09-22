import { createClient } from '@sanity/client'
import { env } from '../email'

/** Non-CDN client for authenticated mutations (e.g. End live). */
export function getSanityWriteClient() {
  const token = env('SANITY_API_TOKEN')
  if (!token) return null

  return createClient({
    projectId: env('SANITY_STUDIO_PROJECT_ID') || '94fb4yui',
    dataset: env('SANITY_STUDIO_DATASET') || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}
