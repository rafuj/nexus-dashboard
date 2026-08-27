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
import { useDeviceState } from "../hooks/useDeviceState";
import { useParams } from "react-router";

export const CabinetStatistics = () => {  

  const {id} = useParams()
  const {data, isSuccess} = useDeviceState(id ?? '')

  const doorOpenedAt = isSuccess && data?.doorOpen ? data?.doorStateChangedAt : ""
  const assetTakenAt = isSuccess && data?.assetStateChangedAt
  const assetPresent = isSuccess && data?.assetPresent
  const health = "Ok"

  const isPaused = !data

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
      badgeClass: getTemperatureBadgeClass({current: data?.temperature, temperatureOutOfRangeSince: new Date()}), // static data
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                {getTemperatureChip({current: data?.temperature, temperatureOutOfRangeSince: new Date()}, "w-full")}
              </TooltipTrigger>
                <TooltipContent side="right" className={cn(getTemperatureTooltipClass({current: data?.temperature, temperatureOutOfRangeSince: new Date()}))}>
                  {getTemperatureTooltip({current: data?.temperature, temperatureOutOfRangeSince: new Date()})}
                </TooltipContent>
            </Tooltip>
    },
    {
      title: "Connectivity",
      Icon: ConnectivityIcon,
      badgeClass: data
          ? "bg-card-success text-success"
          : "bg-card-error text-error",
      value: <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
              data
                ? "bg-card-success text-success"
                : "bg-card-error text-error"
            )}
          >
            {data
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