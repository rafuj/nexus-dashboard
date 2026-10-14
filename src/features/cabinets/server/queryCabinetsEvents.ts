import type { SortingState } from "@tanstack/react-table"
import type { EventStatus, CabinetEventRow } from "../types/eventList"
import type { DateRange } from "react-day-picker"

export type CabinetEventsQuery = {
  data: CabinetEventRow[]
  search: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
  tabValue: EventStatus
  group: string
  type: string
  dateRange: DateRange
}

export type CabinetActivitiesPageResult = {
  rows: CabinetEventRow[]
  totalCount: number
}

function filterActivities(
  rows: readonly CabinetEventRow[],
  search: string,
  group: string,
  type: string,
  dateRange: DateRange
): CabinetEventRow[] {
  const q = search.trim().toLowerCase();

  return rows.filter((row) => {
    if (group !== "all"  && row.group !== group) {
      return false
    }
    if (type !== "all" && row.event !== type) {
      return false
    }

    if (dateRange.from && dateRange.to) {
      const rowDate = new Date(row.time)
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      if (rowDate < fromDate || rowDate > toDate) {
        return false
      }
    }

    if (q) {
      const inCabinet = row?.cabinetName?.toLowerCase()?.includes(q);
      if (!inCabinet) {
        return false;
      }
    }

    return true;
  });
}

function compareRows(a: CabinetEventRow, b: CabinetEventRow, columnId: string): number {
  switch (columnId) {
    case "time":
      return a?.time?.localeCompare(b?.time)
    case "activity":
      return a?.event?.localeCompare(b?.event)
    case "cabinet":
      return a?.cabinetName?.localeCompare(b?.cabinetName)
    case "addedBy":
      return a?.addedBy?.localeCompare(b?.addedBy)
    case "notes": {
      const notesA = a.notes ?? ""
      const notesB = b.notes ?? ""
      return notesA.localeCompare(notesB)
    }
    default:
      return 0
  }
}

/**
 * Mock server-side list query handlers: filter → sort → paginate over activity feed.
 */
export function queryCabinetsEvents(query: CabinetEventsQuery): CabinetActivitiesPageResult {
  const filtered = filterActivities(
    query.data,
    query.search,
    query.group,
    query.type,
    query.dateRange
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