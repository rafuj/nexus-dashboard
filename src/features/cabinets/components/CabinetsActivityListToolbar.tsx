import { RotateCcw, Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Icons } from "@/app/icons/icons"
import { DateRangePicker } from "@/shared/components/ui/date-range-picker"
import type { ActivityCabinetsListToolbarProps } from "../types/activityList"

const CABINET_GROUP = "all"
const ACTIVITY_TYPE = "all"

export function CabinetsActivityListToolbar({
  search,
  onSearchChange,
  cabinetGroup,
  setCabinetGroup,
  activityType,
  setActivityType,
  dateRange, 
  setDateRange
}: ActivityCabinetsListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[min(100%,9rem)] flex-1 space-y-2">
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            id="cabinet-search"
            placeholder="Search activities"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 border border-border bg-white md:!h-12.5"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end sm:flex-wrap">
          {/* City */}
          <Select value={cabinetGroup} onValueChange={setCabinetGroup}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Cabinet/Group:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CABINET_GROUP}>All</SelectItem>
              <SelectItem value="option-1">Option 1</SelectItem>
              <SelectItem value="option-2">Option 2</SelectItem>
            </SelectContent>
          </Select>
          {/* Street */}
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Type:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ACTIVITY_TYPE}>All</SelectItem>
              <SelectItem value="door-closed">Door Closed</SelectItem>
              <SelectItem value="placed-back">Placed Back</SelectItem>
              <SelectItem value="connectivity">Connectivity</SelectItem>
            </SelectContent>
          </Select>
          {/* Status Filter */}
          <div>
            <DateRangePicker className="h-10 bg-white text-sm md:!h-12.5" prefix={"Date"} value={dateRange} onChange={(value)=>{
              if(value) {
                setDateRange(value)
              }
            }} />
          </div>
          <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-white text-accent-foreground py-2 px-3 sm:py-3 rounded-[10px] text-sm gap-1.25 border border-border">
            <RotateCcw size={16} /> <span>Reset Filter</span>
          </button>
          <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
            <Icons.export /> <span>Export</span>
          </button>
      </div>
    </div>
  )
}
