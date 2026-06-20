import { RotateCcw, Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import type { SettingsToolbarProps } from "../types/settingsList"

const STATUS_FILTER_ALL = "all"
const TYPE_FILTER_ALL = "all"
const SORT_BY_FILTER_ALL = "all"

export function SettingsMemberToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
}: SettingsToolbarProps ) {
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
            className="pl-9 h-10 border border-border bg-white md:!h-12.5"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end sm:flex-wrap">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Type:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TYPE_FILTER_ALL}>All</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
              <SelectItem value="medium-priority">Medium Priority</SelectItem>
              <SelectItem value="low-priority">Low Priority</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-s md:!h-12.5">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Group:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SORT_BY_FILTER_ALL}>All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
              <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                <span className="font-normal text-foreground">Status:</span>
                <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All Status" /></span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={STATUS_FILTER_ALL}>All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-white text-accent-foreground py-2 px-3 sm:py-3 rounded-[10px] text-sm gap-1.25 border border-border">
            <RotateCcw size={16} /> <span>Reset Filter</span>
          </button>
      </div>
    </div>
  )
}
