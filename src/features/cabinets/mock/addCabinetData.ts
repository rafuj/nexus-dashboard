import type { RadioOption } from "@/shared/components/CustomRadioGroup";
import type { AssetType, AvailabilityType, BrightnessType, ColorType, DayConfig, PadsType, StepConfig, VolumeType } from "../types/cabinetList";

// Stepper
export const STEPS: StepConfig[] = [
  { id: 'basic-information', label: 'Basic Information' },
  { id: 'cabinet-details', label: 'Cabinet Details' },
  { id: 'asset-information', label: 'Asset Information' },
];

// Asset
export const assetTypeList : RadioOption<AssetType>[] = [
  { id: "aed", value: "aed", label: "AED" },
  { id: "other", value: "other", label: "Other" }
];

// Pads
export const padsTypeList : RadioOption<PadsType>[] = [
  { id: "adult", value: "adult", label: "Adult Only" },
  { id: "children", value: "children", label: "Children Only" },
  { id: "all", value: "all", label: "Both adult and children" }
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
