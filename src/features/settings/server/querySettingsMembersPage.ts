/**
 * Mock server-side list filtering and sorting for user dashboard members list.
 */
import type { SortingState } from "@tanstack/react-table"
import { membersData } from "../mock/settingsListData" // Your dataset array
import type { MemberRoleFilter, UserDashboardItem } from "../types/settingsList"

export type SettingsGroupQuery = {
  search: string
  statusFilter: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
  role: MemberRoleFilter
}

export type SettingsMembersPageResult = {
  rows: UserDashboardItem[]
  totalCount: number
}

/**
 * Filter members based on Name, Email, Phone, Title, or Group name.
 */

function filterMembers(
  rows: readonly UserDashboardItem[],
  search: string
): UserDashboardItem[] {
  const q = search.trim().toLowerCase()
  if (!q) return [...rows]

  return rows.filter((row) => {
    return (
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q) ||
      row.title.toLowerCase().includes(q) ||
      row.group.toLowerCase().includes(q)
    )
  })
}

/**
 * Type-safe sorting utility for UserDashboardItem primitive fields.
 */
function sortMembers(
  rows: UserDashboardItem[],
  sorting: SortingState
): UserDashboardItem[] {
  if (!sorting || sorting.length === 0) return rows

  const [{ id, desc }] = sorting

  return [...rows].sort((a, b) => {
    // Avoid sorting by complex/nested objects like 'notifications' directly
    if (id === "notifications") return 0

    let valueA = a[id as keyof UserDashboardItem]
    let valueB = b[id as keyof UserDashboardItem]

    // Normalize case-insensitive sorting for strings
    if (typeof valueA === "string" && typeof valueB === "string") {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    if (valueA === undefined || valueA === null) return desc ? 1 : -1
    if (valueB === undefined || valueB === null) return desc ? -1 : 1

    if (valueA < valueB) return desc ? 1 : -1
    if (valueA > valueB) return desc ? -1 : 1
    return 0
  })
}

/**
 * Mock server list processor strictly for Members (UserDashboardItem).
 */
export function querySettingsMembersPage(query: SettingsGroupQuery): SettingsMembersPageResult {
  // 1. Text Search Filtering
  let filtered = filterMembers(membersData, query.search)

  // 2. Exact Select Status Filter (e.g., 'Active' vs 'Suspended')
  if (query.statusFilter && query.statusFilter !== "all") {
    filtered = filtered.filter(
      (row) => row.status.toLowerCase() === query.statusFilter.toLowerCase()
    )
  }

  // 3. Exact Select Role Filter (e.g., 'admin', 'viewer', 'owner', 'super')
  if (query.role && query.role !== "all") {
    filtered = filtered.filter(
      (row) => row.role.toLowerCase() === query.role.toLowerCase()
    )
  }

  // 4. Sort Columns
  const sorted = sortMembers(filtered, query.sorting)

  // 5. Pagination Split
  const totalCount = sorted.length
  const start = query.pageIndex * query.pageSize
  const rows = sorted.slice(start, start + query.pageSize)

  return { rows, totalCount }
}