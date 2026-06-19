"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { settingMemberColumns } from "../components/settingMemberColumns";
import { querySettingsMembersPage } from "../server/querySettingsMembersPage";
import { SettingsMemberToolbar } from "./SettingsMemberToolbar";


const STATUS_FILTER_ALL = "all";
const TYPE_FILTER_ALL = "all";
const SORT_BY = "all";
const PAGE_SIZE = 8;

export default function MemberSetting() {
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
const pageResult = useMemo(() => querySettingsMembersPage({ // Use the members API endpoint/handler
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
const columns = useMemo(() => settingMemberColumns, []);

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
            <SettingsMemberToolbar
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
        <DataTable
            key="member-setting"
            table={table}
            emptyMessage="No data found"
            tableClassName="min-w-[920px] table-fixed"
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
