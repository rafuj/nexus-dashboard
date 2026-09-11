import type { FactoryRow } from "../types/factoryType"
import type { DateRange } from "react-day-picker"

export type FactoryOverviewQuery = {
  search: string
  pageIndex: number
  pageSize: number
  prefix: string
  linked: string
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
  prefix: string,
  linked: string,
  dateRange: DateRange | null
): FactoryRow[] {
  const q = search.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesSearch =
      !q ||
      row.id.toLowerCase().includes(q) ||
      row.imei?.toLowerCase().includes(q) ||
      row.serialNumber.toLowerCase().includes(q)

    const matchesPrefix =
      !prefix ||
      prefix === "all" ||
      row.prefix === prefix

    const matchesLinked =
      linked === "all" ||
      (linked === "linked" && row.deviceLinked) ||
      (linked === "unlinked" && !row.deviceLinked)

    const createdAt = new Date(row.createdAt)

    const matchesDate =
      (!dateRange?.from || createdAt >= dateRange.from) &&
      (!dateRange?.to || createdAt <= dateRange.to)

    return (
      matchesSearch 
      &&
      matchesPrefix 
      &&
      matchesLinked 
      &&
      matchesDate
    )
  })
}

/**
 * Mock “server” list: filter → sort → paginate over {@link mockFactoryList}.
 * Replace with a real `fetch()` when an API exists; keep the same result shape.
 */
export function queryFactoryOverviewPage(query: FactoryOverviewQuery): CabinetsListPageResult {
  const filtered = filterFactoryRows(
    query.data,
    query.search,
    query.prefix,
    query.linked,
    query?.dateRange
  )

  const sorted = [...filtered]

  const totalCount = sorted.length
  const start = query.pageIndex * query.pageSize
  const rows = sorted.slice(start, start + query.pageSize)

  return { rows, totalCount }
}
