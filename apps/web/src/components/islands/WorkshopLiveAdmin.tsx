import { useCallback, useEffect, useMemo, useState } from 'react';

export interface LiveRosterRow {
  email: string;
  name: string;
  sectionKey: string | null;
  focused: boolean;
  lastSeen: string;
}

interface LiveSnapshot {
  phase: string;
  title?: string;
  event?: string;
  token: string;
  liveEndedAt?: string | null;
  closeDateISO?: string;
  onlineCount: number;
  totalRecent: number;
  rows: LiveRosterRow[];
  rosterError?: string;
}

interface SectionMeta {
  _key: string;
  title: string;
  emoji?: string;
}

type FilterMode = 'all' | 'focused' | 'away';

function relativeAgo(iso: string | null, nowMs: number): string {
  if (!iso) return '—';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '—';
  const sec = Math.max(0, Math.round((nowMs - t) / 1000));
  if (sec < 5) return 'just now';
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  return new Date(iso).toLocaleTimeString();
}

export default function WorkshopLiveAdmin({
  token: _token,
  sections,
  attendPath,
  event,
  pollPath,
  actionPath,
  initialData,
}: {
  /** Workshop access token (kept for callers; paths are passed explicitly). */
  token: string;
  sections: SectionMeta[];
  attendPath: string;
  event: string;
  /** Same-origin page route that returns JSON (`?format=json`). Avoid nested /api on Vercel. */
  pollPath: string;
  /** Same page route for End/Reopen live POSTs. */
  actionPath: string;
  initialData?: LiveSnapshot | null;
}) {
  const [data, setData] = useState<LiveSnapshot | null>(initialData ?? null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [copied, setCopied] = useState(false);
  const [lastFetchAt, setLastFetchAt] = useState<number | null>(
    initialData ? Date.now() : null
  );
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [confirmEnd, setConfirmEnd] = useState(false);

  const sectionTitle = useCallback(
    (key: string | null) => {
      if (!key) return 'Schedule / lobby';
      const s = sections.find((x) => x._key === key);
      return s ? `${s.emoji ? `${s.emoji} ` : ''}${s.title}` : key;
    },
    [sections]
  );

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(pollPath, { credentials: 'same-origin' });
      const body = (await res.json().catch(() => ({}))) as LiveSnapshot & {
        error?: string;
        detail?: string;
      };
      if (!res.ok) {
        throw new Error(body.detail || body.error || `HTTP ${res.status}`);
      }
      setData(body);
      setError(null);
      setLastFetchAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roster');
    }
  }, [pollPath]);

  useEffect(() => {
    // SSR already painted initialData; still poll immediately for freshness.
    void refresh();
    const tick = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, [refresh]);

  useEffect(() => {
    const poll = () => {
      if (document.hidden) return;
      void refresh();
    };
    const id = window.setInterval(poll, 5000);
    const onVis = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [refresh]);

  const endOrReopen = async (action: 'end-live' | 'reopen-live') => {
    setBusy(true);
    setConfirmEnd(false);
    try {
      const res = await fetch(actionPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
      if (!res.ok) {
        throw new Error(body.detail || body.error || `HTTP ${res.status}`);
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const copyAttend = async () => {
    const url = `${window.location.origin}${attendPath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy link');
    }
  };

  const rows = data?.rows || [];
  const focusedCount = rows.filter((r) => r.focused).length;
  const awayCount = rows.length - focusedCount;

  const sectionCounts = useMemo(() => {
    const map = new Map<string, { key: string | null; count: number; focused: number }>();
    for (const row of rows) {
      const key = row.sectionKey || '__lobby__';
      const prev = map.get(key) || { key: row.sectionKey, count: 0, focused: 0 };
      prev.count += 1;
      if (row.focused) prev.focused += 1;
      map.set(key, prev);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [rows]);

  const filteredRows = useMemo(() => {
    let list = [...rows];
    if (filter === 'focused') list = list.filter((r) => r.focused);
    if (filter === 'away') list = list.filter((r) => !r.focused);
    list.sort((a, b) => {
      if (a.focused !== b.focused) return a.focused ? -1 : 1;
      return (a.name || a.email).localeCompare(b.name || b.email);
    });
    return list;
  }, [rows, filter]);

  const closeLabel = data?.closeDateISO
    ? new Date(data.closeDateISO).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const pollAge =
    lastFetchAt != null ? relativeAgo(new Date(lastFetchAt).toISOString(), nowMs) : null;

  return (
    <div className="live-admin">
      {/* Toolbar */}
      <div className="live-admin__toolbar">
        <div className="live-admin__phase">
          <span
            className={`live-admin__pill live-admin__pill--${data?.phase || 'loading'}`}
          >
            <span className="live-admin__pill-dot" aria-hidden="true" />
            {data?.phase === 'live'
              ? 'Live'
              : data?.phase === 'readonly'
                ? 'Read-only'
                : data?.phase || 'Loading…'}
          </span>
          {pollAge && (
            <span className="live-admin__meta">Updated {pollAge}</span>
          )}
          {event && <span className="live-admin__meta">{event}</span>}
        </div>

        <div className="live-admin__actions">
          <button type="button" className="ds-btn ds-btn-secondary" onClick={copyAttend}>
            {copied ? 'Copied' : 'Copy attend link'}
          </button>
          <a
            href={attendPath}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn ds-btn-secondary"
          >
            Open attend
          </a>
          <button type="button" className="ds-btn ds-btn-secondary" onClick={() => void refresh()}>
            Refresh
          </button>
          {data?.phase === 'live' && !confirmEnd && (
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmEnd(true)}
              className="ds-btn ds-btn-primary"
            >
              End live
            </button>
          )}
          {data?.phase === 'live' && confirmEnd && (
            <div className="live-admin__confirm">
              <span>Stop presence for everyone?</span>
              <button
                type="button"
                disabled={busy}
                className="ds-btn ds-btn-primary"
                onClick={() => void endOrReopen('end-live')}
              >
                {busy ? 'Saving…' : 'Confirm end'}
              </button>
              <button
                type="button"
                className="ds-btn ds-btn-secondary"
                onClick={() => setConfirmEnd(false)}
              >
                Cancel
              </button>
            </div>
          )}
          {data?.phase === 'readonly' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void endOrReopen('reopen-live')}
              className="ds-btn ds-btn-primary"
            >
              {busy ? 'Saving…' : 'Reopen live'}
            </button>
          )}
        </div>
      </div>

      {data?.phase === 'readonly' && (
        <p className="live-admin__banner">
          Live presence is off. Materials stay readable until <strong>{closeLabel}</strong>.
          Historical heartbeats remain in PostHog.
        </p>
      )}

      {(error || data?.rosterError) && (
        <div className="live-admin__error" role="alert">
          <strong>{error ? 'Error' : 'Roster note'}:</strong>{' '}
          {error || data?.rosterError}
          {String(error || data?.rosterError || '').includes('PostHog') && (
            <span className="live-admin__error-hint">
              {' '}
              Set <code>POSTHOG_PERSONAL_API_KEY</code> and <code>POSTHOG_PROJECT_ID</code> on
              this Vercel environment.
            </span>
          )}
        </div>
      )}

      {data?.phase === 'live' && (
        <>
          {/* Stats */}
          <div className="live-admin__stats">
            <div className="live-admin__stat">
              <div className="live-admin__stat-value">{rows.length}</div>
              <div className="live-admin__stat-label">In room (45s)</div>
            </div>
            <div className="live-admin__stat live-admin__stat--signal">
              <div className="live-admin__stat-value">{focusedCount}</div>
              <div className="live-admin__stat-label">Tab active</div>
            </div>
            <div className="live-admin__stat">
              <div className="live-admin__stat-value">{awayCount}</div>
              <div className="live-admin__stat-label">Away / backgrounded</div>
            </div>
            <div className="live-admin__stat">
              <div className="live-admin__stat-value">{sectionCounts.length}</div>
              <div className="live-admin__stat-label">Sections in use</div>
            </div>
          </div>

          {/* Section breakdown */}
          {sectionCounts.length > 0 && (
            <div className="live-admin__sections">
              <h3 className="live-admin__h">Where people are</h3>
              <ul className="live-admin__section-list">
                {sectionCounts.map((s) => {
                  const pct = rows.length ? Math.round((s.count / rows.length) * 100) : 0;
                  return (
                    <li key={s.key || '__lobby__'} className="live-admin__section-row">
                      <div className="live-admin__section-head">
                        <span>{sectionTitle(s.key)}</span>
                        <span className="live-admin__meta">
                          {s.count} · {s.focused} active · {pct}%
                        </span>
                      </div>
                      <div className="live-admin__bar" aria-hidden="true">
                        <div className="live-admin__bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Roster */}
          <div className="live-admin__roster-head">
            <h3 className="live-admin__h">Roster</h3>
            <div className="live-admin__filters" role="group" aria-label="Filter roster">
              {([
                ['all', `All (${rows.length})`],
                ['focused', `Active (${focusedCount})`],
                ['away', `Away (${awayCount})`],
              ] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  className={`live-admin__filter${filter === mode ? ' is-active' : ''}`}
                  onClick={() => setFilter(mode)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="live-admin__table-wrap">
            <table className="live-admin__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Section</th>
                  <th>Tab</th>
                  <th>Last seen</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="live-admin__empty">
                      {rows.length === 0
                        ? 'No heartbeats in the last 45s. Attendees need the attend page open while live.'
                        : 'No people match this filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => (
                    <tr key={row.email} className={row.focused ? '' : 'is-away'}>
                      <td>
                        <div className="live-admin__name">{row.name || '—'}</div>
                        <div className="live-admin__email">{row.email}</div>
                      </td>
                      <td>{sectionTitle(row.sectionKey)}</td>
                      <td>
                        <span className={row.focused ? 'live-admin__tag is-on' : 'live-admin__tag'}>
                          {row.focused ? 'Active' : 'Away'}
                        </span>
                      </td>
                      <td className="live-admin__meta">
                        {relativeAgo(row.lastSeen, nowMs)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {data && data.phase !== 'live' && data.phase !== 'readonly' && (
        <p className="live-admin__banner">
          This workshop is not in a teachable materials window (phase: {data.phase}).
        </p>
      )}

      {!data && !error && <p className="live-admin__meta">Loading live room…</p>}

      <style>{`
        .live-admin { display: flex; flex-direction: column; gap: 1.25rem; }
        .live-admin__toolbar {
          display: flex; flex-wrap: wrap; gap: 1rem;
          align-items: center; justify-content: space-between;
        }
        .live-admin__phase { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }
        .live-admin__actions { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
        .live-admin__confirm {
          display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;
          font-size: 0.85rem; color: rgb(var(--ink-muted));
        }
        .live-admin__pill {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 0.35rem 0.7rem; border-radius: 999px;
          border: 1px solid rgb(var(--edge-strong)); color: rgb(var(--ink-muted));
        }
        .live-admin__pill--live {
          color: rgb(var(--signal)); border-color: rgb(var(--signal) / 0.45);
          background: rgb(var(--signal) / 0.08);
        }
        .live-admin__pill--readonly {
          color: rgb(var(--accent-bright)); border-color: rgb(var(--accent-bright) / 0.4);
        }
        .live-admin__pill-dot {
          width: 0.45rem; height: 0.45rem; border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 15%, transparent);
        }
        .live-admin__pill--live .live-admin__pill-dot {
          animation: live-pulse 1.6s ease-in-out infinite;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .live-admin__meta {
          font-size: 0.8rem; color: rgb(var(--ink-faint));
        }
        .live-admin__banner {
          margin: 0; padding: 0.85rem 1rem; border-radius: 10px;
          border: 1px solid rgb(var(--edge)); background: rgb(var(--surface));
          color: rgb(var(--ink-muted)); font-size: 0.9rem;
        }
        .live-admin__error {
          padding: 0.85rem 1rem; border-radius: 10px;
          border: 1px solid rgb(var(--danger) / 0.4);
          background: rgb(var(--danger) / 0.08);
          color: rgb(var(--danger)); font-size: 0.88rem;
        }
        .live-admin__error-hint { color: rgb(var(--ink-muted)); }
        .live-admin__error code {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.78rem;
        }
        .live-admin__stats {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem;
        }
        @media (min-width: 720px) {
          .live-admin__stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        .live-admin__stat {
          border: 1px solid rgb(var(--edge)); border-radius: 12px;
          background: rgb(var(--surface-2)); padding: 1rem 1.1rem;
        }
        .live-admin__stat--signal { border-color: rgb(var(--signal) / 0.35); }
        .live-admin__stat-value {
          font-family: var(--font-display, system-ui, sans-serif);
          font-weight: 700; font-size: 1.75rem; line-height: 1;
          color: rgb(var(--ink)); letter-spacing: -0.02em;
        }
        .live-admin__stat--signal .live-admin__stat-value { color: rgb(var(--signal)); }
        .live-admin__stat-label {
          margin-top: 0.45rem; font-size: 0.75rem;
          color: rgb(var(--ink-faint)); text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: var(--font-mono, ui-monospace, monospace);
        }
        .live-admin__h {
          margin: 0; font-family: var(--font-display, system-ui, sans-serif);
          font-weight: 600; font-size: 1.05rem; color: rgb(var(--ink));
        }
        .live-admin__sections {
          border: 1px solid rgb(var(--edge)); border-radius: 12px;
          background: rgb(var(--surface-2)); padding: 1rem 1.15rem;
        }
        .live-admin__section-list { list-style: none; margin: 0.9rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .live-admin__section-head {
          display: flex; justify-content: space-between; gap: 1rem;
          font-size: 0.88rem; color: rgb(var(--ink)); margin-bottom: 0.35rem;
        }
        .live-admin__bar {
          height: 0.35rem; border-radius: 999px; background: rgb(var(--surface-overlay, var(--surface)));
          overflow: hidden;
        }
        .live-admin__bar-fill {
          height: 100%; border-radius: 999px; background: rgb(var(--accent));
          transition: width 0.35s ease;
        }
        .live-admin__roster-head {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem;
        }
        .live-admin__filters { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .live-admin__filter {
          border: 1px solid rgb(var(--edge-strong)); background: transparent;
          color: rgb(var(--ink-muted)); border-radius: 8px;
          padding: 0.35rem 0.65rem; font-size: 0.78rem; cursor: pointer;
        }
        .live-admin__filter.is-active {
          border-color: rgb(var(--accent)); color: rgb(var(--ink));
          background: rgb(var(--accent) / 0.1);
        }
        .live-admin__table-wrap {
          overflow-x: auto; border: 1px solid rgb(var(--edge)); border-radius: 12px;
        }
        .live-admin__table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .live-admin__table th {
          text-align: left; padding: 0.75rem 1rem;
          background: rgb(var(--surface)); color: rgb(var(--ink-faint));
          font-weight: 500; font-size: 0.75rem; text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .live-admin__table td {
          padding: 0.85rem 1rem; border-top: 1px solid rgb(var(--edge));
          color: rgb(var(--ink-muted)); vertical-align: top;
        }
        .live-admin__table tr.is-away { opacity: 0.72; }
        .live-admin__name { font-weight: 600; color: rgb(var(--ink)); }
        .live-admin__email { font-size: 0.75rem; color: rgb(var(--ink-faint)); margin-top: 0.15rem; }
        .live-admin__tag {
          display: inline-block; font-size: 0.75rem;
          padding: 0.15rem 0.45rem; border-radius: 6px;
          border: 1px solid rgb(var(--edge)); color: rgb(var(--ink-faint));
        }
        .live-admin__tag.is-on {
          color: rgb(var(--signal)); border-color: rgb(var(--signal) / 0.4);
          background: rgb(var(--signal) / 0.08);
        }
        .live-admin__empty {
          text-align: center; padding: 2rem 1rem !important;
          color: rgb(var(--ink-muted));
        }
      `}</style>
    </div>
  );
}
