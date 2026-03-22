import { useState } from 'react';

interface Props {
  instanceSlug: string;
  event: string;
}

export default function WorkshopEmailCapture({ instanceSlug, event }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/workshop/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          source: 'workshop-attend',
          instanceSlug,
          event,
        }),
      });

      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-8 text-center">
        <p className="text-lg font-display font-semibold text-[var(--color-ink)]">
          You're in! 🎉
        </p>
        <p className="text-sm text-[var(--color-ink-muted)] mt-2">
          You'll hear from me about future workshops and events.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-8">
      <h3 className="text-lg font-display font-semibold text-[var(--color-ink)] mb-1">
        Stay in the loop
      </h3>
      <p className="text-sm text-[var(--color-ink-muted)] mb-6">
        Get notified about future workshops and conference appearances.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <div>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 rounded border-[var(--color-edge)]"
          />
          <span className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
            I agree to receive updates about future workshops and conference appearances from Faris Aziz. No spam — unsubscribe anytime.
          </span>
        </label>

        <button
          type="submit"
          disabled={!consent || status === 'loading'}
          className="w-full px-6 py-3 rounded-lg font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? 'Subscribing...' : 'Follow Along'}
        </button>

        {status === 'error' && (
          <p className="text-sm text-red-500 text-center">
            Something went wrong — try again.
          </p>
        )}
      </form>
    </div>
  );
}
