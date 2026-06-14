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

export const cabinetConfig = {
  active: {
    bg: "bg-[#E6F4EA] border-[#C2E7CB]",
    text: "text-[#137333]",
    badge: "bg-[#137333] text-white",
    pin: "text-[#137333]",
    label: "Asset OK",
  },
  maintenance: {
    bg: "bg-[#FCEFE3] border-[#FAD7B7]",
    text: "text-[#E06021]",
    badge: "bg-[#F17336] text-white",
    pin: "text-[#F17336]",
    label: "Need Attention",
  },
  offline: {
    bg: "bg-[#FCE8E6] border-[#FAD2CF]",
    text: "text-[#C5221F]",
    badge: "bg-[#C5221F] text-white",
    pin: "text-[#C5221F]",
    label: "Need Urgent Attention",
  },
}