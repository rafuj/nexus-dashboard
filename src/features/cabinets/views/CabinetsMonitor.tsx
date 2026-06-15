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
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { cn } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { CabinetsMonitorToolbar } from "../components/CabinetsMonitorToolbar";
import { cabinetsMonitorTableColumns } from "../components/cabinetsMonitorTableColumns";
import { queryCabinetsMonitorPage} from "../server/queryCabinetsMonitorPage";


const CITIES_FILTER_ALL = "all";
const STREETS_FILTER_ALL = "all";
const PAGE_SIZE = 8;

export default function CabinetsMonitor() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>(CITIES_FILTER_ALL);
  const [assetHealth, setAssetHealth] = useState<string>(STREETS_FILTER_ALL);
  const [doorStatus, setDoorStatus] = useState<string>(STREETS_FILTER_ALL);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "cabinet", desc: false },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const pageResult = useMemo(
    () =>
      queryCabinetsMonitorPage({
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      city,
      assetHealth,
      doorStatus
    ],
  );

  const columns = useMemo(() => cabinetsMonitorTableColumns, []);

  const resetPage = () =>
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }));

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
          <div className="flex flex-wrap md:flex-nowrap gap-5 items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              Monitor cabinet status in real time
            </h2>
          </div>
          <section aria-label="Cabinets">
            <div className="mb-2.5">
              <CabinetsMonitorToolbar
                onSearchChange={(v) => {
                  setSearch(v);
                  resetPage();
                }}
                {
                  ...{
                    search,
                    city,
                    setCity,
                    assetHealth,
                    setAssetHealth,
                    doorStatus,
                    setDoorStatus
                  }
                }
              />
            </div>
            <div
              className={cn(
                "bg-white border rounded-[10px] border-border py-5 px-4",
              )}
            >
              <h4 className="text-sm font-semibold mb-4">248 Cabinets</h4>
              <DataTable
                table={table}
                emptyMessage="No cabinets match your filters."
                tableClassName="min-w-[920px] table-fixed"
              />
              <div className="border-border border-t px-4 py-3">
                <DataTablePagination
                  table={table}
                  navLabel="Cabinets table pagination"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
