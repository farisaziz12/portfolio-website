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
      {contentStatus === 'loading' && (
        <p className="mb-12 text-sm text-[rgb(var(--ink-muted))]">Loading section…</p>
      )}
      {contentStatus === 'error' && (
        <p className="mb-12 text-sm text-danger" role="alert">
          Couldn’t load this section. Go back and try again.
        </p>
      )}
      {contentStatus === 'ready' && content && content.length > 0 && (
        <div className="mb-12">
          <PortableTextContent
            blocks={content}
            sanityProjectId={sanityProjectId}
            sanityDataset={sanityDataset}
          />
        </div>
      )}
      {contentStatus === 'ready' && (!content || content.length === 0) && (
        <p className="mb-12 text-sm text-[rgb(var(--ink-muted))]">No content in this section yet.</p>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-ink-on-accent bg-[rgb(var(--accent-deep))] hover:bg-[rgb(var(--accent-hover))] transition-colors"
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-ink-on-signal bg-signal hover:bg-signal-deep transition-colors"
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

