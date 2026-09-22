import { useCallback, useEffect, useState } from 'react';
import type { WorkshopUser } from './types';
import { getStoredUser, storeUser } from './user-storage';

/**
 * Prefer SSR cookie user, then localStorage, then quiet cookie confirm.
 * Paints immediately — never blocks first render on the session fetch.
 */
export function useWorkshopSession(token: string, initialUser: WorkshopUser | null = null) {
  const [user, setUser] = useState<WorkshopUser | null>(initialUser);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        const stored = getStoredUser(token);
        if (stored && !cancelled) setUser(stored);
      }

      try {
        const res = await fetch(`/api/workshop/session?token=${encodeURIComponent(token)}`);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { authenticated?: boolean; user?: WorkshopUser };
        if (data.authenticated && data.user && !cancelled) {
          storeUser(token, data.user);
          setUser(data.user);
        }
      } catch {
        /* keep local / SSR user */
      }
    })();
    return () => {
      cancelled = true;
    };
    // Only re-run when workshop token changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const acceptUser = useCallback(
    (next: WorkshopUser) => {
      storeUser(token, next);
      setUser(next);
    },
    [token]
  );

  return { user, setUser: acceptUser };
}
