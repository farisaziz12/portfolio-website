import { useCallback, useMemo, useState } from 'react';
import { track } from '../../lib/analytics';
import { GateView } from './workshop/GateView';
import { ScheduleView } from './workshop/ScheduleView';
import { SectionView } from './workshop/SectionView';
import type { WorkshopAttendProps } from './workshop/types';
import { useSectionContent } from './workshop/useSectionContent';
import { useWorkshopHeartbeats } from './workshop/useWorkshopHeartbeats';
import { useWorkshopSession } from './workshop/useWorkshopSession';
import { getVisitedSections, persistVisitedSections } from './workshop/user-storage';

export type { WorkshopAttendProps } from './workshop/types';

/**
 * Workshop attend island — thin orchestrator.
 * Views: GateView / ScheduleView / SectionView
 * State: useWorkshopSession, useSectionContent, useWorkshopHeartbeats
 */
export default function WorkshopAttend({
  title,
  event,
  token,
  phase,
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

  useWorkshopHeartbeats({
    phase,
    user,
    token,
    event,
    sections,
    activeSectionIndex: activeSection,
  });

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
      new Date(closeDateISO).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [closeDateISO]
  );

  if (!user) {
    return <GateView event={event} token={token} phase={phase} onSuccess={setUser} />;
  }

  const readonlyBanner =
    phase === 'readonly' ? (
      <div className="max-w-3xl mx-auto mb-8 rounded-lg border border-[rgb(var(--edge))] bg-[rgb(var(--surface))] px-4 py-3 text-sm text-[rgb(var(--ink-muted))]">
        Live session has ended — materials are read-only until {closeDate}. Presence is no longer
        shared with the instructor.
      </div>
    ) : null;

  if (activeSection !== null && sections[activeSection]) {
    const section = sections[activeSection];
    return (
      <div className="py-12 md:py-16 px-5 sm:px-8 lg:px-12">
        {readonlyBanner}
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
    <div className="py-12 md:py-16 px-5 sm:px-8 lg:px-12">
      {readonlyBanner}
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
        <div className="max-w-3xl mx-auto mt-16">
          <div className="rounded-xl border border-[rgb(var(--edge))] bg-[rgb(var(--surface-raised))] p-6 text-center">
            <h3 className="text-lg font-display font-semibold text-[rgb(var(--ink))] mb-2">
              You've completed all sections!
            </h3>
            <p className="text-sm text-[rgb(var(--ink-muted))] mb-4">
              One last thing: your overall feedback helps me improve future workshops.
            </p>
            <a
              href={overallFeedbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] transition-colors"
            >
              Share Feedback
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}

      <p className="text-xs text-[rgb(var(--ink-faint))] text-center mt-12">
        Materials available until {closeDate}.
      </p>
    </div>
  );
}
