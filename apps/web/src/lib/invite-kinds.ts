/**
 * "What's it for?" options on /invite. The selection changes the label and
 * placeholder of the third required field. Shared by the InviteForm island
 * (client) and /api/invite (server), so keep it free of server-only imports.
 */
export const INVITE_KINDS = [
  { value: 'conference', label: 'Conference or meetup', field: 'Event name and where it is', placeholder: 'e.g. Game of Codes 2026, Niš' },
  { value: 'podcast', label: 'Podcast or livestream', field: 'Show name and a link', placeholder: 'e.g. PodRocket, podrocket.logrocket.com' },
  { value: 'workshop', label: 'Workshop or team training', field: 'Company or event, and where', placeholder: 'e.g. in-house for our frontend team, Zurich' },
  { value: 'panel', label: 'Panel', field: 'Panel topic and host event', placeholder: 'e.g. Growing into leadership, React Summit' },
  { value: 'article', label: 'Article or interview', field: 'Publication and topic', placeholder: 'e.g. iJS, React 19.2' },
  { value: 'other', label: 'Something else', field: 'What is it?', placeholder: 'A sentence or two is plenty' },
] as const;

export type InviteKind = (typeof INVITE_KINDS)[number]['value'];

/** Legacy `?format=` values from V2 links (talk/keynote CTAs) → kind. */
const LEGACY: Record<string, InviteKind> = { talk: 'conference', keynote: 'conference', workshop: 'workshop', panel: 'panel', podcast: 'podcast' };

export function toKind(v: string | null | undefined): InviteKind | undefined {
  if (!v) return undefined;
  const k = v.toLowerCase();
  return INVITE_KINDS.find((d) => d.value === k)?.value ?? LEGACY[k];
}

export function kindDef(kind: InviteKind) {
  return INVITE_KINDS.find((d) => d.value === kind) ?? INVITE_KINDS[0];
}
