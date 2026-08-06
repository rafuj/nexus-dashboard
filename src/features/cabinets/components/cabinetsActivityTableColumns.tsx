/**
 * Columns for the cabinets activity log table.
 * Matches layout from image_6214cc.png.
 */
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/shared/components/data-table"
import type { CabinetActivityRow } from "../types/activityList"
import { ActivityIcons } from "@/app/icons/icons"

const columnHelper = createColumnHelper<CabinetActivityRow>()

export const cabinetsActivityTableColumns = (tabValue: string) => [

  // 1. Cabinet Name
  columnHelper.accessor("name", {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cabinet Name" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle tabular-nums",
    },
    cell: ({ row }) => row.original.name,
  }),

  // 2. Activity Column (Includes Dynamic Activity Description & Placeholder Icons)
  columnHelper.accessor("activity", {
    id: "activity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activity" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const activity = row.original.activity
      return (
        <div className="flex items-center gap-3">
          <div className={tabValue === "Resolved" ? "text-success2" : "text-error"}>
            <ActivityIcon activity={activity} />
          </div>
          <span>{activity}</span>
        </div>
      )
    },
  }),

  // 3. Time Column
  columnHelper.accessor("timestamp", {
    id: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle whitespace-nowrap",
    },
    cell: ({ row }) => row.original.timestamp,
  }),


  // 5. Added by Column (Can render a string or an Avatar + User layout)
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
      const entry = row.original.addedBy

      if (typeof entry == "string") {
        return <span className="text-slate-600">{entry}</span>
      }

      return (
        <div className="flex items-center gap-2">
          {entry.avatarUrl ? (
            <img
              src={entry.avatarUrl}
              alt={entry.name}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold">
              {entry.name.charAt(0)}
            </div>
          )}
          <span className="font-medium">{entry.name}</span>
        </div>
      )
    },
  }),
  ...(tabValue === "Resolved"
  ? [
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
  : []),
  ...(tabValue === "Ongoing"
  ? [
    columnHelper.accessor("addedBy", {
      id: "actions",
      header: "Actions",
      meta: {
        headerClassName: "",
        cellClassName: "align-middle",
      },
      cell: ({ row }) => {
        const entry = row.original.addedBy

        if (typeof entry == "string") {
          return <div className="flex items-center">
            <div className="w-8.5 border-b-2 border-accent-foreground"></div>
          </div>
        }

        return (
          <div className="flex items-center gap-2">
            <button type="button" className="card-error px-4 py-1.25 text-error border rounded-[4px] text-xs">End Activity</button>
          </div>
        )
      },
    })
    ]
  : []),
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

    case "Pads replaced":
      return <ActivityIcons.padsReplaced className={baseClass} />

    case "Data retrieved":
      return <ActivityIcons.dataRetrived className={baseClass} />

    case "Battery replaced":
      return <ActivityIcons.batteryReplaced className={baseClass} />

    default:
      return <ActivityIcons.openDoor className={baseClass} />
  }
}