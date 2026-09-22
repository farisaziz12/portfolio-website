import { useEffect, useState } from 'react';

/**
 * SSR paints the phase from Sanity; poll so End/Reopen live takes effect
 * without a full reload (heartbeats start/stop for people already in the room).
 */
export function useWorkshopPhase(token: string, initial: 'live' | 'readonly') {
  const [phase, setPhase] = useState<'live' | 'readonly'>(initial);

  useEffect(() => {
    setPhase(initial);
  }, [initial]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/workshops/attend/${encodeURIComponent(token)}?format=json`, {
          cache: 'no-store',
        });
        const body = (await res.json().catch(() => ({}))) as { phase?: string };
        if (cancelled || !res.ok) return;
        if (body.phase === 'live' || body.phase === 'readonly') {
          setPhase(body.phase);
        }
      } catch {
        /* keep last known phase */
      }
    };

    void load();
    const id = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 15000);
    const onVis = () => {
      if (!document.hidden) void load();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [token]);

  return phase;
}
