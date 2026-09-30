/**
 * Display helpers shared by /workshops, /workshops/[slug] and their .md
 * mirrors: edition labels, group size, delivery lines, invite link.
 */
import { TOPICS, titleFor } from 'shared';
import { fullDate, type TalkDelivery, type Workshop, type WorkshopFormat, type WorkshopWithHistory } from './sanity/v3';

export function pillarLabel(w: Pick<Workshop, 'pillar'>): string {
  return titleFor(TOPICS, w.pillar) || 'Workshop';
}

/** "3 h", "full day" — the short name of one edition. */
export function editionShort(f: WorkshopFormat): string {
  if (/full/i.test(f.label)) return 'full day';
  return f.duration || f.label;
}

/** "3 h · full day" */
export function editionsLine(w: Workshop): string {
  const out = w.formats.map(editionShort);
  const line = out.join(' · ') || w.duration || '';
  return line ? line.charAt(0).toUpperCase() + line.slice(1) : '';
}

/** "3 h or full day (6.5 h)" (the record's own wording wins). */
export function lengthLine(w: Workshop): string {
  if (w.duration && w.formats.length !== 1) return w.duration;
  return w.formats.map((f) => (f.duration && f.duration !== f.label ? `${f.label} (${f.duration})` : f.label)).join(' or ') || w.duration || '';
}

export function groupLine(w: Workshop, noun = 'participants'): string {
  const p = w.participants;
  if (!p?.min && !p?.max) return '';
  if (p.min && p.max) return `${p.min}–${p.max} ${noun}`;
  return p.max ? `Up to ${p.max} ${noun}` : `From ${p.min} ${noun}`;
}

export function pastDeliveries(w: WorkshopWithHistory): TalkDelivery[] {
  return w.deliveries.filter((d) => !d.event.isUpcoming);
}

/** "ZurichJS · Zurich · 12 Nov 2025 · 3-hour workshop" */
export function deliveryLine(d: TalkDelivery): string {
  const place = d.event.location.isOnline ? 'Online' : d.event.location.city;
  return [d.event.seriesName || d.event.title, place, fullDate(d.event.date), d.session.detail].filter(Boolean).join(' · ');
}

/** "Delivered at ZurichJS and WhatTheStack." */
export function deliveredAtSentence(w: WorkshopWithHistory): string {
  const names = [...new Set(pastDeliveries(w).map((d) => d.event.seriesName || d.event.title))];
  if (!names.length) return '';
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return `Delivered at ${list}.`;
}

export function workshopInviteHref(w: Pick<Workshop, 'title'>): string {
  return `/invite?kind=workshop&workshop=${encodeURIComponent(w.title)}`;
}

/** Footnote under an agenda: "3-hour edition · 6 blocks · totals 3 h". */
export function agendaNote(f: WorkshopFormat): string {
  const n = f.agenda.length;
  return [f.label, `${n} block${n === 1 ? '' : 's'}`, f.duration && f.duration !== f.label ? `totals ${f.duration}` : ''].filter(Boolean).join(' · ');
}

/**
 * A listing-sized excerpt: whole sentences up to `max` characters, else the
 * first sentence cut at a word. The full text stays on the workshop page.
 */
export function excerpt(text: string | undefined, max = 220): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [clean];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  if (out.trim()) return out.trim();
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
}
