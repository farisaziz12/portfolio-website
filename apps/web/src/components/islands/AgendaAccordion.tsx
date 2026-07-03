import { useState } from 'react';

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
  children: PortableTextChild[];
  markDefs?: PortableTextMarkDef[];
}

interface AgendaItem {
  _key?: string;
  title?: string;
  topic?: string;
  duration?: string;
  description?: PortableTextBlock[];
}

interface AgendaAccordionProps {
  items: AgendaItem[];
}

function PortableText({ blocks }: { blocks: PortableTextBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => {
        if (block._type === 'block') {
          const Tag = block.listItem ? 'li' : 'p';
          return (
            <Tag key={block._key} className={block.listItem ? '' : 'mb-2 last:mb-0'}>
              {block.children.map((child, idx) => {
                let text: React.ReactNode = child.text;

                if (child.marks?.includes('strong')) {
                  text = <strong key={child._key || idx}>{text}</strong>;
                }
                if (child.marks?.includes('em')) {
                  text = <em key={child._key || idx}>{text}</em>;
                }

                const linkMark = block.markDefs?.find(
                  (def) => def._type === 'link' && child.marks?.includes(def._key)
                );
                if (linkMark?.href) {
                  text = (
                    <a
                      key={child._key || idx}
                      href={linkMark.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-signal border-b border-signal/30 hover:border-signal"
                    >
                      {text}
                    </a>
                  );
                }

                return <span key={child._key || idx}>{text}</span>;
              })}
            </Tag>
          );
        }
        return null;
      })}
    </>
  );
}

export default function AgendaAccordion({ items }: AgendaAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number, hasContent: boolean) => {
    if (!hasContent) return;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const itemTitle = item.title || item.topic || 'Untitled';
        const hasDescription = item.description && item.description.length > 0;
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={item._key || index}
            className={`rounded-2xl border bg-ink/5 backdrop-blur-[8px] overflow-hidden transition-all duration-200 ${
              isExpanded
                ? 'border-signal/40 shadow-[0_0_20px_rgb(var(--signal)/0.1)]'
                : 'border-edge'
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggle(index, !!hasDescription)}
              disabled={!hasDescription}
              aria-expanded={isExpanded}
              className={`flex items-center w-full text-left ${
                hasDescription ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Number Block */}
              <div
                className="flex-shrink-0 w-[4.5rem] min-h-[5rem] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgb(var(--signal)), rgb(var(--signal-deep)))' }}
              >
                <span className="text-[1.75rem] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 py-5 px-4 min-w-0">
                <h3 className="text-lg font-semibold text-ink leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                  {itemTitle}
                </h3>
              </div>

              {/* Duration */}
              {item.duration && (
                <span
                  className="flex-shrink-0 px-2.5 py-1 text-xs rounded-md mr-4 whitespace-nowrap bg-ink/10 text-ink-muted"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item.duration}
                </span>
              )}

              {/* Expand Icon */}
              {hasDescription && (
                <div
                  className={`flex-shrink-0 w-10 h-10 mr-4 flex items-center justify-center rounded-lg transition-all duration-300 ${
                    isExpanded ? 'bg-signal/20' : 'bg-ink/5'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-5 h-5 transition-all duration-300 ${
                      isExpanded ? 'text-signal rotate-180' : 'text-ink-muted'
                    }`}
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>

            {/* Expandable Content */}
            {hasDescription && item.description && (
              <div
                className={`grid transition-all duration-300 ${
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className="ml-[4.5rem] mr-6 mb-5 p-5 rounded-r-lg border-l-[3px] border-signal/40 bg-signal/5"
                  >
                    <div className="text-[0.9375rem] text-ink-muted leading-relaxed">
                      <PortableText blocks={item.description} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
