import { useState } from 'react';
import { identify, track } from '../../../lib/analytics';
import type { WorkshopUser } from './types';
import { storeUser } from './user-storage';

export function GateView({
  event,
  token,
  phase,
  onSuccess,
}: {
  event: string;
  token: string;
  phase: 'live' | 'readonly';
  onSuccess: (user: WorkshopUser) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !email || !name.trim()) return;

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
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[rgb(var(--edge))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] placeholder-[rgb(var(--ink-faint))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[rgb(var(--edge))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] placeholder-[rgb(var(--ink-faint))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors"
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 rounded"
              />
              <span className="text-xs text-[rgb(var(--ink-muted))] leading-relaxed">
                I agree to receive updates about future workshops and conference appearances. No spam, unsubscribe anytime.
              </span>
            </label>

            {phase === 'live' && (
              <p className="text-xs text-[rgb(var(--ink-faint))] leading-relaxed">
                During the live session, your name, current section, and whether this tab is active
                are visible to the instructor. Live presence stops when the session ends; materials
                stay available afterward.
              </p>
            )}

            <button
              type="submit"
              disabled={!consent || !name.trim() || !email || status === 'loading'}
              className="w-full px-6 py-3 rounded-lg font-medium text-white bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

