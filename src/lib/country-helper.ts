import { Country, City } from "country-state-city";

export type CountryOption = {
  iso2: string; // ISO 3166-1 alpha-2 code ("NL", "US", "GB")
  name: string; // "Netherlands", "United States"
};

export type CityOption = {
  name: string;
};
export const ALLOWED_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "GB",
] as const;

// Get all ISO countries
export const COUNTRY_OPTIONS: CountryOption[] = Country.getAllCountries()
  .filter((country) => ALLOWED_COUNTRIES.includes(country.isoCode as typeof ALLOWED_COUNTRIES[number]))
  .map((country) => ({
    iso2: country.isoCode,
    name: country.name,
  }));

// Get cities for a specific country ISO code
export const getCitiesByCountry = (countryIso2: string|''): CityOption[] => {
  if (!countryIso2) return [];
  return City.getCitiesOfCountry(countryIso2) || [];
};
// Get CountryCode by Country Name
// Get Country Code by Country Name
export const getCountryCodeByCountryName = (
  countryName: string,
): string => {
  if (!countryName) return "";

  return (
    COUNTRY_OPTIONS.find(
      (item) =>
        item.name.toLowerCase() ===
        countryName.toLowerCase(),
    )?.iso2 ?? countryName
  );
};
export const getCountryNameByCountryCode = (
  isoCode: string,
): string => {
  if (!isoCode) return "";

  return (
    COUNTRY_OPTIONS.find(
      (item) =>
        item.iso2.toLowerCase() ===
        isoCode.toLowerCase(),
    )?.name ?? isoCode
  );
};