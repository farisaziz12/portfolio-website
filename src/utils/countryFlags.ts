import countryFlagEmoji from "country-flag-emoji";

// Helper function to get country codes from country names
export const getCountryCode = (country: string): string => {
  const codes: { [key: string]: string } = {
    'Switzerland': 'CH',
    'United Kingdom': 'GB',
    'United States': 'US',
    'Italy': 'IT',
    'Germany': 'DE',
    'Netherlands': 'NL',
    'Austria': 'AT',
    'Greece': 'GR',
    'Thailand': 'TH',
    'Macedonia': 'MK',
    'France': 'FR',
    'Spain': 'ES',
    'Belgium': 'BE',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Portugal': 'PT',
    'Ireland': 'IE',
    'Denmark': 'DK',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Finland': 'FI',
    'Estonia': 'EE',
    'Latvia': 'LV',
    'Lithuania': 'LT',
    'Canada': 'CA',
    'Australia': 'AU',
    'New Zealand': 'NZ',
    'Japan': 'JP',
    'South Korea': 'KR',
    'Singapore': 'SG',
    'India': 'IN',
    'China': 'CN',
    'Brazil': 'BR',
    'Mexico': 'MX',
    'Argentina': 'AR',
    'South Africa': 'ZA',
    'UK': 'GB',
    'USA': 'US',
    'England': 'GB',
  };
  
  return codes[country] || '';
};

// Helper function to get country flag emoji from location string
export const getCountryFlag = (location: string): string => {
  const country = location.split(',').pop()?.trim();
  
  if (!country) return '🌍';
  
  // Handle special cases for virtual events
  const lowerCountry = country.toLowerCase();
  if (['remote', 'online', 'virtual'].includes(lowerCountry)) {
    return '🌐';
  }
  
  const countryCode = getCountryCode(country);
  const flag = countryCode ? countryFlagEmoji.get(countryCode)?.emoji : null;
  
  return flag || '🌍';
};

// Helper function to get unique locations with country flags
export const getUniqueLocations = (events: Array<{ location: string }>) => {
  const locations = new Set(events.map(event => event.location));
  return Array.from(locations).map(location => {
    const [city, country] = location.split(', ');
    const flag = getCountryFlag(location);
    return { city, country, flag };
  });
}; 