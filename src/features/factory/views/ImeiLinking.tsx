import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { InfoIcon, RotateCcw, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import BoxIcons from "@/assets/icons/box-icons.svg?react"
import CheckCircleIcon from "@/assets/icons/check-circle.svg?react"
import CheckIcon from "@/assets/icons/check.svg?react"
import { cn } from "@/lib/utils";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { Input } from "@/shared/components/ui/input";
import { useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type PaginationState, type SortingState } from "@tanstack/react-table";
import { factoryColumns } from "../components/factoryColumns";
import { queryImeiLinkingPage } from "../server/queryImeiLinkingPage";
import { useGeneratedSerialList } from "../hooks/useGeneratedSerialList";

const PAGE_SIZE = 10;

export default function ImeiLinking() {
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
      { id: "serialNumber", desc: false },
    ]);
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  
  const columns = useMemo(() => factoryColumns(), []);

  const { data } = useGeneratedSerialList()

  const resetPage = () =>
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }));

  const pageResult = useMemo(
    () =>
      queryImeiLinkingPage({
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        data: data || []
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      data
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
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">IMEI</h1>
                <p className="text-xs lg:text-sm">
                  Scan the cabinet serial code and IMEI to link them automatically.
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
            {/* Cabinet Serial Number */}
            <div className="bg-white border rounded-[10px] border-border py-5 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cabinet Serial */}
                <div>
                  <div className="text-xs font-medium flex items-center gap-1 text-accent-foreground mb-2.5">
                    <span>Cabinet Serial Number</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={""}>
                          <InfoIcon size={16} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className={""}>
                        Cabinet Serial Number NEX - 00125
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="py-5.5 px-4 card-success2 border rounded-[10px]">
                    <div className="flex items-center gap-4.25 text-xl lg:text-2xl font-semibold">
                      <BoxIcons className="text-success2" />
                      <span className="text-accent-foreground">NEX - 00125</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold flex items-center justify-end text-success2 gap-1 mt-2.5">
                    <span>Scanned successfully</span>
                    <CheckCircleIcon />
                  </div>
                </div>
                {/* IMEI Number */}
                <div>
                  <div className="text-xs font-medium flex items-center gap-1 text-accent-foreground mb-2.5">
                    <span>IMEI Number</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={""}>
                          <InfoIcon size={16} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className={""}>
                        IMEI Number - 847394728949384
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="py-5.5 px-4 card-success2 border rounded-[10px]">
                    <div className="flex items-center gap-4.25 text-xl lg:text-2xl font-semibold">
                      <BoxIcons className="text-success2" />
                      <span className="text-accent-foreground">847394728949384</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold flex items-center justify-end text-success2 gap-1 mt-2.5">
                    <span>Scanned successfully</span>
                    <CheckCircleIcon />
                  </div>
                </div>
                {/* Linked Successfully */}
                <div className="md:col-span-2">
                  <div className="py-4 px-2.75 card-success2 border rounded-[10px] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-12.5 rounded-full bg-success2 text-white flex justify-center items-center shrink-0">
                        <CheckIcon />
                      </div>
                      <div className="text-success2">
                        <h6 className="font-semibold text-success2">Linked successfully</h6>
                        <div className="text-sm">
                          Cabinet serial <span className="font-bold">NEX-00125</span> has been linked to IMEI <span className="font-bold">847394728949384.</span>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="bg-white flex items-center gap-1.5 text-accent-foreground py-3.75 px-5 rounded-full text-sm">
                      <BoxIcons className="size-5" />
                      <span>Ready for next scan</span>
                    </button>
                  </div>
                  <div className="flex justify-end items-center text-xs font-semibold text-accent-foreground gap-2.5 mt-2.5">
                    Scanner Status:
                    <span className="flex items-center gap-1.25 text-success2"><span className="size-2.5 bg-success2 rounded-full"></span> Connected</span>
                  </div>
                  <div className="mt-3.75 flex flex-wrap gap-2.5">
                    <div className="grow border border-border rounded-[10px] text-base px-5 py-3 text-accent-foreground">
                      Counter: <span className="font-semibold">128</span>
                    </div>
                    <button type="button" className="flex items-center gap-1.25 text-accent-foreground text-sm bg-chip h-12.5 px-5 xl:px-6 rounded-full">
                      <RotateCcw size={16} />
                      <span>Reset Counter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
                className={cn(
                  "bg-white border rounded-[10px] border-border py-5 px-4",
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 pb-4 border-b">
                  <div>
                    <h6 className="font-semibold text-base">Recently Linked</h6>
                    <div className="text-sm">View recently linked IMEI numbers and cabinet serial numbers.</div>
                  </div>
                  <div>
                    <div className="relative max-w-[434px] ml-auto">
                      <Search
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        placeholder="Search serial number or IMEI..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 border border-border bg-white md:!h-12.5"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
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
