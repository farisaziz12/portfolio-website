import { useEffect, useRef } from 'react';
import { track } from '../../../lib/analytics';
import type { WorkshopSection, WorkshopUser } from './types';

/**
 * Emit workshop_heartbeat while phase is live and the attendee is signed in.
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
  activeRef.current = activeSectionIndex;
  userRef.current = user;

  useEffect(() => {
    if (phase !== 'live' || !user) return;

    const send = (focused: boolean) => {
      const u = userRef.current;
      if (!u) return;
      const idx = activeRef.current;
      const sectionKey = idx != null ? sections[idx]?._key : null;
      track('workshop_heartbeat', {
        instance: token,
        workshop: event,
        section_key: sectionKey,
        focused,
        name: u.name,
      });
    };

    send(!document.hidden);

    const interval = window.setInterval(() => {
      if (!document.hidden) send(true);
    }, 10000);

    const onVis = () => send(!document.hidden);
    const onFocus = () => send(true);
    const onBlur = () => send(false);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      send(false);
    };
  }, [phase, user, token, event, sections]);
}
