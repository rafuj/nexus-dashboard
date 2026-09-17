import type { SortingState } from "@tanstack/react-table"
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
  nexCode: string
  updCode: string
  type: string
  model: string
  combination: string
  linkedAt: string
}

export type FactoryOverviewToolbarProps = {
  search: string
  setSearch: (value: string) => void
  type: string
  setType: (value: string) => void
  deviceModelId: string
  setDeviceModelId: (value: string) => void
  combination: string
  setCombination: (value: string) => void
  dateRange?: DateRange,
  setDateRange: (value: DateRange) => void
  resetPage: () => void
  onExport: () => void
  tabs: 'linked' | 'available'
}

export interface AvailableSerialNumbersRow {
  deviceModel: {
    id: string
    modelName: string
  }
  generatedAt: string
  serialNumber: string
  type: string
}

export type AvailableSerialNumbersQuery = {
  search?: string
  //this will be extended later with other filters
  page?: number
  limit?: number
  sorting?: SortingState
}
