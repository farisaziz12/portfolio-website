export interface BeehiivSubscriptionInput {
  email: string
  source?: string
  utmMedium?: string
  utmCampaign?: string
  referringSite?: string
}

export interface BeehiivSubscription {
  id: string
  email: string
  status: 'active' | 'inactive' | 'pending' | 'unsubscribed' | 'invalid' | 'needs_attention' | string
  created: number
  subscription_tier?: string
  subscription_premium_tier_names?: string[]
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referring_site?: string
}

export interface BeehiivPostContent {
  free?: { web?: string; email?: string; rss?: string }
  premium?: { web?: string; email?: string; rss?: string }
}

export interface BeehiivPost {
  id: string
  title: string
  subtitle?: string
  slug: string
  status: 'draft' | 'confirmed' | 'archived' | string
  audience: 'free' | 'premium' | 'all' | string
  platform: 'web' | 'email' | 'both' | string
  web_url?: string
  thumbnail_url?: string
  publish_date?: number
  displayed_date?: number
  authors?: string[]
  content_tags?: string[]
  meta_default_title?: string
  meta_default_description?: string
  preview_text?: string
  hidden_from_feed?: boolean
  content?: BeehiivPostContent
}

export interface BeehiivPostListResponse {
  data: BeehiivPost[]
  limit: number
  page: number
  total_results: number
  total_pages: number
}

export interface BeehiivSingleResponse<T> {
  data: T
}
