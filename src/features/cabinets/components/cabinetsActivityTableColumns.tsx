/**
 * Columns for the cabinets activity log table.
 * Matches layout from image_6214cc.png.
 */
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/shared/components/data-table"
import { cn } from "@/lib/utils"
import type { CabinetActivityRow } from "../types/activityList"
import { ActivityIcons } from "@/app/icons/icons"

const columnHelper = createColumnHelper<CabinetActivityRow>()

// Helper for dynamic status colors according to image_6214cc.png
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-[#EDF7F0] text-success"
    case "Ongoing":
      return "bg-[#FDECEC] text-error"
    case "Done":
      return "bg-[#EDF7F0] text-success"
    default:
      return "bg-gray-50 text-accent-foreground"
  }
}

export const cabinetsActivityTableColumns = [
  // 1. Time Column
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
          <ActivityIcon activity={activity} />
          <span>{activity}</span>
        </div>
      )
    },
  }),

  // 3. Cabinet Code Column
  columnHelper.accessor("cabinetCode", {
    id: "cabinet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cabinet" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle tabular-nums",
    },
    cell: ({ row }) => row.original.cabinetCode,
  }),

  // 4. Location Column
  columnHelper.accessor("location", {
    id: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle text-slate-700",
    },
    cell: ({ row }) => row.original.location,
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

      if (typeof entry === "string") {
        return <span className="text-slate-600">{entry}</span>
      }

      return (
        <div className="flex items-center gap-2">
          {entry.avatarUrl ? (
            <img
              src={entry.avatarUrl}
              alt={entry.name}
              className="size-6 rounded-full object-cover"
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

  // 6. Status Column
  columnHelper.accessor("status", {
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <span
          className={cn(
            "px-2.5 py-1 rounded text-xs font-medium w-[84px] text-center block",
            getStatusBadgeClass(status)
          )}
        >
          {status}
        </span>
      )
    },
  }),

  // 7. Notes Column
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

      // If status is "Done" and string specifies "View notes", render it styled or as an action link
      if (notes === "View notes") {
        return (
          <button className="rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">
            View notes
          </button>
        )
      }

      return <span>{notes}</span>
    },
  }),
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