/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID: string;
  readonly SANITY_STUDIO_DATASET: string;
  readonly SANITY_API_TOKEN: string;
  readonly PROD: boolean;
  /** PostHog project API key; falls back to the production EU project. */
  readonly PUBLIC_POSTHOG_KEY?: string;
  /** PostHog ingestion host; defaults to https://eu.i.posthog.com. */
  readonly PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
