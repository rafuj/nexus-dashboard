import type { SortingState } from "@tanstack/react-table"
import type { FilterStatus } from "../types/cabinetMonitor"
import type { SmartCabinet } from "../types/cabinetList"

export type CabinetsQuery = {
  search: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
  status: FilterStatus
  id: string,
  city: string
  data: SmartCabinet[]
}

export type CabinetsPageResult = {
  rows: SmartCabinet[]
  totalCount: number,
  status?: string | 'all'
}

export function filterCabinets(
  rows: readonly SmartCabinet[],
  search: string,
  status: string,
  id: string,
  city: string
): SmartCabinet[] {
  const q = search.trim().toLowerCase();
  const selectedStatus = status.trim().toLowerCase();
  const selectedId = id.trim();
  const selectedCity = city.trim().toLowerCase();

  return rows.filter((row) => {
    // Status filter
    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "all" ||
      row.status?.toLowerCase() === selectedStatus;

    // Cabinet ID filter
    const matchesId =
      !selectedId || row.id?.toString() === selectedId;

    // City filter
    const matchesCity =
      !selectedCity ||
      selectedCity === "all" ||
      row.city?.toLowerCase() === selectedCity;

    // Search query filter across text fields
    const matchesSearch =
      !q ||
      [
        row.name,
        row.city,
        row.zipCode,
        row.serialNumber,
        row.street,
        row.number,
        row.status,
      ].some((field) => field?.toLowerCase().includes(q));

    // Must satisfy all active filters
    return matchesStatus && matchesId && matchesCity && matchesSearch;
  });
}
function compareRows(a: SmartCabinet, b: SmartCabinet, columnId: string): number {
  switch (columnId) {
    case "name":
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
    case "city":
      return a.city.localeCompare(b.city, undefined, { sensitivity: "base" })
    case "zipCode":
      return a.zipCode?.localeCompare(b.zipCode, undefined, { sensitivity: "base" }) || 0
    case "street":
      return a.street?.localeCompare(b.street, undefined, { sensitivity: "base" }) || 0
    case "number":
      return a.number?.localeCompare(b.number, undefined, { sensitivity: "base" }) || 0
    case "status":
      return a.status?.localeCompare(b.status, undefined, { sensitivity: "base" }) || 0
    case "createdAt": 
      return a.createdAt.localeCompare(b.createdAt) // we need to change this later to last update
    default:
      return 0
  }
}

/**
 * Mock server-side list query handlers: filter → sort → paginate over cabinet dataset.
 */
export function queryCabinetsMonitorPage(query: CabinetsQuery): CabinetsPageResult {
  const filtered = filterCabinets(
    query.data,
    query.search,
    query.status,
    query.id,
    query.city
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