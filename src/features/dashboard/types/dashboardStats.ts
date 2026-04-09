import type { LucideIcon } from "lucide-react"

/**
 * One tile on the dashboard summary row.
 * Values usually come from an API later; for now we use mock data.
 */
export type DashboardStatDefinition = {
  /** Stable key for lists / tests */
  id: string
  /** Short label shown above the number */
  title: string
  /** Main metric (count). Keep as string if you need formatting like "1.2k" */
  value: string
  /** Optional line under the value — trend, period, or short explanation */
  hint?: string
  icon: LucideIcon
}

/**
 * One item in the recent activity list.
 */
export type RecentActivityDefinition = {
  /** Stable key for lists / tests */
  id: string | number | undefined | null
  /** Date of the activity */
  date: string
  /** ID of the cabinet */
  cabinetId: string
  /** Description of the activity */
  activity: string
  /** Type of the activity — drives the icon from `getIcon` in the UI */
  type: "aed" | "door" | "maintenance" | "temperature" | "user" | "system"

}
/**
 * One item in the system logs list.
 */
export type SystemLogsDefinition = {
  /** Stable key for lists / tests */
  id: string | number | undefined | null
  /** Date of the activity */
  date: string
  /** Description of the activity */
  activity: string
  /** Type of the activity */
  type: "user" | "system"
}

