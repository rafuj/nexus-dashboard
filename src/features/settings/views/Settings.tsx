"use client";

import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { PlusCircle, XCircle } from "lucide-react";

import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { cn } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { SettingsToolbar } from "../components/SettingsToolbar";
import { querySettingsPage } from "@/features/settings/server/querySettingsPage";
import { settingGroupColumns } from "../components/settingGroupColumns";
import { useQueryState } from "nuqs";
import { Icons } from "@/app/icons/icons";


const STATUS_FILTER_ALL = "all";
const TYPE_FILTER_ALL = "all";
const SORT_BY = "all";
const PAGE_SIZE = 8;

export default function Settings() {
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

  const [tabValue, setTabValue] = useQueryState("tabs", {defaultValue:"group"})
  const tablist = ["group", "members"]

  const pageResult = useMemo(
    () =>
      querySettingsPage({
        search,
        statusFilter,
        typeFilter,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
      }),
    [
      search,
      statusFilter,
      typeFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
  );

  const columns = useMemo(() => settingGroupColumns, []);

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
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Settings</h1>
                <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                  <li>Manage groups and member preferences.</li>
                </ul>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
                <Link to="/cabinets/add" className="sm:hidden flex items-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                  <PlusCircle/> <span>Add Cabinet</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5">
          <section aria-label="Cabinets">
            <div
              className={cn(
                "bg-white border rounded-[10px] border-border pb-5 px-4",
              )}
            >
            <div className="mb-5 flex flex-wrap justify-between border-b-2 border-border">
              <ul className="flex text-base sm:text-lg md:text-2xl translate-y-[2px]">
                {
                  tablist.map(item=> <li key={item} className={cn("capitalize text-accent-foreground px-2 sm:px-4 xl:px-11 border-b-2 border-transparent py-5 sm:py-7 cursor-pointer", {
                    "text-primary font-semibold border-primary": tabValue === item
                  })} onClick={()=> setTabValue(item)}>{item}</li> )
                }
              </ul>
              <div className="flex items-center max-sm:flex-wrap gap-2.5 self-center">
                  <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                    <Icons.export /> <span>Export</span>
                  </button>
                <div className="max-sm:hidden">
                  <Link to="/cabinets/add" className="flex items-center bg-primary text-white py-2 px-3 md:py-3 md:px-5 rounded-full text-sm gap-1.25">
                    <PlusCircle/> <span>Add Cabinet</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mb-2.5">
              <SettingsToolbar
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
            {tabValue === 'group' &&
              <div className="mb-5 mt-4.5 flex items-center p-3 sm:p-5 card-error border rounded-[10px] gap-3.75">
                <Icons.group />
                <div className="w-0 grow">
                  <h5 className="text-sm font-semibold">Groups help you organise cabinets and target notifications.</h5>
                  <div className="text-xs mt-1">Create group to easily manage, cabinets, assign members, and send relevant alerts.</div>
                </div>
                <div className="border-r h-10 border-card-error-stroke"></div>
                <button type="button" className="text-error">
                  <XCircle />
                </button>
              </div>
            }
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
