export type CabinetStatus =
  | "ok"
  | "warning"
  | "urgent"
  | "paused"
  | (string & {});
  
export type FilterStatus = "ok" | "warning" | "urgent" | "paused" | 'all'

export type CabinetConnectionType = "connected" | "not_connected";

export type AssetHealth = 'ok' | 'warning' | 'urgent' | 'paused';
export type AssetPresence = 'present' | 'missing';
export type DoorStatus = 'closed' | 'open';

interface BaseCabinet {
  accessType: string
  id: string
  name: string
  city: string
  country: string
  zipCode: string
  latitude: number
  longitude: number
  street: string
  number: string
  addressLine2?: string
  serialNumber: string
  lockCode: string
  assignedAt: string
  createdAt: string
  description: string
  smart: boolean
  status: string
  tenantId?: string
  deviceState: {
    assetPresent: boolean
    assetStateChangedAt: string
    createdAt: string
    deviceInstallationId: string
    doorOpen: boolean
    doorStateChangedAt: string
    lastSeenAt: string
    rssi: number
    temperature: number
    assetHealth: string
  }
}

export interface Cabinet extends BaseCabinet {}
export interface SmartCabinet extends BaseCabinet {}

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
  onExport: () => void
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
  assigned: {
    bg: "card-success",
    text: "text-success",
    badge: "bg-success text-white",
    pin: "text-success",
  },
  "n/a": {
    bg: "card-neutral",
    text: "text-foreground",
    badge: "bg-foreground text-white",
    pin: "text-foreground",
  },
}