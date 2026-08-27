import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import DoorIcon from "@/assets/icons/door.svg?react";
import AssetPresenceIcon from "@/assets/icons/asset-presence.svg?react";
import AssetHealthIcon from "@/assets/icons/asset-health.svg?react";
import TemperatureIcon from "@/assets/icons/temperature.svg?react";
import ConnectivityIcon from "@/assets/icons/connectivity.svg?react";

import { cn } from "@/lib/utils";
import {
  getTemperatureChip
} from "./cabinetsMonitorTableColumns";
import { getDoorBadgeClass, getDoorStatus, getDoorStatusTooltip, getDoorStatusTooltipClass, getHealthBadgeClass, getHealthBadgeTooltipColor, getHealthTooltip, getPresenceBadgeClass, getPresenceStatus, getPresenceTooltip, getPresenceTooltipClass, getTemperatureBadgeClass, getTemperatureTooltip, getTemperatureTooltipClass } from "../lib/cabinetListDisplay";
import type { SmartCabinet } from "../types/cabinetList";

export const CabinetStatistics = ({ data } : { data : SmartCabinet }) => {  

  const doorOpenedAt = data?.deviceState?.doorOpen ? data?.deviceState?.doorStateChangedAt : ""
  const assetTakenAt = data?.deviceState?.assetStateChangedAt
  const assetPresent = data?.deviceState?.assetPresent
  const health = "Ok"

  if (!data?.smart) return null;

  const isPaused = !data.deviceState

  const cards = [
    {
      title: "Door",
      Icon: DoorIcon,
      badgeClass: getDoorBadgeClass(doorOpenedAt),
      value: <Tooltip>
            <TooltipTrigger className="w-full">
              <span
                className={cn(
                  "px-3 py-1 rounded-[4px] text-xs w-full text-center block transition-all",
                  getDoorBadgeClass(doorOpenedAt)
                )}
              >
                    {getDoorStatus(doorOpenedAt)}
              </span>
            </TooltipTrigger>
              <TooltipContent side="right" className={cn(getDoorStatusTooltipClass(doorOpenedAt))}>
                {getDoorStatusTooltip(doorOpenedAt)}
              </TooltipContent>
          </Tooltip>
    },
    {
      title: "Asset Presence",
      Icon: AssetPresenceIcon,
      badgeClass: getPresenceBadgeClass(assetPresent, assetTakenAt),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                <span
                  className={cn(
                    "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
                    getPresenceBadgeClass(assetPresent, assetTakenAt)
                  )}
                >
                  {getPresenceStatus(assetPresent, assetTakenAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(getPresenceTooltipClass(assetPresent, assetTakenAt))}>
                {getPresenceTooltip(assetPresent, assetTakenAt)}
              </TooltipContent>
            </Tooltip>
    },
    { // static state
      title: "Asset Health",
      Icon: AssetHealthIcon,
      badgeClass: getHealthBadgeClass(health),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                <span
                    className={cn(
                      "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
                      getHealthBadgeClass(health)
                    )}
                  >
                    {health}
                  </span>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(getHealthBadgeTooltipColor(health))}>
                {getHealthTooltip(health)}
              </TooltipContent>
            </Tooltip>
    },
    {
      title: "Temperature",
      Icon: TemperatureIcon,
      badgeClass: getTemperatureBadgeClass({current: data?.deviceState?.temperature, temperatureOutOfRangeSince: new Date()}), // static data
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                {getTemperatureChip({current: data?.deviceState?.temperature, temperatureOutOfRangeSince: new Date()}, "w-full")}
              </TooltipTrigger>
                <TooltipContent side="right" className={cn(getTemperatureTooltipClass({current: data?.deviceState?.temperature, temperatureOutOfRangeSince: new Date()}))}>
                  {getTemperatureTooltip({current: data?.deviceState?.temperature, temperatureOutOfRangeSince: new Date()})}
                </TooltipContent>
            </Tooltip>
    },
    {
      title: "Connectivity",
      Icon: ConnectivityIcon,
      badgeClass: data?.deviceState
          ? "bg-card-success text-success"
          : "bg-card-error text-error",
      value: <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
              data?.deviceState
                ? "bg-card-success text-success"
                : "bg-card-error text-error"
            )}
          >
            {data?.deviceState
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