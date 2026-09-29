/**
 * Shared bits for the inquiry routes (/api/invite, /api/contact).
 *
 * Honesty rule (V3): a form shows success ONLY when the server confirms the
 * inquiry was stored, i.e. the admin notification was accepted by Resend.
 * Missing email config is a failure (503 not-configured), never a silent 200.
 */
import { randomBytes } from 'node:crypto';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Field length caps (characters). Anything longer is rejected with 400. */
export const LIMITS = { short: 200, email: 320, line: 500, long: 5000 } as const;

// No 0/O/1/I so a reference read out over the phone survives.
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** "FA-260929-K7QD": date the inquiry arrived (UTC) + 4 random characters. */
export function inquiryRef(now = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const bytes = randomBytes(4);
  const tail = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('');
  return `FA-${yy}${mm}${dd}-${tail}`;
}

export function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/** Trimmed string or '' for anything that isn't a string. */
export function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/** Names of fields whose value exceeds its cap. */
export function tooLong(fields: Record<string, [string, number]>): string[] {
  return Object.entries(fields)
    .filter(([, [value, max]]) => value.length > max)
    .map(([name]) => name);
}

export type InquiryFailure = 'invalid' | 'not-configured' | 'delivery-failed';
