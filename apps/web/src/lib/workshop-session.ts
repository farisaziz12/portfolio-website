import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from './env'

export const WORKSHOP_SESSION_COOKIE = 'workshop_session'
export const ADMIN_SESSION_COOKIE = 'admin_session'

export type WorkshopSessionPayload = {
  v: 1
  token: string
  email: string
  name: string
  exp: number
}

type AdminSessionPayload = {
  v: 1
  role: 'admin'
  exp: number
}

function sessionSecret(): string | undefined {
  return env('WORKSHOP_SESSION_SECRET') || env('ADMIN_PASSWORD')
}

function sign(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('base64url')
}

function encodePayload(payload: object, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${body}.${sign(body, secret)}`
}

function decodePayload<T extends { exp: number }>(value: string, secret: string): T | null {
  const dot = value.indexOf('.')
  if (dot <= 0) return null
  const body = value.slice(0, dot)
  const sig = value.slice(dot + 1)
  if (!body || !sig) return null

  const expected = sign(body, secret)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T
    if (!parsed || typeof parsed.exp !== 'number') return null
    if (Math.floor(Date.now() / 1000) >= parsed.exp) return null
    return parsed
  } catch {
    return null
  }
}

export function createWorkshopSessionCookie(
  input: { token: string; email: string; name: string; expEpochSec: number },
  secret = sessionSecret()
): string | null {
  if (!secret) return null
  const payload: WorkshopSessionPayload = {
    v: 1,
    token: input.token,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    exp: input.expEpochSec,
  }
  return encodePayload(payload, secret)
}

export function verifyWorkshopSessionCookie(
  value: string | undefined,
  expectedToken?: string,
  secret = sessionSecret()
): WorkshopSessionPayload | null {
  if (!value || !secret) return null
  const payload = decodePayload<WorkshopSessionPayload>(value, secret)
  if (!payload || payload.v !== 1) return null
  if (!payload.token || !payload.email || !payload.name) return null
  if (expectedToken && payload.token !== expectedToken) return null
  return payload
}

export function createAdminSessionCookie(
  maxAgeSec = 28800,
  secret = sessionSecret()
): string | null {
  if (!secret) return null
  const payload: AdminSessionPayload = {
    v: 1,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + maxAgeSec,
  }
  return encodePayload(payload, secret)
}

export function verifyAdminSessionCookie(
  value: string | undefined,
  secret = sessionSecret()
): boolean {
  if (!value || !secret) return false
  // Reject the old forgeable literal immediately.
  if (value === 'valid') return false
  const payload = decodePayload<AdminSessionPayload>(value, secret)
  return Boolean(payload && payload.v === 1 && payload.role === 'admin')
}

export function adminCookieOptions(maxAgeSec = 28800) {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict' as const,
    maxAge: maxAgeSec,
    path: '/',
  }
}

export function workshopCookieOptions(maxAgeSec: number) {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
    maxAge: Math.max(60, maxAgeSec),
    path: '/',
  }
}
