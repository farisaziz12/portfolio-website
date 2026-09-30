import { cloneElement, useEffect, useId, useRef, useState, type FormEvent, type ReactElement } from 'react';
import { identify, track, trackFormStarted } from '../../lib/analytics';
import { INVITE_KINDS, kindDef, toKind, type InviteKind } from '../../lib/invite-kinds';
import './inquiry-form.css';

/**
 * /invite form. States: form → (validation) → sending → accepted | failed.
 * Success is shown ONLY when /api/invite answers 200 with a reference, which
 * it does only after Resend accepted the admin notification. Anything else
 * (503 not-configured, 502, network) is a failure and the text stays put.
 */

interface Art {
  src: string;
  srcset?: string;
  width: number;
  height: number;
}

interface Props {
  replyTime: string;
  /** Optimised celebrating-duck image from getImage() on the page. */
  art?: Art;
  pressKitHref?: string;
  linkedin?: string;
}

type Status = 'form' | 'sending' | 'accepted' | 'failed';
type FieldName = 'name' | 'email' | 'what' | 'when' | 'audience' | 'message';
type Fields = Record<FieldName, string>;

const EMPTY: Fields = { name: '', email: '', what: '', when: '', audience: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED: FieldName[] = ['name', 'email', 'what'];

function validate(f: Fields): Partial<Record<FieldName, string>> {
  const e: Partial<Record<FieldName, string>> = {};
  if (!f.name.trim()) e.name = 'Add your name so I know who to reply to.';
  if (!f.email.trim()) e.email = 'Add an email address so I can reply.';
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "That doesn't look like an email address.";
  if (!f.what.trim()) e.what = 'A line about it is enough.';
  return e;
}

export default function InviteForm({ replyTime, art, pressKitHref = '/press-kit', linkedin }: Props) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [kind, setKind] = useState<InviteKind>('conference');
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>('form');
  const [result, setResult] = useState<{ ref: string; confirmationSent: boolean } | null>(null);
  const [failure, setFailure] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Prefill from CTAs: /invite?kind=workshop&workshop=<title> or ?talk=<title>
  // (legacy ?format=talk|workshop|panel still works).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const k = toKind(q.get('kind') || q.get('format'));
    const talk = q.get('talk');
    const workshop = q.get('workshop');
    if (k) setKind(k);
    else if (workshop) setKind('workshop');
    const line = workshop ? `I'd like to book the workshop "${workshop}".` : talk ? `I'd like to book the talk "${talk}".` : '';
    if (line) setFields((f) => ({ ...f, message: f.message || `${line}\n\n` }));
  }, []);

  useEffect(() => {
    if (status === 'accepted' || status === 'failed') panelRef.current?.focus();
  }, [status]);

  function set(key: FieldName, value: string) {
    trackFormStarted('invite');
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    const next = validate(fields);
    setErrors(next);
    const invalid = REQUIRED.filter((k) => next[k]);
    if (invalid.length) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(invalid[0]))}`)?.focus();
      track('form_validation_failed', { form: 'invite', fields: invalid });
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, ...fields }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string; confirmationSent?: boolean };
      if (!res.ok || !body.ok || !body.ref) {
        setFailure(body.error || `http-${res.status}`);
        setStatus('failed');
        track('form_submit_failed', { form: 'invite', reason: body.error || 'server', status: res.status });
        return;
      }
      setResult({ ref: body.ref, confirmationSent: body.confirmationSent !== false });
      setStatus('accepted');
      identify(fields.email.trim(), { name: fields.name.trim(), last_invite_event: fields.what.trim() });
      track('invite_form_submitted', {
        format: kind,
        audience_size: fields.audience.trim(),
        event: fields.what.trim(),
        has_date: Boolean(fields.when.trim()),
        has_location: false,
      });
    } catch {
      setFailure('network');
      setStatus('failed');
      track('form_submit_failed', { form: 'invite', reason: 'network' });
    }
  }

  function reset() {
    setFields(EMPTY);
    setErrors({});
    setResult(null);
    setStatus('form');
  }

  if (status === 'accepted' && result) {
    const first = fields.name.trim().split(/\s+/)[0] || 'there';
    return (
      <div className="ds-panel inq-accepted" ref={panelRef} tabIndex={-1} role="status">
        <div className="inq-accepted__text">
          <p className="ds-kicker">Received · ref {result.ref}</p>
          <h2 className="inq-accepted__title">Got it, {first}. I'll get back to you within {replyTime}.</h2>
          <p className="inq-accepted__body">
            {result.confirmationSent
              ? `A copy went to ${fields.email.trim()}. If it isn't there in ten minutes, check spam; the inquiry is stored either way.`
              : `The confirmation email to ${fields.email.trim()} didn't go out, but the inquiry is stored and I'll reply from my own inbox.`}
          </p>
          <div className="inq-accepted__actions">
            <a className="ds-link ds-link--sm" href={pressKitHref} data-track="invite_accepted_press_kit">Grab the press kit meanwhile</a>
            <button type="button" className="inq-textbtn" onClick={reset}>Send another</button>
          </div>
        </div>
        {art && (
          <img className="inq-accepted__art" src={art.src} srcSet={art.srcset} sizes="120px" width={art.width} height={art.height} alt="" loading="lazy" decoding="async" />
        )}
      </div>
    );
  }

  const def = kindDef(kind);
  const sending = status === 'sending';

  return (
    <div className="inq">
      {status === 'failed' && (
        <div className="inq-failed" ref={panelRef} tabIndex={-1} role="alert">
          <p className="ds-kicker">Not sent</p>
          <h2 className="inq-failed__title">That didn't go through, and nothing was stored.</h2>
          <p className="inq-failed__body">
            Your text is still in the form below. Try again in a minute
            {linkedin ? <>, or message me on <a className="ds-textlink" href={linkedin} rel="me noopener" target="_blank">LinkedIn</a></> : null}.
            {failure === 'not-configured' ? ' (The site’s mail service isn’t set up right now.)' : ''}
          </p>
        </div>
      )}

      <form ref={formRef} data-form="invite" className="inq-form" onSubmit={onSubmit} noValidate aria-busy={sending}>
        <fieldset className="inq-kinds" disabled={sending}>
          <legend className="ds-field__label">What’s it for?</legend>
          <div className="ds-pills">
            {INVITE_KINDS.map((k) => (
              <label key={k.value} className={`ds-pill inq-pill${k.value === kind ? ' is-active' : ''}`}>
                <input type="radio" name={id('kind')} value={k.value} checked={k.value === kind} onChange={() => setKind(k.value)} />
                {k.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="inq-fields" disabled={sending}>
          <div className="inq-row">
            <Field id={id('name')} label="Your name" required error={errors.name}>
              <input id={id('name')} className="ds-input" value={fields.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={200} />
            </Field>
            <Field id={id('email')} label="Email" required error={errors.email}>
              <input id={id('email')} className="ds-input" type="email" inputMode="email" value={fields.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" maxLength={320} />
            </Field>
          </div>
          <Field id={id('what')} label={def.field} required error={errors.what}>
            <input id={id('what')} className="ds-input" value={fields.what} onChange={(e) => set('what', e.target.value)} placeholder={def.placeholder} maxLength={500} />
          </Field>
          <div className="inq-row">
            <Field id={id('when')} label="When" optional>
              <input id={id('when')} className="ds-input" value={fields.when} onChange={(e) => set('when', e.target.value)} placeholder="a date, a window, or flexible" maxLength={200} />
            </Field>
            <Field id={id('audience')} label="Audience" optional>
              <input id={id('audience')} className="ds-input" value={fields.audience} onChange={(e) => set('audience', e.target.value)} placeholder="who, and roughly how many" maxLength={200} />
            </Field>
          </div>
          <Field id={id('message')} label="Anything else" optional>
            <textarea id={id('message')} className="ds-textarea" rows={4} value={fields.message} onChange={(e) => set('message', e.target.value)} placeholder="Topic you have in mind, links, budget or travel, accessibility needs, anything that helps." maxLength={5000} />
          </Field>
        </fieldset>

        <div className="inq-submit">
          <button type="submit" className="ds-btn ds-btn--yellow ds-btn--lg" disabled={sending} data-track="invite_submit">
            {sending ? 'Sending…' : status === 'failed' ? 'Try again' : 'Send it over'}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">{sending ? 'Sending. The button stays disabled until the server confirms it stored the inquiry.' : ''}</p>
      </form>
    </div>
  );
}

function Field({ id, label, required, optional, error, children }: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: ReactElement<Record<string, unknown>>;
}) {
  const errId = `${id}-err`;
  const control = cloneElement(children, { 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errId : undefined, 'aria-required': required || undefined });
  return (
    <div className="ds-field">
      <label htmlFor={id} className={`ds-field__label${optional ? ' inq-optional' : ''}`}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {control}
      {error && <span id={errId} className="ds-field__error">{error}</span>}
    </div>
  );
}
