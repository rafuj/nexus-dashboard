import type { SortingState } from "@tanstack/react-table"
import type { FilterStatus } from "../types/cabinetMonitor"
import type { Cabinet } from "../types/cabinetList"
import { mockCabinetsList } from "../mock/mockCabinetsList"

export type CabinetsQuery = {
  search: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
  status: FilterStatus
  id: string
}

export type CabinetsPageResult = {
  rows: Cabinet[]
  totalCount: number,
  status?: string | 'all'
}

export function filterCabinets(
  rows: readonly Cabinet[],
  search: string,
  status: string,
  id: string
): Cabinet[] {
  const q = search.trim().toLowerCase();
  const selectedStatus = status.trim().toLowerCase();
  const selectedId = id.trim();

  return rows.filter((row) => {
    // Status filter
    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "all" ||
      row.status.toLowerCase() === selectedStatus;

    // Cabinet ID filter
    const matchesId =
      !selectedId || row.id.toString() === selectedId;

    // If there's no search query, only apply status and ID filters
    if (!q) {
      return matchesStatus && matchesId;
    }

    // Search filter
    const matchesSearch =
      row.cabinetName.toLowerCase().includes(q) ||
      row.city.toLowerCase().includes(q) ||
      row.assetHealth.toLowerCase().includes(q) ||
      row.assetPresence.toLowerCase().includes(q) ||
      row.doorStatus.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      (row.healthTooltip?.toLowerCase().includes(q) ?? false);

    // Must satisfy all active filters
    return matchesSearch && matchesStatus && matchesId;
  });
}

function compareRows(a: Cabinet, b: Cabinet, columnId: string): number {
  switch (columnId) {
    case "cabinetName":
      return a.cabinetName.localeCompare(b.cabinetName, undefined, { numeric: true, sensitivity: "base" })
    case "city":
      return a.city.localeCompare(b.city, undefined, { sensitivity: "base" })
    case "assetHealth":
      return a.assetHealth.localeCompare(b.assetHealth)
    case "assetPresence":
      return a.assetPresence.localeCompare(b.assetPresence)
    case "doorStatus":
      return a.doorStatus.localeCompare(b.doorStatus)
    case "lastActivityAt":
      return a.lastActivityAt.localeCompare(b.lastActivityAt)
    default:
      return 0
  }
}

/**
 * Mock server-side list query handlers: filter → sort → paginate over cabinet dataset.
 */
export function queryCabinetsMonitorPage(query: CabinetsQuery): CabinetsPageResult {
  const filtered = filterCabinets(
    mockCabinetsList,
    query.search,
    query.status,
    query.id
  )

  const sorted = [...filtered]
  const sort = query.sorting[0]
  if (sort) {
    sorted.sort((a, b) => {
      const cmp = compareRows(a, b, sort.id)
      return sort.desc ? -cmp : cmp
    })
  }

  const totalCount = sorted.length
  const start = query.pageIndex * query.pageSize
  const rows = sorted.slice(start, start + query.pageSize)

  return { rows, totalCount }
}