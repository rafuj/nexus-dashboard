import { Boxes, CircleCheck, Package, Wrench } from "lucide-react"

import type { DashboardStatDefinition, RecentActivityDefinition, SystemLogsDefinition } from "../types/dashboardStats"

/**
 * Placeholder numbers until the backend (or a real hook) supplies live stats.
 */
export const mockDashboardStats: DashboardStatDefinition[] = [
  {
    id: "total-cabinets",
    title: "Total Cabinets",
    value: "128",
    hint: "Registered in the fleet",
    icon: Boxes,
  },
  {
    id: "active-cabinets",
    title: "Active Cabinets",
    value: "112",
    hint: "Online and reporting",
    icon: CircleCheck,
  },
  {
    id: "maintenance-cabinets",
    title: "Cabinets in Maintenance",
    value: "9",
    hint: "Service or repair window",
    icon: Wrench,
  },
  {
    id: "assets-installed",
    title: "Assets Installed",
    value: "340",
    hint: "AEDs and modules tracked",
    icon: Package,
  },
];

export const mockRecentActivity: RecentActivityDefinition[] = [
  { id: "1", date: "2026-04-08 10:15",cabinetId: "C0000001", activity: "AED replaced in Cabinet", type: "aed" },
  { id: "2", date: "2026-04-08 09:40",cabinetId: "C0000002", activity: "Door opened", type: "door" },
  { id: "3", date: "2026-04-07 18:20",cabinetId: "C0000003", activity: "Maintenance mode enabled", type: "maintenance" },
  { id: "4", date: "2026-04-07 15:05",cabinetId: "C0000004", activity: "Temperature alert triggered", type: "temperature" },
]

export const mockSystemLogs: SystemLogsDefinition[] = [ 
  { id: "1", date: "2026-04-08 10:00", activity: "User John invited to tenant", type: "user" },
  { id: "2", date: "2026-04-08 09:20", activity: "New cabinet created (#D552)", type: "system" },
  { id: "3", date: "2026-04-07 17:10", activity: "Group 'Amsterdam Offices' created", type: "system" },
  { id: "4", date: "2026-04-07 14:30", activity: "User role updated (Admin → Viewer)", type: "system" },
]
