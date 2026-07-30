export type CabinetStatus = "active" | "maintenance" | "offline"

export type CabinetConnectionType = "connected" | "non_connected"

export type CabinetListRow = {
  id: string
  name: string
  serial: string
  status: CabinetStatus
  type: CabinetConnectionType
  location: string
  locationCoordinates: { lat: number; lng: number }
  asset: "aed" | "none"
  temperatureC: number | null
  lastActivityAt: string
  city: string
  zip: string
  street: string
  hNo: string
  cabinetCode: string
  updaidCode: string
}

export type CabinetsListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  // typeFilter: string
  // onTypeFilterChange: (value: string) => void
  cities: string
  onCitiesChange: (value: string) => void
}

export const cabinetConfig = {
  active: {
    bg: "card-success",
    text: "text-success",
    badge: "bg-success text-white",
    pin: "text-success",
    label: "Asset OK",
  },
  maintenance: {
    bg: "card-warning",
    text: "text-warning",
    badge: "bg-warning text-white",
    pin: "text-warning",
    label: "Need Attention",
  },
  offline: {
    bg: "card-error",
    text: "text-error",
    badge: "bg-error text-white",
    pin: "text-error",
    label: "Need Urgent Attention",
  },
  paused: {
    bg: "card-info",
    text: "text-info",
    badge: "bg-info text-white",
    pin: "text-info",
    label: "Need Urgent Attention",
  },
}