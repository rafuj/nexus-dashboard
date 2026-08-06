import type { ActivityDefination, DashboardStatDefinition, RecentActivityDefinition, SystemHelthDefination, SystemLogsDefinition } from "../types/dashboardStats"
import { Icons } from "@/app/icons/icons";

export const mockDashboardStats: DashboardStatDefinition[] = [
  {
    id: "total-cabinets",
    title: "Total Cabinets",
    value: "128",
    icon: Icons.cabinets,
    className: "card-info",
    url: "/cabinets/monitor?status=all",
  },
  {
    id: "active-cabinets",
    title: "Ok",
    value: "112",
    icon: Icons.activeCabinets,
    className: "card-success",
    url: "/cabinets/monitor?status=ok",
  },
  {
    id: "maintenance-warning",
    title: "Warning",
    value: "9",
    icon: Icons.warning,
    className: "card-warning",
    url: "/cabinets/monitor?status=warning",
  },
  {
    id: "assets-urgent",
    title: "Urgent",
    value: "340",
    icon: Icons.urgent,
    className: "card-error",
    url: "/cabinets/monitor?status=urgent",
  },
  {
    id: "assets-paused",
    title: "Paused",
    value: "3",
    icon: Icons.paused,
    className: "card-neutral",
    url: "/cabinets/monitor?status=paused",
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
export const systemHealthData: SystemHelthDefination[]  = [
  { id:"1", activity: "Connectivity", yes: "230", no: "10", icon: Icons.connectivity },
  { id:"2", activity: "Asset Present", yes: "200", no: "40", icon: Icons.asset },
  { id:"3", activity: "Door Closed", yes: "238", no: "2", icon: Icons.doorClosed },
  { id:"4", activity: "Temp. OK", yes: "231", no: "9", icon: Icons.temp},
  { id:"5", activity: "Maintenance up to date", yes: "218", no: "22", icon: Icons.maintenance }
];
// Recent Activity Data
export const recentActivityData: ActivityDefination[]  = [
  { id:"1", time: "13:42", action: "Cabinet opened", location: "Delft Station", icon: Icons.openCabinet },
  { id:"2", time: "13:39", action: "Alert resolved", location: "Amsterdam Zuid", icon: Icons.alertResolved },
  { id:"3", time: "13:21", action: "AED removed", location: "Rotterdam Office Park", icon: Icons.aedRemoved },
  { id:"4", time: "12:08", action: "Connectivity restored", location: "Utrecht Office (Lobby)", icon: Icons.connectivityRestored }
];