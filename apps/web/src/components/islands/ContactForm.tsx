import { useEffect, useState, type FormEvent } from 'react';
import { identify, track, trackFormStarted } from '../../lib/analytics';

type Topic = 'role' | 'speaking' | 'consulting' | 'mentorship' | 'other';

const TOPICS: { v: Topic; l: string }[] = [
  { v: 'role', l: 'Full-time role' },
  { v: 'speaking', l: 'Speaking' },
  { v: 'consulting', l: 'Consulting' },
  { v: 'mentorship', l: 'Mentorship' },
  { v: 'other', l: 'Something else' },
];

interface Fields {
  name: string;
  email: string;
  company: string;
  topic: Topic;
  message: string;
}

const initial: Fields = {
  name: '',
  email: '',
  company: '',
  topic: 'other',
  message: '',
};

// General contact form — every message goes through /api/contact (Resend),
// never a mailto. The "Hire me full-time" door preselects topic=role via the
// contact:topic custom event; other pages can deep-link with /contact?topic=….
export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Record<string, true>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    // Priority: pending door click (pre-hydration) > ?topic= deep link.
    const pending = (window as any).__contactTopic as string | undefined;
    const params = new URLSearchParams(window.location.search);
    const topic = pending || params.get('topic');
    if (topic && TOPICS.some((t) => t.v === topic)) {
      setFields((f) => ({ ...f, topic: topic as Topic }));
    }
    delete (window as any).__contactTopic;
    const onTopic = (e: Event) => {
      const next = (e as CustomEvent<{ topic?: string }>).detail?.topic;
      if (next && TOPICS.some((t) => t.v === next)) {
        setFields((f) => ({ ...f, topic: next as Topic }));
      }
    };
    window.addEventListener('contact:topic', onTopic);
    return () => window.removeEventListener('contact:topic', onTopic);
  }, []);

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    trackFormStarted('contact');
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const { [key]: _, ...rest } = e; return rest; });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, true> = {};
    if (!fields.name.trim()) next.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = true;
    if (!fields.message.trim()) next.message = true;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      track('form_validation_failed', { form: 'contact', fields: Object.keys(next) });
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setServerError(body.error || 'Something went wrong. Try again in a moment.');
        track('form_submit_failed', { form: 'contact', reason: 'server', status: res.status });
        return;
      }
      setSuccess(true);
      identify(fields.email, {
        name: fields.name.trim(),
        company: fields.company.trim() || undefined,
        last_contact_topic: fields.topic,
      });
      track('contact_form_submitted', {
        topic: fields.topic,
        has_company: Boolean(fields.company.trim()),
        message_length: fields.message.trim().length,
      });
    } catch (err) {
      setServerError("Couldn't reach the server. Try again in a moment.");
      track('form_submit_failed', { form: 'contact', reason: 'network' });
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
        <h3 className="invite-form__success-title">Message sent</h3>
        <p className="invite-form__success-body">Thanks, it's in my inbox. I'll get back to you within two days.</p>
      </div>
    );
  }

  return (
    <form className="invite-form" onSubmit={onSubmit} noValidate>
      <h3 className="invite-form__title">Send me a message</h3>

      <div className="invite-form__grid">
        <Field label="Your name" htmlFor="c-name" error={errors.name}>
          <input
            id="c-name"
            className="invite-form__input"
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            required
          />
        </Field>

        <Field label="Email" htmlFor="c-email" error={errors.email}>
          <input
            id="c-email"
            type="email"
            className="invite-form__input"
            value={fields.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="ada@company.com"
            autoComplete="email"
            required
          />
        </Field>

        <Field label="Company (optional)" htmlFor="c-company" full>
          <input
            id="c-company"
            className="invite-form__input"
            value={fields.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="Where you're building"
            autoComplete="organization"
          />
        </Field>

        <Field label="What's this about?" full>
          <div className="invite-form__seg">
            {TOPICS.map((opt) => (
              <label key={opt.v}>
                <input
                  type="radio"
                  name="topic"
                  value={opt.v}
                  checked={fields.topic === opt.v}
                  onChange={() => set('topic', opt.v)}
                />
                <span>{opt.l}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Your message" htmlFor="c-msg" error={errors.message} full>
          <textarea
            id="c-msg"
            className="invite-form__input invite-form__textarea"
            value={fields.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder={fields.topic === 'role' ? 'The role, the team, and what you’re shipping…' : 'What’s on your mind…'}
            rows={5}
            required
          />
        </Field>
      </div>

      {serverError && <p className="invite-form__server-error">{serverError}</p>}

      <button type="submit" className="ds-btn ds-btn-primary ds-btn-lg invite-form__submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send message'}
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
