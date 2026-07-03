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
 * Honest urgency: how full the next bookable quarter actually is, derived
 * from confirmed event dates. Thresholds are the invite-page calendar's
 * monthly scheme (0–2 open, 3–4 limited, 5+ booked) scaled to a quarter.
 */
export interface QuarterLoad {
  /** e.g. "Q3 2026" */
  label: string;
  /** Confirmed events falling inside that quarter. */
  confirmed: number;
  tone: 'open' | 'limited' | 'booked';
}

export function quarterLoad(eventDates: (string | undefined)[], opts: QuarterOpts = {}): QuarterLoad {
  const { quarter, year } = getNextBookableQuarter(opts);
  const confirmed = eventDates.filter((d) => {
    if (!d) return false;
    const dt = new Date(d);
    return dt.getFullYear() === year && Math.floor(dt.getMonth() / 3) + 1 === quarter;
  }).length;
  const tone: QuarterLoad['tone'] = confirmed <= 6 ? 'open' : confirmed <= 12 ? 'limited' : 'booked';
  return { label: `Q${quarter} ${year}`, confirmed, tone };
}
