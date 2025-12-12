declare module 'country-flag-emoji' {
  interface CountryFlag {
    code: string;
    unicode: string;
    name: string;
    emoji: string;
  }

  function get(code: string): CountryFlag | undefined;
  function list(): CountryFlag[];

  export default {
    get,
    list,
  };
}
