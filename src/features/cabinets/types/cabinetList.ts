export type CabinetStatus = "active" | "maintenance" | "offline"

export type CabinetConnectionType = "connected" | "non_connected"

export type CabinetListRow = {
  id: string
  name: string
  serial: string
  status: CabinetStatus
  type: CabinetConnectionType
  location: string
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
  streets: string
  onStreetsChange: (value: string) => void
}
