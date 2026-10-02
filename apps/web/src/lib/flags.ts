import countryFlagEmoji from 'country-flag-emoji';

/**
 * Country name → flag emoji. Single source used by the events UI (EventsFilter,
 * EventRow) so /events and /speaking always render flags identically.
 */
const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'Czech Republic': 'Czechia',
  'North Macedonia': 'Macedonia',
  Türkiye: 'Turkey',
  USA: 'United States',
  'United States of America': 'United States',
  UK: 'United Kingdom',
  'Great Britain': 'United Kingdom',
  England: 'United Kingdom',
};

/** Short display names for flag chips ("USA", "UK", "N. Macedonia"). */
const SHORT_NAMES: Record<string, string> = {
  'United States': 'USA',
  'United Kingdom': 'UK',
  'North Macedonia': 'N. Macedonia',
  Macedonia: 'N. Macedonia',
};

export function shortCountry(countryName?: string): string {
  if (!countryName) return '';
  return SHORT_NAMES[countryName] ?? countryName;
}

/** ISO-3166 alpha-2 code for a country name (for "Ghent, BE" style meta). */
export function countryCode(countryName?: string): string {
  if (!countryName) return '';
  const lookupName = COUNTRY_NAME_ALIASES[countryName] || countryName;
  return countryFlagEmoji.list.find((c: { name: string; code: string }) => c.name === lookupName)?.code ?? '';
}

export function getCountryFlag(countryName?: string): string {
  if (!countryName) return '🌐';
  const lookupName = COUNTRY_NAME_ALIASES[countryName] || countryName;
  const country = countryFlagEmoji.list.find((c: { name: string }) => c.name === lookupName);
  return country?.emoji || '🌐';
}
