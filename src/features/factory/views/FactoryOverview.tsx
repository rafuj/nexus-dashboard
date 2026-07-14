import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { Input } from "@/shared/components/ui/input";
import { useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type PaginationState, type SortingState } from "@tanstack/react-table";
import { factoryOverviewColumns } from "../components/factoryOverviewColumns";
import { queryFactoryOverviewPage } from "../server/queryFactoryOverviewPage";
import { FactoryOverviewToolbar } from "../components/FactoryOverviewToolbar";
import type { DateRange } from "react-day-picker";

const PAGE_SIZE = 12

export default function FactoryOverview() {
  const [search, setSearch] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [linked, setLinked] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
      { id: "serialNumber", desc: false },
    ]);
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const today = new Date()
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: today
  });

  const columns = useMemo(() => factoryOverviewColumns(), []);


  const resetPage = () =>
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }));

  const pageResult = useMemo(
    () =>
      queryFactoryOverviewPage({
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        prefix,
        linked
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      prefix,
      linked
    ],
  );

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
                      setDateRange
                    }
                  } />
            </div>
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
          </div>
        </div>
      </main>
    </>
  );
}
