import type { SortingState } from "@tanstack/react-table"
import type { CabinetMonitorProps } from "../types/cabinetMonitor"
import { mockCabinetData } from "../mock/cabinetMonitor"

export type CabinetsQuery = {
  search: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
}

export type CabinetsPageResult = {
  rows: CabinetMonitorProps[]
  totalCount: number
}

function filterCabinets(
  rows: readonly CabinetMonitorProps[],
  search: string,
): CabinetMonitorProps[] {
  const q = search.trim().toLowerCase()
  
  if (!q) return [...rows]

  return rows.filter((row) => {
    const inName = row.cabinetName.toLowerCase().includes(q)
    const inCity = row.city.toLowerCase().includes(q)
    const inHealth = row.assetHealth.toLowerCase().includes(q)
    const inPresence = row.assetPresence.toLowerCase().includes(q)
    const inDoor = row.doorStatus.toLowerCase().includes(q)
    
    // Convert temperature to string for textual search matching (e.g., searching "21")
    const inTemp = row.temperature.toString().includes(q)
    
    // Check optional tooltip text if it exists
    const inTooltip = row.healthTooltip ? row.healthTooltip.toLowerCase().includes(q) : false

    // Return true if it matches any of the fields
    return inName || inCity || inHealth || inPresence || inDoor || inTemp || inTooltip
  })
}

function compareRows(a: CabinetMonitorProps, b: CabinetMonitorProps, columnId: string): number {
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
    case "temperature":
      // Direct numeric subtraction for accurate temperature sorting
      return a.temperature - b.temperature 
    case "lastUpdate":
      return a.lastUpdate.localeCompare(b.lastUpdate)
    default:
      return 0
  }
}

/**
 * Mock server-side list query handlers: filter → sort → paginate over cabinet dataset.
 */
export function queryCabinetsMonitorPage(query: CabinetsQuery): CabinetsPageResult {
  const filtered = filterCabinets(
    mockCabinetData,
    query.search,
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