"use client";

import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronRight, PlusCircle, RotateCcw } from "lucide-react";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { cn, formatISODate } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { CabinetsMonitorToolbar } from "../components/CabinetsMonitorToolbar";
import { cabinetsMonitorTableColumns } from "../components/cabinetsMonitorTableColumns";
import { queryCabinetsMonitorPage} from "../server/queryCabinetsMonitorPage";
import { Icons } from "@/app/icons/icons";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import type { CabinetStatus } from "../types/cabinetList";
import { useSmartCabinetsList } from "../hooks/useSmartCabinetsList";
import { useDebounce } from "@/app/hooks/use-debounce";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { errorToast } from "@/lib/toast";
import { exportExcel } from "@/lib/exportExcel";


const CITY_FILTER_ALL = "all";
const STATUS_FILTER_ALL = "all";
const PAGE_SIZE = 12;
const filterStatuses = [
  "paused",
  "ok",
  "warning",
  "urgent",
  "all"
] as const satisfies readonly CabinetStatus[];

export default function CabinetsMonitor() {
  const [search, setSearch] = useQueryState("search", { defaultValue:"" });
  const [city, setCity] = useQueryState("city", { defaultValue: CITY_FILTER_ALL });
  const [status, setStatus] = useQueryState("status", parseAsStringLiteral(filterStatuses).withDefault(STATUS_FILTER_ALL))
  const [cabinetId, setCabinetId] = useQueryState("id", { defaultValue: "" })

  console.log("setCabinetId",setCabinetId)

  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const debouncedSearch = useDebounce(search, 400)
  const {
    data,
    isFetching
  } = useSmartCabinetsList({
    search: debouncedSearch,
    status,
    city,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sorting,
  })
  const pageResult = useMemo(
    () =>
      queryCabinetsMonitorPage({
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        status,
        id: cabinetId,
        city,
        data: data || []
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      city,
      status,
      cabinetId,
      data
    ],
  );

  const columns = useMemo(() => cabinetsMonitorTableColumns, []);

  const resetPage = () => {
    setSearch("")
    setCity(CITY_FILTER_ALL)
    setStatus(STATUS_FILTER_ALL)
    resetPagination()
  }
  const resetPagination = () => {
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }))
  }
  const refreshPage = () => {
    // Later this will just invalidate queryKeys
    setSearch("")
    setCity(CITY_FILTER_ALL)
    setStatus(STATUS_FILTER_ALL)
    resetPagination()
  }

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable
  const table = useReactTable({
    data: pageResult.rows,
    // data: data || [],
    columns,
    rowCount: pageResult.totalCount,
    manualPagination: true,
    manualSorting: true,
    autoResetPageIndex: false,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: (updater) => {
      setSorting(updater);
      resetPagination();
    },
    state: {
      pagination,
      sorting,
    },
  });



  const allData = useMemo(
    () =>
      queryCabinetsMonitorPage({
        search,
        pageIndex: 0,
        pageSize: data?.length || 0,
        sorting,
        status,
        id: cabinetId,
        city,
        data: data || []
      }),
    [
      search,
      sorting,
      city,
      status,
      cabinetId,
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
      "Asset Health": "Ok",
      "Asset Presence": "Taken",
      "Door Status": "Opened",
      "Temperature": "20",
      "Last Update": formatISODate(item?.deviceState?.lastSeenAt || item?.createdAt)
    }))
    exportExcel(data, "cabinet-monitor")
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
                  <li className="text-accent-foreground">Monitor</li>
                </ul>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
                <Link to="/cabinets/add" className="flex items-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                  <PlusCircle/> <span>Add Cabinet</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5">
          <div className="flex flex-wrap md:flex-nowrap gap-5 justify-between mb-5 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                Monitor cabinet status in current state
              </h2>
              <p className="text-xs m-0">Overall status uses the highest severity. Paused cabinets are not monitored.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 xl:px-7" onClick={refreshPage}>
                <RotateCcw size={16} /> <span>Refresh</span>
              </button>
              <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 xl:px-7" onClick={()=> exportList()}>
                <Icons.export /> <span>Export</span>
              </button>
            </div>
          </div>
          <section aria-label="Cabinets">
            <div className="mb-2.5">
              <CabinetsMonitorToolbar
                onSearchChange={(v) => {
                  setSearch(v);
                  resetPagination();
                }}
                {
                  ...{
                    search,
                    city,
                    setCity,
                    status,
                    setStatus,
                    resetPage,
                  }
                }
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
              <h4 className="text-sm font-semibold mb-4">{data?.length ?? 0} Cabinets</h4>
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
