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
      components: [
        {
          componentTypeId: data?.asset?.components[0]?.componentTypeId || "1",
          componentVariantId: data?.asset?.components[0]?.componentVariantId || "",
          expiresAt: data?.asset?.components[0]?.expiresAt || undefined,
          lotNumber: data?.asset?.components[0]?.lotNumber || "",
          serialNumber: data?.asset?.components[0]?.serialNumber || "",
          componentVariantName: data?.asset?.components[0]?.componentVariantName || "",
        }, // Index 0: 1st Set Pads
        {
          componentTypeId: data?.asset?.components[1]?.componentTypeId || "1",
          componentVariantId: data?.asset?.components[1]?.componentVariantId || "",
          expiresAt: data?.asset?.components[1]?.expiresAt || undefined,
          lotNumber: data?.asset?.components[1]?.lotNumber || "",
          serialNumber: data?.asset?.components[1]?.serialNumber || "",
          componentVariantName: data?.asset?.components[1]?.componentVariantName || "",
        }, // Index 1: 2nd Set Pads
        {
          componentTypeId: data?.asset?.components[2]?.componentTypeId || "2",
          componentVariantId: data?.asset?.components[2]?.componentVariantId || "",
          expiresAt: data?.asset?.components[2]?.expiresAt || undefined,
          lotNumber: data?.asset?.components[2]?.lotNumber || "",
          serialNumber: data?.asset?.components[2]?.serialNumber || "",
          componentVariantName: data?.asset?.components[2]?.componentVariantName || "",
        }, // Index 2: Battery (Fixed: changed index 1 -> 2)
      ],
      name: data?.asset?.name || "",
      notes: data?.asset?.notes || "",
      expiresAt: data?.asset?.expiresAt || undefined,
      purchaseDate: data?.asset?.purchaseDate || undefined,
      serialNumber: data?.asset?.serialNumber || "",

      // states for validations
      brand: data?.asset?.brand || "",
      id: data?.asset?.id || "",
      cabinetId: data?.asset?.cabinetId || "" ,
    },
  };
};
