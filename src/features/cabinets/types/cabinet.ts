import { convertDDMMYYYY } from "@/lib/utils";


export type StepType = 'basic-information' | 'cabinet-details' | 'asset-information';

export interface AssetType {
  label: string;
  value: string;
}
export const serialRegex = /^NEX-[A-Z0-9]{5}-[A-Z0-9]{4}$/;

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


export interface CreateCabinetFormValues  {
  accessType: "public" | "private"
  addressLine1: string
  name: string
  description?: string
  addressLine2: string
  latitude: number
  longitude: number
  zipCode: string
  city: string
  country: string
  serialNumber: string
  customSerialNumber?: string // only for ui
  lockCode: string
  picture1: File | null
  picture2: File | null
  picture3: File | null
  
  // model
  cabinetModelId: string
  brand: string // only for ui
  cabinetModel?: {
    brand: string
  }
  serialNumberRecognition: boolean // for logic
  imeiRecognition: boolean // only for ui
  
  // optional values for create cabinet
  imei: string
  volume: VolumeType
  color: ColorType
  brightness: BrightnessType
  primaryLanguage: string
  secondaryLanguage: string

  // asset info
  asset: {
    id: string // id is for error handling not for apies
    brand: string // brand is for error handling not for apies
    cabinetId?: string // cabinetId is for error handling not for apies
    assetModelId?: string
    assetModel?: { // only for ui
      brand: string
      assetTypeId: string
    }
    checkupDate?: Date | undefined
    components?: {
        componentTypeId: string
        componentVariantId?: string
        componentVariantName?: string // is set to visible in ui not for apies
        expiresAt: Date | undefined
        lotNumber?: string
        serialNumber?: string
        id: string // for update api
    }[]
    expiresAt?: Date | undefined
    name: string
    notes?: string
    purchaseDate?: Date | undefined
    serialNumber?: string
  }
}

export const cabinetInitialValues = (
  data?: Partial<CreateCabinetFormValues> | null
): CreateCabinetFormValues => {

  const padsComponents = [...(data?.asset?.components || [])].filter(
    (c: any) => c.componentTypeId === "1"
  );

  const batteryComponent = [...(data?.asset?.components || [])].find(
    (c: any) => c.componentTypeId === "2"
  );

  return {
    accessType: data?.accessType || "public",
    name: data?.name || "",
    description: data?.description || "",

    addressLine1: data?.addressLine1 || "",
    addressLine2: data?.addressLine2 || "",
    latitude: data?.latitude || 0,
    longitude: data?.longitude || 0,
    zipCode: data?.zipCode || "",
    city: data?.city || "",
    country: data?.country || "",

    serialNumber: data?.serialNumber || data?.customSerialNumber || "",
    lockCode: data?.lockCode || "",

    picture1: data?.picture1 || null,
    picture2: data?.picture2 || null,
    picture3: data?.picture3 || null,


    // model
    brand: data?.cabinetModel?.brand || "", // only for ui
    cabinetModelId: data?.cabinetModelId || "",
    serialNumberRecognition: false, // will update later
    imeiRecognition: false, // only for ui


    // Device Settings All Optional Fields
    imei: data?.imei || "",
    volume: data?.volume || "50%",
    color: data?.color || "white",
    brightness: data?.brightness || "50%",
    primaryLanguage: data?.primaryLanguage || "",
    secondaryLanguage: data?.secondaryLanguage || "",

    // asset info
    asset: {
      assetModelId: data?.asset?.assetModelId || "",
      checkupDate: convertDDMMYYYY(data?.asset?.checkupDate) || undefined,
      expiresAt: convertDDMMYYYY(data?.asset?.expiresAt) || undefined,
      purchaseDate: convertDDMMYYYY(data?.asset?.purchaseDate) || undefined,
      name: data?.asset?.name || "",
      notes: data?.asset?.notes || "",
      serialNumber: data?.asset?.serialNumber || "",
      components: [
        // Index 0: 1st Set Pads
        {
          componentTypeId: padsComponents[0]?.componentTypeId || '1',
          componentVariantId: padsComponents[0]?.componentVariantId || '',
          expiresAt: convertDDMMYYYY(padsComponents[0]?.expiresAt) || undefined,
          lotNumber: padsComponents[0]?.lotNumber || '',
          serialNumber: padsComponents[0]?.serialNumber || '',
          componentVariantName: padsComponents[0]?.componentVariantName || '',
          id: padsComponents[0]?.id || ''
        },

        // Index 1: 2nd Set Pads
        {
          componentTypeId: padsComponents[1]?.componentTypeId || '1',
          componentVariantId: padsComponents[1]?.componentVariantId || '',
          expiresAt: convertDDMMYYYY(padsComponents[1]?.expiresAt) || undefined,
          lotNumber: padsComponents[1]?.lotNumber || '',
          serialNumber: padsComponents[1]?.serialNumber || '',
          componentVariantName: padsComponents[1]?.componentVariantName || '',
          id: padsComponents[1]?.id || ''
        },
        // Index 2: Battery
        {
          componentTypeId: batteryComponent?.componentTypeId || '2',
          componentVariantId: batteryComponent?.componentVariantId || '',
          expiresAt: convertDDMMYYYY(batteryComponent?.expiresAt) || undefined,
          lotNumber: batteryComponent?.lotNumber || '',
          serialNumber: batteryComponent?.serialNumber || '',
          componentVariantName: batteryComponent?.componentVariantName || '',
          id: batteryComponent?.id || ''
        },
      ],

      // states for validations skip this for api
      brand: data?.asset?.assetModel?.brand || "",
      id: data?.asset?.assetModel?.assetTypeId || "",
    },
  };
};
