/**
 * Client-side PostHog helper for React islands.
 *
 * PostHog is loaded by `components/posthog.astro` (inline snippet on every
 * page); islands never import posthog-js directly — they call these wrappers,
 * which no-op safely when the script is blocked or still loading. Keep the
 * event names here in sync with docs/measurement.md.
 */

/** Known custom events — one place to see the whole vocabulary. */
export type AnalyticsEvent =
  | 'cta_click'
  | 'invite_form_submitted'
  | 'mentorship_inquiry_submitted'
  | 'contact_form_submitted'
  | 'newsletter_subscribed'
  | 'workshop_signed_up'
  | 'discovery_call_opened'
  | 'email_entered'
  | 'form_started'
  | 'form_validation_failed'
  | 'form_submit_failed'
  | 'scroll_depth'
  | 'outbound_link_click'
  | 'terminal_command'
  | 'command_palette_opened'
  | 'command_palette_action';

type Props = Record<string, unknown>;

function ph(): any | undefined {
  return typeof window !== 'undefined' ? (window as any).posthog : undefined;
}

/** Capture a custom event. Never throws. */
export function track(event: AnalyticsEvent, props?: Props): void {
  try {
    ph()?.capture(event, props);
  } catch (_) {
    /* analytics must never break the UI */
  }
}

/**
 * Tie the current anonymous session to a real person. Call at the moment we
 * actually learn who they are (form success), never speculatively.
 *
 * Uses the lowercased email as the distinct ID so the same person converges
 * across devices/forms; extra props become person properties ($set).
 */
export function identify(email: string, props?: Props): void {
  try {
    const id = email.trim().toLowerCase();
    if (!id) return;
    ph()?.identify(id, { email: id, ...props });
  } catch (_) {
    /* noop */
  }
}

/** Person properties that should only ever be written once (first-touch). */
export function setPersonPropsOnce(props: Props): void {
  try {
    ph()?.setPersonProperties({}, props);
  } catch (_) {
    /* noop */
  }
}

const startedForms = new Set<string>();

/**
 * Fire `form_started` the first time a visitor touches a given form (per
 * page lifetime). Pairs with the `*_submitted` events to measure abandonment.
 */
export function trackFormStarted(form: string): void {
  if (startedForms.has(form)) return;
  startedForms.add(form);
  track('form_started', { form });
}
