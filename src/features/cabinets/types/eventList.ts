import type { DateRange } from "react-day-picker"

export type EventStatus = "Resolved" | "Ongoing" | "Events";

export type EventType =
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
  // from apies
  | "repaired"
  | "damaged"
  | "battery replaced"
  | "other"
  | "pads replaced"
  | "checked"
  | "stolen"

export type ActivityUser = {
  name: string;
  avatarUrl?: string; // For rendering user profiles in the "Added by" column
};

export type CabinetEventRow = {
  id: string
  event: EventType
  cabinetName: string
  category: string
  notes: string
  time: string
  group: string
  temperature?: string
  addedBy: string
  cabinetId: string
}


export type EventCabinetsListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  cabinetGroup:string
  setCabinetGroup: (value:string)=> void
  eventType:string
  setEventType: (value:string)=> void
  dateRange: DateRange,
  setDateRange: (value: DateRange) => void
  onReset: () => void
  onExport: () => void
}
