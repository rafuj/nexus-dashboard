import { useMemo } from "react";
import { useParams } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import DoorIcon from "@/assets/icons/door.svg?react";
import AssetPresenceIcon from "@/assets/icons/asset-presence.svg?react";
import AssetHealthIcon from "@/assets/icons/asset-health.svg?react";
import TemperatureIcon from "@/assets/icons/temperature.svg?react";
import ConnectivityIcon from "@/assets/icons/connectivity.svg?react";

import { cn } from "@/lib/utils";
import { mockCabinetsList } from "../mock/mockCabinetsList";
import {
  getTemperatureChip
} from "./cabinetsMonitorTableColumns";
import { getDoorBadgeClass, getDoorStatus, getDoorStatusTooltip, getDoorStatusTooltipClass, getHealthBadgeClass, getHealthBadgeTooltipColor, getHealthTooltip, getPresenceBadgeClass, getPresenceStatus, getPresenceTooltip, getPresenceTooltipClass, getTemperatureBadgeClass, getTemperatureTooltip, getTemperatureTooltipClass } from "../lib/cabinetListDisplay";

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
      badgeClass: getDoorBadgeClass(cabinet.doorOpenedAt),
      value: <Tooltip>
            <TooltipTrigger className="w-full">
              <span
                className={cn(
                  "px-3 py-1 rounded-[4px] text-xs w-full text-center block transition-all",
                  getDoorBadgeClass(cabinet.doorOpenedAt)
                )}
              >
                {getDoorStatus(cabinet.doorOpenedAt)}
              </span>
            </TooltipTrigger>
              <TooltipContent side="right" className={cn(getDoorStatusTooltipClass(cabinet.doorOpenedAt))}>
                {getDoorStatusTooltip(cabinet.doorOpenedAt)}
              </TooltipContent>
          </Tooltip>
    },
    {
      title: "Asset Presence",
      Icon: AssetPresenceIcon,
      badgeClass: getPresenceBadgeClass(cabinet.assetTakenAt),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                <span
                  className={cn(
                    "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
                    getPresenceBadgeClass(cabinet.assetTakenAt)
                  )}
                >
                  {getPresenceStatus(cabinet.assetTakenAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(getPresenceTooltipClass(cabinet.assetTakenAt))}>
                {getPresenceTooltip(cabinet.assetTakenAt)}
              </TooltipContent>
            </Tooltip>
    },
    {
      title: "Asset Health",
      Icon: AssetHealthIcon,
      badgeClass: getHealthBadgeClass(cabinet.assetHealth),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                <span
                    className={cn(
                      "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
                      getHealthBadgeClass(cabinet.assetHealth)
                    )}
                  >
                    {cabinet.assetHealth}
                  </span>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(getHealthBadgeTooltipColor(cabinet.assetHealth))}>
                {getHealthTooltip(cabinet.assetHealth)}
              </TooltipContent>
            </Tooltip>
    },
    {
      title: "Temperature",
      Icon: TemperatureIcon,
      badgeClass: getTemperatureBadgeClass({current: cabinet.temperature, temperatureOutOfRangeSince: cabinet.temperatureOutOfRangeSince}),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                {getTemperatureChip({current: cabinet.temperature, temperatureOutOfRangeSince: cabinet.temperatureOutOfRangeSince}, "w-full")}
              </TooltipTrigger>
                <TooltipContent side="right" className={cn(getTemperatureTooltipClass({current: cabinet.temperature, temperatureOutOfRangeSince: cabinet.temperatureOutOfRangeSince}))}>
                  {getTemperatureTooltip({current: cabinet.temperature, temperatureOutOfRangeSince: cabinet.temperatureOutOfRangeSince})}
                </TooltipContent>
            </Tooltip>
    },
    {
      title: "Connectivity",
      Icon: ConnectivityIcon,
      badgeClass: cabinet.type === "connected"
          ? "bg-card-success text-success"
          : "bg-card-error text-error",
      value: <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
              cabinet.type === "connected"
                ? "bg-card-success text-success"
                : "bg-card-error text-error"
            )}
          >
            {cabinet.type === "connected"
              ? "Connected"
              : "Not Connected"}
          </div>
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

          {isPaused ? <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
              isPaused ? getHealthBadgeClass("Paused") : badgeClass
            )}
          >
            Paused
          </div> :
            value
          }
        </div>
      ))}
    </div>
  );
};