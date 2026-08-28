import type { RadioOption } from "@/shared/components/CustomRadioGroup";
import type { AssetType, AvailabilityType, BrightnessType, ColorType, DayConfig, StepConfig, VolumeType } from "../types/cabinet";

// Stepper
export const STEPS: StepConfig[] = [
  { id: 'basic-information', label: 'Cabinet Information' },
  { id: 'asset-information', label: 'Asset Information' },
];

// Asset
export const assetTypeList : AssetType[] = [
  { label: "Defibrillator", value: "defibrillator" },
  { label: "Fire Extinguisher", value: "fire-extinguisher" },
  { label: "First-Aid Kit", value: "first-aid-kit" },
  { label: "Life Bouy", value: "life-bouy" },
  { label: "Other", value: "other" }
];

// Volume
export const volumeList : RadioOption<VolumeType>[] = [
  { id: "0", value: "0%", label: "0%" },
  { id: "1", value: "50%", label: "50%" },
  { id: "2", value: "100%", label: "100%" }
];

// Brightness
export const brightnessList : RadioOption<BrightnessType>[] = [
  { id: "0", value: "0%", label: "0%" },
  { id: "1", value: "50%", label: "50%" },
  { id: "2", value: "100%", label: "100%" }
];

// Color
export const colorList : RadioOption<ColorType>[] = [
  { id: "white", value: "white", label: "White" },
  { id: "green", value: "green", label: "Green" },
  { id: "yellow", value: "yellow", label: "Yellow" },
  { id: "red", value: "red", label: "Red" },
];

// Availability
export const availabilityTypeList : RadioOption<AvailabilityType>[] = [
  { id: "24/7", value: "24/7", label: "24/7" },
  { id: "Custom days and times", value: "custom-days-and-types", label: "Custom days and times" },
];


export type AccessTypeI = 'private' | 'public';


// Day Config
export const dayList: DayConfig[] = [
  { day: 'Monday', checked: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Tuesday', checked: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Wednesday', checked: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Thursday', checked: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Friday', checked: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Saturday', checked: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Sunday', checked: false, startTime: '09:00', endTime: '17:00' },
];
