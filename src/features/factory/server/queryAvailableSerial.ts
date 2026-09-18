import type { AvailableSerialNumbersRow } from "../types/factoryType"
import type { DateRange } from "react-day-picker"

export interface AvailableSerialQuery {
  search: string
  pageIndex: number
  pageSize: number
  type: string
  deviceModelId: string
  data: AvailableSerialNumbersRow[]
  dateRange: DateRange | null
}

export type AvailableSerialPageResult = {
  rows: AvailableSerialNumbersRow[]
  totalCount: number
}

function filterAvailableSerial(
  rows: readonly AvailableSerialNumbersRow[],
  search: string,
  type: string,
  deviceModelId: string,
  dateRange: DateRange | null
): AvailableSerialNumbersRow[] {
  const q = search.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesSearch =
      !q ||
      row.serialNumber.toLowerCase().includes(q) ||
      row.deviceModel?.modelName.toLowerCase().includes(q) ||
      row.type.toLowerCase().includes(q)

    const matchesType =
      !type ||
      type === "all" ||
      row.type === type

    const matchesDeviceModel =
      !deviceModelId ||
      deviceModelId === "all" ||
      row.deviceModel?.id === deviceModelId

    const createdAt = new Date(row.generatedAt)
    const from = dateRange?.from
      ? new Date(dateRange.from)
      : undefined

    const to = dateRange?.to
      ? new Date(dateRange.to)
      : undefined

    if (from) {
      from.setHours(0, 0, 0, 0)
    }

    if (to) {
      to.setHours(23, 59, 59, 999)
    }

    const matchesDate =
      (!from || createdAt >= from) &&
      (!to || createdAt <= to)

    return (
      matchesSearch 
      &&
      matchesDeviceModel 
      &&
      matchesType 
      &&
      matchesDate
    )
  })
}

/**
 * Mock “server” list: filter → sort → paginate over {@link mockFactoryList}.
 * Replace with a real `fetch()` when an API exists; keep the same result shape.
 */
export function queryAvailableSerial(query: AvailableSerialQuery): AvailableSerialPageResult {
  const filtered = filterAvailableSerial(
    query.data,
    query.search,
    query.type,
    query.deviceModelId,
    query?.dateRange
  )

  const sorted = [...filtered]

  const totalCount = sorted.length
  const start = query.pageIndex * query.pageSize
  const rows = sorted.slice(start, start + query.pageSize)

  return { rows, totalCount }
}
