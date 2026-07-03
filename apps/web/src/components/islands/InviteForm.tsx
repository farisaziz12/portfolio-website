import { useEffect, useState, type FormEvent } from 'react';

type Format = 'keynote' | 'talk' | 'workshop' | 'panel';
type Size = 's' | 'm' | 'l' | 'xl';

interface Fields {
  name: string;
  email: string;
  event: string;
  date: string;
  location: string;
  format: Format;
  size: Size;
  message: string;
}

const initial: Fields = {
  name: '',
  email: '',
  event: '',
  date: '',
  location: '',
  format: 'talk',
  size: 'm',
  message: '',
};

const FORMATS: Format[] = ['keynote', 'talk', 'workshop', 'panel'];

export default function InviteForm() {
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Record<string, true>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // Date/location/format/size live behind "Add details" — three fields is a
  // first touch, eight is a chore. Deep links that prefill a format auto-open it.
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Prefill from query params so "Book this talk" / "Book a workshop" CTAs land
  // in a contextual form: /invite?format=workshop&talk=<title>&workshop=<title>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const format = params.get('format');
    const talk = params.get('talk');
    const workshop = params.get('workshop');
    if (FORMATS.includes(format as Format)) setDetailsOpen(true);
    setFields((f) => ({
      ...f,
      format: FORMATS.includes(format as Format) ? (format as Format) : f.format,
      message: talk
        ? `I'd like to book the talk "${talk}".\n\n`
        : workshop
          ? `I'd like to book the workshop "${workshop}".\n\n`
          : f.message,
    }));
  }, []);

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const { [key]: _, ...rest } = e; return rest; });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, true> = {};
    if (!fields.name.trim()) next.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = true;
    if (!fields.event.trim()) next.event = true;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setServerError(body.error || 'Something went wrong — try emailing instead.');
        return;
      }
      setSuccess(true);
      try { (window as any).posthog?.capture('invite_form_submitted', { format: fields.format }); } catch (_) {}
    } catch (err) {
      setServerError("Couldn't reach the server. Try again in a moment.");
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
        <h3 className="invite-form__success-title">Invitation sent</h3>
        <p className="invite-form__success-body">Thanks — I'll get back to you within two days. Talk soon.</p>
        <div className="invite-form__next">
          <span className="invite-form__next-label">While you wait, grab what you need:</span>
          <a href="#bios">Bios</a>
          <a href="#headshots">Headshots</a>
          <a href="#rider">Rider</a>
          <a href="#availability">Availability</a>
        </div>
        <p className="invite-form__success-body">
          While you're here: I also do <a className="invite-form__alt-link" href="/consulting">consulting</a> and{' '}
          <a className="invite-form__alt-link" href="/mentorship">mentorship</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="invite-form" onSubmit={onSubmit} noValidate>
      <h3 className="invite-form__title">Tell me about your event</h3>

      <div className="invite-form__grid">
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            className="invite-form__input"
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Jane Organizer"
            autoComplete="name"
            required
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            className="invite-form__input"
            value={fields.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="jane@event.com"
            autoComplete="email"
            required
          />
        </Field>

        <Field label="Event name" htmlFor="event" error={errors.event} full>
          <input
            id="event"
            className="invite-form__input"
            value={fields.event}
            onChange={(e) => set('event', e.target.value)}
            placeholder="React Summit 2026"
            required
          />
        </Field>

        <button
          type="button"
          className="invite-form__details-toggle"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((o) => !o)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
            style={{ transform: detailsOpen ? 'rotate(90deg)' : undefined }}
          >
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {detailsOpen ? 'Hide details' : 'Add details (optional)'}
          {!detailsOpen && <span className="invite-form__details-hint">date · location · format · audience size</span>}
        </button>

        {detailsOpen && (
        <>
        <Field label="Date" htmlFor="date">
          <input
            id="date"
            className="invite-form__input"
            value={fields.date}
            onChange={(e) => set('date', e.target.value)}
            placeholder="e.g. 12 Jun 2026"
          />
        </Field>

        <Field label="Location" htmlFor="location">
          <input
            id="location"
            className="invite-form__input"
            value={fields.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="Amsterdam / Remote"
          />
        </Field>

        <Field label="Format" full>
          <div className="invite-form__seg">
            {FORMATS.map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name="format"
                  value={opt}
                  checked={fields.format === opt}
                  onChange={() => set('format', opt)}
                />
                <span>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Audience size" full>
          <div className="invite-form__seg">
            {([
              { v: 's', l: '< 100' },
              { v: 'm', l: '100–500' },
              { v: 'l', l: '500–2k' },
              { v: 'xl', l: '2k+' },
            ] as { v: Size; l: string }[]).map((opt) => (
              <label key={opt.v}>
                <input
                  type="radio"
                  name="size"
                  value={opt.v}
                  checked={fields.size === opt.v}
                  onChange={() => set('size', opt.v)}
                />
                <span>{opt.l}</span>
              </label>
            ))}
          </div>
        </Field>
        </>
        )}

        <Field label="What's the event about?" htmlFor="msg" full>
          <textarea
            id="msg"
            className="invite-form__input invite-form__textarea"
            value={fields.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Audience, theme, what you're hoping I'll cover…"
            rows={4}
          />
        </Field>
      </div>

      {serverError && <p className="invite-form__server-error">{serverError}</p>}

      <button type="submit" className="ds-btn ds-btn-primary ds-btn-lg invite-form__submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send invitation'}
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
