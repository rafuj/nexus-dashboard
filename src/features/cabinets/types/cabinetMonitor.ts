export type CabinetMonitorToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  city: string
  setCity: (value:string)=> void
  assetHealth: string
  setAssetHealth: (value:string)=> void
  doorStatus: string
  setDoorStatus: (value:string)=> void
}


export type AssetHealth = 'Ok' | 'Warning' | 'Urgent' | 'Paused';
export type AssetPresence = 'Present' | 'Missing';
export type DoorStatus = 'Closed' | 'Open';

export interface CabinetMonitorProps {
  id: string;
  cabinetName: string;
  city: string;
  assetHealth: AssetHealth;
  assetPresence: AssetPresence;
  doorStatus: DoorStatus;
  temperature: number; // Stored as a number for easier manipulation/rendering
  lastUpdate: string;  // Formatted date string
  healthTooltip: string; // Optional field for tooltips like "Temperature too high"
}