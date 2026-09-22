import { useCallback, useEffect, useState } from 'react';

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

export default function WorkshopLiveAdmin({
  token,
  sections,
}: {
  token: string;
  sections: SectionMeta[];
}) {
  const [data, setData] = useState<LiveSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sectionTitle = useCallback(
    (key: string | null) => {
      if (!key) return 'Schedule';
      const s = sections.find((x) => x._key === key);
      return s ? `${s.emoji ? `${s.emoji} ` : ''}${s.title}` : key;
    },
    [sections]
  );

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/workshop/admin/live?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as LiveSnapshot;
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roster');
    }
  }, [token]);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 5000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const endOrReopen = async (action: 'end-live' | 'reopen-live') => {
    setBusy(true);
    try {
      const res = await fetch('/api/workshop/admin/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  const closeLabel = data?.closeDateISO
    ? new Date(data.closeDateISO).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <p className="text-sm text-[rgb(var(--ink-muted))]">
            Phase:{' '}
            <span className="font-semibold text-[rgb(var(--ink))]">{data?.phase || '…'}</span>
            {data?.phase === 'live' && (
              <span className="ml-3 text-[rgb(var(--ink-faint))]">
                {data.totalRecent} recent · {data.onlineCount} focused
              </span>
            )}
          </p>
          {data?.phase === 'readonly' && (
            <p className="text-sm text-[rgb(var(--ink-muted))] mt-1">
              Live ended — materials stay readable until {closeLabel}.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {data?.phase === 'live' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => endOrReopen('end-live')}
              className="ds-btn ds-btn-primary"
            >
              {busy ? 'Saving…' : 'End live'}
            </button>
          )}
          {data?.phase === 'readonly' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => endOrReopen('reopen-live')}
              className="ds-btn ds-btn-secondary"
            >
              {busy ? 'Saving…' : 'Reopen live'}
            </button>
          )}
          <button type="button" onClick={refresh} className="ds-btn ds-btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {(error || data?.rosterError) && (
        <p className="text-sm text-[rgb(var(--danger))]">{error || data?.rosterError}</p>
      )}

      {data?.phase === 'live' ? (
        <div className="overflow-x-auto rounded-xl border border-[rgb(var(--edge))]">
          <table className="w-full text-sm">
            <thead className="bg-[rgb(var(--surface))] text-left text-[rgb(var(--ink-faint))]">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Section</th>
                <th className="px-4 py-3 font-medium">Tab</th>
                <th className="px-4 py-3 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[rgb(var(--ink-muted))]">
                    No heartbeats in the last 45s yet. Attendees must be on the attend page while live.
                  </td>
                </tr>
              ) : (
                data.rows.map((row) => (
                  <tr key={row.email} className="border-t border-[rgb(var(--edge))]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[rgb(var(--ink))]">{row.name || '—'}</div>
                      <div className="text-xs text-[rgb(var(--ink-faint))]">{row.email}</div>
                    </td>
                    <td className="px-4 py-3 text-[rgb(var(--ink-muted))]">
                      {sectionTitle(row.sectionKey)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          row.focused
                            ? 'text-[rgb(var(--signal))]'
                            : 'text-[rgb(var(--ink-faint))]'
                        }
                      >
                        {row.focused ? 'Active' : 'Away'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[rgb(var(--ink-faint))]">
                      {row.lastSeen
                        ? new Date(row.lastSeen).toLocaleTimeString()
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : data ? (
        <p className="text-sm text-[rgb(var(--ink-muted))]">
          Roster polling is paused outside the live phase. Historical heartbeats remain in PostHog.
        </p>
      ) : (
        <p className="text-sm text-[rgb(var(--ink-muted))]">Loading roster…</p>
      )}
    </div>
  );
}
