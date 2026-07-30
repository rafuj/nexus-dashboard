import type { CabinetConnectionType, CabinetStatus } from "../types/cabinetList"

export function cabinetStatusLabel(status: CabinetStatus) {
  switch (status) {
    case "urgent":
      return "Active"
    case "ok":
      return "Active"
    case "warning":
      return "Active"
    case "paused":
      return "Paused"
    default :
      return status
  }
}

export function cabinetStatusBadgeClass(status: CabinetStatus) {
  switch (status) {
    case "urgent":
      return "bg-success"
    case "ok":
      return "bg-success"
    case "warning":
      return "bg-success"
    case "paused":
      return "bg-foreground"
    default :
      return "bg-error"
  }
}
export function statusBadgeColor(status: CabinetStatus) {
  switch (status) {
    case "urgent":
      return "text-success"
    case "ok":
      return "text-success"
    case "warning":
      return "text-success"
    case "paused":
      return "text-foreground"
    default :
      return "text-error"
  }
}

export function cabinetTypeLabel(type: CabinetConnectionType) {
  return type === "connected" ? "Connected" : "Non"
}
