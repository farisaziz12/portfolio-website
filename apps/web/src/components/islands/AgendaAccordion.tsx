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
                      className="text-emerald-400 hover:text-emerald-300 border-b border-emerald-400/30 hover:border-emerald-400"
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
            className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
              isExpanded
                ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : 'border-white/10'
            }`}
            style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}
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
                style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
              >
                <span className="text-[1.75rem] font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 py-5 px-4 min-w-0">
                <h3 className="text-lg font-semibold text-white leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                  {itemTitle}
                </h3>
              </div>

              {/* Duration */}
              {item.duration && (
                <span
                  className="flex-shrink-0 px-2.5 py-1 text-xs rounded-md mr-4 whitespace-nowrap"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {item.duration}
                </span>
              )}

              {/* Expand Icon */}
              {hasDescription && (
                <div
                  className={`flex-shrink-0 w-10 h-10 mr-4 flex items-center justify-center rounded-lg transition-all duration-300 ${
                    isExpanded ? 'bg-emerald-500/20' : 'bg-white/5'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-5 h-5 transition-all duration-300 ${
                      isExpanded ? 'text-emerald-400 rotate-180' : 'text-white/60'
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
                    className="ml-[4.5rem] mr-6 mb-5 p-5 rounded-r-lg border-l-[3px] border-emerald-500/40"
                    style={{ background: 'rgba(16, 185, 129, 0.05)' }}
                  >
                    <div className="text-[0.9375rem] text-slate-300 leading-relaxed">
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
