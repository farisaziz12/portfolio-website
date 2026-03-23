import { useState, useEffect, useMemo, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────

interface WorkshopInstance {
  _id: string;
  title: string;
  event: string;
  token: string;
  workshopDate: string;
  accessDurationDays: number;
  forceClose: boolean;
  repoUrl: string;
  subscriberCount?: number;
  followUpSentAt?: string;
  status: string;
  closeDate: string;
}

interface UpcomingEvent {
  _id: string;
  title: string;
  conference: string;
  date: string;
}

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  unsubscribed: boolean;
  createdAt: string;
}

interface SubscriberData {
  total: number;
  active: number;
  unsubscribed: number;
  contacts: Subscriber[];
}

interface Props {
  instances: WorkshopInstance[];
  upcomingEvents: UpcomingEvent[];
}

type Tab = 'workshops' | 'subscribers' | 'announce' | 'digest';
type StatusFilter = 'all' | 'open' | 'upcoming' | 'closed';

// ── Helpers ────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function pluralize(count: number, singular: string) {
  return `${count} ${singular}${count !== 1 ? 's' : ''}`;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bar: string }> = {
  open: {
    label: 'Open',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    bar: 'bg-emerald-500',
  },
  upcoming: {
    label: 'Upcoming',
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    bar: 'bg-amber-500',
  },
  closed: {
    label: 'Closed',
    color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    bar: 'bg-red-500',
  },
  'force-closed': {
    label: 'Force Closed',
    color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    bar: 'bg-red-500',
  },
};

const ExternalIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// ── API helpers ────────────────────────────────────────────────

async function postJSON(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Sub-components ─────────────────────────────────────────────

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-edge)] hover:border-[var(--color-edge-strong)] transition-colors font-mono text-xs text-[var(--color-accent)] cursor-pointer group"
    >
      <span>{url.replace('https://', '')}</span>
      <span className="text-[var(--color-ink-faint)] group-hover:text-[var(--color-ink-muted)] transition-colors">
        {copied ? 'Copied!' : 'Click to copy'}
      </span>
    </button>
  );
}

function FollowUpButton({ instanceId, title, subscriberCount }: {
  instanceId: string;
  title: string;
  subscriberCount: number;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sentCount, setSentCount] = useState(0);

  const handleSend = useCallback(async () => {
    if (!confirm(`Send follow-up to ${subscriberCount} subscriber(s) for "${title}"?`)) return;
    setState('sending');
    try {
      const data = await postJSON('/api/workshop/send-followup', { instanceId });
      setSentCount(data.sent);
      setState('sent');
    } catch {
      setState('error');
    }
  }, [instanceId, title, subscriberCount]);

  if (state === 'sent') {
    return <span className="text-sm text-[var(--color-ink-faint)]">Sent to {sentCount}</span>;
  }

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={state === 'sending'}
      className="btn-ghost text-sm disabled:opacity-50"
    >
      {state === 'sending' ? 'Sending...' : state === 'error' ? 'Retry' : `Send Follow-up (${subscriberCount})`}
    </button>
  );
}

function InstanceCard({ instance }: { instance: WorkshopInstance }) {
  const cfg = STATUS_CONFIG[instance.status] || STATUS_CONFIG.closed;
  const isClosed = instance.status === 'closed' || instance.status === 'force-closed';
  const hasSubscribers = (instance.subscriberCount || 0) > 0;
  const canSendFollowUp = isClosed && hasSubscribers && !instance.followUpSentAt;
  const attendUrl = `https://faziz-dev.com/workshops/attend/${instance.token}`;
  const sanityUrl = `https://faziz-dev.sanity.studio/structure/speaking;workshopInstance;${instance._id}`;

  return (
    <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] overflow-hidden">
      <div className={`h-1 ${cfg.bar}`} />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-display font-semibold text-lg text-[var(--color-ink)]">{instance.title}</h2>
            <p className="text-sm text-[var(--color-ink-muted)]">{instance.event}</p>
          </div>
          <div className="flex items-center gap-2">
            {hasSubscribers && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-[var(--color-accent-muted)] text-[var(--color-accent)] border-transparent">
                {pluralize(instance.subscriberCount || 0, 'subscriber')}
              </span>
            )}
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Workshop Date</p>
            <p className="text-sm text-[var(--color-ink)] font-medium">{formatDate(instance.workshopDate)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Close Date</p>
            <p className="text-sm text-[var(--color-ink)] font-medium">{formatDate(instance.closeDate)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Duration</p>
            <p className="text-sm text-[var(--color-ink)] font-medium">{instance.accessDurationDays} days</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Follow-up</p>
            <p className="text-sm text-[var(--color-ink)] font-medium">
              {instance.followUpSentAt ? `Sent ${formatDate(instance.followUpSentAt)}` : 'Not sent'}
            </p>
          </div>
        </div>

        {/* Access link */}
        <div className="mb-6">
          <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-2">Access Link</p>
          <CopyButton url={attendUrl} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--color-edge)]">
          <a href={`/workshops/attend/${instance.token}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
            Preview <ExternalIcon />
          </a>
          <a href={instance.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
            Repo <ExternalIcon />
          </a>
          <a href={sanityUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
            Edit in Sanity <ExternalIcon />
          </a>
          {canSendFollowUp && (
            <FollowUpButton
              instanceId={instance._id}
              title={instance.title}
              subscriberCount={instance.subscriberCount || 0}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AnnounceTab({ events }: { events: UpcomingEvent[] }) {
  const [eventId, setEventId] = useState('');
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [result, setResult] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setState('sending');
    try {
      const data = await postJSON('/api/admin/send-announcement', {
        eventId,
        personalNote: note || undefined,
      });
      setResult(`Sent to ${pluralize(data.sent, 'subscriber')}`);
      setState('sent');
    } catch (err) {
      setResult(err instanceof Error ? err.message : 'Network error');
      setState('error');
    }
  }, [eventId, note]);

  return (
    <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-8 max-w-2xl">
      <h2 className="font-display font-semibold text-xl text-[var(--color-ink)] mb-2">Announce an Event</h2>
      <p className="text-sm text-[var(--color-ink-muted)] mb-6">Send an email to all subscribers about an upcoming event.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-2">Event</label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          >
            <option value="">Select an event...</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title} — {e.conference} ({formatDate(e.date)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-2">
            Personal Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="I'm excited to announce..."
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={state === 'sending' || !eventId}
          className="px-6 py-3 rounded-lg font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state === 'sending' ? 'Sending...' : 'Send Announcement'}
        </button>

        {result && (
          <p className={`text-sm mt-2 ${state === 'sent' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {result}
          </p>
        )}
      </form>
    </div>
  );
}

function DigestTab({ upcomingEventCount }: { upcomingEventCount: number }) {
  const [intro, setIntro] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [result, setResult] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      const data = await postJSON('/api/admin/send-digest', {
        introText: intro || undefined,
      });
      setResult(`Sent to ${pluralize(data.sent, 'subscriber')}`);
      setState('sent');
    } catch (err) {
      setResult(err instanceof Error ? err.message : 'Network error');
      setState('error');
    }
  }, [intro]);

  return (
    <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-8 max-w-2xl">
      <h2 className="font-display font-semibold text-xl text-[var(--color-ink)] mb-2">Send Digest</h2>
      <p className="text-sm text-[var(--color-ink-muted)] mb-6">
        Send a roundup of upcoming events and recent blog posts to all subscribers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-2">
            Intro Message (optional)
          </label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            placeholder="Here's what I've been up to..."
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
          />
        </div>

        <div className="p-4 rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-edge)]">
          <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-2">Auto-included content</p>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {pluralize(upcomingEventCount, 'upcoming event')} + recent blog posts
          </p>
        </div>

        <button
          type="submit"
          disabled={state === 'sending'}
          className="px-6 py-3 rounded-lg font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state === 'sending' ? 'Sending...' : 'Send Digest'}
        </button>

        {result && (
          <p className={`text-sm mt-2 ${state === 'sent' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {result}
          </p>
        )}
      </form>
    </div>
  );
}

// ── Subscribers Tab ────────────────────────────────────────────

function SubscribersTab() {
  const [data, setData] = useState<SubscriberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('active');

  useEffect(() => {
    fetch('/api/admin/subscribers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const lowerSearch = search.toLowerCase();
    return data.contacts.filter((c) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' ? !c.unsubscribed : c.unsubscribed);
      const matchesSearch =
        !lowerSearch ||
        c.email.toLowerCase().includes(lowerSearch) ||
        c.firstName.toLowerCase().includes(lowerSearch) ||
        c.lastName.toLowerCase().includes(lowerSearch);
      return matchesFilter && matchesSearch;
    });
  }, [data, filter, search]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-12 text-center">
        <p className="text-[var(--color-ink-muted)]">Loading subscribers...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-12 text-center">
        <p className="text-red-600 dark:text-red-400">{error || 'Failed to load subscribers'}</p>
      </div>
    );
  }

  const filters: { key: typeof filter; label: string; count: number }[] = [
    { key: 'active', label: 'Active', count: data.active },
    { key: 'unsubscribed', label: 'Unsubscribed', count: data.unsubscribed },
    { key: 'all', label: 'All', count: data.total },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-5 text-center">
          <p className="text-2xl font-display font-bold text-[var(--color-ink)]">{data.active}</p>
          <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-5 text-center">
          <p className="text-2xl font-display font-bold text-[var(--color-ink)]">{data.unsubscribed}</p>
          <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mt-1">Unsubscribed</p>
        </div>
        <div className="rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-5 text-center">
          <p className="text-2xl font-display font-bold text-[var(--color-ink)]">{data.total}</p>
          <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mt-1">Total</p>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-[var(--color-surface-overlay)] text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="ml-auto px-3 py-1.5 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] text-sm placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors w-64"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-12 text-center">
          <p className="text-[var(--color-ink-muted)]">No subscribers match your filters.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-edge)]">
                  <th className="text-left px-4 py-3 text-xs text-[var(--color-ink-faint)] uppercase tracking-wider font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-xs text-[var(--color-ink-faint)] uppercase tracking-wider font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-xs text-[var(--color-ink-faint)] uppercase tracking-wider font-medium">Subscribed</th>
                  <th className="text-left px-4 py-3 text-xs text-[var(--color-ink-faint)] uppercase tracking-wider font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr key={contact.id} className="border-b border-[var(--color-edge)] last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-ink)]">{contact.email}</td>
                    <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                      {[contact.firstName, contact.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-ink-faint)]">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {contact.unsubscribed ? (
                        <span className="text-xs text-red-600 dark:text-red-400">Unsubscribed</span>
                      ) : (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--color-edge)] text-xs text-[var(--color-ink-faint)]">
            Showing {filtered.length} of {data.total} contacts
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────

export default function AdminDashboard({ instances, upcomingEvents }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('workshops');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  // Fetch live subscriber count from Resend on mount
  useEffect(() => {
    fetch('/api/admin/subscribers')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setSubscriberCount(data.active); })
      .catch(() => {});
  }, []);

  const counts = useMemo(() => ({
    all: instances.length,
    open: instances.filter((i) => i.status === 'open').length,
    upcoming: instances.filter((i) => i.status === 'upcoming').length,
    closed: instances.filter((i) => i.status === 'closed' || i.status === 'force-closed').length,
  }), [instances]);

  const filteredInstances = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return instances.filter((i) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'closed' ? (i.status === 'closed' || i.status === 'force-closed') : i.status === statusFilter);
      const matchesSearch =
        !lowerSearch ||
        i.title.toLowerCase().includes(lowerSearch) ||
        i.event.toLowerCase().includes(lowerSearch);
      return matchesStatus && matchesSearch;
    });
  }, [instances, statusFilter, search]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'workshops', label: 'Workshops' },
    { key: 'subscribers', label: 'Subscribers' },
    { key: 'announce', label: 'Announce Event' },
    { key: 'digest', label: 'Send Digest' },
  ];

  const filters: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'open', label: 'Open', count: counts.open },
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { key: 'closed', label: 'Closed', count: counts.closed },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--color-ink)] mb-2">Admin Dashboard</h1>
          <p className="text-[var(--color-ink-muted)]">Workshops, announcements, and subscriber engagement</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--color-ink-faint)]">
          <span>{subscriberCount !== null ? pluralize(subscriberCount, 'subscriber') : 'Loading...'}</span>
          <span>{pluralize(instances.length, 'instance')}</span>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--color-edge)] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
                : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workshops tab */}
      {activeTab === 'workshops' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex gap-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === f.key
                      ? 'bg-[var(--color-surface-overlay)] text-[var(--color-ink)]'
                      : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="ml-auto px-3 py-1.5 rounded-lg border border-[var(--color-edge)] bg-[var(--color-surface)] text-[var(--color-ink)] text-sm placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-accent)] transition-colors w-48"
            />
          </div>

          {/* Instance list */}
          {filteredInstances.length === 0 ? (
            <div className="rounded-2xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] p-12 text-center">
              <p className="text-[var(--color-ink-muted)]">
                {instances.length === 0 ? 'No instances yet.' : 'No instances match your filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInstances.map((instance) => (
                <InstanceCard key={instance._id} instance={instance} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscribers tab */}
      {activeTab === 'subscribers' && <SubscribersTab />}

      {/* Announce tab */}
      {activeTab === 'announce' && <AnnounceTab events={upcomingEvents} />}

      {/* Digest tab */}
      {activeTab === 'digest' && <DigestTab upcomingEventCount={upcomingEvents.length} />}
    </>
  );
}
