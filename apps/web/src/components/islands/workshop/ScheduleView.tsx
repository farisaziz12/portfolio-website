import type { WorkshopSection } from './types';

export function ScheduleView({
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
  repoUrl?: string;
  sections: WorkshopSection[];
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
      {repoUrl && (
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
      )}

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[rgb(var(--ink-muted))]">Progress</span>
          <span className="text-sm text-[rgb(var(--ink-faint))]">{completedCount} / {sections.length}</span>
        </div>
        <div className="h-2 rounded-full bg-[rgb(var(--surface-overlay))]">
          <div
            className="h-2 rounded-full bg-signal transition-all duration-300"
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
                    ? 'bg-signal/10 text-signal'
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

