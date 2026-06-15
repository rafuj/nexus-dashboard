import type { DateRange } from "react-day-picker"

export type ActivityStatus = "Resolved" | "Ongoing" | "Done";

export type ActivityType =
  | "Door opened"
  | "Connectivity lost"
  | "Asset removed"
  | "Temperature too high"
  | "Temperature too low"
  | "Ventilator error"
  | "Pads replaced"
  | "Data retrieved"
  | "Battery replaced";

export type ActivityUser = {
  name: string;
  avatarUrl?: string; // For rendering user profiles in the "Added by" column
};

export type CabinetActivityRow = {
  id: string;
  timestamp: string;      // "May 26, 13:38"
  activity: ActivityType;
  cabinetCode: string;    // "CAB - 102"
  location: string;       // "Amsterdam Zuid"
  addedBy: "Cabinet" | ActivityUser;
  status: ActivityStatus;
  notes: string | null;   // e.g., "Door closed again" or null for "—"
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
}
