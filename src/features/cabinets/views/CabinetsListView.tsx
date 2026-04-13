"use client"

import { useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { CabinetsListToolbar } from "../components/CabinetsListToolbar"
import { cabinetListColumns } from "../components/cabinetsTableColumns"
import { queryCabinetsListPage } from "../server/queryCabinetsListPage"
import { DataTable, DataTablePagination } from "@/shared/components/data-table"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/lib/utils"

const STATUS_FILTER_ALL = "all"
const TYPE_FILTER_ALL = "all"
const PAGE_SIZE = 5

export default function CabinetsListView() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_FILTER_ALL)
  const [typeFilter, setTypeFilter] = useState<string>(TYPE_FILTER_ALL)
  const [sorting, setSorting] = useState<SortingState>([
    { id: "cabinet", desc: false },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const pageResult = useMemo(
    () =>
      queryCabinetsListPage({
        search,
        statusFilter,
        typeFilter,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
      }),
    [search, statusFilter, typeFilter, pagination.pageIndex, pagination.pageSize, sorting]
  )

  const columns = useMemo(() => cabinetListColumns, [])

  const resetPage = () =>
    setPagination((p) => ({
      ...p,
      pageIndex: 0,
    }))

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
      setSorting(updater)
      resetPage()
    },
    state: {
      pagination,
      sorting,
    },
  })

  return (
    <>
      <Helmet>
        <title>Cabinets | Updaid</title>
      </Helmet>

      <div className="mx-auto max-w-[1600px] space-y-8 px-4 pb-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Cabinets</h1>
            <p className="text-muted-foreground text-sm">
              Search and filter your SmartCabinet fleet.
            </p>
          </div>
          <Button type="button" className="shrink-0 gap-1.5 self-start sm:self-auto">
            <Plus className="size-4" data-icon="inline-start" />
            Add cabinet
          </Button>
        </header>

        <section aria-label="Cabinets">
          <div
              className={cn(
                "bg-card ring-border/60 overflow-hidden rounded-xl shadow-none ring-1",
              )}
            >
              <div className="border-border/60 bg-muted/30 border-b p-4">
              <CabinetsListToolbar
                search={search}
                onSearchChange={(v) => {
                  setSearch(v)
                  resetPage()
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(v) => {
                  setStatusFilter(v)
                  resetPage()
                }}
                typeFilter={typeFilter}
                onTypeFilterChange={(v) => {
                  setTypeFilter(v)
                  resetPage()
                }}
              />
              </div>
              <DataTable
                table={table}
                emptyMessage="No cabinets match your filters."
                tableClassName="min-w-[920px] table-fixed"
              />
              <div className="border-border/60 bg-muted/20 border-t px-4 py-3">
                <DataTablePagination table={table} navLabel="Cabinets table pagination" />
              </div>
          </div>
        </section>
      </div>
    </>
  )
}
