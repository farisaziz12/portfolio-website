import { beehiivFetch } from './client'
import type { BeehiivPost, BeehiivPostListResponse } from './types'

interface ListOptions {
  limit?: number
  page?: number
  /** Default 'free' — we never expose premium content publicly. */
  audience?: 'free' | 'premium' | 'all'
  /** Default true — fetches `content.free.web` HTML for inline rendering. */
  expandContent?: boolean
}

// Module-level request memo. Each serverless invocation gets a fresh module
// scope on Vercel, so this is effectively per-request — keeps a `/subscribe` page
// that needs the latest issue from re-hitting Beehiiv once we also render the
// archive grid on the same page.
const memo = new Map<string, Promise<BeehiivPost[]>>()

function memoKey(opts: ListOptions): string {
  return JSON.stringify({
    l: opts.limit ?? 50,
    p: opts.page ?? 1,
    a: opts.audience ?? 'free',
    e: opts.expandContent ?? false,
  })
}

export async function listPublishedPosts(opts: ListOptions = {}): Promise<BeehiivPost[]> {
  const key = memoKey(opts)
  const existing = memo.get(key)
  if (existing) return existing

  const promise = (async () => {
    const query: Record<string, string | number | undefined> = {
      limit: opts.limit ?? 50,
      page: opts.page ?? 1,
      status: 'confirmed',
      audience: opts.audience ?? 'free',
      platform: 'both',
      order_by: 'publish_date',
      direction: 'desc',
    }
    if (opts.expandContent) {
      // Beehiiv expects expand to be repeated; the fetch wrapper turns this single
      // value into the right query string. If we ever need multiple expand keys,
      // switch to URLSearchParams directly.
      query['expand[]'] = 'free_web_content'
    }

    const res = await beehiivFetch<BeehiivPostListResponse>({
      method: 'GET',
      path: '/publications/{publicationId}/posts',
      query,
      context: 'posts:list',
    })

    if (!res.ok) return []
    const items = res.data?.data ?? []
    // Belt-and-braces: drop anything not actually published yet or explicitly hidden.
    const now = Math.floor(Date.now() / 1000)
    return items.filter((p) => {
      if (p.hidden_from_feed) return false
      if (!p.publish_date) return true
      return p.publish_date <= now
    })
  })()

  memo.set(key, promise)
  return promise
}

export async function getPostBySlug(slug: string): Promise<BeehiivPost | null> {
  // Beehiiv has no slug lookup endpoint — list and filter. The list call is
  // memoized within a request, so the second call from a sibling component is free.
  const all = await listPublishedPosts({ limit: 100, expandContent: true })
  return all.find((p) => p.slug === slug) ?? null
}
