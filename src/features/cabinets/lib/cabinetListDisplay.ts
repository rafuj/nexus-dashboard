import type { CabinetConnectionType, CabinetStatus } from "../types/cabinetList"

export function cabinetStatusLabel(status: CabinetStatus) {
  switch (status) {
    case "active":
      return "Active"
    case "maintenance":
      return "Maintenance"
    case "offline":
      return "Offline"
  }
}

export function cabinetStatusBadgeClass(status: CabinetStatus) {
  switch (status) {
    case "active":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
    case "maintenance":
      return "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100"
    case "offline":
      return "border-border bg-muted text-muted-foreground"
  }
}

export function cabinetTypeLabel(type: CabinetConnectionType) {
  return type === "connected" ? "Connected" : "Non"
}
