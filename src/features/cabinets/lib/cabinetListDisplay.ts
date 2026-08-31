import type { CabinetConnectionType, CabinetStatus } from "../types/cabinetList"
import dayjs from "dayjs";

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
    case "n/a":
      return "N/A"
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
    case "n/a":
      return "bg-foreground"
    default :
      return "bg-error"
  }
}
export function cabinetStatusSoftBadgeClass(status: CabinetStatus) {
  switch (status) {
    case "urgent":
      return "bg-card-error text-error"
    case "ok":
      return "bg-card-success text-success"
    case "warning":
      return "bg-card-warning text-warning"
    case "paused":
      return "bg-card-neutral text-accent-foreground"
    case "n/a":
      return "bg-card-neutral text-accent-foreground"
    default :
      return "bg-card-error text-error"
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
    case "n/a":
      return "text-foreground"
    default :
      return "text-error"
  }
}

export function cabinetTypeLabel(type: CabinetConnectionType) {
  return type === "connected" ? "Connected" : "Non"
}

// Asset Health
export const getHealthBadgeClass = (health: string = "Ok") => {
  switch (health) {
    case "Ok":
      return "bg-card-success text-success"
    case "Warning":
      return "bg-card-warning text-warning"
    case "Urgent":
      return "bg-card-error text-error"
    case "Paused":
      return "bg-card-neutral text-foreground" 
    case "n/a":
      return "bg-card-neutral text-foreground" 
    default:
      return "bg-card-neutral text-accent-foreground"
  }
}

export const getHealthBadgeTooltipColor = (health: string = "Ok") => {
  switch (health) {
    case "Ok":
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success"
    case "Warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning"
    case "Urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error"
    case "Paused":
      return "bg-card-neutral text-foreground [&_.arrow]:bg-card-neutral [&_.arrow]:fill-card-neutral" 
    case "n/a":
      return "bg-card-neutral text-foreground [&_.arrow]:bg-card-neutral [&_.arrow]:fill-card-neutral" 
    default:
      return "bg-neutral [&_.arrow]:bg-neutral [&_.arrow]:fill-neutral"
  }
}

export const getHealthTooltip = (health: string = "Ok") => {
  switch (health) {
    case "Warning":
      return "Expiration date(s) about to reach "
    case "Urgent":
      return "Expiration date(s) reached"
    // case "Paused":
    //   return "Asset in stress"
    default:
      return "No attention needed"
  }
}

// Asset Presence
type AssetPresenceStatus =
  | "Present"
  | "Taken"
  | "Warning"
  | "Urgent";

export const getPresenceStatus = (
  assetPresent: boolean,
  takenAt?: string | Date | null
): AssetPresenceStatus => {
  if (assetPresent) return "Present";

  const hoursTaken = dayjs().diff(dayjs(takenAt), "hour", true);

  if (hoursTaken < 1) return "Taken";
  if (hoursTaken < 6) return "Warning";
  return "Urgent";
};

export const getPresenceBadgeClass = (
  assetPresent: boolean,
  takenAt?: string | Date | null
) => {
  switch (getPresenceStatus(assetPresent, takenAt)) {
    case "Present":
      return "bg-card-success text-success";

    case "Taken":
    case "Warning":
      return "bg-card-warning text-warning";

    case "Urgent":
      return "bg-card-error text-error";
  }
};

export const getPresenceTooltip = (
  assetPresent:boolean,
  takenAt?: string | Date | null
) => {
  switch (getPresenceStatus(assetPresent, takenAt)) {
    case "Present":
      return "No attention needed";

    case "Taken":
      return "Asset taken <1 hour";

    case "Warning":
      return "Asset taken for >1 hour";

    case "Urgent":
      return "Asset taken for >6 hours";
  }
};

export const getPresenceTooltipClass = (
  assetPresent:boolean,
  takenAt?: string | Date | null
) => {
  switch (getPresenceStatus(assetPresent, takenAt)) {
    case "Present":
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success";

    case "Taken":
    case "Warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning";

    case "Urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error";
  }
};


// DoorStatus
type DoorStatus = "Closed" | "Open" | "Warning" | "Urgent";
export const getDoorStatus = (
  openedAt?: string | Date | null
): DoorStatus => {
  if (!openedAt) return "Closed";

  const minutesOpen = dayjs().diff(dayjs(openedAt), "minute");

  if (minutesOpen < 30) return "Open";
  if (minutesOpen < 60) return "Warning";
  return "Urgent";
};

export const getDoorBadgeClass = (openedAt?: string | Date | null) => {
  const status = getDoorStatus(openedAt);

  switch (status) {
    case "Closed":
      return "bg-card-success text-success";

    case "Open":
    case "Warning":
      return "bg-card-warning text-warning";

    case "Urgent":
      return "bg-card-error text-error";
  }
};

export const getDoorStatusTooltip = (openedAt?: string | Date | null) => {
  const status = getDoorStatus(openedAt);

  switch (status) {
    case "Closed":
      return "No attention needed";

    case "Open":
      return "Door open <30 min";

    case "Warning":
      return "Door open for >30 min";

    case "Urgent":
      return "Door open for >1 hour";
  }
};

export const getDoorStatusTooltipClass = (
  openedAt?: string | Date | null
) => {
  const status = getDoorStatus(openedAt);

  switch (status) {
    case "Closed":
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success";

    case "Open":
    case "Warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning";

    case "Urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error";
  }
};

const HIGH_TEMPERATURE_LIMIT = 25
const LOW_TEMPERATURE_LIMIT = 20

export type TemperatureStatus = "OK" | "Warning" | "Urgent";
export type TemperatureState = {
  current: number;
  temperatureOutOfRangeSince: string | Date | null;
};

export const getTemperatureStatus = ({
  current,
  temperatureOutOfRangeSince,
}: TemperatureState): TemperatureStatus => {
  if (LOW_TEMPERATURE_LIMIT >= current && current >= HIGH_TEMPERATURE_LIMIT) return "OK";
  const hours = dayjs().diff(dayjs(temperatureOutOfRangeSince), "hour", true);

  if (hours < 1) return "OK";
  if (hours < 2) return "Warning";
  return "Urgent";
};

export const getTemperatureTooltipClass = (data: TemperatureState) => {
  switch (getTemperatureStatus(data)) {
    case "Urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error";
    case "Warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning";
    default:
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success";
  }
};

export const getTemperatureBadgeClass = (data: TemperatureState) => {
  switch (getTemperatureStatus(data)) {
    case "Urgent":
      return "bg-card-error text-error";
    case "Warning":
      return "bg-card-warning text-warning";
    default:
      return "bg-card-success text-success";
  }
};

export const getTemperatureTooltip = (data: TemperatureState) => {
  const status = getTemperatureStatus(data);

  if (status === "OK") {
    return "No attention needed";
  }

  if (status === "Warning") {
    return data.current >= HIGH_TEMPERATURE_LIMIT
      ? "Temperature too high for >1 hour"
      : "Temperature too low for >1 hour";
  }

  return data.current >= HIGH_TEMPERATURE_LIMIT
    ? "Temperature too high for >2 hours"
    : "Temperature too low for >2 hours";
};
