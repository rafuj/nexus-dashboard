import { City } from "country-state-city";

export interface CountryOption {
    country: string
    iso: string
    format: string
    regex: RegExp
}
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

// EU AND UK COUNTRIES
export const COUNTRY_OPTIONS:CountryOption[] = [
  {
    country: "Austria",
    iso: "AT",
    format: "NNNN",
    regex: /^\d{4}$/,
  },
  {
    country: "Belgium",
    iso: "BE",
    format: "NNNN",
    regex: /^\d{4}$/,
  },
  {
    country: "Bulgaria",
    iso: "BG",
    format: "NNNN",
    regex: /^\d{4}$/,
  },
  {
    country: "Croatia",
    iso: "HR",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "Cyprus",
    iso: "CY",
    format: "NNNN",
    regex: /^\d{4}$/,
  },
  {
    country: "Czech Republic",
    iso: "CZ",
    format: "NNN NN",
    regex: /^\d{3} ?\d{2}$/,
  },
  {
    country: "Denmark",
    iso: "DK",
    format: "NNNN",
    regex: /^\d{4}$/,
  },
  {
    country: "Estonia",
    iso: "EE",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "Finland",
    iso: "FI",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "France",
    iso: "FR",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "Germany",
    iso: "DE",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "Greece",
    iso: "GR",
    format: "NNN NN",
    regex: /^\d{3}\s?\d{2}$/,
  },
  {
    country: "Hungary",
    iso: "HU",
    format: "NNNN",
    regex: /^\d{4}$/,
  },
  {
    country: "Ireland",
    iso: "IE",
    format: "AAA AAAA",
    regex: /^[A-Z]\d{2} ?[A-Z0-9]{4}$/i,
  },
  {
    country: "Italy",
    iso: "IT",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "Latvia",
    iso: "LV",
    format: "LVNNNN",
    regex: /^[Ll][Vv][- ]?\d{4}$/,
  },
  {
    country: "Lithuania",
    iso: "LT",
    format: "LTNNNNN",
    regex: /^[Ll][Tt][- ]?\d{5}$/,
  },
  {
    country: "Luxembourg",
    iso: "LU",
    format: "NNNN",
    regex: /^\d{4}$/,
  },
  {
    country: "Malta",
    iso: "MT",
    format: "AAANNNN",
    regex: /^[A-Za-z]{3}\s?\d{4}$/,
  },
  {
    country: "Netherlands",
    iso: "NL",
    format: "NNNN AA",
    regex: /^\d{4}\s?[A-Za-z]{2}$/,
  },
  {
    country: "Poland",
    iso: "PL",
    format: "NN-NNN",
    regex: /^\d{2}[- ]?\d{3}$/,
  },
  {
    country: "Portugal",
    iso: "PT",
    format: "NNNN-NNN",
    regex: /^\d{4}[- ]?\d{3}$/,
  },
  {
    country: "Romania",
    iso: "RO",
    format: "NNNNNN",
    regex: /^\d{6}$/,
  },
  {
    country: "Slovakia",
    iso: "SK",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "Slovenia",
    iso: "SI",
    format: "NNNN",
    regex: /^([Ss][Ii][- ]?)?\d{4}$/,
  },
  {
    country: "Spain",
    iso: "ES",
    format: "NNNNN",
    regex: /^\d{5}$/,
  },
  {
    country: "Sweden",
    iso: "SE",
    format: "NNN NN",
    regex: /^\d{3}\s?\d{2}$/,
  },
  {
    country: "United Kingdom",
    iso: "GB",
    format: "A(A)N(A/N)NAA",
    regex: /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s*[0-9][A-HJ-NP-UW-Z]{2}$/i,
  },
];

export const countryIsos = COUNTRY_OPTIONS.map((country) => country.iso);

export const allCities = City.getAllCities().filter((city) =>
  countryIsos.includes(city.countryCode)
)

// Get Cties for a specific country ISO code
export const getCitiesByCountry = (countryIso2: string|''): CityOption[] => {
  if (!countryIso2) return [];
  return City.getCitiesOfCountry(countryIso2) || [];
};
export const getCountryName = (countryIso: string) => {
  return COUNTRY_OPTIONS.find((item) => item.iso === countryIso)?.country;
}
export const getCountryCode = (countryName: string) => {
  return COUNTRY_OPTIONS.find((item) => item.country === countryName)?.iso;
}
export const formatPostalCode = (value: string, countryIso: string): string => {
  const rule = COUNTRY_OPTIONS.find(
    (item) => item.iso === countryIso
  );

  if (!rule || !value) return value;

  // Remove existing spaces/hyphens
  const cleanValue = value
    .toUpperCase()
    .replace(/[\s-]/g, "");

  // UK has a variable postcode structure
  if (countryIso === "GB") {
    if (cleanValue.length <= 3) {
      return cleanValue;
    }

    return `${cleanValue.slice(0, -3)} ${cleanValue.slice(-3)}`;
  }

  // Determine where the separator should be based on the format
  const format = rule.format;

  const separatorIndex = format.search(/[- ]/);

  if (separatorIndex === -1) {
    return cleanValue;
  }

  const separator = format[separatorIndex];

  // Count characters before the separator
  const prefix = format
    .slice(0, separatorIndex)
    .replace(/[^NA]/gi, "");

  const splitIndex = prefix.length;

  if (cleanValue.length <= splitIndex) {
    return cleanValue;
  }

  return `${cleanValue.slice(0, splitIndex)}${separator}${cleanValue.slice(
    splitIndex
  )}`;
};

export const POSTAL_CODE_RULES: Record<string, RegExp> =
  Object.fromEntries(
    COUNTRY_OPTIONS.map(({ iso, regex }) => [iso, regex])
  );
