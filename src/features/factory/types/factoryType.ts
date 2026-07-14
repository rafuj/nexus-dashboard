import type { DateRange } from "react-day-picker"

export type FactoryRow = {
  id: string
  serial: string
  status: 'linked' | 'unlinked'
  imei: string
  linkedOn: string
  generatedOn: string
  prefix: "NEX" | "UPD"
}
export type FactoryOverviewToolbarProps = {
  search: string
  setSearch: (value: string) => void
  prefix: string
  setPrefix: (value: string) => void
  linked: string
  setLinked: (value: string) => void
  dateRange: DateRange,
  setDateRange: (value: DateRange) => void
}