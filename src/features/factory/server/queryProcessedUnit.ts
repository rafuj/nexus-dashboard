import type { FactoryRow } from "../types/factoryType"
import type { DateRange } from "react-day-picker"

interface ProcessedUnitQuery {
  search: string
  pageIndex: number
  pageSize: number
  combination: string
  data: FactoryRow[]
  dateRange: DateRange | null
}

export type CabinetsListPageResult = {
  rows: FactoryRow[]
  totalCount: number
}

function filterFactoryRows(
  rows: readonly FactoryRow[],
  search: string,
  combination: string,
  dateRange: DateRange | null
): FactoryRow[] {
  const q = search.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesSearch =
      !q ||
      row.id.toLowerCase().includes(q) ||
      row.imei?.toLowerCase().includes(q) ||
      row.serialNumber.toLowerCase().includes(q)

    const matchesCombination =
      !combination ||
      combination === "all" ||
      row.combination === combination

    const createdAt = new Date(row.createdAt)

    const matchesDate =
      (!dateRange?.from || createdAt >= dateRange.from) &&
      (!dateRange?.to || createdAt <= dateRange.to)

    return (
      matchesSearch
      &&
      matchesCombination
      &&
      matchesDate
    )
  })
}

/**
 * Mock “server” list: filter → sort → paginate over {@link mockFactoryList}.
 * Replace with a real `fetch()` when an API exists; keep the same result shape.
 */
export function queryProcessedUnit(query: ProcessedUnitQuery): CabinetsListPageResult {
  const filtered = filterFactoryRows(
    query.data,
    query.search,
    query.combination,
    query?.dateRange
  )

  const sorted = [...filtered]

  const totalCount = sorted.length
  const start = query.pageIndex * query.pageSize
  const rows = sorted.slice(start, start + query.pageSize)

  return { rows, totalCount }
}
