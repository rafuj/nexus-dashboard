import { Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import type { CabinetsListToolbarProps } from "../types/cabinetList"

const STATUS_FILTER_ALL = "all"
const TYPE_FILTER_ALL = "all"

export function CabinetsListToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}: CabinetsListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-[min(100%,16rem)] flex-1 space-y-2">
        <Label htmlFor="cabinet-search" className="text-muted-foreground text-xs font-medium">
          Search
        </Label>
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            id="cabinet-search"
            placeholder="Serial or name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs font-medium">Status</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={STATUS_FILTER_ALL}>All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs font-medium">Type</Label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TYPE_FILTER_ALL}>All types</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="non_connected">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
