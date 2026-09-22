import { useState } from 'react';

export function SectionFeedback({ url }: { url: string }) {
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

