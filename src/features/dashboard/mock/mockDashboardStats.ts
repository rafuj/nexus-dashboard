import type { DashboardStatDefinition, RecentActivityDefinition, SystemHelthDefination, SystemLogsDefinition } from "../types/dashboardStats"
import { Icons } from "@/app/icons/icons";

export const mockDashboardStats = (data:any): DashboardStatDefinition[] => [
  {
    id: "total-cabinets",
    title: "Total Cabinets",
    value: data?.totalCabinets,
    icon: Icons.cabinets,
    className: "card-info",
    url: "/cabinets/status?status=all",
  },
  {
    id: "active-cabinets",
    title: "Ok",
    value: data?.okCabinets,
    icon: Icons.activeCabinets,
    className: "card-success",
    url: "/cabinets/status?status=ok",
  },
  {
    id: "maintenance-warning",
    title: "Warning",
    value: data?.warningCabinets,
    icon: Icons.warning,
    className: "card-warning",
    url: "/cabinets/status?status=warning",
  },
  {
    id: "assets-urgent",
    title: "Urgent",
    value: data?.urgentCabinets,
    icon: Icons.urgent,
    className: "card-error",
    url: "/cabinets/status?status=urgent",
  },
  {
    id: "assets-suspended",
    title: "Suspended",
    // value: data?.unknownCabinets,
    value: 0,
    icon: Icons.paused,
    className: "card-neutral",
    url: "/cabinets/status?status=suspended",
  },
];

export const mockRecentActivity: RecentActivityDefinition[] = [
  { id: "1", date: "2026-04-08 10:15", cabinetId: "C0000001", activity: "AED replaced in Cabinet", type: "aed" },
  { id: "2", date: "2026-04-08 09:40", cabinetId: "C0000002", activity: "Door opened", type: "door" },
  { id: "3", date: "2026-04-07 18:20", cabinetId: "C0000003", activity: "Maintenance mode enabled", type: "maintenance" },
  { id: "4", date: "2026-04-07 15:05", cabinetId: "C0000004", activity: "Temperature alert triggered", type: "temperature" },
]

export const mockSystemLogs: SystemLogsDefinition[] = [
  { id: "1", date: "2026-04-08 10:00", activity: "User John invited to tenant", type: "user" },
  { id: "2", date: "2026-04-08 09:20", activity: "New cabinet created (#D552)", type: "system" },
  { id: "3", date: "2026-04-07 17:10", activity: "Group 'Amsterdam Offices' created", type: "system" },
  { id: "4", date: "2026-04-07 14:30", activity: "User role updated (Admin → Viewer)", type: "system" },
]

export const HAS_CONNECTED_CABINETS = false

export const AVAILABLE_CREDITS: number = 50;

// permissions
export const MANAGE_CABINETS = "manage_cabinets"

// Sample Data mimicking the image
export const responders = [
  {
    name: "Emma de Vries",
    role: "Viewer",
    roleType: "viewer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    notifications: { email: true, chat: false }
  },
  {
    name: "Lucas Jansen",
    role: "Editor",
    roleType: "editor",
    avatar: null, // Shows fallback icon
    notifications: { email: true, chat: true }
  },
  {
    name: "Sophie Bakker",
    role: "Admin",
    roleType: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    notifications: { email: true, chat: true }
  },
  {
    name: "Noah Visser",
    role: "Viewer",
    roleType: "viewer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    notifications: { email: false, chat: true }
  },
  {
    name: "John Smith",
    role: "Editor",
    roleType: "editor",
    avatar: null,
    notifications: { email: false, chat: true }
  }
];

// System Helth Data
export const systemHealthData = (data:any): SystemHelthDefination[] => {

  return [
    { id:"2", activity: "Asset Missing", icon: Icons.asset, count: data?.systemHealth?.assetMissing || 0 },
    { id:"3", activity: "Doors Open", icon: Icons.doorClosed, count: data?.systemHealth?.doorsOpen || 0 },
    { id:"4", activity: "Temperatures Issues", icon: Icons.temp, count: data?.systemHealth?.temperatureIssues || 0 },
    { id:"5", activity: "Maintenance needed ", icon: Icons.maintenance, count: data?.maintenance?.overdue || 0 },
    { id:"1", activity: "Offline", icon: Icons.connectivity, count: data?.systemHealth?.offline || 0 },
  ]
}