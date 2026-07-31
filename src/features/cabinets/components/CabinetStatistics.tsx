import { useMemo } from "react";
import { useParams } from "react-router";

import DoorIcon from "@/assets/icons/door.svg?react";
import AssetPresenceIcon from "@/assets/icons/asset-presence.svg?react";
import AssetHealthIcon from "@/assets/icons/asset-health.svg?react";
import TemperatureIcon from "@/assets/icons/temperature.svg?react";
import ConnectivityIcon from "@/assets/icons/connectivity.svg?react";

import { cn } from "@/lib/utils";
import { mockCabinetsList } from "../mock/mockCabinetsList";
import {
  getDoorBadgeClass,
  getHealthBadgeClass,
  getPresenceBadgeClass,
  getTemperatureChip,
  getTemperatureChipClass,
} from "./cabinetsMonitorTableColumns";

export const CabinetStatistics = () => {
  const { id } = useParams();

  const cabinet = useMemo(
    () => mockCabinetsList.find((item) => item.id === id),
    [id]
  );

  if (!cabinet) return null;

  const isPaused = cabinet.status === "paused";

  const cards = [
    {
      title: "Door",
      Icon: DoorIcon,
      badgeClass: getDoorBadgeClass(cabinet.doorStatus),
      value: cabinet.doorStatus,
    },
    {
      title: "Asset Presence",
      Icon: AssetPresenceIcon,
      badgeClass: getPresenceBadgeClass(cabinet.assetPresence),
      value: cabinet.assetPresence,
    },
    {
      title: "Asset Health",
      Icon: AssetHealthIcon,
      badgeClass: getHealthBadgeClass(cabinet.assetHealth),
      value: cabinet.assetHealth,
    },
    {
      title: "Connectivity",
      Icon: ConnectivityIcon,
      badgeClass:
        cabinet.type === "connected"
          ? "bg-card-success text-success"
          : "bg-card-error text-error",
      value:
        cabinet.type === "connected"
          ? "Connected"
          : "Not Connected",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 mb-3">
      {cards.map(({ title, Icon, badgeClass, value }) => (
        <div
          key={title}
          className="border p-3 bg-white rounded-[10px] text-center flex flex-col gap-2 items-center justify-center"
        >
          <div
            className={cn(
              "size-7 flex items-center justify-center rounded-full",
              isPaused ? getHealthBadgeClass("Paused") : badgeClass
            )}
          >
            <Icon />
          </div>

          <h6 className="text-xs font-semibold">{title}</h6>

          <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
              isPaused ? getHealthBadgeClass("Paused") : badgeClass
            )}
          >
            {isPaused ? "Paused" : value}
          </div>
        </div>
      ))}

      {/* Temperature */}
      <div className="border p-3 bg-white rounded-[10px] text-center flex flex-col gap-2 items-center justify-center">
        <div
          className={cn(
            "size-7 flex items-center justify-center rounded-full",
            isPaused
              ? getHealthBadgeClass("Paused")
              : getTemperatureChipClass(cabinet.temperature ?? 0)
          )}
        >
          <TemperatureIcon />
        </div>

        <h6 className="text-xs font-semibold">Temperature</h6>

        {isPaused ? (
          <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block",
              getHealthBadgeClass("Paused")
            )}
          >
            Paused
          </div>
        ) : (
          getTemperatureChip(
            cabinet.temperature ?? 0,
            "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block !min-w-0"
          )
        )}
      </div>
    </div>
  );
};