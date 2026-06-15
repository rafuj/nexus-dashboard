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
      return "bg-success"
    case "maintenance":
      return "bg-warning"
    case "offline":
      return "bg-error"
  }
}
export function statusBadgeColor(status: CabinetStatus) {
  switch (status) {
    case "active":
      return "text-success"
    case "maintenance":
      return "text-warning"
    case "offline":
      return "text-error"
  }
}

export function cabinetTypeLabel(type: CabinetConnectionType) {
  return type === "connected" ? "Connected" : "Non"
}
