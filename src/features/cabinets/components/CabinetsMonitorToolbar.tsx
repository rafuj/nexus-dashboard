import { RotateCcw, Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import type { CabinetMonitorToolbarProps } from "../types/cabinetMonitor"


const CITY_FILTER_ALL = "all"
const ACTIVITY_TYPE = "all"

export function CabinetsMonitorToolbar({
  search,
  onSearchChange,
  city,
  setCity,
  status,
  setStatus,
  resetPage,
}: CabinetMonitorToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="w-full max-w-[260px] space-y-2">
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
            className="pl-9 h-10 border border-border bg-white md:!h-12.5"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end sm:flex-wrap">
          {/* City */}
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">City:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All Cities" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CITY_FILTER_ALL}>All Cities</SelectItem>
              <SelectItem value="Amsterdam">Amsterdam</SelectItem>
              <SelectItem value="Rotterdam">Rotterdam</SelectItem>
              <SelectItem value="The Hague (Den Haag)">The Hague (Den Haag)</SelectItem>
              <SelectItem value="Utrecht">Utrecht</SelectItem>
              <SelectItem value="Eindhoven">Eindhoven</SelectItem>
              <SelectItem value="Delft">Delft</SelectItem>
              <SelectItem value="Groningen">Groningen</SelectItem>
            </SelectContent>
          </Select>
          {/* Status */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Status:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ACTIVITY_TYPE}>All</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-white text-accent-foreground py-2 px-3 sm:py-3 rounded-[10px] text-sm gap-1.25 border border-border" onClick={resetPage}>
            <RotateCcw size={16} /> <span>Reset Filter</span>
          </button>
      </div>
    </div>
  )
}
