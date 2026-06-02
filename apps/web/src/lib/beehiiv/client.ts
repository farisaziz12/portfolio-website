import { env } from '../email'

// Beehiiv API base. The publication ID + API key come from env.
// Reads use the shared `env()` helper from lib/email.ts which checks process.env
// first (the only reliable source on Vercel serverless) before falling back to
// import.meta.env for local `astro dev`. Reading import.meta.env.BEEHIIV_* directly
// would inline at build time and end up undefined in production — same gotcha that
// bit the Resend setup in commit 66633e7.
export const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2'

export function getBeehiivKey(): string | undefined {
  return env('BEEHIIV_API_KEY')
}

export function getBeehiivPublicationId(): string | undefined {
  return env('BEEHIIV_PUBLICATION_ID')
}

export function isBeehiivConfigured(): boolean {
  return Boolean(getBeehiivKey() && getBeehiivPublicationId())
}

type BeehiivFetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  query?: Record<string, string | number | undefined>
  body?: unknown
  context: string
}

type BeehiivFetchResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number }

export async function beehiivFetch<T>({
  method = 'GET',
  path,
  query,
  body,
  context,
}: BeehiivFetchOptions): Promise<BeehiivFetchResult<T>> {
  const key = getBeehiivKey()
  const publicationId = getBeehiivPublicationId()

  if (!key || !publicationId) {
    console.warn(`[beehiiv:${context}] not configured — BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID missing`)
    return { ok: false, error: 'beehiiv-not-configured', status: 0 }
  }

  const resolvedPath = path.replace('{publicationId}', publicationId)
  const url = new URL(`${BEEHIIV_API_BASE}${resolvedPath}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.append(k, String(v))
      }
    }
  }

  try {
    const res = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const text = await res.text()
    let parsed: unknown = null
    if (text) {
      try {
        parsed = JSON.parse(text)
      } catch {
        // Non-JSON response — surface the status + raw text for debugging.
      }
    }

    if (!res.ok) {
      const msg = typeof parsed === 'object' && parsed && 'errors' in parsed
        ? JSON.stringify((parsed as { errors: unknown }).errors)
        : text || res.statusText
      console.error(`[beehiiv:${context}] ${res.status}: ${msg}`)
      return { ok: false, error: msg || `http-${res.status}`, status: res.status }
    }

    return { ok: true, data: parsed as T, status: res.status }
  } catch (err) {
    console.error(`[beehiiv:${context}] exception:`, err)
    return { ok: false, error: err instanceof Error ? err.message : 'unknown-error', status: 0 }
  }
}
