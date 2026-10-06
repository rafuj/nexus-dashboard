/**
 * Columns for the cabinets activity log table.
 * Matches layout from image_6214cc.png.
 */
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/shared/components/data-table"
import type { CabinetActivityRow } from "../types/activityList"
import { ActivityIcons } from "@/app/icons/icons"
import { formatMonDayTime } from "@/lib/utils"

const columnHelper = createColumnHelper<CabinetActivityRow>()

export const cabinetsActivityTableColumns = (tabValue: string) => [

  // 1. Cabinet Name
  columnHelper.accessor("cabinetName", {
    id: "cabinetName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cabinet Name" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle tabular-nums",
    },
    cell: ({ row }) => row.original.cabinetName,
  }),

  columnHelper.accessor("group", {
    id: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const group = row.original.group
      return (
        <div className="flex items-center gap-3">
          <span>{group ? group : <span className="block w-8 border-b-2 border-accent-foreground"></span>}</span>
        </div>
      )
    },
  }),

  // 2. Activity Column (Includes Dynamic Activity Description & Placeholder Icons)
  columnHelper.accessor("activity", {
    id: "activity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={tabValue === "Activities" ? "Activity" : "Incident"} />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const activity = row.original.activity
      return (
        <div className="flex items-center gap-3">
          <div className={tabValue === "Ongoing" ? "text-error" : "text-success2"}>
            <ActivityIcon activity={activity} />
          </div>
          <div>
          <div className="capitalize">{activity}</div>
            {tabValue === "Ongoing" ?  <>
              {(activity === "Temperature too high" || activity === "Temperature too low") ? (
                <span className="text-foreground text-[10px]">
                  Last measured temp: {row.original.temperature}°C
                </span>
              ) : null}
            </> : <>
              {(activity === "Temperature too high" || activity === "Temperature too low") && <>
                <span className="text-foreground text-[10px]">
                  {activity === "Temperature too low" ? "Lowest" : "Highest"} measured temp: {row.original.temperature}°C
                </span>
              </>}
            </>
            }
          </div>
        </div>
      )
    },
  }),

  // 3. Time Column
  columnHelper.accessor("time", {
    id: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle whitespace-nowrap",
    },
    cell: ({ row }) => formatMonDayTime(row.original.time),
  }),

  ...(tabValue === "Activities"
  ? [
      columnHelper.accessor("addedBy", {
        id: "addedBy",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Added by" />
        ),
        meta: {
          headerClassName: "",
          cellClassName: "align-middle",
        },
        cell: ({ row }) => {
          const entry = row.original?.addedBy
          return (
            <div className="flex items-center gap-2">
              {/* {entry?.avatarUrl ? (
                <img
                  src={entry.avatarUrl}
                  alt={entry.name}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
              )} */}
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold">
                  {entry
                    ?.split(" ").slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase()}
                </div>
              {/* <span className="font-medium">{entry?.name}</span> */}
              <span className="font-medium">{entry}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("notes", {
        id: "notes",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Notes" />
        ),
        meta: {
          headerClassName: "",
          cellClassName: "align-middle",
        },
        cell: ({ row }) => {
          const notes = row.original.notes

          if (!notes) {
            return <span className="text-slate-300">—</span>
          }

          if (notes === "View notes") {
            return (
              <button className="rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200">
                View notes
              </button>
            )
          }

          return <span>{notes}</span>
        },
      }),
    ]
  : [])
]

interface ActivityIconProps {
  activity: string
  className?: string
}

const ActivityIcon = ({ activity }: ActivityIconProps) => {
  // Common styling for consistency matching image_6214cc.png
  const baseClass = "size-5 flex-shrink-0"

  switch (activity) {
    case "Door opened":
      return <ActivityIcons.openDoor className={baseClass} />
    case "Connectivity lost":
      return <ActivityIcons.connectivityLost className={baseClass} />

    case "Asset removed":
      return <ActivityIcons.assetRemoved className={baseClass} />

    case "Temperature too high":
    case "Temperature too low":
      return <ActivityIcons.temperature className={baseClass} />

    case "Ventilator error":
      return <ActivityIcons.ventilatorError className={baseClass} />

    case "Data retrieved":
      return <ActivityIcons.dataRetrived className={baseClass} />
    case "Data Retrieved":
      return <ActivityIcons.dataRetrived className={baseClass} />

    case "Battery replaced":
      return <ActivityIcons.batteryReplaced className={baseClass} />
    case "Battery Replaced":
      return <ActivityIcons.batteryReplaced className={baseClass} />

    default:
      return <ActivityIcons.padsReplaced className={baseClass} />
  }
}