import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { identify, track, trackFormStarted } from '../../lib/analytics';

/**
 * Mentorship "Apply for a seat" form (V3). Styles live in
 * components/services/MentorshipApply.astro (`.mform`).
 *
 * Honesty rule: success shows ONLY when /api/mentorship confirms the inquiry
 * reached the inbox (200 + ok). 503 (email not configured), 502 and network
 * errors show a failure and keep every answer in place.
 */

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

const initial: Fields = { name: '', email: '', goals: '', currency: 'chf', budget: 'm', timeline: 'soon', cadence: 'biweekly', message: '' };

const CURRENCIES: { v: Currency; l: string }[] = [
  { v: 'chf', l: 'CHF' },
  { v: 'eur', l: 'EUR' },
  { v: 'usd', l: 'USD' },
];
const BUDGETS: { v: BudgetTier; l: string }[] = [
  { v: 's', l: 'Up to 300' },
  { v: 'm', l: '300–600' },
  { v: 'l', l: '600–1,200' },
  { v: 'xl', l: '1,200+' },
  { v: 'flex', l: 'Flexible' },
];
const CADENCES: { v: Cadence; l: string }[] = [
  { v: 'weekly', l: 'Weekly' },
  { v: 'biweekly', l: 'Every two weeks' },
  { v: 'monthly', l: 'Monthly' },
  { v: 'open', l: 'Open' },
];
const TIMELINES: { v: Timeline; l: string }[] = [
  { v: 'asap', l: 'As soon as possible' },
  { v: 'soon', l: 'In 1–2 months' },
  { v: 'exploring', l: 'Just exploring' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type ErrKey = 'name' | 'email' | 'goals';
const ERR_TEXT: Record<ErrKey, string> = {
  name: 'Add your name.',
  email: 'Add an email I can reply to.',
  goals: 'A sentence on your goal is enough.',
};

interface Props {
  /** Alternative path shown when sending fails (MentorCruise). */
  fallbackHref?: string;
  replyTime?: string;
}

interface Sent {
  ref?: string;
  confirmationSent?: boolean;
}

export default function MentorshipInquiryForm({ fallbackHref, replyTime = 'two working days' }: Props) {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Record<ErrKey, true>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  // Until hydrated, submitting would be a native GET (answers in the URL), so the button waits.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    trackFormStarted('mentorship');
    setFields((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function fail(message: string) {
    setServerError(message);
    requestAnimationFrame(() => errRef.current?.focus());
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Record<ErrKey, true>> = {};
    if (!fields.name.trim()) next.name = true;
    if (!EMAIL_RE.test(fields.email.trim())) next.email = true;
    if (!fields.goals.trim()) next.goals = true;
    setErrors(next);
    const bad = Object.keys(next) as ErrKey[];
    if (bad.length) {
      track('form_validation_failed', { form: 'mentorship', fields: bad });
      document.getElementById(`m-${bad[0]}`)?.focus();
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
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; success?: boolean; error?: string; fields?: string[]; ref?: string; confirmationSent?: boolean };
      if (!res.ok || !(body.ok || body.success)) {
        track('form_submit_failed', { form: 'mentorship', reason: body.error || 'server', status: res.status });
        if (res.status === 400 && body.fields?.length) {
          const flagged = body.fields.filter((f): f is ErrKey => f in ERR_TEXT);
          setErrors(Object.fromEntries(flagged.map((f) => [f, true])));
          fail('Something in the form needs another look; the fields are marked. Some answers may be too long.');
        } else if (res.status === 503 || body.error === 'not-configured') {
          fail('This didn’t send: the mail service isn’t available right now. Your answers are still here, so try again later.');
        } else {
          fail('This didn’t send: delivery failed on my side. Your answers are still here, so try again in a moment.');
        }
        return;
      }
      setSent({ ref: body.ref, confirmationSent: body.confirmationSent });
      identify(fields.email, { name: fields.name.trim() });
      track('mentorship_inquiry_submitted', {
        budget: fields.budget,
        currency: fields.currency,
        timeline: fields.timeline,
        cadence: fields.cadence,
      });
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch (_err) {
      track('form_submit_failed', { form: 'mentorship', reason: 'network' });
      fail('This didn’t send: I couldn’t reach the server. Your answers are still here, so check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="mform__done" role="status">
        <h3 ref={doneRef} tabIndex={-1} className="mform__done-title">
          Thanks, it’s with me.
        </h3>
        <p>
          I’ll reply within {replyTime} with an honest yes, no, or “not right now”.
          {sent.ref && (
            <>
              {' '}Your reference is <strong>{sent.ref}</strong>.
            </>
          )}
        </p>
        {sent.confirmationSent === false && <p className="mform__note">The confirmation email didn’t go out, so keep the reference above.</p>}
      </div>
    );
  }

  const errId = (k: ErrKey) => (errors[k] ? `m-${k}-err` : undefined);

  return (
    <form className="mform" method="post" onSubmit={onSubmit} noValidate aria-busy={submitting}>
      <div className="mform__row">
        <Field id="m-name" label="Your name" required error={errors.name && ERR_TEXT.name}>
          <input id="m-name" className="ds-input" value={fields.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" required aria-invalid={errors.name ? 'true' : undefined} aria-describedby={errId('name')} />
        </Field>
        <Field id="m-email" label="Email" required error={errors.email && ERR_TEXT.email}>
          <input id="m-email" type="email" className="ds-input" value={fields.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" required aria-invalid={errors.email ? 'true' : undefined} aria-describedby={errId('email')} />
        </Field>
      </div>

      <Field id="m-goals" label="Goal" required hint="Where you are, where you want to be. The promotion case, the first team, the first talk." error={errors.goals && ERR_TEXT.goals}>
        <textarea id="m-goals" className="ds-textarea" value={fields.goals} onChange={(e) => set('goals', e.target.value)} rows={4} required aria-invalid={errors.goals ? 'true' : undefined} aria-describedby={['m-goals-hint', errId('goals')].filter(Boolean).join(' ')} />
      </Field>

      <fieldset className="mform__set">
        <legend className="ds-field__label">Budget per month</legend>
        <Choices name="currency" label="Currency" options={CURRENCIES} value={fields.currency} onChange={(v) => set('currency', v)} compact />
        <Choices name="budget" label="Amount" options={BUDGETS} value={fields.budget} onChange={(v) => set('budget', v)} />
      </fieldset>

      <fieldset className="mform__set">
        <legend className="ds-field__label">Cadence</legend>
        <Choices name="cadence" label="Cadence" options={CADENCES} value={fields.cadence} onChange={(v) => set('cadence', v)} />
      </fieldset>

      <fieldset className="mform__set">
        <legend className="ds-field__label">When would you like to start?</legend>
        <Choices name="timeline" label="Start" options={TIMELINES} value={fields.timeline} onChange={(v) => set('timeline', v)} />
      </fieldset>

      <Field id="m-msg" label="Anything else?" hint="Optional.">
        <textarea id="m-msg" className="ds-textarea" value={fields.message} onChange={(e) => set('message', e.target.value)} rows={3} aria-describedby="m-msg-hint" />
      </Field>

      {serverError && (
        <div ref={errRef} tabIndex={-1} className="mform__error" role="alert">
          <p>{serverError}</p>
          {fallbackHref && (
            <p>
              Or apply on{' '}
              <a href={fallbackHref} target="_blank" rel="noopener noreferrer" className="ds-textlink">
                MentorCruise
              </a>
              .
            </p>
          )}
        </div>
      )}

      <div className="mform__actions">
        <button type="submit" className="ds-btn ds-btn--yellow ds-btn--lg" disabled={submitting || !ready} data-track="mentorship-apply-submit">
          {submitting ? 'Sending…' : 'Send application'}
        </button>
        <span className="ds-meta">I reply within {replyTime}.</span>
      </div>
    </form>
  );
}

function Field({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string; error?: string | false; children: ReactNode }) {
  return (
    <div className="ds-field">
      <label htmlFor={id} className="ds-field__label">
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <span id={`${id}-hint`} className="ds-meta">
          {hint}
        </span>
      )}
      {children}
      {error && (
        <span id={`${id}-err`} className="ds-field__error">
          {error}
        </span>
      )}
    </div>
  );
}

function Choices<V extends string>({ name, label, options, value, onChange, compact }: { name: string; label: string; options: { v: V; l: string }[]; value: V; onChange: (v: V) => void; compact?: boolean }) {
  return (
    <div className={`mform__choices${compact ? ' mform__choices--compact' : ''}`} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label key={o.v} className="mform__opt">
          <input type="radio" name={name} value={o.v} checked={value === o.v} onChange={() => onChange(o.v)} />
          <span>{o.l}</span>
        </label>
      ))}
    </div>
  );
}
