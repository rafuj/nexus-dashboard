import countries from "world-countries";

export type CountryOption = {
  iso2: string; // ISO 3166-1 alpha-2 code ("NL", "US", "GB")
  name: string; // Country Name ("Netherlands", "United States")
};

export const COUNTRY_OPTIONS: CountryOption[] = countries
  .map((c) => ({
    iso2: c.cca2,
    name: c.name.common,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));