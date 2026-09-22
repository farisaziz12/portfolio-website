/**
 * Runtime env helper shared by server modules.
 * Prefer process.env on Vercel (non-public import.meta.env is inlined at build).
 */
export const env = (key: string): string | undefined =>
  process.env[key] ?? (import.meta.env as Record<string, string | undefined>)[key]
