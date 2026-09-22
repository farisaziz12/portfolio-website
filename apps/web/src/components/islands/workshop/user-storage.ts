import type { WorkshopUser } from './types';

function storageKey(token: string) {
  return `workshop-user-${token}`;
}

export function getStoredUser(token: string): WorkshopUser | null {
  try {
    const raw = localStorage.getItem(storageKey(token));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkshopUser;
    if (parsed.name && parsed.email) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function storeUser(token: string, user: WorkshopUser) {
  localStorage.setItem(storageKey(token), JSON.stringify(user));
}

export function getVisitedSections(token: string): Set<string> {
  try {
    const raw = localStorage.getItem(`workshop-visited-${token}`);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

export function persistVisitedSections(token: string, visited: Set<string>) {
  localStorage.setItem(`workshop-visited-${token}`, JSON.stringify([...visited]));
}
