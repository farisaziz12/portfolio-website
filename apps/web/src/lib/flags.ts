import countryFlagEmoji from 'country-flag-emoji';

/**
 * Country name → flag emoji. Single source used by the events UI (EventsFilter,
 * EventRow) so /events and /speaking always render flags identically.
 */
const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'Czech Republic': 'Czechia',
};

export function getCountryFlag(countryName?: string): string {
  if (!countryName) return '🌐';
  const lookupName = COUNTRY_NAME_ALIASES[countryName] || countryName;
  const country = countryFlagEmoji.list.find((c: { name: string }) => c.name === lookupName);
  return country?.emoji || '🌐';
}
