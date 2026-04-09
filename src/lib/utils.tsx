import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  ScanHeart,
  Wrench,
  Thermometer,
  UserPlus,
  Building2,
  ShieldCheck,
  LockOpen,
} from "lucide-react"
import dayjs from "dayjs"

import type { RecentActivityDefinition } from "@/features/dashboard/types/dashboardStats"
import type { SystemLogsDefinition } from "@/features/dashboard/types/dashboardStats"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Shared timestamp for dashboard activity tables */
export function formatActivityDate(isoOrLocal: string) {
  return dayjs(isoOrLocal).format("MMM D, YYYY · h:mm A")
}


export const getIcon = (type: RecentActivityDefinition["type"] | SystemLogsDefinition["type"]) => {
  switch (type) {
    case "aed":
      return <ScanHeart className="h-4 w-4" />
    case "door":
      return <LockOpen className="h-4 w-4 " />
    case "maintenance":
      return <Wrench className="h-4 w-4 " />
    case "temperature":
      return <Thermometer className="h-4 w-4 " />
    case "user":
      return <UserPlus className="h-4 w-4 " />
    case "system":
      return <ShieldCheck className="h-4 w-4" />
    default:
      return <Building2 className="h-4 w-4" />
  }
}