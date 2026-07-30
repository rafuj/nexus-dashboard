export type CabinetMonitorToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  city: string
  setCity: (value:string)=> void
  status: string
  setStatus: (value:string)=> void
}


export type AssetHealth = 'Ok' | 'Warning' | 'Urgent' | 'Paused';
export type AssetPresence = 'Present' | 'Missing';
export type DoorStatus = 'Closed' | 'Open';
export type Status = 'urgent' | 'ok' | 'warning' | 'paused';
export type FilterStatus = Status | 'all';

export interface CabinetMonitorProps {
  id: string;
  cabinetName: string;
  city: string;
  assetHealth: AssetHealth;
  assetPresence: AssetPresence;
  doorStatus: DoorStatus;
  status: Status;
  temperature: number; // Stored as a number for easier manipulation/rendering
  lastUpdate: string;  // Formatted date string
  healthTooltip: string; // Optional field for tooltips like "Temperature too high"
}