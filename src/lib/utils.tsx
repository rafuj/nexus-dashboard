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
type TargetFormat = "date" | "iso" | "yyyy-mm-dd";
export const convertDDMMYYYY = <T extends TargetFormat = "date">(
  dateVal?: string | Date | null,
  target: T = "date" as T
): (T extends "date" ? Date : string) | undefined => {
  if (!dateVal) return undefined;

  let dateObj: Date | null = null;

  // Case 1: Value is already a Date object
  if (dateVal instanceof Date) {
    dateObj = isNaN(dateVal.getTime()) ? null : dateVal;
  } 
  // Case 2: Value is a DD-MM-YYYY string format
  else if (typeof dateVal === "string" && dateVal.includes("-")) {
    const parts = dateVal.split("-");
    
    // Check if it matches DD-MM-YYYY (3 parts)
    if (parts.length === 3 && parts[0].length <= 2) {
      const [day, month, year] = parts.map(Number);
      if (day && month && year) {
        // Months are 0-indexed in JS (August = 7)
        dateObj = new Date(year, month - 1, day);
      }
    } else {
      // Fallback for standard ISO string formats (YYYY-MM-DD)
      const parsed = new Date(dateVal);
      dateObj = isNaN(parsed.getTime()) ? null : parsed;
    }
  }

  // Return undefined if date parsing failed
  if (!dateObj || isNaN(dateObj.getTime())) return undefined;

  // Return requested target format
  switch (target) {
    case "iso":
      return dateObj.toISOString() as any;
    case "yyyy-mm-dd":
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}` as any;
    case "date":
    default:
      return dateObj as any;
  }
};
export const formatDateDDMMYYYY = (dateVal: Date) => {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return "";

  // Dynamic formatting using internationalization API
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Replaces default "/" separator dynamically with "-"
  return formatter.format(date).replace(/\//g, "-");
};