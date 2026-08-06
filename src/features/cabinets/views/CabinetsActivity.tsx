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
import { cn } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { CabinetsActivityListToolbar } from "../components/CabinetsActivityListToolbar";
import type { DateRange } from "react-day-picker";
import { cabinetsActivityTableColumns } from "../components/cabinetsActivityTableColumns";
import { queryCabinetsActivityPage } from "../server/queryCabinetsActivityPage";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { mockCabinetActivities } from "../mock/mockCabinetsActivity";
import { AddActivityModal } from "./AddActivityModal";
import { EndActivityModal } from "./EndActivityModal";
const CABINET_FILTER_ALL = "all";
const ACTIVITY_FILTER_ALL = "all";
const PAGE_SIZE = 8;
export type TabValue = "Ongoing" | "Resolved";

interface TabItem {
  label: string;
  value: TabValue;
  count: number;
}


export default function CabinetsActivity() {
  const [search, setSearch] = useState("");
  const [cabinetGroup, setCabinetGroup] = useState<string>(CABINET_FILTER_ALL);
  const [activityType, setActivityType] = useState<string>(ACTIVITY_FILTER_ALL);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "cabinet", desc: false },
  ]);
  const [openActivity, setOpenActivity] = useState<boolean>(false)

  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: today
  })

  const tabCounts = useMemo(() => {
    return {
      Ongoing: mockCabinetActivities.filter(
        (item) => item.status === "Ongoing"
      ).length,
      Resolved: mockCabinetActivities.filter(
        (item) => item.status === "Resolved"
      ).length,
    };
  }, []);

  const tablist : TabItem[] = [
    {
      label:"Ongoing Activities", 
      value:"Ongoing",
      count: tabCounts.Ongoing
    }, 
    {
      label:"Resolved Activities", 
      value:"Resolved",
      count: tabCounts.Resolved
    }
  ]
  const [tabValue, setTabValue] = useQueryState("tabs",   parseAsStringLiteral(["Resolved", "Ongoing"]).withDefault("Ongoing"))

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const pageResult = useMemo(
    () =>
      queryCabinetsActivityPage({
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        activityType,
        cabinetGroup,
        status: tabValue
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      cabinetGroup,
      activityType,
      tabValue
    ],
  );

  const columns = useMemo(() => cabinetsActivityTableColumns(tabValue), [tabValue]);

  const resetPage = () => {
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }));
    setSearch("")
    setCabinetGroup(CABINET_FILTER_ALL)
    setActivityType(ACTIVITY_FILTER_ALL)
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
                  <li className="text-accent-foreground">Activity</li>
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
              Cabinet activity & maintenance tracking
            </h2>
              <button className="flex items-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25" type="button" onClick={()=> setOpenActivity(true)}>
                <PlusCircle size={18} />
                <span>Add Activity</span>
              </button>
          </div>
          <section aria-label="Cabinets Activity">
            <div
              className={cn(
                "bg-white border rounded-[10px] border-border",
              )}
            >
              <div className="px-5">
                <ul className="flex text-base select-none mb-5 border-b border-border">
                  {tablist.map((item) => (
                    <li
                      key={item.value}
                      className={cn(
                        "cursor-pointer border-b-2 border-transparent px-5 py-5 text-accent-foreground",
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
                      <span className={cn("ml-2 text-accent-foreground bg-chip py-1.75 px-3 rounded-full xl:min-w-15 inline-flex justify-center", {
                        "bg-primary text-white":
                            tabValue === item.value,
                      })}>{item.count}</span>
                    </li>
                  ))}
                  <li className="text-sm ml-auto self-center text-accent-foreground flex items-center gap-4">
                     <span>Last update: 13:58</span>
                     <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 xl:px-7">
                      <RotateCcw size={16} /> <span>Refresh</span>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="px-5">
                <div className="pb-5">
                  <CabinetsActivityListToolbar
                    onSearchChange={(v) => {
                      setSearch(v);
                    }}
                    {
                      ...{
                        search,
                        activityType,
                        setActivityType,
                        cabinetGroup,
                        setCabinetGroup,
                        dateRange,
                        setDateRange
                      }
                    }
                  />
                </div>
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
              </div>
            </div>
            <AddActivityModal {
                ...{
                  open: openActivity,
                  setOpen: setOpenActivity
                }
              } />
          </section>
        </div>
      </main>
    </>
  );
}
