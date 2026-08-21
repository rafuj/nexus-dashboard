/**
 * Columns for the settings member list table.
 * Mapped according to the user management dashboard layout.
 */
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/shared/components/data-table"
import { cn } from "@/lib/utils"
import type { UserDashboardItem } from "../types/settingsList"
import { Icons } from "@/app/icons/icons"
import { MemberListRowActions } from "./MemberListRowActions"

const columnHelper = createColumnHelper<UserDashboardItem>()

export const settingMemberColumns = [
  // 1. Group Name Column (Displays Avatar, Name, and Title/Role description)
  columnHelper.accessor("name", {
    id: "groupName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group Name" />
    ),
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    enableSorting:false,
    cell: ({ row }) => (
      <div className="flex items-center gap-5">
        <img 
          src={row.original.avatarUrl} 
          alt={row.original.name} 
          className="h-10 w-10 rounded-full object-cover bg-background"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h6 className="truncate font-semibold text-xs">{row.original.name}</h6>
          <span className="truncate">{row.original.title}</span>
        </div>
      </div>
    ),
  }),

  // 2. Role Column
  columnHelper.accessor("role", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    enableSorting:false,
    meta: {
      headerClassName: "",
      cellClassName: "align-middle capitalize",
    },
    cell: ({ row }) => row.original.role,
  }),

  // 3. Phone / Email Column
  columnHelper.accessor("email", {
    id: "phoneEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone / Email" />
    ),
    enableSorting:false,
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5 text-accent-foreground">
        <span className="truncate">{row.original.email}</span>
        <span className="tabular-nums">{row.original.phone}</span>
      </div>
    ),
  }),

  // 4. Groups Column (Displays Badges for Group & Priority)
  columnHelper.accessor("group", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Groups" />
    ),
    enableSorting:false,
    meta: {
      headerClassName: "",
      cellClassName: "align-middle",
    },
    cell: ({ row }) => {
      const { group, priority } = row.original;
      
      // Dynamic styling matching the UI
      const groupBg = group === 'Amsterdam Offices' ? 'bg-purple-100 text-purple-700' 
                    : group === 'Rotterdam Retail' ? 'bg-card-warning text-warning' 
                    : 'bg-card-success text-success';

      const priorityBg = priority === 'High Priority' ? 'bg-card-error text-error' : 'bg-card-info text-info';

      return (
        <div className="flex items-center gap-2">
          <span className={cn("px-2.5 py-1 rounded", groupBg)}>
            {group}
          </span>
          <span className={cn("px-2.5 py-1 rounded", priorityBg)}>
            {priority}
          </span>
        </div>
      );
    },
  }),

  // 5. Notifications Column (Displays Mail/Chat icons or placeholders based on settings)
  columnHelper.accessor("notifications", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notifications" />
    ),
    enableSorting:false,
    meta: {
      headerClassName: "pl-7",
      cellClassName: "pl-7 align-middle",
    },
    cell: ({ row }) => {
      const { email, chat } = row.original.notifications;
      return (
        <div className="flex items-center gap-5">
          {email && (
            <button type="button">
              <Icons.mail />
            </button>
          )}
          {chat && (
            <button type="button">
              <Icons.messageSquare />
            </button>
          )}
        </div>
      );
    },
  }),

  // 6. Status Column
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "align-middle",
    },
    enableSorting:false,
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === "Active";

      return (
        <span className="flex items-center gap-1.5">
          <span className={cn("size-1 block rounded-full", {
            "bg-success":isActive,
            "bg-error":!isActive
          })}></span>
          <span className={cn("", {
            "text-success":isActive,
            "text-error":!isActive
          })}>{status}</span>
        </span>
      );
    },
  }),

  // 7. Actions Column
  columnHelper.display({
    id: "actions",
    header: "Action",
    enableSorting: false,
    meta: {
      headerClassName: "text-center w-[10%]",
      cellClassName: "text-center align-middle",
    },
    cell: () => <MemberListRowActions />,
  }),
]