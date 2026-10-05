import type { SortingState } from "@tanstack/react-table"
import type { ActivityStatus, CabinetActivityRow } from "../types/activityList"

export type CabinetActivitiesQuery = {
  data: CabinetActivityRow[]
  search: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
  tabValue: ActivityStatus
  activityType: string
  cabinetGroup: string
}

export type CabinetActivitiesPageResult = {
  rows: CabinetActivityRow[]
  totalCount: number
}

function filterActivities(
  rows: readonly CabinetActivityRow[],
  search: string,
): CabinetActivityRow[] {
  const q = search.trim().toLowerCase();

  return rows.filter((row) => {
    if (q) {
      const inCabinet = row?.cabinetName?.toLowerCase()?.includes(q);
      if (!inCabinet) {
        return false;
      }
    }

    return true;
  });
}

function compareRows(a: CabinetActivityRow, b: CabinetActivityRow, columnId: string): number {
  switch (columnId) {
    case "time":
      return a?.time?.localeCompare(b?.time)
    case "activity":
      return a?.activity?.localeCompare(b?.activity)
    case "cabinet":
      return a?.cabinetName?.localeCompare(b?.cabinetName)
    // case "addedBy": {
    //   const nameA = typeof a.addedBy === "object" ? a.addedBy.name : a.addedBy
    //   const nameB = typeof b.addedBy === "object" ? b.addedBy.name : b.addedBy
    //   return nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
    // }
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
export function queryCabinetsActivityPage(query: CabinetActivitiesQuery): CabinetActivitiesPageResult {
  const filtered = filterActivities(
    query.data,
    query.search
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