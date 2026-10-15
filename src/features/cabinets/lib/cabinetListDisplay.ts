import type { CabinetConnectionType, CabinetStatus, SmartCabinet } from "../types/cabinetList"
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
    case "suspended":
      return "Suspended"
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
    case "active":
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
    case "active":
      return "bg-card-success text-success"
    case "suspended":
      return "bg-foreground/20 text-foreground"
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
      return "text-error"
    case "ok":
      return "text-success"
    case "active":
      return "text-success"
    case "suspended":
      return "text-foreground/70"
    case "warning":
      return "text-warning"
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
export const getHealthBadgeClass = (health: string = "ok") => {
  switch (health) {
    case "ok":
      return "bg-card-success text-success"
    case "warning":
      return "bg-card-warning text-warning"
    case "urgent":
      return "bg-card-error text-error"
    case "paused":
      return "bg-card-neutral text-foreground" 
    case "n/a":
      return "bg-card-neutral text-foreground" 
    default:
      return "bg-card-neutral text-accent-foreground"
  }
}

export const getHealthBadgeTooltipColor = (health: string = "ok") => {
  switch (health) {
    case "ok":
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success"
    case "warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning"
    case "urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error"
    case "paused":
      return "bg-card-neutral text-foreground [&_.arrow]:bg-card-neutral [&_.arrow]:fill-card-neutral" 
    case "n/a":
      return "bg-card-neutral text-foreground [&_.arrow]:bg-card-neutral [&_.arrow]:fill-card-neutral" 
    default:
      return "bg-neutral [&_.arrow]:bg-neutral [&_.arrow]:fill-neutral"
  }
}

export const getHealthTooltip = (health: string = "ok") => {
  switch (health) {
    case "warning":
      return "Expiration date(s) about to reach "
    case "urgent":
      return "Expiration date(s) reached"
    // case "paused":
    //   return "Asset in stress"
    default:
      return "No attention needed"
  }
}

// Asset Presence
type AssetPresenceStatus =
  | "present"
  | "taken"
  | "warning"
  | "urgent";

export const getPresenceStatus = (
  assetPresent: boolean,
  takenAt?: string | Date | null
): AssetPresenceStatus => {
  if (assetPresent) return "present";

  const minutesTaken = dayjs().diff(dayjs(takenAt), "minutes", true);

  if (minutesTaken < 1) return "taken";
  if (minutesTaken < 10) return "warning";
  return "urgent";
};

export const getPresenceBadgeClass = (
  assetPresent: boolean,
  takenAt?: string | Date | null
) => {
  switch (getPresenceStatus(assetPresent, takenAt)) {
    case "present":
      return "bg-card-success text-success";

    case "taken":
    case "warning":
      return "bg-card-warning text-warning";

    case "urgent":
      return "bg-card-error text-error";
  }
};

export const getPresenceTooltip = (
  assetPresent:boolean,
  takenAt?: string | Date | null
) => {
  switch (getPresenceStatus(assetPresent, takenAt)) {
    case "present":
      return "No attention needed";

    case "taken":
      return "Asset taken <1 minute";

    case "warning":
      return "Asset taken for <10 minutes";

    case "urgent":
      return "Asset taken for >10 minutes";
  }
};

export const getPresenceTooltipClass = (
  assetPresent:boolean,
  takenAt?: string | Date | null
) => {
  switch (getPresenceStatus(assetPresent, takenAt)) {
    case "present":
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success";

    case "taken":
    case "warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning";

    case "urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error";
  }
};


// DoorStatus
type DoorStatus = "closed" | "open" | "warning" | "urgent";
export const getDoorStatus = (
  status: boolean,
  openedAt?: string | Date | null
): DoorStatus => {
  if (!status) return "closed";

  const minutesOpen = dayjs().diff(dayjs(openedAt), "minute");

  if (minutesOpen < 1) return "open";
  if (minutesOpen < 10) return "warning";
  return "urgent";
};

export const getDoorBadgeClass = (openStatus: boolean, openedAt?: string | Date | null) => {
  const status = getDoorStatus(openStatus, openedAt);

  switch (status) {
    case "closed":
      return "bg-card-success text-success";

    case "open":
    case "warning":
      return "bg-card-warning text-warning";

    case "urgent":
      return "bg-card-error text-error";
  }
};

export const getDoorStatusTooltip = (openStatus: boolean, openedAt?: string | Date | null) => {
  const status = getDoorStatus(openStatus, openedAt);

  switch (status) {
    case "closed":
      return "No attention needed";

    case "open":
      return "Door open <1 minutes";

    case "warning":
      return "Door open for <10 minutes";

    case "urgent":
      return "Door open for >10 minutes";
  }
};

export const getDoorStatusTooltipClass = (
  openStatus: boolean,
  openedAt?: string | Date | null
) => {
  const status = getDoorStatus(openStatus, openedAt);

  switch (status) {
    case "closed":
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success";

    case "open":
    case "warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning";

    case "urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error";
  }
};

const HIGH_TEMPERATURE_LIMIT = 50
const LOW_TEMPERATURE_LIMIT = -5

export type TemperatureStatus = "ok" | "warning" | "urgent";
export type TemperatureState = {
  current: number;
};

export const getTemperatureStatus = ({
  current,
}: TemperatureState): TemperatureStatus => {
  if (LOW_TEMPERATURE_LIMIT < current && current < HIGH_TEMPERATURE_LIMIT) return "ok";
  return "urgent";
};

export const getTemperatureTooltipClass = (data: TemperatureState) => {
  switch (getTemperatureStatus(data)) {
    case "urgent":
      return "bg-error [&_.arrow]:bg-error [&_.arrow]:fill-error";
    case "warning":
      return "bg-warning [&_.arrow]:bg-warning [&_.arrow]:fill-warning";
    default:
      return "bg-success [&_.arrow]:bg-success [&_.arrow]:fill-success";
  }
};

export const getTemperatureBadgeClass = (data: TemperatureState) => {
  switch (getTemperatureStatus(data)) {
    case "urgent":
      return "bg-card-error text-error";
    case "warning":
      return "bg-card-warning text-warning";
    default:
      return "bg-card-success text-success";
  }
};

export const getTemperatureTooltip = (data: TemperatureState) => {
  const status = getTemperatureStatus(data);

  if (status === "ok") {
    return "No attention needed";
  }
  return data.current > HIGH_TEMPERATURE_LIMIT
    ? "Temperature too high"
    : "Temperature too low";
};



export const getOverallStatus = (cabinet: SmartCabinet) => {
  const assetTakenAt = cabinet.deviceState?.assetStateChangedAt;
  const assetPresent = Boolean(cabinet.deviceState?.assetPresent);
  const doorStatus = getDoorStatus(cabinet.deviceState?.doorOpen, cabinet.deviceState?.doorStateChangedAt);
  const temperature = Number(cabinet.deviceState?.temperature);

  if (cabinet.assetHealth === "urgent") {
    return "urgent"
  }
  if (cabinet.assetHealth === "ok" && !cabinet.deviceState) {
    return "ok"
  }
  
  if (
    getPresenceStatus(assetPresent, assetTakenAt) === "urgent" ||
    doorStatus === "urgent" ||
    getTemperatureStatus({
      current: temperature
    }) === "urgent"
  ) {
    return "urgent"
  }

  if (
    getPresenceStatus(assetPresent, assetTakenAt) === "warning" ||
    doorStatus === "warning" ||
    doorStatus === "open" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "taken"
  ) {
    return "warning"
  }

  return "ok"
};
export const getOverallStatusBadgeClass = (cabinet: SmartCabinet) => {
  const assetTakenAt = cabinet?.deviceState?.assetStateChangedAt;
  const assetPresent = cabinet?.deviceState?.assetPresent;
  const doorStatus = getDoorStatus(cabinet?.deviceState?.doorOpen, cabinet?.deviceState?.doorStateChangedAt);
  const temperature = cabinet?.deviceState?.temperature;

  if (cabinet.assetHealth === "urgent") {
    return getHealthBadgeClass("urgent")
  }

  if (cabinet.assetHealth === "ok" && !cabinet.deviceState) {
    return getHealthBadgeClass("ok")
  }
  
  if (!cabinet?.deviceState) {
    return getHealthBadgeClass("n/a")
  }

  if (
    getPresenceStatus(assetPresent, assetTakenAt) === "urgent" ||
    doorStatus === 'urgent' ||
    getTemperatureStatus({
      current: temperature
    }) === "urgent"
  ) {
    return getHealthBadgeClass("urgent")
  }

  if (
    getTemperatureStatus({
      current: temperature
    }) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "warning" ||
    doorStatus === "warning" ||
    doorStatus === "open" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "taken"
  ) {
    return getHealthBadgeClass("warning")
  }

  return getHealthBadgeClass("ok")
};
export const getOverallStatusCardClass = (cabinet: SmartCabinet) => {
  const assetTakenAt = cabinet.deviceState?.assetStateChangedAt;
  const assetPresent = cabinet.deviceState?.assetPresent;
  const doorStatus = getDoorStatus(cabinet.deviceState?.doorOpen, cabinet.deviceState?.doorStateChangedAt);
  const temperature = cabinet.deviceState?.temperature;

  if (!cabinet.deviceState) {
    return getHealthBadgeClass("n/a")
  }
  
  if (cabinet?.status === "paused") {
    return getHealthBadgeClass("paused")
  }

  if (
    getPresenceStatus(assetPresent, assetTakenAt) === "urgent" ||
    doorStatus === 'urgent' ||
    getTemperatureStatus({
      current: temperature
    }) === "urgent"
  ) {
    return getHealthBadgeClass("urgent")
  }

  if (
    getTemperatureStatus({
      current: temperature
    }) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "taken" ||
    doorStatus === "warning" ||
    doorStatus === "open" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "taken"
  ) {
    return getHealthBadgeClass("warning")
  }

  return getHealthBadgeClass("ok")
};
