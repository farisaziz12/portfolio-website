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
  const pct = sections.length > 0 ? (completedCount / sections.length) * 100 : 0;

  return (
    <div>
      <header className="wsa-head">
        <p className="ds-kicker">Hi {userName}</p>
        <h1 className="ds-h1">{title}</h1>
        <p className="wsa-head__event">{event}</p>
      </header>

      {repoUrl && (
        <div className="wsa-actions">
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="ds-btn ds-btn--yellow" data-track="workshop_repo">
            Open the repo
          </a>
        </div>
      )}

      <div className="wsa-progress" aria-label={`${completedCount} of ${sections.length} sections opened`}>
        <div className="wsa-progress__row">
          <span>Progress</span>
          <span><strong>{completedCount}</strong> / {sections.length}</span>
        </div>
        <div className="wsa-progress__track" aria-hidden="true">
          <div className="wsa-progress__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="wsa-list">
        {sections.map((section, index) => {
          const done = visited.has(section._key);
          return (
            <li key={section._key}>
              <button type="button" onClick={() => onSelectSection(index)} className={`wsa-row${done ? ' is-done' : ''}`}>
                <span className="wsa-row__num" aria-hidden="true">{index + 1}</span>
                <span className="wsa-row__title">
                  {section.title}
                  {done && <span className="sr-only"> (opened)</span>}
                </span>
                <span className="wsa-row__go" aria-hidden="true">Open →</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
