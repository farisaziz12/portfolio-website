import { useState } from 'react';

type Variant = 'inline' | 'card' | 'prominent';
type Source =
  | 'home'
  | 'subscribe-page'
  | 'newsletter-archive'
  | 'blog-cta'
  | 'footer'
  | 'website';

interface Props {
  variant?: Variant;
  source?: Source;
  heading?: string;
  lead?: string;
  ctaLabel?: string;
}

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

function track(event: string, properties?: Record<string, unknown>) {
  try {
    window.posthog?.capture(event, properties);
  } catch {
    // PostHog stub may not be ready on early page loads — silent.
  }
}

export default function GeneralSubscribe({
  variant = 'card',
  source = 'website',
  heading,
  lead,
  ctaLabel,
}: Props) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const headingText = heading ?? 'The newsletter';
  const leadText = lead ?? 'One email, occasionally. A running notebook from the conference road and the engineering trenches.';
  const ctaText = ctaLabel ?? 'Subscribe';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !email) return;

    track('newsletter_subscribe_attempt', { source });
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) throw new Error('Failed');
      const data = (await res.json().catch(() => ({}))) as { alreadySubscribed?: boolean };
      setAlreadySubscribed(Boolean(data.alreadySubscribed));
      setStatus('success');
      track('newsletter_subscribe_success', { source, alreadySubscribed: Boolean(data.alreadySubscribed) });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    const message = alreadySubscribed
      ? "You're already on the list — see you in the next issue."
      : "You're in. Check your inbox to confirm your subscription.";
    if (variant === 'inline') {
      return (
        <div className="text-center">
          <p className="text-sm font-display font-semibold text-[var(--color-ink)]">
            Subscribed.
          </p>
          <p className="text-xs text-[var(--color-ink-muted)] mt-1">{message}</p>
        </div>
      );
    }
    return (
      <div className={
        variant === 'prominent'
          ? 'rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-10 text-center'
          : 'rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-8 text-center'
      }>
        <p className={
          variant === 'prominent'
            ? 'text-2xl font-display font-semibold text-[var(--color-ink)]'
            : 'text-lg font-display font-semibold text-[var(--color-ink)]'
        }>
          You're in.
        </p>
        <p className="text-sm text-[var(--color-ink-muted)] mt-2">{message}</p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-ink-muted)]">{headingText}</p>
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
          <button
            type="submit"
            disabled={!consent || status === 'loading'}
            className="px-4 py-2 text-sm rounded-lg font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {status === 'loading' ? '...' : ctaText}
          </button>
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 rounded border-[var(--color-edge)]"
          />
          <span className="text-xs text-[var(--color-ink-faint)] leading-relaxed">
            I agree to receive Faris's newsletter. No spam — unsubscribe anytime.
          </span>
        </label>
        {status === 'error' && (
          <p className="text-xs text-red-500">Something went wrong — try again.</p>
        )}
      </form>
    );
  }

  const isProminent = variant === 'prominent';

  return (
    <div className={
      isProminent
        ? 'rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-10'
        : 'rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-8'
    }>
      <h3 className={
        isProminent
          ? 'text-2xl font-display font-semibold text-[var(--color-ink)] mb-2'
          : 'text-lg font-display font-semibold text-[var(--color-ink)] mb-1'
      }>
        {headingText}
      </h3>
      <p className={
        isProminent
          ? 'text-base text-[var(--color-ink-muted)] mb-6 max-w-[52ch]'
          : 'text-sm text-[var(--color-ink-muted)] mb-6'
      }>
        {leadText}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={isProminent ? 'flex gap-2 flex-col sm:flex-row' : ''}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              isProminent
                ? 'flex-1 px-4 py-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                : 'w-full px-4 py-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors'
            }
          />
          {isProminent && (
            <button
              type="submit"
              disabled={!consent || status === 'loading'}
              className="px-6 py-3 rounded-lg font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : ctaText}
            </button>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 rounded border-[var(--color-edge)]"
          />
          <span className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
            I agree to receive Faris's newsletter. No spam — unsubscribe anytime.
          </span>
        </label>

        {!isProminent && (
          <button
            type="submit"
            disabled={!consent || status === 'loading'}
            className="w-full px-6 py-3 rounded-lg font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'loading' ? 'Subscribing...' : ctaText}
          </button>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-500 text-center">
            Something went wrong — try again.
          </p>
        )}
      </form>
    </div>
  );
}
