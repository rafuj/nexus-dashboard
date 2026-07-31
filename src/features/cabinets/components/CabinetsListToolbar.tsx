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

const STATUS_FILTER_ALL = "all"
// const TYPE_FILTER_ALL = "all"
const CITIES_FILTER_ALL = "all"

export function CabinetsListToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  // typeFilter,
  // onTypeFilterChange,
  cities,
  onCitiesChange
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
      <Select value={cities} onValueChange={onCitiesChange}>
        <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
            <span className="font-normal text-foreground">City:</span>
            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All Cities" /></span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={CITIES_FILTER_ALL}>All Cities</SelectItem>
          <SelectItem value="amsterdam">Amsterdam</SelectItem>
          <SelectItem value="rotterdam">Rotterdam</SelectItem>
          <SelectItem value="the-hague">The Hague (Den Haag)</SelectItem>
          <SelectItem value="utrecht">Utrecht</SelectItem>
          <SelectItem value="eindhoven">Eindhoven</SelectItem>
          <SelectItem value="delft">Delft</SelectItem>
          <SelectItem value="groningen">Groningen</SelectItem>
        </SelectContent>
      </Select>
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
      <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-white text-accent-foreground py-2 px-3 sm:py-3 rounded-[10px] text-sm gap-1.25 border border-border">
        <RotateCcw size={16} /> <span>Reset Filter</span>
      </button>
      <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
        <RotateCcw size={16} /> <span>Refresh</span>
      </button>
      <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
        <Icons.export /> <span>Export</span>
      </button>
    </div>
  )
}
