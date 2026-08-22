/**
 * Columns for the cabinets monitor table.
 * Matches layout from the provided dashboard overview.
 */
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/shared/components/data-table"
import { cn, formatDateTime } from "@/lib/utils" // Adjusted path to use your CabinetData model
import { Link } from "react-router"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import type { SmartCabinet } from "../types/cabinetList"
import { getDoorBadgeClass, getDoorStatus, getDoorStatusTooltip, getDoorStatusTooltipClass, getHealthBadgeClass, getHealthBadgeTooltipColor, getHealthTooltip, getPresenceBadgeClass, getPresenceStatus, getPresenceTooltip, getPresenceTooltipClass, getTemperatureBadgeClass, getTemperatureStatus, getTemperatureTooltip, getTemperatureTooltipClass, type TemperatureState } from "../lib/cabinetListDisplay"

const columnHelper = createColumnHelper<SmartCabinet>()

export const getTemperatureChip = (
  data: TemperatureState,
  className?: string
) => {
  switch (getTemperatureStatus(data)) {
    case "Urgent":
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block", getTemperatureBadgeClass(data),
            className
          )}
        >
          Urgent
        </span>
      );

    case "Warning":
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block", getTemperatureBadgeClass(data),
            className
          )}
        >
          Warning
        </span>
      );

    default:
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block", getTemperatureBadgeClass(data),
            className
          )}
        >
          OK
        </span>
      );
  }
};


export const cabinetsMonitorTableColumns = [
  // 1. Cabinet Name Column
  columnHelper.accessor("name", {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cabinet Name" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      // const health = "Ok" // data is not available now
      const assetTakenAt = row.original.deviceState?.assetStateChangedAt
      const doorOpen = row.original.deviceState?.doorOpen
      const temperature = row.original.deviceState?.temperature
      const temperatureOutOfRangeSince = row.original.deviceState?.lastSeenAt // data is not available now
      const status = row.original.status

      const getCabinetStatusColor = () => {
        if (getPresenceStatus(assetTakenAt) === "Urgent" || doorOpen || getTemperatureStatus({current:temperature, temperatureOutOfRangeSince}) === "Urgent") {
          return getHealthBadgeClass("Urgent") // Urgent Chip
        // } else if (health === "Warning" || getTemperatureStatus({current:temperature, temperatureOutOfRangeSince}) === "Warning" || getPresenceStatus(assetTakenAt) === "Warning" || getPresenceStatus(assetTakenAt) === "Taken") {
        } else if (getTemperatureStatus({current:temperature, temperatureOutOfRangeSince}) === "Warning" || getPresenceStatus(assetTakenAt) === "Warning" || getPresenceStatus(assetTakenAt) === "Taken") {
          return getHealthBadgeClass("Warning") // Warning Chip
        } else if (status === "paused") {
          return getHealthBadgeClass("Paused") // Paused Chip
        } else {
          return getHealthBadgeClass("Ok") // Success Chip
        }
      }
      return (
        <Link className={cn("px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all", getCabinetStatusColor())} to={`/cabinets/list/${row.original.id}`} >
            {row.original.name}
        </Link>
      )
    },
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
  columnHelper.accessor("id", {
    id: "assetHealth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Health" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle relative group",
    },
    cell: ({ row }) => {
      const health = "Ok"

      return (
        <div className="inline-flex items-center gap-1.5 relative">
          <Tooltip>
            <TooltipTrigger>
              {
                row.original.status === "paused" ? (
                  <span className={cn(
                      "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                      getHealthBadgeClass("Paused")
                    )}
                  >
                    Paused
                  </span>
                ) : (
                  <span
                    className={cn(
                      "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                      getHealthBadgeClass(health)
                    )}
                  >
                    {health}
                  </span>
                )
              }
            </TooltipTrigger>
            {row.original.status !== "paused" && (
              <TooltipContent side="right" className={cn(getHealthBadgeTooltipColor(health))}>
              {getHealthTooltip(health)}
            </TooltipContent>)}
          </Tooltip>
        </div>
      )
    },
  }),

  // 4. Asset Presence Column
  columnHelper.accessor("deviceState.assetPresent", {
    id: "assetPresence",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset Presence" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const assetTakenAt = row.original.deviceState?.assetStateChangedAt
      return (
        <div className="inline-flex items-center gap-1.5 relative">
          <Tooltip>
            <TooltipTrigger>
              {
                row.original.status === "paused" ? (
                  <span className={cn(
                      "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                      getHealthBadgeClass("Paused")
                    )}
                  >
                    Paused
                  </span>
                ) : (
                  row.original.deviceState?.assetPresent ? (
                    <span
                    className={cn(
                      "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                      getPresenceBadgeClass()
                    )}
                  >
                    {getPresenceStatus()}
                  </span>
                  ) : (
                      <span
                      className={cn(
                        "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                        getPresenceBadgeClass(assetTakenAt)
                      )}
                    >
                      {getPresenceStatus(assetTakenAt)}
                    </span>
                  )
                )
              }
            </TooltipTrigger>
            {row.original.status !== "paused" && (
              <TooltipContent side="right" className={cn(getPresenceTooltipClass(assetTakenAt))}>
                {getPresenceTooltip(assetTakenAt)}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      )
    },
  }),

  // 5. Door Status Column
  columnHelper.accessor("deviceState.doorOpen", {
    id: "doorStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Door Status" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const doorOpenedAt = row.original.deviceState?.doorStateChangedAt
      return (

        <div className="inline-flex items-center gap-1.5 relative">
          <Tooltip>
            <TooltipTrigger>
              {
                row.original.status === "paused" ? (
                  <span className={cn(
                      "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                      getHealthBadgeClass("Paused")
                    )}
                  >
                    Paused
                  </span>
                ) : (
                  row.original.deviceState?.doorOpen ? (
                    <span
                      className={cn(
                        "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                        getDoorBadgeClass()
                      )}
                    >
                      {getDoorStatus()}
                    </span>
                    ) : (
                      <span
                        className={cn(
                          "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                          getDoorBadgeClass(doorOpenedAt)
                        )}
                      >
                        {getDoorStatus(doorOpenedAt)}
                      </span>
                  )
                )
              }
            </TooltipTrigger>
            {row.original.status !== "paused" && (
              <TooltipContent side="right" className={cn(getDoorStatusTooltipClass(doorOpenedAt))}>
                {getDoorStatusTooltip(doorOpenedAt)}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      )
    },
  }),

  // 6. Temperature Column
  columnHelper.accessor("deviceState.temperature", {
    id: "temperature",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Temperature" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle tabular-nums",
    },
    cell: ({ row }) => {
      const temp = {
            current: row.original.deviceState?.temperature,
            temperatureOutOfRangeSince: row.original.deviceState?.lastSeenAt //
          }
      return (
        <div className="flex">
          <Tooltip>
            <TooltipTrigger>
              {
                row.original.status === "paused" ? (
                  <span className={cn(
                      "px-3 py-1 rounded-[4px] text-xs min-w-[70px] xl:min-w-[84px] text-center inline-block transition-all",
                      getHealthBadgeClass("Paused")
                    )}
                  >
                    Paused
                  </span>
                ) : (
                    getTemperatureChip(temp)
                )
              }
            </TooltipTrigger>
            {row.original.status !== "paused" && (
              <TooltipContent side="right" className={cn(getTemperatureTooltipClass(temp))}>
                {getTemperatureTooltip(temp)}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      )
    },
  }),

  // 7. Last Update Column
  columnHelper.accessor("deviceState.assetStateChangedAt", {
    id: "lastActivityAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Update" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle whitespace-nowrap",
    },
    cell: ({ row }) => formatDateTime(row.original.deviceState?.assetStateChangedAt),
  }),
]