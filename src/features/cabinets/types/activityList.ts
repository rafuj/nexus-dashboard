import type { DateRange } from "react-day-picker"

export type ActivityCabinetsListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  cabinetGroup:string
  setCabinetGroup: (value:string)=> void
  activityType:string
  setActivityType: (value:string)=> void
  dateRange: DateRange,
  setDateRange: (value: DateRange) => void
}
