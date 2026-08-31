import type { CreateCabinetFormValues } from "@/features/cabinets/types/cabinet";
import type { FormikHelpers } from "formik";
import { getCountryName } from "./country-helper";

export const handleUpdateMapAddress = async (
  values: CreateCabinetFormValues,
  setValues: FormikHelpers<CreateCabinetFormValues>["setValues"]
) => {

    if(!values.number || !values.street || !values.zipCode || !values.city || !values.country) {
        return;
    }
    
  const address = [
    values.number,
    values.street,
    values.zipCode,
    values.city,
    getCountryName(values.country),
  ]
    .filter(Boolean)
    .join(", ");

  const geocoder = new google.maps.Geocoder();

  try {
    const { results } = await geocoder.geocode({ address });

    if (!results || results.length === 0) {
      setValues({
        ...values,
        addressLine1: "",
        latitude: null,
        longitude: null,
      });
      return;
    }

    // FIX 1: Always grab the first (best) match
    const result = results[0];
    const location = result.geometry.location;

    const getAddressComponent = (type: string) =>
      result.address_components.find((component) =>
        component.types.includes(type)
      )?.long_name;

    const extractedNumber = getAddressComponent("street_number");
    const extractedStreet = getAddressComponent("route");
    // const extractedZip = getAddressComponent("postal_code");

    // FIX 2: Preserve original input values if Google returns broad area matches
    const updatedPlace: CreateCabinetFormValues = {
      ...values,
    //   number: extractedNumber ?? values.number ?? "",
    //   street: extractedStreet ?? values.street ?? "",
    //   zipCode: extractedZip ?? values.zipCode ?? "",
      latitude: location.lat(),
      longitude: location.lng(),
      addressLine1: [
        extractedNumber || values.number,
        extractedStreet || values.street,
        values.zipCode,
        // extractedZip || values.zipCode,
      ]
        .filter(Boolean)
        .join(" "),
    };
    console.log({updatedPlace})
    setValues(updatedPlace, false);
  } catch (error) {
    console.error("Geocoding failed:", error);
  }
};