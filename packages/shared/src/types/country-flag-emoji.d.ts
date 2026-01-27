declare module 'country-flag-emoji' {
  interface CountryFlag {
    code: string;
    unicode: string;
    name: string;
    emoji: string;
  }

  const countryFlagEmoji: {
    get(code: string): CountryFlag | undefined;
    list: CountryFlag[];
  };

  export default countryFlagEmoji;
}
