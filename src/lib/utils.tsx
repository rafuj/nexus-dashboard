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
import dayjs, { type ConfigType } from "dayjs"

import type { RecentActivityDefinition } from "@/features/dashboard/types/dashboardStats"
import type { SystemLogsDefinition } from "@/features/dashboard/types/dashboardStats"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatActivityDate(isoOrLocal: string) {
  return dayjs(isoOrLocal).format("MMM D, YYYY · h:mm A")
}

/** Formatting Date from ISO to a readable format */
export function formatISODate(isoOrLocal: string) {
  return dayjs(isoOrLocal).format("MMM D, YYYY / HH:mm")
}
/** Formatting Date from ISO to a readable format */
export function formatDateTime(isoOrLocal: string) {
  return dayjs(isoOrLocal).format("DD MMM YYYY, HH:mm");
}
/** Formatting Date from ISO to a readable format */
export function formatDateSlash(date?: ConfigType) {
  if (!date) return "";
  const d = dayjs(date);
  return d.isValid() ? d.format("DD/MM/YYYY") : "";
}

/** Get icon for recent activity or system logs based on the type */
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


export const removeEmptyValues = <T,>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(removeEmptyValues) as T;
  }

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, value]) => value !== "" && value !== null && value !== undefined)
        .map(([key, value]) => [key, removeEmptyValues(value)])
    ) as T;
  }

  return obj;
};