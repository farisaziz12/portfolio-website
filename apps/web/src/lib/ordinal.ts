/** Ordinal day numbers for every date on the site: 1st, 2nd, 3rd, 4th, 11th, 22nd. Client-safe (no CMS imports). */

/** 1 → "1st", 2 → "2nd", 3 → "3rd", 11 → "11th", 22 → "22nd". */
export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`;
}

/** en-US long/short date with an ordinal day: "October 9th, 2026". */
export function ordinalDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', options)
    .formatToParts(date)
    .map((p) => (p.type === 'day' ? ordinal(Number(p.value)) : p.value))
    .join('');
}
