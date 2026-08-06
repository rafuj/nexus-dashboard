import type { SortingState } from "@tanstack/react-table"

import { mockCabinetActivities } from "../mock/mockCabinetsActivity"
import type { ActivityStatus, CabinetActivityRow } from "../types/activityList"

export type CabinetActivitiesQuery = {
  search: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
  status: ActivityStatus
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
  status: ActivityStatus,
): CabinetActivityRow[] {
  const q = search.trim().toLowerCase();

  return rows.filter((row) => {
    // Filter by tab status
    if (row.status !== status) {
      return false;
    }

    if (q) {
      const inCabinet = row.name.toLowerCase().includes(q);
      const inLocation = row.location.toLowerCase().includes(q);
      const inActivity = row.activity.toLowerCase().includes(q);

      const addedByName =
        typeof row.addedBy === "object"
          ? row.addedBy.name.toLowerCase()
          : row.addedBy.toLowerCase();

      const inAddedBy = addedByName.includes(q);
      const inNotes = row.notes
        ? row.notes.toLowerCase().includes(q)
        : false;

      if (
        !inCabinet &&
        !inLocation &&
        !inActivity &&
        !inAddedBy &&
        !inNotes
      ) {
        return false;
      }
    }

    return true;
  });
}

function compareRows(a: CabinetActivityRow, b: CabinetActivityRow, columnId: string): number {
  switch (columnId) {
    case "time":
      return a.timestamp.localeCompare(b.timestamp)
    case "activity":
      return a.activity.localeCompare(b.activity)
    case "cabinet":
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    case "location":
      return a.location.localeCompare(b.location, undefined, { sensitivity: "base" })
    case "addedBy": {
      const nameA = typeof a.addedBy === "object" ? a.addedBy.name : a.addedBy
      const nameB = typeof b.addedBy === "object" ? b.addedBy.name : b.addedBy
      return nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
    }
    case "status":
      return a.status.localeCompare(b.status)
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
    mockCabinetActivities,
    query.search,
    query.status
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