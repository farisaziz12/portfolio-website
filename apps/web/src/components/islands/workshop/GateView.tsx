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
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const canSubmit = Boolean(name.trim() && email) && status !== 'loading';

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

  return (
    <div className="wsa-gate">
      <div className="ds-card wsa-gate__card">
        <p className="ds-kicker">Workshop · {event}</p>
        <h1 className="ds-h2">Welcome to the workshop</h1>
        <p className="wsa-gate__lede">Tell me who you are and the materials open right away.</p>

        <form onSubmit={handleSubmit} data-form="workshop-attend">
          <div className="ds-field">
            <label htmlFor="workshop-gate-name" className="ds-field__label">Name</label>
            <input
              id="workshop-gate-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ds-input"
            />
          </div>

          <div className="ds-field">
            <label htmlFor="workshop-gate-email" className="ds-field__label">Email</label>
            <input
              id="workshop-gate-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ds-input"
            />
          </div>

          <button
            type="submit"
            aria-disabled={!canSubmit}
            onClick={(e) => {
              if (!canSubmit) e.preventDefault();
            }}
            className="ds-btn ds-btn--yellow ds-btn--lg ds-btn--block"
          >
            {status === 'loading' ? 'Opening…' : 'Open the materials'}
          </button>

          {status === 'error' && (
            <p className="wsa-error" role="alert">That didn't work. Try again in a moment.</p>
          )}
        </form>
      </div>
    </div>
  );
}
