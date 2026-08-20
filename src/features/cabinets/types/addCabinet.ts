
import * as Yup from "yup";
import type { CreateCabinetFormValues } from "../api/cabinet.api";

export type StepType = 'basic-information' | 'cabinet-details' | 'asset-information';

export interface AssetType {
  label: string;
  value: string;
}

export type VolumeType = '0%' | '50%' | '100%';

export type BrightnessType = '0%' | '50%' | '100%';

export type ColorType = 'white' | 'green' | 'yellow' | 'red';

export type AvailabilityType = '24/7' | 'custom-days-and-types';

export type AccessTypeI = 'private' | 'public';

export interface DayConfig {
  day: string;
  checked: boolean;
  startTime: string;
  endTime: string;
}

export interface StepConfig {
  id: StepType;
  label: string;
}
export interface StepperProps {
  step: StepType;
  setStep?: (step: StepType) => void;
  stepList: StepConfig[],
  hideLine?: boolean,
}

export const cabinetValidationSchema = Yup.object({
  // step 1 (basic information)
  name: Yup.string()
    .trim()
    .required("Cabinet name is required"),

  description: Yup.string()
    .trim(),

  addressLine1: Yup.string()
    .trim()
    .required("Address is required"),

  addressLine2: Yup.string()
    .trim(),

  zipCode: Yup.string()
    .trim()
    .required("Zip code is required"),

  city: Yup.string()
    .trim()
    .required("City is required"),

  country: Yup.string()
    .trim()
    .required("Country is required"),
    // step 2 (cabinet details)
    accessType: Yup.string()
    .trim()
    .required("Access type is required"),
    // Step 3: Asset (Conditional Validation)
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

export const cabinetInitialValues = (
  data?: Partial<CreateCabinetFormValues> | null
): CreateCabinetFormValues => {

  return {
    accessType: data?.accessType || "public",
    name: data?.name || "",
    description: data?.description || "",

    addressLine1: data?.addressLine1 || "",
    addressLine2: data?.addressLine2 || "",
    zipCode: data?.zipCode || "",
    city: data?.city || "",
    country: data?.country || "",

    serialNumber: data?.serialNumber || "",
    lockCode: data?.lockCode || "",

    picture1: data?.picture1 || null,
    picture2: data?.picture2 || null,
    picture3: data?.picture3 || null,

    asset: {
        assetModelId: data?.asset?.assetModelId || "",
        checkupDate: data?.asset?.checkupDate || undefined,
        components: [{
          componentTypeId: "1",
          componentVariantId: data?.asset?.components?.[0]?.componentVariantId || "",
          expiresAt: data?.asset?.components?.[0]?.expiresAt || undefined,
          lotNumber: data?.asset?.components?.[0]?.lotNumber || "",
          serialNumber: data?.asset?.components?.[0]?.serialNumber || "",
          componentVariantName: data?.asset?.components?.[0]?.componentVariantName || "",
        }, // Index 0: 1st Set Pads
        {
          componentTypeId: "1",
          componentVariantId: data?.asset?.components?.[1]?.componentVariantId || "",
          expiresAt: data?.asset?.components?.[1]?.expiresAt || undefined,
          lotNumber: data?.asset?.components?.[1]?.lotNumber || "",
          serialNumber: data?.asset?.components?.[1]?.serialNumber || "",
          componentVariantName: data?.asset?.components?.[1]?.componentVariantName || "",
        }, // Index 1: 2nd Set Pads
        {
          componentTypeId: "2",
          componentVariantId: data?.asset?.components?.[2]?.componentVariantId || "",
          expiresAt: data?.asset?.components?.[2]?.expiresAt || undefined,
          lotNumber: data?.asset?.components?.[2]?.lotNumber || "",
          serialNumber: data?.asset?.components?.[2]?.serialNumber || "",
        }, // Index 2: Battery
        ],
        name: data?.asset?.name || "",
        notes: data?.asset?.notes || "",
        expiresAt: data?.asset?.expiresAt || undefined,
        purchaseDate: data?.asset?.purchaseDate || undefined,
        serialNumber: data?.asset?.serialNumber || "",

        // states for validations
        brand: data?.asset?.brand || "",
        id: data?.asset?.id || "",
    }
  }
}
