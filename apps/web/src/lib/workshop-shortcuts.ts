import { getAccessStatus, type WorkshopInstance } from './workshop-access';

/** Where a terminal command sends the visitor, plus the line printed on the way out. */
export interface TerminalRoute {
  path: string;
  note: string;
}

export interface WorkshopShortcutInstance extends WorkshopInstance {
  event?: string;
  token?: string;
}

/**
 * Conference-name words that point at no single room — typing `react` should not
 * drop someone into one specific workshop.
 */
const AMBIGUOUS_WORDS = new Set([
  'angular',
  'camp',
  'conf',
  'conference',
  'days',
  'festival',
  'javascript',
  'live',
  'meetup',
  'next',
  'nextjs',
  'node',
  'nodejs',
  'online',
  'react',
  'reactjs',
  'remote',
  'summit',
  'svelte',
  'typescript',
  'vue',
  'week',
  'workshop',
  'workshops',
  'world',
]);

/** Keywords that stand in for one conference: `React Alicante 2026` → `alicante`. */
export function shortcutKeywords(event: string): string[] {
  return event
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 4 && !/^\d+$/.test(word) && !AMBIGUOUS_WORDS.has(word));
}

/**
 * Conference keyword → the workshop whose attend page is live. Sessions drop out
 * once their access window closes, so nothing needs pruning by hand.
 */
export function workshopShortcuts(
  instances: WorkshopShortcutInstance[],
  now = new Date()
): Record<string, { token: string; event: string }> {
  const live = instances
    .flatMap((instance) =>
      instance.event && instance.token
        ? [
            {
              event: instance.event,
              token: instance.token,
              status: getAccessStatus(instance, now),
              startsAt: new Date(instance.workshopDate).getTime(),
            },
          ]
        : []
    )
    .filter(({ status }) => status === 'open' || status === 'upcoming')
    .sort((a, b) =>
      a.status === b.status ? a.startsAt - b.startsAt : a.status === 'open' ? -1 : 1
    );

  const shortcuts: Record<string, { token: string; event: string }> = {};
  for (const { event, token } of live) {
    for (const keyword of shortcutKeywords(event)) {
      // An open session wins a shared keyword over a later one.
      if (shortcuts[keyword]) continue;
      shortcuts[keyword] = { token, event };
    }
  }
  return shortcuts;
}

/** Access token behind a keyword URL like `/workshops/attend/alicante`. */
export function resolveWorkshopShortcut(
  keyword: string,
  instances: WorkshopShortcutInstance[],
  now = new Date()
): string | null {
  const match = workshopShortcuts(instances, now)[keyword.trim().toLowerCase()];
  if (!match || match.token === keyword) return null;
  return match.token;
}

/**
 * Undocumented hero-terminal commands: a room types its conference and lands on
 * its own materials. Keyword URLs only — access tokens stay server-side.
 */
export function terminalWorkshopRoutes(
  instances: WorkshopShortcutInstance[],
  now = new Date()
): Record<string, TerminalRoute> {
  const routes: Record<string, TerminalRoute> = {};
  for (const [keyword, { event }] of Object.entries(workshopShortcuts(instances, now))) {
    routes[keyword] = {
      path: `/workshops/attend/${keyword}`,
      note: `opening ${event} workshop materials…`,
    };
  }
  return routes;
}
