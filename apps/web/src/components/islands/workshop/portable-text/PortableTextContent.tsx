import { useEffect, useRef, useState } from 'react';
import type {
  CalloutBlock,
  CalloutType,
  CodeBlock,
  ContentBlock,
  ImageBlock,
  PortableTextBlock,
  PortableTextChild,
  PortableTextMarkDef,
  TableBlock,
} from '../types';

export function renderSpan(child: PortableTextChild, markDefs?: PortableTextMarkDef[]) {
  let node: React.ReactNode = child.text;

  if (child.marks?.includes('strong')) {
    node = <strong className="font-semibold text-[rgb(var(--ink))]">{node}</strong>;
  }
  if (child.marks?.includes('em')) {
    node = <em>{node}</em>;
  }
  if (child.marks?.includes('code')) {
    node = (
      <code className="px-1.5 py-0.5 rounded bg-surface-3 text-sm font-mono text-[rgb(var(--ink))]">
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

export function PortableTextContent({ blocks, sanityProjectId, sanityDataset }: { blocks: ContentBlock[]; sanityProjectId: string; sanityDataset: string }) {
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
  info: 'bg-accent/10 border-accent/30',
  warning: 'bg-[rgb(var(--warn)/0.1)] border-[rgb(var(--warn)/0.3)]',
  success: 'bg-signal/10 border-signal/30',
  error: 'bg-danger/10 border-danger/30',
  tip: 'bg-accent-bright/10 border-accent-bright/30',
};

const calloutTextColors: Record<CalloutType, string> = {
  info: 'text-accent',
  warning: 'text-[rgb(var(--warn))]',
  success: 'text-signal',
  error: 'text-danger',
  tip: 'text-accent-bright',
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
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-3 rounded-t-lg border-b border-edge">
          <svg className="w-4 h-4 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-ink-muted font-mono">{block.filename}</span>
        </div>
      )}
      <div className={`relative ${block.filename ? 'rounded-b-lg' : 'rounded-lg'} overflow-hidden`}>
        {highlightedHtml ? (
          <div
            className="overflow-x-auto text-sm [&>pre]:p-4 [&>pre]:!m-0"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className={`overflow-x-auto p-4 bg-surface-2 text-ink text-sm font-mono ${block.filename ? '' : 'rounded-lg'}`}>
            <code>{code}</code>
          </pre>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy code"
        >
          {copied ? (
            <svg className="w-4 h-4 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

