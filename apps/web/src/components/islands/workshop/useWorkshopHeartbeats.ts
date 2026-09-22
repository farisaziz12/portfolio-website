import { useEffect, useRef } from 'react';
import { track } from '../../../lib/analytics';
import type { WorkshopSection, WorkshopUser } from './types';

function isTabVisible(): boolean {
  return document.visibilityState === 'visible';
}

type Flush = 'queue' | 'beacon';

/**
 * Emit workshop_heartbeat while phase is live and the attendee is signed in.
 *
 * Presence is `document.visibilityState` only — `document.hasFocus()` / window
 * blur fire whenever the instructor looks at the admin tab, and pairing that
 * with send_instantly dropped every heartbeat from a background attend tab
 * (empty roster). Regular beats stay in the PostHog batch; sendBeacon is only
 * for hide/unload so the last "away" actually leaves the device.
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

  const sendRef = useRef((_opts?: { flush?: Flush; focused?: boolean }) => {});
  sendRef.current = (opts) => {
    const u = userRef.current;
    if (!u) return;
    const idx = activeRef.current;
    const sectionKey = idx != null ? sectionsRef.current[idx]?._key || '' : '';
    const focused = opts?.focused ?? isTabVisible();
    const captureOpts =
      opts?.flush === 'beacon' ? { send_instantly: true, transport: 'sendBeacon' as const } : undefined;
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
      captureOpts
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
      if (document.visibilityState !== 'visible') {
        sendRef.current({ flush: 'beacon', focused: false });
        return;
      }
      sendRef.current({ focused: true });
    };
    const onHide = () => sendRef.current({ flush: 'beacon', focused: false });

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onHide);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onHide);
      sendRef.current({ focused: false });
    };
  }, [phase, user, token, event]);
}
