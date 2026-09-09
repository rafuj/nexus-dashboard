"use client";

import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronRight, PlusCircle } from "lucide-react";

import { CabinetsListToolbar } from "../components/CabinetsListToolbar";
import { cabinetListColumns } from "../components/cabinetsTableColumns";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { cn, formatISODate } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import { can, type Role } from "@/lib/permissions";
import { MANAGE_CABINETS } from "@/features/dashboard/mock/mockDashboardStats";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { FilterStatus } from "../types/cabinetList";
import { useCabinetsList } from "../hooks/useCabinetsList";
import { useDebounce } from "@/app/hooks/use-debounce";
import { queryCabinetsListPage } from "../server/queryCabinetsListPage";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { errorToast } from "@/lib/toast";
import { exportExcel } from "@/lib/exportExcel";


const STATUS_FILTER_ALL = "all";
const CITY_FILTER_ALL = "all";
const PAGE_SIZE = 12;
const filterStatuses = [
  "paused",
  "ok",
  "warning",
  "urgent",
  "all"
] as const satisfies readonly FilterStatus[];

export default function CabinetsListView() {
  const [search, setSearch] = useQueryState("search", { defaultValue:"" });
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsStringLiteral(filterStatuses).withDefault(STATUS_FILTER_ALL))
  const [city, setCity] = useQueryState("city", { defaultValue: CITY_FILTER_ALL });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const debouncedSearch = useDebounce(search, 400)
  const {
    data,
    isFetching,
    refetch,
  } = useCabinetsList({
    search: debouncedSearch,
    status: statusFilter,
    city,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sorting,
  })

  const { user } = useAuth();
  const role: Role = user?.role ?? "admin";
  const canManageCabinets = can(role, MANAGE_CABINETS)

    const pageResult = useMemo(
    () =>
      queryCabinetsListPage({
        search: debouncedSearch,
        statusFilter,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        city,
        data: data || []
      }),
    [
      debouncedSearch,
      statusFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      city,
      data
    ],
  );

  const columns = useMemo(() => cabinetListColumns(canManageCabinets), []);

  const resetPage = () => {
    setSearch("")
    setStatusFilter(STATUS_FILTER_ALL)
    setCity(CITY_FILTER_ALL)
    resetPagination()
  }
  const resetPagination = () => {
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }))
  }
  
  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable
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

    onSortingChange: (updater) => {
      setSorting(updater)
      resetPagination()
    },

    state: {
      pagination,
      sorting,
    },
  })

  const onRefresh = () => {
    refetch()
    resetPage()
  }

  const allData = useMemo(
    () =>
      queryCabinetsListPage({
        search: debouncedSearch,
        statusFilter,
        pageIndex: 0,
        pageSize: data?.length || 0,
        sorting,
        city,
        data: data || []
      }),
    [
      debouncedSearch,
      statusFilter,
      sorting,
      city,
      data
    ],
  );

  const exportList = () => {
    if (allData.rows.length === 0) {
      errorToast("No data available to export")
      return
    }
    const data = allData.rows.map((item) => ({
      "Cabinet Name": item.name,
      "City": item.city,
      "Zip Code": item.zipCode,
      "Street": item.street,
      "Number": item.number,
      "Last Update": formatISODate(item?.deviceState?.lastSeenAt || item?.createdAt),
      "Status": item.status.charAt(0).toUpperCase() + item.status.slice(1)
    }))
    exportExcel(data, "cabinet-list")
  }

  return (
    <>
      <Helmet>
        <title>Cabinets | Updaid</title>
      </Helmet>

      <main>
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Cabinets</h1>
                <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                  <li>Cabinets</li>
                  <li className="mx-2"><ChevronRight size={20} /></li>
                  <li className="text-accent-foreground">List</li>
                </ul>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5">
          <div className="flex flex-wrap md:flex-nowrap gap-5 items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              Overview of all cabinets in your network
            </h2>
            <div className="flex flex-wrap gap-2.5">
                <Link to="/cabinets/add" className="flex items-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                  <PlusCircle/> <span>Add Cabinet</span>
                </Link>
            </div>
          </div>
          <section aria-label="Cabinets">
            <div className="mb-2.5">
              <CabinetsListToolbar
                search={search}
                onSearchChange={(v) => {
                  setSearch(v);
                  resetPagination();
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(v) => {
                  setStatusFilter(v as FilterStatus);
                  resetPagination();
                }}
                city={city}
                onCityChange={(v) => {
                  setCity(v);
                  resetPagination()
                }}
                resetPage={resetPage}
                onRefresh={onRefresh}
                isFetching={isFetching}
                onExport={exportList}
              />
            </div>
            {(isFetching && !data) ? (
                <div className="p-5 bg-white border border-border rounded-md">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "bg-white border rounded-[10px] border-border py-5 px-4",
                  )}
                >
                  <h4 className="text-sm font-semibold mb-4">{pageResult.totalCount ?? 0} Cabinets</h4>
                  <DataTable
                    table={table}
                    emptyMessage="No cabinets match your filters."
                  />
                  <div className="border-border border-t px-4 py-3">
                    <DataTablePagination
                      table={table}
                      navLabel="Cabinets table pagination"
                    />
                  </div>
                </div>
              )}
          </section>
        </div>
      </main>
    </>
  );
}
