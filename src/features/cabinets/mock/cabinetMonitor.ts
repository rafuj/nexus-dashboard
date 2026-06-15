import type { CabinetMonitorProps } from "../types/cabinetMonitor";

export const mockCabinetData: CabinetMonitorProps[] = [
  {
    id: "Cabinet 001",
    cabinetName: "Cabinet 001",
    city: "Amsterdam",
    assetHealth: "Ok",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 21.3,
    lastUpdate: "May 16, 2025 / 13:20",
    healthTooltip: "All systems nominal"
  },
  {
    id: "Cabinet 002",
    cabinetName: "Cabinet 002",
    city: "Rotterdam",
    assetHealth: "Warning",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 28.7,
    lastUpdate: "May 16, 2025 / 13:18",
    healthTooltip: "Temperature rising fast"
  },
  {
    id: "Cabinet 003",
    cabinetName: "Cabinet 003",
    city: "Utrecht",
    assetHealth: "Urgent",
    assetPresence: "Missing",
    doorStatus: "Open",
    temperature: 32.5,
    lastUpdate: "May 16, 2025 / 12:44",
    healthTooltip: "Asset missing and door left open"
  },
  {
    id: "Cabinet 004",
    cabinetName: "Cabinet 004",
    city: "Delft",
    assetHealth: "Paused",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 19.8,
    lastUpdate: "May 16, 2025 / 12:20",
    healthTooltip: "Monitoring temporarily paused"
  },
  {
    id: "Cabinet 005",
    cabinetName: "Cabinet 005",
    city: "Amsterdam",
    assetHealth: "Ok",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 21.3,
    lastUpdate: "May 16, 2025 / 13:20",
    healthTooltip: "All systems nominal"
  },
  {
    id: "Cabinet 006",
    cabinetName: "Cabinet 006",
    city: "Rotterdam",
    assetHealth: "Warning",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 28.7,
    lastUpdate: "May 16, 2025 / 13:18",
    healthTooltip: "Temperature too high"
  },
  {
    id: "Cabinet 007",
    cabinetName: "Cabinet 007",
    city: "Utrecht",
    assetHealth: "Urgent",
    assetPresence: "Missing",
    doorStatus: "Open",
    temperature: 32.5,
    lastUpdate: "May 16, 2025 / 12:44",
    healthTooltip: "Critical security door open breach"
  },
  {
    id: "Cabinet 008",
    cabinetName: "Cabinet 008",
    city: "Delft",
    assetHealth: "Paused",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 19.8,
    lastUpdate: "May 16, 2025 / 12:20",
    healthTooltip: "Monitoring temporarily paused"
  },
  {
    id: "Cabinet 009",
    cabinetName: "Cabinet 009",
    city: "Rotterdam",
    assetHealth: "Warning",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 28.7,
    lastUpdate: "May 16, 2025 / 13:18",
    healthTooltip: "Approaching threshold temperature"
  },
  {
    id: "Cabinet 0010",
    cabinetName: "Cabinet 0010",
    city: "Utrecht",
    assetHealth: "Urgent",
    assetPresence: "Missing",
    doorStatus: "Open",
    temperature: 32.5,
    lastUpdate: "May 16, 2025 / 12:44",
    healthTooltip: "Hardware disconnected from hub"
  },
  {
    id: "Cabinet 0011",
    cabinetName: "Cabinet 0011",
    city: "Delft",
    assetHealth: "Paused",
    assetPresence: "Present",
    doorStatus: "Closed",
    temperature: 19.8,
    lastUpdate: "May 16, 2025 / 12:20",
    healthTooltip: "Monitoring temporarily paused"
  }
];