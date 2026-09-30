import { useState } from 'react';

export function SectionFeedback({ url }: { url: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="ds-card wsa-feedback">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="wsa-feedback__toggle" aria-expanded={isOpen}>
        <span>{isOpen ? 'Hide the feedback form' : 'How was this section? It takes 30 seconds.'}</span>
        <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <iframe src={url} title="Section feedback" className="wsa-feedback__frame" />}
    </div>
  );
}
