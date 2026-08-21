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
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { MemberRoleFilter } from "../types/settingsList";


const STATUS_FILTER_ALL = "all";
const ROLE_FILTER_ALL = "all";
const PAGE_SIZE = 8;
const roleTypes = [
  "editor",
  "admin",
  "viewer",
  "all",
] as const satisfies readonly MemberRoleFilter[];

export default function MemberSetting() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useQueryState("status", { defaultValue: STATUS_FILTER_ALL });
  const [roleFilter, setRoleFilter] = useQueryState("role", parseAsStringLiteral(roleTypes).withDefault(ROLE_FILTER_ALL));

  const [sorting, setSorting] = useState<SortingState>([
    { id: "cabinet", desc: false },
  ]);
  console.log(setSorting)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });


  // 1. Differentiate your server queries based on the active tab
  const pageResult = useMemo(() => querySettingsMembersPage({ 
      search,
      statusFilter,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      role: roleFilter
  }), [
    search,
    statusFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    roleFilter
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

  const resetPage = () => {
    setSearch("")
    setStatusFilter(STATUS_FILTER_ALL)
    setRoleFilter(ROLE_FILTER_ALL)
  }

  return (
    <div>
        <div className="mb-3.5">
            <SettingsMemberToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                roleFilter={roleFilter}
                setRoleFilter={(v)=> setRoleFilter(v as MemberRoleFilter)}
                resetPage={resetPage}
            />
        </div>
        <DataTable
            key="member-setting"
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
