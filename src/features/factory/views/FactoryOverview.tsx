import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { cn, formatISODate } from "@/lib/utils";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type PaginationState } from "@tanstack/react-table";
import { linkedCombinationColumns } from "../components/linkedCombinationColumns";
import { queryProcessedUnit } from "../server/queryProcessedUnit";
import { FactoryOverviewToolbar } from "../components/FactoryOverviewToolbar";
import type { DateRange } from "react-day-picker";
import { useGeneratedSerialList } from "../hooks/useGeneratedSerialList";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { exportExcel } from "@/lib/exportExcel";
import { errorToast } from "@/lib/toast";
import { parseAsStringEnum, useQueryState } from "nuqs"
import { FactoryInfoCards } from "../components/FactoryInfoCards";
import { availableSerialColumn } from "../components/availableSerialColumn";
import { useAvailableSerialNumbers } from "../hooks/useAvailableSerialNumbers";
import { useDebounce } from "@/app/hooks/use-debounce";
import { queryAvailableSerial } from "../server/queryAvailableSerial";

const PAGE_SIZE = 10

export default function FactoryOverview() {
  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("all");
  const [deviceModelId, setDeviceModelId] = useState<string>("all");
  const [combination, setCombination] = useState<string>("all");

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

  const debouncedSearch = useDebounce(search, 400)
  const { data, isLoading } = useGeneratedSerialList()
  const { data: availableSerialData, isLoading: availableSerialDataIsLoading } = useAvailableSerialNumbers({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })


  const resetPage = () => {
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }))
    setSearch("")
    setType("all")
    setDeviceModelId("all")
    setCombination("all")
    setDateRange(undefined)
  }

  const processUnitResult = useMemo(
    () => queryProcessedUnit({
        data: data || [],
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        combination,
        dateRange: dateRange || null
      }), [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      combination,
      dateRange,
      data,
    ],
  );
  const availableSerialResult = useMemo(
    () => queryAvailableSerial({
        data: availableSerialData?.serialNumbers || [],
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        type,
        deviceModelId,
        dateRange: dateRange || null
    }), [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      type,
      deviceModelId,
      availableSerialData,
      dateRange
    ],
  );

  const availableAllData = useMemo(() => queryAvailableSerial({
    data: availableSerialData?.serialNumbers || [],
    search,
    pageIndex: 0,
    pageSize: availableSerialData?.serialNumbers.length || 0,
    type,
    deviceModelId,
    dateRange: dateRange || null
  }), [search, availableSerialData?.serialNumbers, dateRange, type, deviceModelId])

  const allData = useMemo(() => queryProcessedUnit({
    data: data || [],
    search: search,
    pageIndex: 0,
    pageSize: data?.length || 0,
    combination,
    dateRange: dateRange || null
  }), [search, data, dateRange, combination])

  const exportList = () => {
    if(tabs === "linked") {
      if(allData.rows.length === 0) {
        errorToast("No data available to export")
        return
      }
      const data = allData.rows.map((item) => ({
        "Combination": item.serialNumber,
        "NEX Code": item.nexCode,
        "UPD Code": item.updCode,
        "IMEI": item.imei,
        "Module Model": item.model,
        "Scanned at": formatISODate(item.createdAt),
      }))
      exportExcel(data, "processed-unit-export")
    }
    if(tabs === "available") {
      if(availableAllData.rows.length === 0) {
        errorToast("No data available to export")
        return
      }
      const data = availableAllData.rows.map((item) => ({
        "Serial Number": item.serialNumber,
        "Type": item.type,
        "Module model": item.deviceModel?.modelName,
        "Generated On": formatISODate(item.generatedAt)
      }))
      exportExcel(data, "available-serial")
    }
  }
  
  const processUnitTable = useReactTable({
    data: processUnitResult.rows,
    columns: linkedColumns,
    rowCount: processUnitResult.totalCount,
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

  const availableSerialTable = useReactTable({
    data: availableSerialResult.rows,
    columns: availableColumns,
    rowCount: availableSerialResult.totalCount,
    manualPagination: true,
    autoResetPageIndex: false,
    enableSorting: false,
    getRowId: (row) => row.serialNumber,
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
                    type,
                    setType,
                    combination,
                    setCombination,
                    deviceModelId,
                    setDeviceModelId,
                    dateRange,
                    setDateRange,
                    resetPage,
                    onExport: exportList,
                    tabs
                  }
                } />
            </div>

            <FactoryInfoCards tabs={tabs} data={{
              connectedNexus: "0",
              nonConnectedNexus: "0",
              seperatedModules: "0",
              totalAvailable: availableSerialData?.totalAvailable || "0",
              availableNexus: availableSerialData?.totalAvailableNex || "0",
              availableUPD: availableSerialData?.totalAvailableUpd || "0"
            }} />
            
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

            {(isLoading && !data && !availableSerialData && availableSerialDataIsLoading) ? (
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
                  {
                    tabs === "available" ? (
                      <>
                        <DataTable
                          table={availableSerialTable}
                          emptyMessage="No data match your filters."
                          tableClassName="text-accent-foreground"
                          key={tabs}
                        />
                        <div className="border-border border-t pt-4">
                          <DataTablePagination
                            table={availableSerialTable}
                            navLabel="Factory Serial Overview"
                            key={tabs}
                            resultSuffix="available serial numbers"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <DataTable
                          table={processUnitTable}
                          emptyMessage="No data match your filters."
                          tableClassName="text-accent-foreground"
                          key={tabs}
                        />
                        <div className="border-border border-t pt-4">
                          <DataTablePagination
                            table={processUnitTable}
                            navLabel="Factory Serial Overview"
                            key={tabs}
                            resultSuffix="processed units"
                          />
                        </div>
                      </>
                    )
                  }
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
