"use client";

import { useMemo, useState, useEffect } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { XCircle } from "lucide-react";

import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { SettingsToolbar } from "../components/SettingsToolbar";
import { querySettingsPage } from "@/features/settings/server/querySettingsPage";
import { settingGroupColumns } from "../components/settingGroupColumns";
import { Icons } from "@/app/icons/icons";

const STATUS_FILTER_ALL = "all";
const TYPE_FILTER_ALL = "all";
const SORT_BY = "all";
const PAGE_SIZE = 8;

const STORAGE_KEY = "group_notification_dismissed_until";
const DURATION_24_HOURS = 24 * 60 * 60 * 1000;

export default function GroupSettings() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>(STATUS_FILTER_ALL);
    const [typeFilter, setTypeFilter] = useState<string>(TYPE_FILTER_ALL);
    const [sortBy, setSortBy] = useState<string>(SORT_BY);
    const [sorting, setSorting] = useState<SortingState>([
      { id: "cabinet", desc: false },
    ]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: PAGE_SIZE,
    });


  // 1. Differentiate your server queries based on the active tab
  const pageResult = useMemo(() => querySettingsPage({
      search,
      statusFilter,
      typeFilter,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
    }), [
    search,
    statusFilter,
    typeFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  // 2. Select columns cleanly
  const columns = useMemo(() => settingGroupColumns, []);

  // 3. Feed the synchronized data and columns into the table
  const table = useReactTable({
    data: pageResult.rows,
    columns,
    rowCount: pageResult.totalCount,
    manualPagination: true,
    manualSorting: true,
    autoResetPageIndex: false,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
    },
  });
  return (
      <div>
        <div className="mb-3.5">
            <SettingsToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />
        </div>
        <NotificationBanner />
        <DataTable
            key="group-setting"
            table={table}
            emptyMessage="No data found"
        />
        <div className="border-border border-t px-4 py-3">
        <DataTablePagination
            table={table}
            navLabel="Cabinets table pagination"
        />
        </div>
    </div>
  );
}


function NotificationBanner() {
  const [isNotificationShow, setIsNotificationShow] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage on mount
    const dismissedUntil = localStorage.getItem(STORAGE_KEY);
    
    if (dismissedUntil) {
      const isExpired = Date.now() > Number(dismissedUntil);
      if (isExpired) {
        localStorage.removeItem(STORAGE_KEY); // Clean up expired key
        setIsNotificationShow(true);
      }
    } else {
      setIsNotificationShow(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsNotificationShow(false);
    
    // Set timestamp for 24 hours from now
    const dismissUntilTimestamp = Date.now() + DURATION_24_HOURS;
    localStorage.setItem(STORAGE_KEY, dismissUntilTimestamp.toString());
  };

  if (!isNotificationShow) return null;

  return (
    <div className="mb-5 mt-4.5 flex items-center p-3 sm:p-5 card-error border rounded-[10px] gap-3.75">
      <Icons.group />
      <div className="w-0 grow">
        <h5 className="text-sm font-semibold">
          Groups help you organise cabinets and target notifications.
        </h5>
        <div className="text-xs mt-1">
          Create group to easily manage, cabinets, assign members, and send relevant alerts.
        </div>
      </div>
      <div className="border-r h-10 border-card-error-stroke"></div>
      <button type="button" className="text-error" onClick={handleDismiss}>
        <XCircle />
      </button>
    </div>
  );
}