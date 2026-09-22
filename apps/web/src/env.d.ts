/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID: string;
  readonly SANITY_STUDIO_DATASET: string;
  readonly SANITY_API_TOKEN: string;
  readonly PROD: boolean;
  /** PostHog project API key; analytics is disabled when unset. */
  readonly PUBLIC_POSTHOG_KEY?: string;
  /** PostHog ingestion host; defaults to https://eu.i.posthog.com. */
  readonly PUBLIC_POSTHOG_HOST?: string;
  /** HMAC secret for workshop + admin session cookies (falls back to ADMIN_PASSWORD). */
  readonly WORKSHOP_SESSION_SECRET?: string;
  readonly ADMIN_PASSWORD?: string;
  /** Personal API key with query:read for /admin/live HogQL roster. */
  readonly POSTHOG_PERSONAL_API_KEY?: string;
  /** Numeric PostHog project id (EU project). */
  readonly POSTHOG_PROJECT_ID?: string;
  /** App host for query API; defaults derived from PUBLIC_POSTHOG_HOST. */
  readonly POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
