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
import type { FactoryOverviewToolbarProps } from "../types/factoryType"
import { DateRangePicker } from "@/shared/components/ui/date-range-picker"

const PREFIX_DEFAULT = "all"
const LINKED_DEFAULT = "all"

export function FactoryOverviewToolbar({
  search,
  setSearch,
  prefix,
  setPrefix,
  linked,
  setLinked,
  dateRange,
  setDateRange,
  resetPage,
  onExport,
  tabs
}: FactoryOverviewToolbarProps) {
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
            placeholder={tabs === "linked" ? "Search NEX, UPD or IMEI..." : "Search serial number..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border border-border bg-white md:!h-12.5"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end sm:flex-wrap">
          {tabs === "linked" ? (
            <Select value={prefix} onValueChange={setPrefix}>
              <SelectTrigger className="w-full min-w-36 sm:w-auto md:!h-12.5 text-sm">
                <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                  <span className="font-normal text-foreground shrink-0">Combination:</span>
                  <span className="line-clamp-1 grow text-left"><SelectValue placeholder="All" /></span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PREFIX_DEFAULT}>All</SelectItem>
                <SelectItem value="connected">Connected Nexus</SelectItem>
                <SelectItem value="non-connected">Non-connected Nexus</SelectItem>
                <SelectItem value="separate">Separate module</SelectItem>
              </SelectContent>
            </Select>
            ) : (
            <>
              <Select value={linked} onValueChange={setLinked}>
                <SelectTrigger className="w-full min-w-36 sm:w-auto md:!h-12.5 text-sm">
                  <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                    <span className="font-normal text-foreground shrink-0">Type:</span>
                    <span className="line-clamp-1 grow text-left"><SelectValue placeholder="All" /></span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LINKED_DEFAULT}>All</SelectItem>
                  <SelectItem value="NEX">NEX</SelectItem>
                  <SelectItem value="UPD">UPD</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <div className="min-w-[190px]">
            <DateRangePicker
              prefix="Date Range"
              value={dateRange}
              onChange={(value)=>{
                if(value) {
                  setDateRange(value)
                }
              }}
              dateType="past"
            />
          </div>
          {tabs === "available" && (
            <Select value={prefix} onValueChange={setPrefix}>
              <SelectTrigger className="w-full min-w-36 sm:w-auto md:!h-12.5 text-sm">
                <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                  <span className="font-normal text-foreground shrink-0">Module model:</span>
                  <span className="line-clamp-1 grow text-left"><SelectValue placeholder="All" /></span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PREFIX_DEFAULT}>All</SelectItem>
                <SelectItem value="connected-v1">Connected V1</SelectItem>
                <SelectItem value="non-connected-v2">Non-connected V1</SelectItem>
              </SelectContent>
            </Select>
          )}
          <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-white text-accent-foreground py-2 px-3 sm:py-3 rounded-[10px] text-sm gap-1.25 border border-border" onClick={resetPage}>
            <RotateCcw size={16} /> <span>Reset Filter</span>
          </button>
          <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25" onClick={()=>onExport()}>
            <Icons.export /> <span>Export</span>
          </button>
      </div>
    </div>
  )
}
