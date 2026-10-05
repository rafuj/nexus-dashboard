import type { DateRange } from "react-day-picker"

export type ActivityStatus = "Resolved" | "Ongoing" | "Activities";

export type ActivityType =
  | "Door open for >15 minutes"
  | "Connectivity lost"
  | "Asset removed"
  | "Temperature too high"
  | "Temperature too low"
  | "Ventilator error"
  | "Pads replaced"
  | "Data retrieved"
  | "Battery replaced"
  | "General Maintenance"
  | "Check-up"
  | "Battery Replaced"
  | "Pads Replaced"
  | "Data Retrieved"

export type ActivityUser = {
  name: string;
  avatarUrl?: string; // For rendering user profiles in the "Added by" column
};

export type CabinetActivityRow = {
  id: string
  activity: ActivityType
  cabinetName: string
  category: string
  notes: string
  time: string
  group: string
  temperature?: string
  addedBy?: {
    name: string
    avatarUrl: string
  }
};


export type ActivityCabinetsListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  cabinetGroup:string
  setCabinetGroup: (value:string)=> void
  activityType:string
  setActivityType: (value:string)=> void
  dateRange: DateRange,
  setDateRange: (value: DateRange) => void
  onReset: () => void
}
