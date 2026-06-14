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
const STREETS_FILTER_ALL = "all"

export function CabinetsListToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  // typeFilter,
  // onTypeFilterChange,
  cities,
  onCitiesChange,
  streets,
  onStreetsChange,
}: CabinetsListToolbarProps) {
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
            placeholder="Search cabinet name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 border border-border bg-white"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end sm:flex-wrap">
          {/* City */}
          <Select value={cities} onValueChange={onCitiesChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm">
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
          {/* Street */}
          <Select value={streets} onValueChange={onStreetsChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Street:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All Streets" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={STREETS_FILTER_ALL}>All Streets</SelectItem>
              <SelectItem value="damrak">Damrak</SelectItem>
              <SelectItem value="prinsengracht">Prinsengracht</SelectItem>
              <SelectItem value="coolsingel">Coolsingel</SelectItem>
              <SelectItem value="weena">Weena</SelectItem>
              <SelectItem value="oudegracht">Oudegracht</SelectItem>
              <SelectItem value="vredenburg">Vredenburg</SelectItem>
              <SelectItem value="oude-delft">Oude Delft</SelectItem>
            </SelectContent>
          </Select>
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Status:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All Status" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={STATUS_FILTER_ALL}>All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <button type="button" className="h-10 flex items-center justify-center bg-white text-accent-foreground py-2 px-3 sm:py-3 rounded-[10px] text-sm gap-1.25 border border-border">
            <RotateCcw size={16} /> <span>Reset Filter</span>
          </button>
          <button type="button" className="h-10 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
            <Icons.export /> <span>Export</span>
          </button>
      </div>
    </div>
  )
}
