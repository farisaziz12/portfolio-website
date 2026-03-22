import { useState } from 'react';

interface Props {
  url: string;
  label?: string;
}

export default function SectionFeedback({
  url,
  label = 'How was this section? (30 seconds)',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--color-edge)] bg-[var(--color-surface-raised)] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
      >
        <span>{isOpen ? 'Hide feedback form' : `💬 ${label}`}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">
            <iframe
              src={url}
              width="100%"
              height="400"
              frameBorder="0"
              title="Section feedback form"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
