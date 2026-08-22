import { Country, City } from "country-state-city";

export type CountryOption = {
  iso2: string; // ISO 3166-1 alpha-2 code ("NL", "US", "GB")
  name: string; // "Netherlands", "United States"
};

export type CityOption = {
  name: string;
};

// Get all ISO countries
export const COUNTRY_OPTIONS: CountryOption[] = Country.getAllCountries().map(
  (c) => ({
    iso2: c.isoCode,
    name: c.name,
  })
);

// Get cities for a specific country ISO code
export const getCitiesByCountry = (countryIso2: string|''): CityOption[] => {
  if (!countryIso2) return [];
  return City.getCitiesOfCountry(countryIso2) || [];
};