/**
 * Columns for the cabinets monitor table.
 * Matches layout from the provided dashboard overview.
 */
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/shared/components/data-table"
import { cn } from "@/lib/utils" // Adjusted path to use your CabinetData model
import type { CabinetMonitorProps } from "../types/cabinetMonitor"
import { Link } from "react-router"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"

const columnHelper = createColumnHelper<CabinetMonitorProps>()

// Badge style mappings matching the UI color schemes
const getHealthBadgeClass = (health: string) => {
  switch (health) {
    case "Ok":
      return "bg-card-success text-success"
    case "Warning":
      return "bg-card-warning text-warning"
    case "Urgent":
      return "bg-card-error text-error"
    case "Paused":
      return "bg-card-info text-info" 
    default:
      return "bg-card-neutral text-accent-foreground"
  }
}
// health badge tooltip color
const getHealthBadgeTooltipColor = (health: string) => {
  switch (health) {
    case "Ok":
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success"
    case "Warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning"
    case "Urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error"
    case "Paused":
      return "bg-info [&_.arrow]:bg-info [&_.arrow]:fill-info"
    default:
      return "bg-neutral [&_.arrow]:bg-neutral [&_.arrow]:fill-neutral"
  }
}

const getPresenceBadgeClass = (presence: string) => {
  return presence === "Present" 
    ? "bg-card-success text-success" 
    : "bg-card-error text-error"
}

const getDoorBadgeClass = (door: string) => {
  return door === "Closed" 
    ? "bg-card-success text-success" 
    : "bg-card-error text-error"
}

const getTemperatureClass = (temp: number) => {
  if (temp >= 30) return "text-error"
  if (temp >= 25) return "text-warning"
  return "text-success"
}

export const cabinetsMonitorTableColumns = [
  // 1. Cabinet Name Column
  columnHelper.accessor("cabinetName", {
    id: "cabinetName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cabinet Name" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle underline cursor-pointer",
    },
    cell: ({ row }) => <Link className="text-accent-foreground hover:text-primary truncate" to={`/cabinets/list/${row.original.id}`} >{row.original.cabinetName}</Link>
  }),

  // 2. City Column
  columnHelper.accessor("city", {
    id: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle text-slate-700",
    },
    cell: ({ row }) => row.original.city,
  }),

  // 3. Asset Health Column (With dynamic tooltip implementation)
  columnHelper.accessor("assetHealth", {
    id: "assetHealth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Health" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle relative group",
    },
    cell: ({ row }) => {
      const health = row.original.assetHealth
      const tooltip = row.original.healthTooltip

      return (
        <div className="inline-flex items-center gap-1.5 relative">
          <Tooltip>
            <TooltipTrigger>
              <span
                className={cn(
                  "px-3 py-1 rounded-md text-xs min-w-[70px] text-center block transition-all",
                  getHealthBadgeClass(health)
                )}
              >
                {health}
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className={cn(getHealthBadgeTooltipColor(health))}>
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  }),

  // 4. Asset Presence Column
  columnHelper.accessor("assetPresence", {
    id: "assetPresence",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Presence" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const presence = row.original.assetPresence
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-md text-xs min-w-[75px] text-center inline-block",
            getPresenceBadgeClass(presence)
          )}
        >
          {presence}
        </span>
      )
    },
  }),

  // 5. Door Status Column
  columnHelper.accessor("doorStatus", {
    id: "doorStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Door Status" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const door = row.original.doorStatus
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-md text-xs min-w-[70px] text-center inline-block",
            getDoorBadgeClass(door)
          )}
        >
          {door}
        </span>
      )
    },
  }),

  // 6. Temperature Column
  columnHelper.accessor("temperature", {
    id: "temperature",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Temperature" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle tabular-nums",
    },
    cell: ({ row }) => {
      const temp = row.original.temperature
      return (
        <span className={cn(getTemperatureClass(temp))}>
          {temp.toFixed(1)} °C
        </span>
      )
    },
  }),

  // 7. Last Update Column
  columnHelper.accessor("lastUpdate", {
    id: "lastUpdate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Update" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle whitespace-nowrap",
    },
    cell: ({ row }) => row.original.lastUpdate,
  }),
]