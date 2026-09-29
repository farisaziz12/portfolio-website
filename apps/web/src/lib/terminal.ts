/**
 * Data for the faris.sh terminal on About: the undocumented conference
 * keywords (`alicante`) that open a live workshop's attend page. Computed
 * when the page renders, so a prerendered About picks up new workshops on
 * the next build.
 */
import groq from 'groq';
import { load } from './sanity/v3/fetch';
import { terminalWorkshopRoutes, type TerminalRoute, type WorkshopShortcutInstance } from './workshop-shortcuts';

const workshopInstancesQuery = groq`*[_type == "workshopInstance"] | order(workshopDate desc) {
  _id, title, event, "slug": slug.current, "token": token.current, workshopDate, accessDurationDays, forceClose
}`;

export async function getTerminalSecretRoutes(): Promise<Record<string, TerminalRoute>> {
  const instances = await load<WorkshopShortcutInstance[]>(workshopInstancesQuery, []);
  return terminalWorkshopRoutes(instances ?? []);
}
