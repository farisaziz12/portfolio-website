import { useCallback, useMemo, useState } from 'react';
import { ordinalDate } from '../../lib/ordinal';
import { track } from '../../lib/analytics';
import { GateView } from './workshop/GateView';
import { ScheduleView } from './workshop/ScheduleView';
import { SectionView } from './workshop/SectionView';
import type { WorkshopAttendProps } from './workshop/types';
import { useSectionContent } from './workshop/useSectionContent';
import { useWorkshopSession } from './workshop/useWorkshopSession';
import { getVisitedSections, persistVisitedSections } from './workshop/user-storage';
import './workshop/attend.css';

export type { WorkshopAttendProps } from './workshop/types';

/**
 * Workshop attend island — thin orchestrator.
 * Views: GateView / ScheduleView / SectionView
 * State: useWorkshopSession, useSectionContent
 */
export default function WorkshopAttend({
  title,
  event,
  token,
  repoUrl,
  overallFeedbackUrl,
  sections,
  closeDateISO,
  sanityProjectId,
  sanityDataset,
  initialUser = null,
}: WorkshopAttendProps) {
  const { user, setUser } = useWorkshopSession(token, initialUser);
  const { contentByKey, loadSection, statusFor } = useSectionContent(token);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() =>
    typeof window === 'undefined' ? new Set() : getVisitedSections(token)
  );

  const openSection = useCallback(
    (index: number) => {
      setActiveSection(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const key = sections[index]?._key;
      if (!key) return;

      void loadSection(key);
      const nextKey = sections[index + 1]?._key;
      if (nextKey) void loadSection(nextKey);

      track('workshop_section_viewed', {
        instance: token,
        workshop: event,
        section_key: key,
        section_index: index,
      });

      setVisited((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        persistVisitedSections(token, next);
        track('workshop_section_completed', {
          instance: token,
          workshop: event,
          section_key: key,
          section_index: index,
        });
        return next;
      });
    },
    [sections, token, event, loadSection]
  );

  const goToSchedule = useCallback(() => {
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeDate = useMemo(
    () =>
      ordinalDate(new Date(closeDateISO), {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [closeDateISO]
  );

  if (!user) {
    return <GateView event={event} token={token} onSuccess={setUser} />;
  }

  if (activeSection !== null && sections[activeSection]) {
    const section = sections[activeSection];
    return (
      <div className="wsa wsa--wide">
        <SectionView
          section={section}
          index={activeSection}
          total={sections.length}
          content={contentByKey[section._key]}
          contentStatus={statusFor(section._key)}
          sanityProjectId={sanityProjectId}
          sanityDataset={sanityDataset}
          onBack={goToSchedule}
          onPrev={() => openSection(activeSection - 1)}
          onNext={() => openSection(activeSection + 1)}
        />
      </div>
    );
  }

  return (
    <div className="wsa">
      <ScheduleView
        userName={user.name.split(' ')[0]}
        title={title}
        event={event}
        repoUrl={repoUrl}
        sections={sections}
        visited={visited}
        onSelectSection={openSection}
      />

      {overallFeedbackUrl && visited.size >= sections.length && (
        <div className="ds-card wsa-done">
          <p className="ds-kicker">All sections opened</p>
          <h2>That's the lot.</h2>
          <p className="ds-body">One last thing: tell me how the whole workshop went. It shapes the next one.</p>
          <a href={overallFeedbackUrl} target="_blank" rel="noopener noreferrer" className="ds-btn ds-btn--yellow" data-track="workshop_overall_feedback">
            Share feedback
          </a>
        </div>
      )}

      <p className="wsa-foot">The materials stay open until {closeDate}.</p>
    </div>
  );
}
