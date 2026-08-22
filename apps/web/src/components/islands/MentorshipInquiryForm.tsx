import { useState, type FormEvent } from 'react';
import { identify, track, trackFormStarted } from '../../lib/analytics';

type Currency = 'chf' | 'eur' | 'usd';
type BudgetTier = 's' | 'm' | 'l' | 'xl' | 'flex';
type Timeline = 'asap' | 'soon' | 'exploring';
type Cadence = 'weekly' | 'biweekly' | 'monthly' | 'open';

interface Fields {
  name: string;
  email: string;
  goals: string;
  currency: Currency;
  budget: BudgetTier;
  timeline: Timeline;
  cadence: Cadence;
  message: string;
}

const initial: Fields = {
  name: '',
  email: '',
  goals: '',
  currency: 'chf',
  budget: 'm',
  timeline: 'soon',
  cadence: 'biweekly',
  message: '',
};

const CURRENCY_SYMBOL: Record<Currency, string> = {
  chf: 'CHF',
  eur: '€',
  usd: '$',
};

export default function MentorshipInquiryForm() {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Record<string, true>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    trackFormStarted('mentorship');
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const { [key]: _omit, ...rest } = e; return rest; });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, true> = {};
    if (!fields.name.trim()) next.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = true;
    if (!fields.goals.trim()) next.goals = true;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      track('form_validation_failed', { form: 'mentorship', fields: Object.keys(next) });
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setServerError(body.error || 'Something went wrong. Try emailing instead.');
        track('form_submit_failed', { form: 'mentorship', reason: 'server', status: res.status });
        return;
      }
      setSuccess(true);
      identify(fields.email, { name: fields.name.trim() });
      track('mentorship_inquiry_submitted', {
        budget: fields.budget,
        currency: fields.currency,
        timeline: fields.timeline,
        cadence: fields.cadence,
      });
    } catch (_err) {
      setServerError("Couldn't reach the server. Try again in a moment.");
      track('form_submit_failed', { form: 'mentorship', reason: 'network' });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="invite-form__success">
        <div className="invite-form__success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M5 12l5 5 9-11" />
          </svg>
        </div>
        <h3 className="invite-form__success-title">Inquiry sent</h3>
        <p className="invite-form__success-body">Thanks, I'll review this and get back to you within two days.</p>
      </div>
    );
  }

  return (
    <form className="invite-form" onSubmit={onSubmit} noValidate>
      <h3 className="invite-form__title">Tell me about yourself</h3>

      <div className="invite-form__grid">
        <Field label="Your name" htmlFor="m-name" error={errors.name}>
          <input
            id="m-name"
            className="invite-form__input"
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Jane Engineer"
            autoComplete="name"
            required
          />
        </Field>

        <Field label="Email" htmlFor="m-email" error={errors.email}>
          <input
            id="m-email"
            type="email"
            className="invite-form__input"
            value={fields.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="jane@example.com"
            autoComplete="email"
            required
          />
        </Field>

        <Field label="What do you want to work on?" htmlFor="m-goals" error={errors.goals} full>
          <textarea
            id="m-goals"
            className="invite-form__input invite-form__textarea"
            value={fields.goals}
            onChange={(e) => set('goals', e.target.value)}
            placeholder="A few sentences on what you'd like to get out of mentorship: career, technical, public speaking, anything."
            rows={4}
            required
          />
        </Field>

        <Field label="Currency" full>
          <div className="invite-form__seg">
            {([
              { v: 'chf', l: 'CHF' },
              { v: 'eur', l: 'EUR' },
              { v: 'usd', l: 'USD' },
            ] as { v: Currency; l: string }[]).map((opt) => (
              <label key={opt.v}>
                <input
                  type="radio"
                  name="currency"
                  value={opt.v}
                  checked={fields.currency === opt.v}
                  onChange={() => set('currency', opt.v)}
                />
                <span>{opt.l}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label={`Monthly budget (${CURRENCY_SYMBOL[fields.currency]})`} full>
          <div className="invite-form__seg">
            {([
              { v: 's', l: 'Up to 300' },
              { v: 'm', l: '300 – 600' },
              { v: 'l', l: '600 – 1,200' },
              { v: 'xl', l: '1,200+' },
              { v: 'flex', l: 'Flexible / open' },
            ] as { v: BudgetTier; l: string }[]).map((opt) => (
              <label key={opt.v}>
                <input
                  type="radio"
                  name="budget"
                  value={opt.v}
                  checked={fields.budget === opt.v}
                  onChange={() => set('budget', opt.v)}
                />
                <span>{opt.l}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Timeline" full>
          <div className="invite-form__seg">
            {([
              { v: 'asap', l: 'ASAP' },
              { v: 'soon', l: '1–2 months' },
              { v: 'exploring', l: 'Just exploring' },
            ] as { v: Timeline; l: string }[]).map((opt) => (
              <label key={opt.v}>
                <input
                  type="radio"
                  name="timeline"
                  value={opt.v}
                  checked={fields.timeline === opt.v}
                  onChange={() => set('timeline', opt.v)}
                />
                <span>{opt.l}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Preferred cadence" full>
          <div className="invite-form__seg">
            {([
              { v: 'weekly', l: 'Weekly' },
              { v: 'biweekly', l: 'Bi-weekly' },
              { v: 'monthly', l: 'Monthly' },
              { v: 'open', l: 'Open' },
            ] as { v: Cadence; l: string }[]).map((opt) => (
              <label key={opt.v}>
                <input
                  type="radio"
                  name="cadence"
                  value={opt.v}
                  checked={fields.cadence === opt.v}
                  onChange={() => set('cadence', opt.v)}
                />
                <span>{opt.l}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Anything else?" htmlFor="m-msg" full>
          <textarea
            id="m-msg"
            className="invite-form__input invite-form__textarea"
            value={fields.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Optional. Context, constraints, what you've tried already…"
            rows={3}
          />
        </Field>
      </div>

      {serverError && <p className="invite-form__server-error">{serverError}</p>}

      <button type="submit" className="ds-btn ds-btn-primary ds-btn-lg invite-form__submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send inquiry'}
        {!submitting && (
          <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  full,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`invite-form__field ${full ? 'invite-form__field--full' : ''} ${error ? 'invite-form__field--error' : ''}`}>
      {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : <span className="invite-form__label">{label}</span>}
      {children}
    </div>
  );
}
