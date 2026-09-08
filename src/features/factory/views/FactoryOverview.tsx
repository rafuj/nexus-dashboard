import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { cn, formatDateSlash } from "@/lib/utils";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type PaginationState, type SortingState } from "@tanstack/react-table";
import { factoryOverviewColumns } from "../components/factoryOverviewColumns";
import { queryFactoryOverviewPage } from "../server/queryFactoryOverviewPage";
import { FactoryOverviewToolbar } from "../components/FactoryOverviewToolbar";
import type { DateRange } from "react-day-picker";
import TagIcon from "@/assets/icons/tag.svg?react";
import LinkIcon from "@/assets/icons/link.svg?react";
import { useGeneratedSerialList } from "../hooks/useGeneratedSerialList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { exportSerialNumbersExcel } from "@/lib/exportExcel";
import { errorToast } from "@/lib/toast";

const PAGE_SIZE = 12

export default function FactoryOverview() {
  const [search, setSearch] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("all");
  const [linked, setLinked] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const columns = useMemo(() => factoryOverviewColumns(), []);

  const { data, isLoading } = useGeneratedSerialList()


  const resetPage = () => {
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }))
    setSearch("")
    setPrefix("all")
    setLinked("all")
    setDateRange(undefined)
  }

  const pageResult = useMemo(
    () =>
      queryFactoryOverviewPage({
        data: data || [],
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        prefix,
        linked,
        dateRange: dateRange || null
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      prefix,
      linked,
      data,
      dateRange
    ],
  );

  const allData = useMemo(() => queryFactoryOverviewPage({
    data: data || [],
    search: search || "",
    pageIndex: 0,
    pageSize: data?.length || 0,
    sorting: sorting,
    prefix: prefix || "all",
    linked: linked || "all",
    dateRange: dateRange || null
  }), [search, prefix, linked, data, dateRange, sorting])

  const exportList = () => {
    if(allData.rows.length === 0) {
      errorToast("No data available to export")
      return
    }
    const data = allData.rows.map((item) => ({
      "Serial Number": item.serialNumber,
      "Prefix": item.prefix || "NEX",
      "Generated On": formatDateSlash(item.createdAt),
      "Linked Status": item.deviceLinked ? "Linked" : "Unlinked",
      "IMEI Number": item.imei || "N/A"
    }))
    exportSerialNumbersExcel(data, "factory-overview")
  }
  

  const table = useReactTable({
    data: pageResult.rows,
    // data: data ?? [],
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
      resetPage();
    },
    state: {
      pagination,
      sorting,
    },
  });

  return (
    <>
      <Helmet>
        <title>IMEI Linking | Updaid</title>
      </Helmet>
      <main>
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Overview</h1>
                <p className="text-xs lg:text-sm">
                  View and manage all generated cabinet serial numbers.
                </p>
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
          <div className="space-y-5">
            <div className={cn(
                "bg-white border rounded-[10px] border-border p-4",
              )}>
                <FactoryOverviewToolbar {
                  ...{
                    search,
                    setSearch,
                    prefix,
                    setPrefix,
                    linked,
                    setLinked,
                    dateRange,
                    setDateRange,
                    resetPage,
                    onExport: exportList
                  }
                } />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <div className="py-4 px-3 rounded-[15px] card-info border flex items-center gap-2.5">
                  <div className="rounded-full bg-info text-white size-12.5 flex items-center justify-center">
                    <TagIcon />
                  </div>
                  <div className="w-0 grow">
                    <h5 className="font-semibold text-accent-primary">{data?.length}</h5>
                    <div className="text-sm">Total Generated</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="py-4 px-3 rounded-[15px] card-success2 border flex items-center gap-2.5">
                  <div className="rounded-full bg-success2 text-white size-12.5 flex items-center justify-center">
                    <LinkIcon />
                  </div>
                  <div className="w-0 grow">
                    <h5 className="font-semibold text-accent-primary">{data?.filter((item) => !item.deviceLinked).length}</h5>
                    <div className="text-sm">Unlinked</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="py-4 px-3 rounded-[15px] card-warning border flex items-center gap-2.5">
                  <div className="rounded-full bg-warning text-white size-12.5 flex items-center justify-center">
                    <LinkIcon />
                  </div>
                  <div className="w-0 grow">
                    <h5 className="font-semibold text-accent-primary">{data?.filter((item) => item.deviceLinked).length}</h5>
                    <div className="text-sm">Linked</div>
                  </div>
                </div>
              </div>
            </div>
            {(isLoading && !data) ? (
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
                    "bg-white border rounded-[10px] border-border p-4",
                  )}
                >
                  <DataTable
                    table={table}
                    emptyMessage="No cabinets match your filters."
                    tableClassName="text-accent-foreground"
                  />
                  <div className="border-border border-t pt-4">
                    <DataTablePagination
                      table={table}
                      navLabel="Cabinets table pagination"
                    />
                  </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
