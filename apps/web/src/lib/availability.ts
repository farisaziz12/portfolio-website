/**
 * Date-driven availability labels.
 *
 * Conference / consulting bookings need ~6 weeks of lead time, so the
 * "next bookable quarter" is the quarter that contains today + 6 weeks.
 * As the year rolls forward, every "Available · Q… …" string updates
 * automatically — no manual edits needed.
 *
 * The home page is ISR-cached at 1-hour granularity, so the label
 * refreshes hourly on the live site without a redeploy.
 */

export interface QuarterInfo {
  quarter: 1 | 2 | 3 | 4;
  year: number;
}

export interface QuarterOpts {
  /** Override the "current" date (mostly useful for tests). */
  now?: Date;
  /** Lead time in weeks before a booking is realistic. Default 6. */
  leadWeeks?: number;
}

/**
 * Compute the earliest realistic booking quarter from a given date,
 * factoring in a configurable lead time.
 */
export function getNextBookableQuarter(opts: QuarterOpts = {}): QuarterInfo {
  const now = opts.now ?? new Date();
  const leadWeeks = opts.leadWeeks ?? 6;
  const leadDate = new Date(now);
  leadDate.setDate(leadDate.getDate() + leadWeeks * 7);
  const quarter = (Math.floor(leadDate.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
  return { quarter, year: leadDate.getFullYear() };
}

/** "Q3 2026" — bare quarter token, no prefix. */
export function formatQuarter(opts: QuarterOpts = {}): string {
  const { quarter, year } = getNextBookableQuarter(opts);
  return `Q${quarter} ${year}`;
}

/**
 * Full status label with a configurable prefix.
 * e.g. `availabilityLabel('Available')` → `"Available · Q3 2026"`.
 */
export function availabilityLabel(prefix = 'Available', opts: QuarterOpts = {}): string {
  return `${prefix} · ${formatQuarter(opts)}`;
}

/**
 * "Current year & next year" token. Used in copy like
 * `Booking ${bookingYears()} dates` → `"Booking 2026 & 2027 dates"`.
 */
export function bookingYears(opts: { now?: Date } = {}): string {
  const now = opts.now ?? new Date();
  const y = now.getFullYear();
  return `${y} & ${y + 1}`;
}

/**
 * Count events that fall inside the next bookable quarter.
 * Used to derive Open vs Limited from real data instead of hand-set labels.
 *
 * Pass an array of objects with a `date` field (ISO string). Anything outside
 * the bookable quarter — past, or further out than that one quarter — doesn't
 * count toward the threshold.
 */
export function getQuarterEventCount<T extends { date?: string }>(
  events: T[],
  opts: QuarterOpts = {},
): number {
  const { quarter, year } = getNextBookableQuarter(opts);
  const startMonth = (quarter - 1) * 3;
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 1); // exclusive
  return events.filter((e) => {
    if (!e.date) return false;
    const d = new Date(e.date);
    return d >= start && d < end;
  }).length;
}

/**
 * Threshold rule for the availability prefix.
 *   0–1 events in the bookable quarter → "open"
 *   2+ events                          → "limited"
 *
 * Single source of truth — don't inline `count < 2` at call sites.
 */
export type AvailabilityState = 'open' | 'limited';

export function getAvailabilityState(count: number): AvailabilityState {
  return count < 2 ? 'open' : 'limited';
}

const STATE_PREFIX: Record<AvailabilityState, string> = {
  open: 'Open',
  limited: 'Limited',
};

/**
 * Derive a full availability label from an event count.
 *   getQuarterEventCount(events) → count
 *   availabilityFromCount(count) → "Open · Q3 2026" or "Limited · Q3 2026"
 *
 * Use this at every event-driven call site (Header, ContactPanel default,
 * about, services, consulting, impact). Mentorship and other non-event
 * contexts keep `availabilityLabel('Mentees')` etc. — the threshold doesn't
 * apply there.
 */
export function availabilityFromCount(count: number, opts: QuarterOpts = {}): string {
  return availabilityLabel(STATE_PREFIX[getAvailabilityState(count)], opts);
}
