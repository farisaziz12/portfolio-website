import { useEffect, useRef } from 'react';
import { track } from '../../../lib/analytics';
import type { WorkshopSection, WorkshopUser } from './types';

function isTabActive(): boolean {
  return document.visibilityState === 'visible' && document.hasFocus();
}

/**
 * Emit workshop_heartbeat while phase is live and the attendee is signed in.
 * Sends on section change, visibility/focus change, and a short interval.
 * Away events flush immediately so PostHog doesn't hold them until the tab
 * is foregrounded again.
 */
export function useWorkshopHeartbeats({
  phase,
  user,
  token,
  event,
  sections,
  activeSectionIndex,
}: {
  phase: 'live' | 'readonly';
  user: WorkshopUser | null;
  token: string;
  event: string;
  sections: WorkshopSection[];
  activeSectionIndex: number | null;
}) {
  const activeRef = useRef(activeSectionIndex);
  const userRef = useRef(user);
  const sectionsRef = useRef(sections);
  activeRef.current = activeSectionIndex;
  userRef.current = user;
  sectionsRef.current = sections;

  const sendRef = useRef((_opts?: { instant?: boolean; focused?: boolean }) => {});
  sendRef.current = (opts) => {
    const u = userRef.current;
    if (!u) return;
    const idx = activeRef.current;
    const sectionKey = idx != null ? sectionsRef.current[idx]?._key || '' : '';
    const focused = opts?.focused ?? isTabActive();
    const instant = Boolean(opts?.instant) || !focused;
    track(
      'workshop_heartbeat',
      {
        instance: token,
        workshop: event,
        section_key: sectionKey,
        section_index: idx == null ? -1 : idx,
        focused: focused ? 1 : 0,
        name: u.name,
      },
      instant ? { send_instantly: true } : undefined
    );
  };

  useEffect(() => {
    if (phase !== 'live' || !user) return;
    sendRef.current();
  }, [activeSectionIndex, phase, user]);

  useEffect(() => {
    if (phase !== 'live' || !user) return;

    sendRef.current();

    const interval = window.setInterval(() => sendRef.current(), 5000);

    const onVis = () => {
      const hidden = document.visibilityState !== 'visible';
      sendRef.current({ instant: hidden, focused: hidden ? false : isTabActive() });
    };
    const onFocusChange = () => sendRef.current();
    const onHide = () => sendRef.current({ instant: true, focused: false });

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onFocusChange);
    window.addEventListener('blur', onFocusChange);
    window.addEventListener('pagehide', onHide);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onFocusChange);
      window.removeEventListener('blur', onFocusChange);
      window.removeEventListener('pagehide', onHide);
      sendRef.current({ instant: true, focused: false });
    };
  }, [phase, user, token, event]);
}
