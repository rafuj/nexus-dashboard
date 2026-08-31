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
      return "paused"
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

  const hoursTaken = dayjs().diff(dayjs(takenAt), "hour", true);

  if (hoursTaken < 1) return "taken";
  if (hoursTaken < 6) return "warning";
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
      return "Asset taken <1 hour";

    case "warning":
      return "Asset taken for >1 hour";

    case "urgent":
      return "Asset taken for >6 hours";
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
  openedAt?: string | Date | null
): DoorStatus => {
  if (!openedAt) return "closed";

  const minutesOpen = dayjs().diff(dayjs(openedAt), "minute");

  if (minutesOpen < 30) return "open";
  if (minutesOpen < 60) return "warning";
  return "urgent";
};

export const getDoorBadgeClass = (openedAt?: string | Date | null) => {
  const status = getDoorStatus(openedAt);

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

export const getDoorStatusTooltip = (openedAt?: string | Date | null) => {
  const status = getDoorStatus(openedAt);

  switch (status) {
    case "closed":
      return "No attention needed";

    case "open":
      return "Door open <30 min";

    case "warning":
      return "Door open for >30 min";

    case "urgent":
      return "Door open for >1 hour";
  }
};

export const getDoorStatusTooltipClass = (
  openedAt?: string | Date | null
) => {
  const status = getDoorStatus(openedAt);

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

const HIGH_TEMPERATURE_LIMIT = 25
const LOW_TEMPERATURE_LIMIT = 20

export type TemperatureStatus = "ok" | "warning" | "urgent";
export type TemperatureState = {
  current: number;
  temperatureOutOfRangeSince: string | Date | null;
};

export const getTemperatureStatus = ({
  current,
  temperatureOutOfRangeSince,
}: TemperatureState): TemperatureStatus => {
  if (LOW_TEMPERATURE_LIMIT >= current && current >= HIGH_TEMPERATURE_LIMIT) return "ok";
  const hours = dayjs().diff(dayjs(temperatureOutOfRangeSince), "hour", true);

  if (hours < 1) return "ok";
  if (hours < 2) return "warning";
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

  if (status === "warning") {
    return data.current >= HIGH_TEMPERATURE_LIMIT
      ? "Temperature too high for >1 hour"
      : "Temperature too low for >1 hour";
  }

  return data.current >= HIGH_TEMPERATURE_LIMIT
    ? "Temperature too high for >2 hours"
    : "Temperature too low for >2 hours";
};



export const getOverallStatus = (cabinet: SmartCabinet) => {
  const assetTakenAt = cabinet.deviceState?.assetStateChangedAt;
  const assetPresent = cabinet.deviceState?.assetPresent;
  const doorOpen = cabinet.deviceState?.doorOpen;
  const temperature = cabinet.deviceState?.temperature;

  const temperatureOutOfRangeSince = new Date(); // data is not available now

  if (!cabinet.deviceState) {
    return "n/a"
  }
  
  if (cabinet?.status === "paused") {
    return "paused"
  }

  if (
    getPresenceStatus(assetPresent, assetTakenAt) === "urgent" ||
    doorOpen ||
    getTemperatureStatus({
      current: temperature,
      temperatureOutOfRangeSince,
    }) === "urgent"
  ) {
    return "urgent"
  }

  if (
    getTemperatureStatus({
      current: temperature,
      temperatureOutOfRangeSince,
    }) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "taken"
  ) {
    return "warning"
  }

  return "ok"
};
export const getOverallStatusBadgeClass = (cabinet: SmartCabinet) => {
  const assetTakenAt = cabinet.deviceState?.assetStateChangedAt;
  const assetPresent = cabinet.deviceState?.assetPresent;
  const doorOpen = cabinet.deviceState?.doorOpen;
  const temperature = cabinet.deviceState?.temperature;

  const temperatureOutOfRangeSince = new Date(); // data is not available now

  if (!cabinet.deviceState) {
    return getHealthBadgeClass("n/a")
  }
  
  if (cabinet?.status === "paused") {
    return getHealthBadgeClass("paused")
  }

  if (
    getPresenceStatus(assetPresent, assetTakenAt) === "urgent" ||
    doorOpen ||
    getTemperatureStatus({
      current: temperature,
      temperatureOutOfRangeSince,
    }) === "urgent"
  ) {
    return getHealthBadgeClass("urgent")
  }

  if (
    getTemperatureStatus({
      current: temperature,
      temperatureOutOfRangeSince,
    }) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "taken"
  ) {
    return getHealthBadgeClass("warning")
  }

  return getHealthBadgeClass("ok")
};
export const getOverallStatusCardClass = (cabinet: SmartCabinet) => {
  const assetTakenAt = cabinet.deviceState?.assetStateChangedAt;
  const assetPresent = cabinet.deviceState?.assetPresent;
  const doorOpen = cabinet.deviceState?.doorOpen;
  const temperature = cabinet.deviceState?.temperature;

  const temperatureOutOfRangeSince = new Date(); // data is not available now

  if (!cabinet.deviceState) {
    return getHealthBadgeClass("n/a")
  }
  
  if (cabinet?.status === "paused") {
    return getHealthBadgeClass("paused")
  }

  if (
    getPresenceStatus(assetPresent, assetTakenAt) === "urgent" ||
    doorOpen ||
    getTemperatureStatus({
      current: temperature,
      temperatureOutOfRangeSince,
    }) === "urgent"
  ) {
    return getHealthBadgeClass("urgent")
  }

  if (
    getTemperatureStatus({
      current: temperature,
      temperatureOutOfRangeSince,
    }) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "warning" ||
    getPresenceStatus(assetPresent, assetTakenAt) === "taken"
  ) {
    return getHealthBadgeClass("warning")
  }

  return getHealthBadgeClass("ok")
};