export type CabinetStatus =
  | "ok"
  | "warning"
  | "urgent"
  | "paused"
  | (string & {});
  
export type FilterStatus = "ok" | "warning" | "urgent" | "paused" | 'all'

export type CabinetConnectionType = "connected" | "not_connected";

export type AssetHealth = 'Ok' | 'Warning' | 'Urgent' | 'Paused';
export type AssetPresence = 'Present' | 'Missing';
export type DoorStatus = 'Closed' | 'Open';

export interface Cabinet {
  id: string;
  name: string;
  city: string;
  zip: string;
  street: string;
  houseNumber: string;
  cabinetCode: string;
  updaidCode: string;
  serial: string;
  type: CabinetConnectionType;
  location: string;
  locationCoordinates: {
    lat: number;
    lng: number;
  };
  asset: "aed" | "none";
  assetPresence: AssetPresence;
  assetHealth: AssetHealth;
  doorStatus: DoorStatus;
  status: CabinetStatus;
  temperature: number;
  lastActivityAt: string;
  doorOpenedAt: Date | string | null;
  assetTakenAt: Date | string | null;
  temperatureOutOfRangeSince: Date | string | null;
}

export type CabinetsListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  city: string
  onCityChange: (value: string) => void
  resetPage: () => void
  onRefresh: () => void
  isFetching?: boolean
}

export const cabinetConfig = {
  ok: {
    bg: "card-success",
    text: "text-success",
    badge: "bg-success text-white",
    pin: "text-success",
  },
  warning: {
    bg: "card-warning",
    text: "text-warning",
    badge: "bg-warning text-white",
    pin: "text-warning",
  },
  urgent: {
    bg: "card-error",
    text: "text-error",
    badge: "bg-error text-white",
    pin: "text-error",
  },
  paused: {
    bg: "card-neutral",
    text: "text-foreground",
    badge: "bg-foreground text-white",
    pin: "text-foreground",
  },
}