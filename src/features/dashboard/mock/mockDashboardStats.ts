import type { DashboardStatDefinition, RecentActivityDefinition, SystemLogsDefinition } from "../types/dashboardStats"
import { Icons } from "@/app/icons/icons";

export const mockDashboardStats: DashboardStatDefinition[] = [
  {
    id: "total-cabinets",
    title: "Total Cabinets",
    value: "128",
    icon: Icons.cabinets,
    className: "card-info"
  },
  {
    id: "active-cabinets",
    title: "Ok",
    value: "112",
    icon: Icons.activeCabinets,
    className: "card-success"
  },
  {
    id: "maintenance-warning",
    title: "Warning",
    value: "9",
    icon: Icons.warning,
    className: "card-warning"
  },
  {
    id: "assets-urgent",
    title: "Urgent",
    value: "340",
    icon: Icons.urgent,
    className: "card-error"
  },
  {
    id: "assets-paused",
    title: "Paused",
    value: "3",
    icon: Icons.paused,
    className: "card-neutral"
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