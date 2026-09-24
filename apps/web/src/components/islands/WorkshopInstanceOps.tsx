import { useEffect, useMemo, useState } from 'react';
import { renderSVG } from 'uqr';
import '../../styles/workshop-instance-ops.css';

type FollowUpState =
  | { kind: 'idle' }
  | { kind: 'loading'; dryRun: boolean }
  | { kind: 'dry'; wouldSend: number; recipients: string[] }
  | { kind: 'sent'; sent: number; failed: number; total: number }
  | { kind: 'error'; message: string };

export default function WorkshopInstanceOps({
  attendUrl,
  shortUrl,
  instanceSlug,
  feedbackUrl,
  hasAudience,
  eventLabel,
}: {
  attendUrl: string;
  /** When set, preferred typeable link (faziz-dev.com/survive). QR encodes this. */
  shortUrl?: string;
  instanceSlug: string;
  feedbackUrl?: string;
  hasAudience: boolean;
  eventLabel: string;
}) {
  const [copied, setCopied] = useState<'short' | 'full' | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [followUp, setFollowUp] = useState<FollowUpState>({ kind: 'idle' });

  const shareUrl = shortUrl || attendUrl;
  const displayShare = shareUrl.replace(/^https?:\/\//, '');
  const displayAttend = attendUrl.replace(/^https?:\/\//, '');

  const qrSvg = useMemo(
    () =>
      renderSVG(shareUrl, {
        ecc: 'M',
        border: 2,
        pixelSize: 8,
        whiteColor: 'white',
        blackColor: 'black',
      }),
    [shareUrl]
  );

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  const copyLink = async (url: string, which: 'short' | 'full') => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setFollowUp({ kind: 'error', message: 'Could not copy link' });
    }
  };

  const runFollowUp = async (dryRun: boolean) => {
    setFollowUp({ kind: 'loading', dryRun });
    try {
      const res = await fetch('/api/workshop/follow-up', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceSlug,
          feedbackUrl: feedbackUrl || undefined,
          dryRun,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        dryRun?: boolean;
        wouldSend?: number;
        recipients?: string[];
        sent?: number;
        failed?: number;
        total?: number;
      };
      if (!res.ok) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      if (dryRun) {
        setFollowUp({
          kind: 'dry',
          wouldSend: body.wouldSend ?? 0,
          recipients: body.recipients ?? [],
        });
        return;
      }
      setFollowUp({
        kind: 'sent',
        sent: body.sent ?? 0,
        failed: body.failed ?? 0,
        total: body.total ?? 0,
      });
    } catch (err) {
      setFollowUp({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Follow-up failed',
      });
    }
  };

  return (
    <div className="wio">
      <div className="wio__row">
        <span className="wio__label">Access</span>
        <div className="wio__access">
          <div
            className="wio__qr"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <div className="wio__access-actions">
            {shortUrl ? (
              <button
                type="button"
                className="wio__copy wio__copy--short"
                onClick={() => void copyLink(shortUrl, 'short')}
              >
                <code>{displayShare}</code>
                <span className="wio__lbl">{copied === 'short' ? 'Copied' : 'Copy short'}</span>
              </button>
            ) : (
              <p className="wio__hint">
                In Sanity, Generate a default short path from the event — or type your own (e.g. survive).
              </p>
            )}
            <button type="button" className="wio__copy" onClick={() => void copyLink(attendUrl, 'full')}>
              <code>{displayAttend}</code>
              <span className="wio__lbl">{copied === 'full' ? 'Copied' : 'Copy'}</span>
            </button>
            <div className="wio__btn-row">
              <button
                type="button"
                className="ds-btn ds-btn-primary"
                onClick={() => setFullscreen(true)}
              >
                Fullscreen QR
              </button>
              <a
                href={attendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-btn ds-btn-secondary"
              >
                Preview attend
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="wio__row">
        <span className="wio__label">Follow-up</span>
        <div className="wio__follow">
          {!hasAudience ? (
            <p className="wio__hint">
              Set a Resend audience on this instance in Sanity to enable the feedback blast.
            </p>
          ) : (
            <>
              <div className="wio__btn-row">
                <button
                  type="button"
                  className="ds-btn ds-btn-secondary"
                  disabled={followUp.kind === 'loading'}
                  onClick={() => void runFollowUp(true)}
                >
                  {followUp.kind === 'loading' && followUp.dryRun
                    ? 'Checking…'
                    : 'Dry-run follow-up'}
                </button>
                <button
                  type="button"
                  className="ds-btn ds-btn-primary"
                  disabled={followUp.kind === 'loading' || followUp.kind !== 'dry'}
                  onClick={() => void runFollowUp(false)}
                  title={
                    followUp.kind === 'dry'
                      ? `Send to ${followUp.wouldSend} contacts`
                      : 'Run dry-run first'
                  }
                >
                  {followUp.kind === 'loading' && !followUp.dryRun
                    ? 'Sending…'
                    : 'Send follow-up'}
                </button>
              </div>
              {followUp.kind === 'dry' && (
                <p className="wio__hint" role="status">
                  Would email {followUp.wouldSend} contact
                  {followUp.wouldSend === 1 ? '' : 's'} for {eventLabel}.
                  {feedbackUrl ? ' Includes feedback link.' : ' No feedback URL set.'}
                </p>
              )}
              {followUp.kind === 'sent' && (
                <p className="wio__hint wio__hint--ok" role="status">
                  Sent {followUp.sent} of {followUp.total}
                  {followUp.failed > 0 ? ` (${followUp.failed} failed)` : ''}.
                </p>
              )}
              {followUp.kind === 'error' && (
                <p className="wio__hint wio__hint--err" role="alert">
                  {followUp.message}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {fullscreen && (
        <div
          className="wio__fs"
          role="dialog"
          aria-modal="true"
          aria-label="Attend QR code fullscreen"
        >
          <button
            type="button"
            className="wio__fs-close"
            onClick={() => setFullscreen(false)}
          >
            Close
          </button>
          <div
            className="wio__fs-qr"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="wio__fs-url">{displayShare}</p>
          <p className="wio__fs-hint">
            {shortUrl
              ? 'Scan or type the short link for workshop materials'
              : 'Scan to open workshop materials'}
          </p>
        </div>
      )}
    </div>
  );
}
