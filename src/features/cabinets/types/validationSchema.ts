import { POSTAL_CODE_RULES } from "@/lib/country-helper";
import * as Yup from "yup";
import { serialRegex } from "./cabinet";

export const cabinetValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Cabinet name is required"),

  description: Yup.string()
    .trim(),

  addressLine1: Yup.string()
    .trim()
    .required("Address is required"),
    
  street: Yup.string()
    .trim()
    .required("Street is required"),
    
  number: Yup.string()
    .trim()
    .required("Number is required"),
    
  latitude: Yup.string()
    .trim()
    .required("To enter a valid address, please search for and select an address from the dropdown."),

  addressLine2: Yup.string()
    .trim(),

  zipCode: Yup.string()
    .trim()
    .required("Zip code is required")
    .test("postal-code-format", "Invalid postal code", function (value) {
      const { country } = this.parent;

      if (!value) return true;

      const regex = POSTAL_CODE_RULES[country];

      if (!regex) return true;

      return regex.test(value);
    }),

  city: Yup.string()
    .trim()
    .required("City is required"),

  country: Yup.string()
    .trim()
    .required("Country is required"),
  accessType: Yup.string()
  .trim()
  .required("Access type is required"),

  cabinetModelId: Yup.string()
  .trim()
  .required("Model is required"),

  serialNumber: Yup.string()
  .trim()
  .when("brand", {
    is: (brand: string) => brand !== "Nexus",
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .required("Serial number is required")
        .matches(
          serialRegex,
          "Nexus Brand Serial number format does not match"
        ),
  }),

  serialNumberRecognition: Yup.boolean()
  .when("brand", {
    is: (brand: string) => brand !== "Nexus",
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.default(false).required("Serial number does not recognized"),
  }),

  imeiRecognition: Yup.boolean().when(
    ["brand", "imei"],
    {
      is: (brand: string, imei: string) =>
        brand !== "Nexus" && imei !== "",
      then: (schema) =>
        schema
          .required("Module code does not recognized"),
      otherwise: (schema) => schema.notRequired(),
    }
  ),

  brand: Yup.string()
  .trim()
  .required("Brand is required"),
  
  asset: Yup.lazy((assetValues) => {
    const isTypeOne = String(assetValues?.id ?? "") === "1";

    return Yup.object({
      id: Yup.string().notRequired(),
      name: Yup.string().trim().required("Asset name is required"),
      assetModelId: isTypeOne ? Yup.string().trim().required("Model is required") : Yup.string().trim().notRequired(),
      
      brand: isTypeOne ? Yup.string().trim().required("Brand is required") : Yup.string().trim().notRequired(),

      components: isTypeOne
        ? Yup.array().test(
            "validate-required-components",
            "Required components validation",
            function (components) {
              if (!components || !Array.isArray(components)) return true;

              const errors = [];

              // Index 0: 1st Set Pads (Required)
              if (!components[0]?.componentVariantId) {
                errors.push(
                  this.createError({
                    path: `${this.path}[0].componentVariantId`,
                    message: "1st set pads type is required",
                  })
                );
              }
              if (!components[0]?.expiresAt) {
                errors.push(
                  this.createError({
                    path: `${this.path}[0].expiresAt`,
                    message: "1st set pads expiration date is required",
                  })
                );
              }

              // Index 1: 2nd Set Pads (Optional - No validation required)

              // Index 2: Battery (Required)
              if (!components[2]?.expiresAt) {
                errors.push(
                  this.createError({
                    path: `${this.path}[2].expiresAt`,
                    message: "Battery expiration date is required",
                  })
                );
              }

              // Return all collected errors directly as a ValidationError stack
              if (errors.length > 0) {
                return new Yup.ValidationError(errors);
              }

              return true;
            }
          )
        : Yup.array().notRequired(),

      checkupDate: Yup.date().nullable().notRequired(),
      expiresAt: Yup.date().nullable().notRequired(),
      purchaseDate: Yup.date().nullable().notRequired(),
      serialNumber: Yup.string().trim().notRequired(),
      notes: Yup.string().trim().notRequired(),
    });
  }),
});

export const cabinetUpdateSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Cabinet name is required"),

  description: Yup.string()
    .trim(),

  addressLine1: Yup.string()
    .trim()
    .required("Address is required"),
    
  street: Yup.string()
    .trim()
    .required("Street is required"),
    
  number: Yup.string()
    .trim()
    .required("Number is required"),

  latitude: Yup.string()
    .trim()
    .required("To enter a valid address, please search for and select an address from the dropdown."),
    
  addressLine2: Yup.string()
    .trim(),

  zipCode: Yup.string()
    .trim()
    .required("Zip code is required")
    .test("postal-code-format", "Invalid postal code", function (value) {
      const { country } = this.parent;

      if (!value) return true;

      const regex = POSTAL_CODE_RULES[country];

      if (!regex) return true;

      return regex.test(value);
    }),

  city: Yup.string()
    .trim()
    .required("City is required"),

  country: Yup.string()
    .trim()
    .required("Country is required"),
  accessType: Yup.string()
  .trim()
  .required("Access type is required"),

  cabinetModelId: Yup.string()
  .trim()
  .required("Model is required"),

  serialNumber: Yup.string()
  .trim()
  .when("brand", {
    is: (brand: string) => brand !== "Nexus",
    then: (schema) => schema.notRequired(),
    otherwise: (schema) =>
      schema
        .required("Serial number is required")
        .matches(
          serialRegex,
          "Nexus Brand Serial number format does not match"
        ),
  }),

  serialNumberRecognition: Yup.boolean()
  .when("brand", {
    is: (brand: string) => brand !== "Nexus",
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.default(false).required("Serial number does not recognized"),
  }),

  brand: Yup.string()
  .trim()
  .required("Brand is required"),
  
});

export const assetUpdateSchema = Yup.object({
  asset: Yup.lazy((assetValues) => {
    const isTypeOne = String(assetValues?.id ?? "") === "1";

    return Yup.object({
      id: Yup.string().notRequired(),
      name: Yup.string().trim().required("Asset name is required"),
      assetModelId: isTypeOne ? Yup.string().trim().required("Model is required") : Yup.string().trim().notRequired(),
      
      brand: isTypeOne ? Yup.string().trim().required("Brand is required") : Yup.string().trim().notRequired(),

      components: isTypeOne
        ? Yup.array().test(
            "validate-required-components",
            "Required components validation",
            function (components) {
              if (!components || !Array.isArray(components)) return true;

              const errors = [];

              // Index 0: 1st Set Pads (Required)
              if (!components[0]?.componentVariantId) {
                errors.push(
                  this.createError({
                    path: `${this.path}[0].componentVariantId`,
                    message: "1st set pads type is required",
                  })
                );
              }
              if (!components[0]?.expiresAt) {
                errors.push(
                  this.createError({
                    path: `${this.path}[0].expiresAt`,
                    message: "1st set pads expiration date is required",
                  })
                );
              }

              // Index 1: 2nd Set Pads (Optional - No validation required)

              // Index 2: Battery (Required)
              if (!components[2]?.expiresAt) {
                errors.push(
                  this.createError({
                    path: `${this.path}[2].expiresAt`,
                    message: "Battery expiration date is required",
                  })
                );
              }

              // Return all collected errors directly as a ValidationError stack
              if (errors.length > 0) {
                return new Yup.ValidationError(errors);
              }

              return true;
            }
          )
        : Yup.array().notRequired(),

      checkupDate: Yup.date().nullable().notRequired(),
      expiresAt: Yup.date().nullable().notRequired(),
      purchaseDate: Yup.date().nullable().notRequired(),
      serialNumber: Yup.string().trim().notRequired(),
      notes: Yup.string().trim().notRequired(),
    });
  }),
});