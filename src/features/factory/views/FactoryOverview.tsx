import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { cn, formatDateSlash } from "@/lib/utils";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type PaginationState } from "@tanstack/react-table";
import { linkedCombinationColumns } from "../components/linkedCombinationColumns";
import { queryFactoryOverviewPage } from "../server/queryFactoryOverviewPage";
import { FactoryOverviewToolbar } from "../components/FactoryOverviewToolbar";
import type { DateRange } from "react-day-picker";
import { useGeneratedSerialList } from "../hooks/useGeneratedSerialList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { exportExcel } from "@/lib/exportExcel";
import { errorToast } from "@/lib/toast";
import { parseAsStringEnum, useQueryState } from "nuqs"
import { FactoryInfoCards } from "../components/FactoryInfoCards";
import { availableSerialColumn } from "../components/availableSerialColumn";

const PAGE_SIZE = 10

export default function FactoryOverview() {
  const [search, setSearch] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("all");
  const [linked, setLinked] = useState<string>("all");

  const tablist = [
    {
      id: "linked",
      name: "Processed units",
    },
    {
      id: "available",
      name: "Available serial numbers",
    },
  ] as const

  const tabValues = tablist.map((tab) => tab.id)

  const [tabs, setTabs] = useQueryState(
    "tabs",
    parseAsStringEnum(tabValues).withDefault("linked")
  )
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const linkedColumns = useMemo(() => linkedCombinationColumns(), []);
  const availableColumns = useMemo(() => availableSerialColumn(), []);

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
        prefix,
        linked,
        dateRange: dateRange || null
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
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
    prefix: prefix || "all",
    linked: linked || "all",
    dateRange: dateRange || null
  }), [search, prefix, linked, data, dateRange])

  const exportList = () => {
    if(allData.rows.length === 0) {
      errorToast("No data available to export")
      return
    }
    const data = allData.rows.map((item) => ({
      "Serial Number": item.serialNumber,
      "Prefix": item.prefix || "NEX",
      "Generated On": formatDateSlash(item.createdAt),
      "Linked Status": item.deviceLinked ? "✓ Linked" : "✕ Unlinked"  ,
      "IMEI Number": item.imei || "N/A"
    }))
    exportExcel(data, "factory-overview")
  }
  

  const table = useReactTable({
    data: pageResult.rows,
    columns: tabs === "linked" ? linkedColumns : availableColumns,
    rowCount: pageResult.totalCount,
    manualPagination: true,
    autoResetPageIndex: false,
    enableSorting: false,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
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
                  {tabs === "linked" ? "View linked cabinet bodies, PCB enclosures and IMEI numbers." : "View generated NEX and UPD serial numbers not yet assigned."}
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
                    onExport: exportList,
                    tabs
                  }
                } />
            </div>

            <FactoryInfoCards tabs={tabs} />
            
            <div className="flex flex-wrap justify-between border-b-1 border-border">
              <ul className="flex text-[13px] select-none translate-y-[1px]">
                {
                  tablist.map(item=> <li key={item.id} className={cn("capitalize text-foreground px-2 sm:px-4 xl:px-6.5 border-b-2 border-transparent py-3 cursor-pointer font-Inter", {
                    "text-primary font-semibold border-primary": tabs === item.id
                  })} onClick={()=> {
                    setTabs(item.id)
                    resetPage()
                  }}>{item.name}</li> )
                }
              </ul>
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
                    key={tabs}
                  />
                  <div className="border-border border-t pt-4">
                    <DataTablePagination
                      table={table}
                      navLabel="Factory Serial Overview"
                      key={tabs}
                      resultSuffix={tabs === "linked" ? "processed units" : "available serial numbers"}
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
