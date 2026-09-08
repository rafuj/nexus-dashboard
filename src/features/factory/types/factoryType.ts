import type { DateRange } from "react-day-picker"

export type FactoryRow = {
  assignedAt: string
  createdAt: string
  deviceLinked: boolean
  id: string
  imei: string
  serialNumber: string
  status: string
  tenantId: string
  startsWith: string
  prefix: string
}

export type FactoryOverviewToolbarProps = {
  search: string
  setSearch: (value: string) => void
  prefix: string
  setPrefix: (value: string) => void
  linked: string
  setLinked: (value: string) => void
  dateRange?: DateRange,
  setDateRange: (value: DateRange) => void
  resetPage: () => void
}