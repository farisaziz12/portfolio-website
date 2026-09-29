import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { identify, track, trackFormStarted } from '../../lib/analytics';
import './inquiry-form.css';

/**
 * "Everything else" door on /contact: email + message → /api/contact (Resend).
 * Same honesty rule as the invite form: success only on a 200 with a reference
 * (the admin notification was accepted); 503 not-configured / 502 / network are
 * failures and the text stays in the form. `?topic=role|press|…` is passed through.
 */

type Status = 'form' | 'sending' | 'sent' | 'failed';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ['role', 'speaking', 'press', 'consulting', 'mentorship', 'other'];

interface Props {
  replyTime: string;
  linkedin?: string;
}

export default function ContactForm({ replyTime, linkedin }: Props) {
  const uid = useId();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('other');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>('form');
  const [ref, setRef] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('topic');
    if (t && TOPICS.includes(t)) setTopic(t);
  }, []);

  useEffect(() => {
    if (status === 'sent' || status === 'failed') panelRef.current?.focus();
  }, [status]);

  function touch() {
    trackFormStarted('contact');
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Add an email address so I can reply.';
    else if (!EMAIL_RE.test(email.trim())) next.email = "That doesn't look like an email address.";
    if (!message.trim()) next.message = 'A sentence is enough.';
    setErrors(next);
    if (next.email || next.message) {
      (next.email ? emailRef.current : messageRef.current)?.focus();
      track('form_validation_failed', { form: 'contact', fields: Object.keys(next) });
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, topic }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string };
      if (!res.ok || !body.ok || !body.ref) {
        setStatus('failed');
        track('form_submit_failed', { form: 'contact', reason: body.error || 'server', status: res.status });
        return;
      }
      setRef(body.ref);
      setStatus('sent');
      identify(email.trim(), { last_contact_topic: topic });
      track('contact_form_submitted', { topic, has_company: false, message_length: message.trim().length });
    } catch {
      setStatus('failed');
      track('form_submit_failed', { form: 'contact', reason: 'network' });
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-sent" ref={panelRef} tabIndex={-1} role="status">
        <p className="ds-kicker">Received · ref {ref}</p>
        <p className="contact-sent__title">It’s in my inbox. I’ll reply within {replyTime}.</p>
        <button
          type="button"
          className="ds-link ds-link--sm contact-sent__again"
          onClick={() => { setEmail(''); setMessage(''); setStatus('form'); }}
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status === 'sending';
  const eId = `${uid}-email`;
  const mId = `${uid}-message`;

  return (
    <form className="inq-form contact-form" onSubmit={onSubmit} noValidate aria-busy={sending}>
      {status === 'failed' && (
        <div className="inq-failed contact-failed" ref={panelRef} tabIndex={-1} role="alert">
          <p className="inq-failed__title">That didn’t go through, and nothing was stored.</p>
          <p className="inq-failed__body">
            Your message is still here. Try again in a minute
            {linkedin ? <>, or reach me on <a className="ds-textlink" href={linkedin} rel="me noopener" target="_blank">LinkedIn</a></> : null}.
          </p>
        </div>
      )}
      <fieldset className="inq-fields contact-form__fields" disabled={sending}>
        <div className="ds-field">
          <label htmlFor={eId} className="ds-field__label">Your email<span className="req" aria-hidden="true"> *</span></label>
          <input
            ref={emailRef}
            id={eId}
            type="email"
            inputMode="email"
            autoComplete="email"
            className="ds-input"
            value={email}
            maxLength={320}
            aria-required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${eId}-err` : undefined}
            onChange={(e) => { touch(); setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }}
          />
          {errors.email && <span id={`${eId}-err`} className="ds-field__error">{errors.email}</span>}
        </div>
        <div className="ds-field">
          <label htmlFor={mId} className="ds-field__label">Message<span className="req" aria-hidden="true"> *</span></label>
          <textarea
            ref={messageRef}
            id={mId}
            rows={4}
            className="ds-textarea"
            value={message}
            maxLength={5000}
            aria-required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${mId}-err` : undefined}
            onChange={(e) => { touch(); setMessage(e.target.value); if (errors.message) setErrors((x) => ({ ...x, message: undefined })); }}
          />
          {errors.message && <span id={`${mId}-err`} className="ds-field__error">{errors.message}</span>}
        </div>
      </fieldset>
      <div className="inq-submit">
        <button type="submit" className="ds-btn ds-btn--yellow" disabled={sending} data-track="contact_submit">
          {sending ? 'Sending…' : status === 'failed' ? 'Try again' : 'Send'}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{sending ? 'Sending your message.' : ''}</p>
    </form>
  );
}
