

export type StepType = 'basic-information' | 'cabinet-details' | 'asset-information';

export type AssetType = 'aed' | 'other';

export type PadsType = 'adult' | 'children' | 'all';

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
}