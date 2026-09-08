import { RotateCcw, Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import type { CabinetsListToolbarProps } from "../types/cabinetList"
import { Icons } from "@/app/icons/icons"
import { CityCombobox } from "./CityCombobox"
import { allCities} from "@/lib/country-helper"

const STATUS_FILTER_ALL = "all"

export function CabinetsListToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  city,
  onCityChange,
  resetPage,
  onRefresh,
  isFetching,
  onExport
}: CabinetsListToolbarProps) {


  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 flex-row sm:items-end">
      <div className="min-w-[260px] grow space-y-2">
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            id="cabinet-search"
            placeholder="Search cabinet..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 border border-border bg-white md:!h-12.5"
            autoComplete="off"
          />
        </div>
      </div>
      {/* City */}
      <CityCombobox
        availableCities={allCities}
        selectedCity={city}
        onSelectCity={onCityChange}
        prefix="City"
        className="w-[auto] capitalize"
      />
      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
            <span className="font-normal text-foreground">Status:</span>
            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All Status" /></span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={STATUS_FILTER_ALL}>All</SelectItem>
          <SelectItem value="ok">OK</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
        </SelectContent>
      </Select>
      <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-white text-accent-foreground py-2 px-3 sm:py-3 rounded-[10px] text-sm gap-1.25 border border-border" onClick={resetPage}>
        <RotateCcw size={16} /> <span>Reset Filter</span>
      </button>
      <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25" onClick={onRefresh} disabled={isFetching}>
        <RotateCcw size={16} /> <span>Refresh</span>
      </button>
      <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25" onClick={()=>onExport()}>
        <Icons.export /> <span>Export</span>
      </button>
    </div>
  )
}
