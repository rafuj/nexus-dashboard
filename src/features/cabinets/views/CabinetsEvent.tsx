"use client";

import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronRight, PlusCircle, RotateCcw } from "lucide-react";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { cn, formatMonDayTime } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { CabinetsEventListToolbar } from "../components/CabinetsEventListToolbar";
import type { DateRange } from "react-day-picker";
import { cabinetsEventTableColumns } from "../components/cabinetsEventTableColumns";
import { queryCabinetsEvents } from "../server/queryCabinetsEvents";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { AddEventModal } from "./AddEventModal";
import type { EventStatus } from "../types/eventList";
import { mockCabinetIncidents } from "../mock/mockCabinetsActivity";
import { useEventsList } from "../hooks/useEventsList";
import { errorToast } from "@/lib/toast";
import { exportExcel } from "@/lib/exportExcel";
import { LoaderButton } from "@/app/components/loader-button";
import { Skeleton } from "@/shared/components/ui/skeleton";
const PAGE_SIZE = 8;

interface TabItem {
  label: string;
  value: EventStatus;
  count: number;
}


export default function CabinetsEvent() {
  const [search, setSearch] = useState("");
  const [cabinetGroup, setCabinetGroup] = useState<string>("all");
  const [eventType, setEventType] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openActivity, setOpenActivity] = useState<boolean>(false)
  const [isRefreshLoading, setIsRefreshLoading] = useState<boolean>(false)

  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  })
  const [now, setNow] = useState(new Date())
  const [tabValue, setTabValue] = useQueryState("tabs",   parseAsStringLiteral(["Resolved", "Ongoing", "Events"]).withDefault("Ongoing"))

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const {data:events, refetch, isFetching, isRefetching} = useEventsList({
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    // sort_by: "created_at",
    // sort_order: "desc",
    // cabinet_ids: cabinetGroup,
    type: eventType,
    // status: tabValue,
    // from_date: dateRange.from,
    // to_date: dateRange.to,
    search,
  })

  const tablist : TabItem[] = [
    {
      label:"Ongoing Incidents", 
      value:"Ongoing",
      count: 10
    }, 
    {
      label:"Resolved Incidents", 
      value:"Resolved",
      count: 10
    },
    {
      label:"Events", 
      value:"Events",
      count: events?.length || 0
    }
  ]

  const pageResult = useMemo(
    () =>
      queryCabinetsEvents({
        data: tabValue === "Events" ? (events||[]) : mockCabinetIncidents,
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        type: eventType,
        group: cabinetGroup,
        tabValue,
        dateRange
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      cabinetGroup,
      eventType,
      tabValue,
      events,
      dateRange
    ],
  );

  const columns = useMemo(() => cabinetsEventTableColumns(tabValue), [tabValue]);

  const resetPagination = () => {
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }));
  }
  const resetPage = () => {
    resetPagination()
    setSearch("")
    setCabinetGroup("all")
    setEventType("all")
    setDateRange({
      from: undefined,
      to: undefined
    })
  }

  useEffect(()=> {
    if(!isRefetching) {
      setIsRefreshLoading(false)
    }
  },[isRefetching])

  const onRefresh = () => {
    setIsRefreshLoading(true)
    resetPage()
    refetch()
    setNow(new Date())
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
      setSorting(updater);
      resetPage();
    },
    state: {
      pagination,
      sorting,
    },
  });


  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // change to true for AM/PM format
  })

  const allData = useMemo(
    () =>
      queryCabinetsEvents({
        data: tabValue === "Events" ? (events||[]) : mockCabinetIncidents,
        search,
        pageIndex: 0,
        pageSize: (tabValue === "Events" ? (events||[]).length : mockCabinetIncidents.length) || 0,
        sorting,
        type: eventType,
        group: cabinetGroup,
        tabValue,
        dateRange
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      cabinetGroup,
      eventType,
      tabValue,
      events,
      dateRange
    ],
  );

  const exportList = () => {
    if (allData.rows.length === 0) {
      errorToast("No data available to export")
      return
    }
    const incidents = allData.rows.map((item) => ({
      "Cabinet Name": item.cabinetName,
      "Group": "",
      "Incident": item.event,
      "Time": formatMonDayTime(item.time),
    }))
    const activities = allData.rows.map((item) => ({
      "Cabinet Name": item.cabinetName,
      "Group": "",
      "Event": item.event,
      "Time": formatMonDayTime(item.time),
      "Added by": item.addedBy,
      "Notes": item.notes,
    }))
    exportExcel(tabValue === "Events" ? activities : incidents, `cabinet-${tabValue.toLowerCase()}-list`)
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
                  <li className="text-accent-foreground">Tracking</li>
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
          <div className="flex flex-wrap md:flex-nowrap gap-5 items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              Cabinet incidents & events tracking
            </h2>
              <button className="flex items-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25" type="button" onClick={()=> setOpenActivity(true)}>
                <PlusCircle size={18} />
                <span>Add Event</span>
              </button>
          </div>
          <section aria-label="Cabinets Tracking">
            <div
              className={cn(
                "bg-white border rounded-[10px] border-border",
              )}
            >
              <div className="px-5">
                <ul className="flex flex-wrap text-sm 2xl:text-base select-none mb-5 border-b border-border max-md:py-4 gap-y-4">
                  {tablist.map((item:TabItem) => (
                    <li
                      key={item.value}
                      className={cn(
                        "cursor-pointer border-b-2 border-transparent px-2 pb-3 md:px-5 md:py-5 text-accent-foreground",
                        {
                          "border-primary font-semibold text-primary":
                            tabValue === item.value,
                        }
                      )}
                      onClick={() => {
                          setTabValue(item.value)
                          resetPage()
                        }
                      }
                    >
                      {item.label}
                      <span className={cn("ml-2 text-accent-foreground bg-chip py-1.25 px-3 rounded-full xl:min-w-12 inline-flex justify-center", {
                        "bg-primary text-white":
                            tabValue === item.value,
                      })}>{item.count}</span>
                    </li>
                  ))}
                  <li className="text-sm ml-auto self-center text-accent-foreground flex items-center gap-4 py-2">
                     <span>Last update: {formattedTime}</span>
                     <LoaderButton type="button" className="h-10 md:!h-12.5 py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm xl:px-7 text-white" onClick={onRefresh} loading={isRefreshLoading}>
                      <div className="flex items-center justify-center gap-1.25">
                        <RotateCcw size={16} /> <span>Refresh</span>
                      </div>
                    </LoaderButton>
                  </li>
                </ul>
              </div>
              <div className="px-5">
                <div className="pb-5">
                  <CabinetsEventListToolbar
                    onSearchChange={(v) => {
                      setSearch(v);
                      resetPagination()
                    }}
                    {
                      ...{
                        search,
                        eventType,
                        setEventType: (value)=>{
                          setEventType(value)
                          resetPagination()
                        },
                        cabinetGroup,
                        setCabinetGroup: (value) => {
                          setCabinetGroup(value)
                          resetPagination()
                        },
                        dateRange,
                        setDateRange: (value)=> {
                          setDateRange(value)
                          resetPagination()
                        },
                        onReset: resetPage,
                        onExport: exportList,
                      }
                    }
                  />
                </div>

                {(isFetching && !events) ? ( // will update when incidents apies are ready
                  <div className="pb-5">
                    <div className="flex flex-col gap-4 p-5 bg-white border border-border rounded-md">
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
                  <>
                    <DataTable
                      key={tabValue}
                      table={table}
                      emptyMessage="No cabinets match your filters."
                      />
                    <div className="border-border border-t px-4 py-3">
                      <DataTablePagination
                        key={tabValue}
                        table={table}
                        navLabel="Cabinets table pagination"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            {openActivity && <AddEventModal {
                ...{
                  open: openActivity,
                  setOpen: setOpenActivity
                }
              } /> }
          </section>
        </div>
      </main>
    </>
  );
}
