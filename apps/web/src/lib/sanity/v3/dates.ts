/**
 * Date helpers for content. Event status is computed in the event's own
 * timezone, so Alicante doesn't stay "upcoming" in Geneva a day late (or
 * flip to "past" before the talk has happened).
 */

import { ordinal } from '../../ordinal';

export { ordinal };

const DEFAULT_TZ = 'Europe/Zurich';

function tzOffsetMs(ts: number, timeZone: string): number {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(new Date(ts));
  } catch {
    return tzOffsetMs(ts, DEFAULT_TZ);
  }
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - ts;
}

/** UTC instant of local midnight at the END of `date` (YYYY-MM-DD) in `timeZone`. */
export function endOfLocalDay(date: string, timeZone = DEFAULT_TZ): number {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  const guess = Date.UTC(y, (m || 1) - 1, (d || 1) + 1, 0, 0, 0);
  return guess - tzOffsetMs(guess, timeZone);
}

export function isUpcoming(date: string, endDate: string | undefined, timeZone: string, now = Date.now()): boolean {
  if (!date) return false;
  return endOfLocalDay(endDate || date, timeZone) > now;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ymd(date: string) {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  return { y, m: (m || 1) - 1, d: d || 1 };
}

/** "Nov 2025" */
export function monthYear(date?: string): string {
  if (!date) return '';
  const { y, m } = ymd(date);
  return `${MONTHS_SHORT[m]} ${y}`;
}

/** "Nov" */
export function monthShort(date?: string): string {
  if (!date) return '';
  return MONTHS_SHORT[ymd(date).m];
}

/** "30th Sep" */
export function dayMonth(date?: string): string {
  if (!date) return '';
  const { m, d } = ymd(date);
  return `${ordinal(d)} ${MONTHS_SHORT[m]}`;
}

/** "9th Oct 2026" */
export function fullDate(date?: string): string {
  if (!date) return '';
  const { y, m, d } = ymd(date);
  return `${ordinal(d)} ${MONTHS_SHORT[m]} ${y}`;
}

export function yearOf(date?: string): number {
  return date ? ymd(date).y : 0;
}

/** "Friday" in the event's timezone (dates are calendar dates, so UTC noon is safe). */
export function weekday(date?: string): string {
  if (!date) return '';
  const { y, m, d } = ymd(date);
  return new Date(Date.UTC(y, m, d, 12)).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
}

/** "19:00 CEST" for a session start in the event's timezone. */
export function localTime(iso?: string, timeZone = DEFAULT_TZ): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone, timeZoneName: 'short' });
  } catch {
    return '';
  }
}

/** "Sep 2026" for today, used on "as of" labels of derived counts. */
export function currentMonthYear(now = new Date()): string {
  return `${MONTHS_SHORT[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
}

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** 9 → "Nine" (numbers in headlines still come from data). */
export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}
