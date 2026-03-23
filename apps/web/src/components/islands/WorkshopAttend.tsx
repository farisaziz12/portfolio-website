import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────

interface PortableTextChild {
  _key: string;
  _type: string;
  text: string;
  marks?: string[];
}

interface PortableTextMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

interface PortableTextBlock {
  _key: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children: PortableTextChild[];
  markDefs?: PortableTextMarkDef[];
}

interface CodeBlock {
  _key: string;
  _type: 'code';
  language?: string;
  filename?: string;
  code?: string;
}

interface ImageBlock {
  _key: string;
  _type: 'image';
  alt?: string;
  caption?: string;
  asset?: {
    _ref: string;
    _type: 'reference';
  };
}

type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'tip';

interface CalloutBlock {
  _key: string;
  _type: 'callout';
  type?: CalloutType;
  title?: string;
  content?: PortableTextBlock[];
}

interface TableBlock {
  _key: string;
  _type: 'table';
  rows?: {
    _key: string;
    cells: string[];
  }[];
}

type ContentBlock = PortableTextBlock | CodeBlock | ImageBlock | CalloutBlock | TableBlock;

interface Section {
  _key: string;
  emoji?: string;
  title: string;
  sectionFeedbackUrl?: string;
  content?: ContentBlock[];
}

interface WorkshopAttendProps {
  title: string;
  event: string;
  token: string;
  repoUrl: string;
  overallFeedbackUrl?: string;
  sections: Section[];
  closeDateISO: string;
  sanityProjectId: string;
  sanityDataset: string;
}

interface UserInfo {
  name: string;
  email: string;
}

// ── Countdown Banner ─────────────────────────────────────────

function CountdownBanner({ closeDateISO }: { closeDateISO: string }) {
  const [remainingDays, setRemainingDays] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const ms = new Date(closeDateISO).getTime() - Date.now();
      setRemainingDays(ms > 0 ? ms / (1000 * 60 * 60 * 24) : 0);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [closeDateISO]);

  if (remainingDays === null || remainingDays <= 0) return null;

  const days = Math.ceil(remainingDays);
  const isUrgent = remainingDays < 1;
  const isWarning = remainingDays <= 3;

  const colors = isUrgent
    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    : isWarning
    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';

  const message = isUrgent
    ? 'Less than 24 hours remaining'
    : isWarning
    ? `${days} day${days === 1 ? '' : 's'} remaining — save your progress`
    : `${days} day${days === 1 ? '' : 's'} remaining`;

  return (
    <div className={`mb-8 px-4 py-3 rounded-lg border text-sm font-medium text-center ${colors}`}>
      {message}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────

function storageKey(token: string) {
  return `workshop-user-${token}`;
}

function getStoredUser(token: string): UserInfo | null {
  try {
    const raw = localStorage.getItem(storageKey(token));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.name && parsed.email) return parsed;
    return null;
  } catch {
    return null;
  }
}

function storeUser(token: string, user: UserInfo) {
  localStorage.setItem(storageKey(token), JSON.stringify(user));
}

// ── PortableText Renderer ──────────────────────────────────────

function renderSpan(child: PortableTextChild, markDefs?: PortableTextMarkDef[]) {
  let node: React.ReactNode = child.text;

  if (child.marks?.includes('strong')) {
    node = <strong className="font-semibold text-[rgb(var(--ink))]">{node}</strong>;
  }
  if (child.marks?.includes('em')) {
    node = <em>{node}</em>;
  }
  if (child.marks?.includes('code')) {
    node = (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm font-mono text-[rgb(var(--ink))]">
        {node}
      </code>
    );
  }

  const linkMark = markDefs?.find(
    (def) => def._type === 'link' && child.marks?.includes(def._key)
  );
  if (linkMark?.href) {
    node = (
      <a
        href={linkMark.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[rgb(var(--accent))] hover:underline"
      >
        {node}
      </a>
    );
  }

  return node;
}

function PortableTextContent({ blocks, sanityProjectId, sanityDataset }: { blocks: ContentBlock[]; sanityProjectId: string; sanityDataset: string }) {
  if (!blocks || blocks.length === 0) return null;

  const elements: React.ReactNode[] = [];
  let listBuffer: PortableTextBlock[] = [];
  let listType: string | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const Tag = listType === 'number' ? 'ol' : 'ul';
    const listClass =
      listType === 'number'
        ? 'list-decimal pl-6 mb-6 space-y-2 text-[rgb(var(--ink-muted))]'
        : 'list-disc pl-6 mb-6 space-y-2 text-[rgb(var(--ink-muted))]';
    elements.push(
      <Tag key={`list-${listBuffer[0]._key}`} className={listClass}>
        {listBuffer.map((item) => (
          <li key={item._key} className="pl-2">
            {item.children.map((child, i) => (
              <span key={child._key || i}>{renderSpan(child, item.markDefs)}</span>
            ))}
          </li>
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  for (const block of blocks) {
    if (block._type === 'code') {
      flushList();
      elements.push(<CodeBlockRenderer key={block._key} block={block as CodeBlock} />);
      continue;
    }

    if (block._type === 'image') {
      flushList();
      elements.push(<ImageRenderer key={block._key} block={block as ImageBlock} projectId={sanityProjectId} dataset={sanityDataset} />);
      continue;
    }

    if (block._type === 'callout') {
      flushList();
      elements.push(<CalloutRenderer key={block._key} block={block as CalloutBlock} />);
      continue;
    }

    if (block._type === 'table') {
      flushList();
      elements.push(<TableRenderer key={block._key} block={block as TableBlock} />);
      continue;
    }

    const b = block as PortableTextBlock;

    if (b.listItem) {
      if (listType && listType !== b.listItem) flushList();
      listType = b.listItem;
      listBuffer.push(b);
      continue;
    }

    flushList();

    const children = b.children.map((child, i) => (
      <span key={child._key || i}>{renderSpan(child, b.markDefs)}</span>
    ));

    switch (b.style) {
      case 'h2':
        elements.push(
          <h2 key={b._key} className="text-2xl font-display font-semibold text-[rgb(var(--ink))] mt-10 mb-4">
            {children}
          </h2>
        );
        break;
      case 'h3':
        elements.push(
          <h3 key={b._key} className="text-xl font-display font-semibold text-[rgb(var(--ink))] mt-8 mb-3">
            {children}
          </h3>
        );
        break;
      case 'h4':
        elements.push(
          <h4 key={b._key} className="text-lg font-display font-semibold text-[rgb(var(--ink))] mt-6 mb-2">
            {children}
          </h4>
        );
        break;
      default:
        elements.push(
          <p key={b._key} className="mb-4 text-[rgb(var(--ink-muted))] leading-relaxed">
            {children}
          </p>
        );
    }
  }

  flushList();
  return <>{elements}</>;
}

// ── Code Block with Syntax Highlighting ────────────────────────

function sanityImageUrl(ref: string, projectId: string, dataset: string, width = 1200) {
  // _ref format: image-<id>-<dimensions>-<format>
  const parts = ref.replace('image-', '').split('-');
  const format = parts.pop();
  const dimensions = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=${width}&fit=max&auto=format`;
}

const calloutColors: Record<CalloutType, string> = {
  info: 'bg-blue-500/10 border-blue-500/30',
  warning: 'bg-amber-500/10 border-amber-500/30',
  success: 'bg-emerald-500/10 border-emerald-500/30',
  error: 'bg-red-500/10 border-red-500/30',
  tip: 'bg-violet-500/10 border-violet-500/30',
};

const calloutTextColors: Record<CalloutType, string> = {
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-red-600 dark:text-red-400',
  tip: 'text-violet-600 dark:text-violet-400',
};

const calloutIcons: Record<CalloutType, string> = {
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  tip: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
};

function TableRenderer({ block }: { block: TableBlock }) {
  if (!block.rows || block.rows.length === 0) return null;
  const [header, ...body] = block.rows;

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[rgb(var(--edge))]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[rgb(var(--surface-overlay))]">
            {header.cells.map((cell, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold text-[rgb(var(--ink))] border-b border-[rgb(var(--edge))]">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row) => (
            <tr key={row._key} className="border-b border-[rgb(var(--edge))] last:border-0">
              {row.cells.map((cell, i) => (
                <td key={i} className="px-4 py-3 text-[rgb(var(--ink-muted))]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalloutRenderer({ block }: { block: CalloutBlock }) {
  const t = block.type ?? 'info';
  return (
    <div className={`my-6 p-4 rounded-lg border ${calloutColors[t]}`}>
      <div className="flex items-start gap-3">
        <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${calloutTextColors[t]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={calloutIcons[t]} />
        </svg>
        <div>
          {block.title && (
            <p className={`font-semibold mb-1 ${calloutTextColors[t]}`}>{block.title}</p>
          )}
          {block.content && block.content.length > 0 && (
            <div className="text-sm text-[rgb(var(--ink-muted))] [&_a]:text-[rgb(var(--accent))] [&_a]:underline [&_a]:underline-offset-2 [&_p]:mb-1 [&_p:last-child]:mb-0">
              {block.content.map((b) => (
                <p key={b._key}>
                  {b.children.map((child, i) => (
                    <span key={child._key || i}>{renderSpan(child, b.markDefs)}</span>
                  ))}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageRenderer({ block, projectId, dataset }: { block: ImageBlock; projectId: string; dataset: string }) {
  if (!block.asset?._ref) return null;

  const src = sanityImageUrl(block.asset._ref, projectId, dataset);

  return (
    <figure className="my-8">
      <img
        src={src}
        alt={block.alt || ''}
        loading="lazy"
        className="rounded-lg w-full"
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-[rgb(var(--ink-faint))]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

const shikiImport = typeof window !== 'undefined' ? import('shiki') : null;

function CodeBlockRenderer({ block }: { block: CodeBlock }) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const code = block.code ?? '';

  useEffect(() => {
    let cancelled = false;
    shikiImport?.then(async ({ codeToHtml }) => {
      try {
        const html = await codeToHtml(code, {
          lang: block.language || 'text',
          theme: 'github-dark',
        });
        if (!cancelled) setHighlightedHtml(html);
      } catch {
        const html = await codeToHtml(code, { lang: 'text', theme: 'github-dark' });
        if (!cancelled) setHighlightedHtml(html);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [code, block.language]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 group relative">
      {block.filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-slate-300 font-mono">{block.filename}</span>
        </div>
      )}
      <div className={`relative ${block.filename ? 'rounded-b-lg' : 'rounded-lg'} overflow-hidden`}>
        {highlightedHtml ? (
          <div
            className="overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:bg-slate-900 [&>pre]:!m-0"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className={`overflow-x-auto p-4 bg-slate-900 text-slate-100 text-sm font-mono ${block.filename ? '' : 'rounded-lg'}`}>
            <code>{code}</code>
          </pre>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy code"
        >
          {copied ? (
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Section Feedback ───────────────────────────────────────────

function SectionFeedback({ url }: { url: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-8 rounded-xl border border-[rgb(var(--edge))] bg-[rgb(var(--surface-raised))] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-[rgb(var(--ink-muted))] hover:text-[rgb(var(--ink))] transition-colors"
      >
        <span>{isOpen ? 'Hide feedback form' : 'How was this section? (30 seconds)'}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <iframe src={url} width="100%" height="400" frameBorder="0" title="Section feedback" className="rounded-lg" />
        </div>
      )}
    </div>
  );
}

// ── Gate View (Name + Email) ───────────────────────────────────

function GateView({
  event,
  token,
  onSuccess,
}: {
  event: string;
  token: string;
  onSuccess: (user: UserInfo) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !email || !name.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/workshop/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          source: 'workshop-attend',
          instanceSlug: token,
          event,
        }),
      });
      if (!res.ok) throw new Error('Failed');

      const user = { name: name.trim(), email };
      storeUser(token, user);
      onSuccess(user);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[rgb(var(--edge))] bg-[rgb(var(--surface-raised))] p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-[rgb(var(--ink))] mb-2">
              Welcome to the workshop
            </h2>
            <p className="text-sm text-[rgb(var(--ink-muted))]">
              Enter your details to access the materials for {event}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[rgb(var(--edge))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] placeholder-[rgb(var(--ink-faint))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[rgb(var(--edge))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] placeholder-[rgb(var(--ink-faint))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors"
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 rounded"
              />
              <span className="text-xs text-[rgb(var(--ink-muted))] leading-relaxed">
                I agree to receive updates about future workshops and conference appearances. No spam — unsubscribe anytime.
              </span>
            </label>

            <button
              type="submit"
              disabled={!consent || !name.trim() || !email || status === 'loading'}
              className="w-full px-6 py-3 rounded-lg font-medium text-white bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Loading...' : 'Access Workshop'}
            </button>

            {status === 'error' && (
              <p className="text-sm text-red-500 text-center">Something went wrong — try again.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Schedule View (root) ───────────────────────────────────────

function ScheduleView({
  userName,
  title,
  event,
  repoUrl,
  sections,
  visited,
  onSelectSection,
}: {
  userName: string;
  title: string;
  event: string;
  repoUrl: string;
  sections: Section[];
  visited: Set<string>;
  onSelectSection: (index: number) => void;
}) {
  const completedCount = sections.filter((s) => visited.has(s._key)).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Greeting */}
      <div className="mb-10">
        <p className="text-[rgb(var(--ink-muted))] mb-1">Hello, {userName}</p>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[rgb(var(--ink))] mb-2">
          {title}
        </h1>
        <p className="text-[rgb(var(--ink-faint))] text-sm">{event}</p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] transition-colors"
        >
          Open GitHub Repo
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[rgb(var(--ink-muted))]">Progress</span>
          <span className="text-sm text-[rgb(var(--ink-faint))]">{completedCount} / {sections.length}</span>
        </div>
        <div className="h-2 rounded-full bg-[rgb(var(--surface-overlay))]">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${sections.length > 0 ? (completedCount / sections.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const done = visited.has(section._key);
          return (
            <button
              key={section._key}
              type="button"
              onClick={() => onSelectSection(index)}
              className="w-full text-left rounded-xl border border-[rgb(var(--edge))] bg-[rgb(var(--surface-raised))] p-5 hover:border-[rgb(var(--edge-strong))] transition-colors group"
            >
              <div className="flex items-center gap-4">
                {/* Step indicator */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  done
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-[rgb(var(--surface-overlay))] text-[rgb(var(--ink-faint))]'
                }`}>
                  {done ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {section.emoji && <span className="text-lg">{section.emoji}</span>}
                    <span className="font-display font-semibold text-[rgb(var(--ink))] group-hover:text-[rgb(var(--accent))] transition-colors">
                      {section.title}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <svg className="w-5 h-5 text-[rgb(var(--ink-faint))] group-hover:text-[rgb(var(--accent))] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Section Detail View ────────────────────────────────────────

function SectionView({
  section,
  index,
  total,
  sanityProjectId,
  sanityDataset,
  onBack,
  onPrev,
  onNext,
}: {
  section: Section;
  index: number;
  total: number;
  sanityProjectId: string;
  sanityDataset: string;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[rgb(var(--ink-muted))] hover:text-[rgb(var(--accent))] transition-colors"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          All sections
        </button>
        <span className="text-sm text-[rgb(var(--ink-faint))]">
          {index + 1} / {total}
        </span>
      </div>

      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {section.emoji && <span className="text-3xl">{section.emoji}</span>}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[rgb(var(--ink))]">
            {section.title}
          </h1>
        </div>
        <div className="h-px bg-[rgb(var(--edge))]" />
      </div>

      {/* Content */}
      {section.content && section.content.length > 0 && (
        <div className="mb-12">
          <PortableTextContent blocks={section.content} sanityProjectId={sanityProjectId} sanityDataset={sanityDataset} />
        </div>
      )}

      {/* Section feedback */}
      {section.sectionFeedbackUrl && (
        <SectionFeedback url={section.sectionFeedbackUrl} />
      )}

      {/* Bottom nav */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-[rgb(var(--edge))]">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[rgb(var(--ink-muted))] hover:text-[rgb(var(--ink))] bg-[rgb(var(--surface-overlay))] border border-[rgb(var(--edge))] hover:border-[rgb(var(--edge-strong))] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Previous
        </button>

        {index < total - 1 ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] transition-colors"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Back to schedule
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export default function WorkshopAttend({
  title,
  event,
  token,
  repoUrl,
  overallFeedbackUrl,
  sections,
  closeDateISO,
  sanityProjectId,
  sanityDataset,
}: WorkshopAttendProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  // Hydrate from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser(token);
    if (stored) setUser(stored);

    // Restore visited sections
    try {
      const raw = localStorage.getItem(`workshop-visited-${token}`);
      if (raw) setVisited(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, [token]);

  // Mark section as visited when entering it
  const openSection = useCallback((index: number) => {
    setActiveSection(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const key = sections[index]?._key;
    if (key) {
      setVisited((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        localStorage.setItem(`workshop-visited-${token}`, JSON.stringify([...next]));
        return next;
      });
    }
  }, [sections, token]);

  const goToSchedule = useCallback(() => {
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeDate = useMemo(() => new Date(closeDateISO).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }), [closeDateISO]);

  // Loading state (SSR → hydration)
  if (!mounted) return null;

  // Gate: require name + email
  if (!user) {
    return <GateView event={event} token={token} onSuccess={setUser} />;
  }

  // Section detail view
  if (activeSection !== null && sections[activeSection]) {
    return (
      <div className="py-12 md:py-16 px-5 sm:px-8 lg:px-12">
        <SectionView
          section={sections[activeSection]}
          index={activeSection}
          total={sections.length}
          sanityProjectId={sanityProjectId}
          sanityDataset={sanityDataset}
          onBack={goToSchedule}
          onPrev={() => openSection(activeSection - 1)}
          onNext={() => openSection(activeSection + 1)}
        />
      </div>
    );
  }

  // Schedule (root) view
  return (
    <div className="py-12 md:py-16 px-5 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <CountdownBanner closeDateISO={closeDateISO} />
      </div>
      <ScheduleView
        userName={user.name.split(' ')[0]}
        title={title}
        event={event}
        repoUrl={repoUrl}
        sections={sections}
        visited={visited}
        onSelectSection={openSection}
      />

      {/* Overall feedback at bottom */}
      {overallFeedbackUrl && visited.size >= sections.length && (
        <div className="max-w-3xl mx-auto mt-16">
          <div className="rounded-xl border border-[rgb(var(--edge))] bg-[rgb(var(--surface-raised))] p-6 text-center">
            <h3 className="text-lg font-display font-semibold text-[rgb(var(--ink))] mb-2">
              You've completed all sections!
            </h3>
            <p className="text-sm text-[rgb(var(--ink-muted))] mb-4">
              One last thing — your overall feedback helps me improve future workshops.
            </p>
            <a
              href={overallFeedbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] transition-colors"
            >
              Share Feedback
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
