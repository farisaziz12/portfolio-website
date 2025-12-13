import countryFlagEmoji from 'country-flag-emoji';

/**
 * Format a date string to a human-readable format
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Format a date string to a short format (e.g., "Jan 2024")
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  return new Date(dateString) >= new Date();
}

/**
 * Check if a date is in the past
 */
export function isPastDate(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Create a URL-friendly slug from a string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

/**
 * Get flag emoji for a country name
 */
export function getCountryFlag(countryName: string): string {
  const countryMap: Record<string, string> = {
    'United Kingdom': 'GB',
    'United States': 'US',
    Switzerland: 'CH',
    Greece: 'GR',
    Italy: 'IT',
    Germany: 'DE',
    Singapore: 'SG',
    Thailand: 'TH',
    Portugal: 'PT',
    Macedonia: 'MK',
    Online: '🌐',
  };

  const code = countryMap[countryName];
  if (code === '🌐') return code;

  if (code) {
    const flag = countryFlagEmoji.get(code);
    return flag?.emoji || '';
  }

  return '';
}

/**
 * Parse location string into city and country
 */
export function parseLocation(location: string): {
  city: string;
  country: string;
} {
  const parts = location.split(', ');
  return {
    city: parts[0] || location,
    country: parts[1] || '',
  };
}

/**
 * Get unique values from an array
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Group array items by a key
 */
export function groupBy<T>(
  arr: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Sort events by date (ascending for upcoming, descending for past)
 */
export function sortByDate<T extends { date: string }>(
  items: T[],
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
}
