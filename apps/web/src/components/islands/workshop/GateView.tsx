import { useState } from 'react';
import { identify, track } from '../../../lib/analytics';
import type { WorkshopUser } from './types';
import { storeUser } from './user-storage';

export function GateView({
  event,
  token,
  onSuccess,
}: {
  event: string;
  token: string;
  onSuccess: (user: WorkshopUser) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const canSubmit = Boolean(consent && name.trim() && email) && status !== 'loading';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/workshop/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email,
          token,
          event,
        }),
      });
      if (!res.ok) throw new Error('Failed');

      const user = { name: name.trim(), email: email.trim().toLowerCase() };
      storeUser(token, user);
      identify(user.email, { name: user.name, workshop_attendee: true });
      track('workshop_signed_up', { workshop: event, instance: token });
      onSuccess(user);
    } catch {
      setStatus('error');
      track('form_submit_failed', { form: 'workshop-attend', reason: 'server' });
    }
  };

  const fieldClass =
    'w-full px-4 py-3 rounded-lg border border-[rgb(var(--edge))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] placeholder-[rgb(var(--ink-faint))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[rgb(var(--edge))] bg-[rgb(var(--surface-raised))] p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-[rgb(var(--ink))] mb-2">
              Welcome to the workshop
            </h2>
            <p className="text-sm text-[rgb(var(--ink-muted))]">
              Enter your details to access the materials for {event}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="workshop-gate-name" className="text-sm font-medium text-[rgb(var(--ink-muted))]">
                Name
              </label>
              <input
                id="workshop-gate-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="workshop-gate-email" className="text-sm font-medium text-[rgb(var(--ink-muted))]">
                Email
              </label>
              <input
                id="workshop-gate-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </div>

            <label
              htmlFor="workshop-gate-consent"
              className="flex items-start gap-3 cursor-pointer rounded-lg border border-[rgb(var(--edge))] bg-[rgb(var(--surface))] px-4 py-3 has-[:focus-visible]:border-[rgb(var(--accent))]"
            >
              <input
                id="workshop-gate-consent"
                name="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                tabIndex={0}
                aria-required="true"
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-[rgb(var(--edge))] accent-[rgb(var(--accent))]"
              />
              <span className="text-xs text-[rgb(var(--ink-muted))] leading-relaxed pt-0.5">
                I agree to receive updates about future workshops and conference appearances. No spam,
                unsubscribe anytime.
              </span>
            </label>

            <button
              type="submit"
              aria-disabled={!canSubmit}
              onClick={(e) => {
                if (!canSubmit) e.preventDefault();
              }}
              className={`w-full px-6 py-3 rounded-lg font-medium text-ink-on-accent bg-[rgb(var(--accent-deep))] hover:bg-[rgb(var(--accent-hover))] transition-colors ${
                !canSubmit ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {status === 'loading' ? 'Loading...' : 'Access Workshop'}
            </button>

            {status === 'error' && (
              <p className="text-sm text-danger text-center">Something went wrong. Try again.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
