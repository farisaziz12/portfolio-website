import { PortableTextContent } from './portable-text/PortableTextContent';
import { SectionFeedback } from './SectionFeedback';
import type { ContentBlock, SectionContentStatus, WorkshopSection } from './types';

export function SectionView({
  section,
  index,
  total,
  content,
  contentStatus,
  sanityProjectId,
  sanityDataset,
  onBack,
  onPrev,
  onNext,
}: {
  section: WorkshopSection;
  index: number;
  total: number;
  content: ContentBlock[] | undefined;
  contentStatus: SectionContentStatus;
  sanityProjectId: string;
  sanityDataset: string;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <nav className="wsa-topnav" aria-label="Section">
        <button type="button" onClick={onBack} className="wsa-back">← All sections</button>
        <span className="wsa-count">{index + 1} / {total}</span>
      </nav>

      <header className="wsa-section-head">
        <p className="ds-kicker">Section {index + 1}</p>
        <h1>{section.title}</h1>
      </header>

      {contentStatus === 'loading' && <p className="wsa-status">Loading the section…</p>}
      {contentStatus === 'error' && (
        <p className="wsa-status is-error" role="alert">This section didn't load. Go back and open it again.</p>
      )}
      {contentStatus === 'ready' && content && content.length > 0 && (
        <div className="wsa-body">
          <PortableTextContent blocks={content} sanityProjectId={sanityProjectId} sanityDataset={sanityDataset} />
        </div>
      )}
      {contentStatus === 'ready' && (!content || content.length === 0) && (
        <p className="wsa-status">Nothing in this section yet.</p>
      )}

      {section.sectionFeedbackUrl && <SectionFeedback url={section.sectionFeedbackUrl} />}

      <div className="wsa-bottomnav">
        <button type="button" onClick={onPrev} disabled={index === 0} className="ds-btn ds-btn--outline">
          ← Previous
        </button>
        {index < total - 1 ? (
          <button type="button" onClick={onNext} className="ds-btn ds-btn--yellow">
            Next →
          </button>
        ) : (
          <button type="button" onClick={onBack} className="ds-btn ds-btn--yellow">
            Back to all sections
          </button>
        )}
      </div>
    </div>
  );
}
