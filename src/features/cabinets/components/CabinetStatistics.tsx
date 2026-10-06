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
import { useDeviceStreamState } from "../hooks/useDeviceStreamState";
import { useEffect, useState } from "react";
interface DeviceState {
  doorOpenedAt: string | ""
  assetTakenAt: string | ""
  assetPresent: boolean
  ser: boolean
  serStateChangedAt: string | ""
  temperature: number | 0
  isConnected: boolean
}
export const CabinetStatistics = ({deviceSerialNumber}: {deviceSerialNumber: string}) => {  

  const [state, setState] = useState<DeviceState>({
  doorOpenedAt: "",
  assetTakenAt: "",
  assetPresent: false,
  ser: false,
  serStateChangedAt: "",
  temperature: 0,
  isConnected: false,
})

  const {id} = useParams()

  const {data, isSuccess} = useDeviceState(id ?? '')
  const {deviceState, isConnected} = useDeviceStreamState(deviceSerialNumber ? id : "")

  const notInitialized = !data

  useEffect(()=>{
    if(deviceState) {
      setState({
        doorOpenedAt: deviceState?.doorOpen ? String(deviceState?.doorStateChangedAt) : "",
        assetTakenAt: deviceState?.assetStateChangedAt ? String(deviceState?.assetStateChangedAt) : "",
        assetPresent: !!deviceState?.assetPresent,
        ser: !!deviceState?.ser,
        serStateChangedAt: deviceState?.serStateChangedAt ? String(deviceState?.serStateChangedAt) : "",
        temperature: Number(deviceState?.temperature) || 0,
        isConnected: isConnected,
      })
    } else if(isSuccess) {
      setState({
        doorOpenedAt: data?.doorOpen ? String(data?.doorStateChangedAt) : "",
        assetTakenAt: data?.assetStateChangedAt ? String(data?.assetStateChangedAt) : "",
        assetPresent: !!data?.assetPresent,
        ser: !!data?.ser,
        serStateChangedAt: data?.serStateChangedAt ? String(data?.serStateChangedAt) : "",
        temperature: Number(data?.temperature) || 0,
        isConnected: isConnected,
      })
    }
  }, [deviceState, isConnected, isSuccess])

  const cards = [
    {
      title: "Door",
      Icon: DoorIcon,
      badgeClass: getDoorBadgeClass(state.doorOpenedAt),
      value: <Tooltip>
            <TooltipTrigger className="w-full">
              <span
                className={cn(
                  "px-3 py-1 rounded-[4px] text-xs w-full text-center block transition-all capitalize",
                  getDoorBadgeClass(state.doorOpenedAt)
                )}
              >
                    {getDoorStatus(state.doorOpenedAt)}
              </span>
            </TooltipTrigger>
              <TooltipContent side="right" className={cn(getDoorStatusTooltipClass(state.doorOpenedAt))}>
                {getDoorStatusTooltip(state.doorOpenedAt)}
              </TooltipContent>
          </Tooltip>
    },
    {
      title: "Asset Presence",
      Icon: AssetPresenceIcon,
      badgeClass: getPresenceBadgeClass(state.assetPresent, state.assetTakenAt),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                <span
                  className={cn(
                    "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all capitalize",
                    getPresenceBadgeClass(state.assetPresent, state.assetTakenAt)
                  )}
                >
                  {getPresenceStatus(state.assetPresent, state.assetTakenAt)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(getPresenceTooltipClass(state.assetPresent, state.assetTakenAt))}>
                {getPresenceTooltip(state.assetPresent, state.assetTakenAt)}
              </TooltipContent>
            </Tooltip>
    },
    { // static state
      title: "Asset Health",
      Icon: AssetHealthIcon,
      badgeClass: getHealthBadgeClass(state.ser ? "urgent" : "ok"),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                <span
                    className={cn(
                      "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all uppercase",
                      getHealthBadgeClass(state.ser ? "urgent" : "ok")
                    )}
                  >
                    {state.ser ? "urgent" : "ok"}
                  </span>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(getHealthBadgeTooltipColor(state.ser ? "urgent" : "ok"))}>
                {getHealthTooltip(state.ser ? "urgent" : "ok")}
              </TooltipContent>
            </Tooltip>
    },
    {
      title: "Temperature",
      Icon: TemperatureIcon,
      badgeClass: getTemperatureBadgeClass({current: data?.temperature}), // static data
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                {getTemperatureChip({current: data?.temperature}, "w-full")}
              </TooltipTrigger>
                <TooltipContent side="right" className={cn(getTemperatureTooltipClass({current: data?.temperature}))}>
                  {getTemperatureTooltip({current: data?.temperature})}
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
              notInitialized ? getHealthBadgeClass("n/a") : badgeClass
            )}
          >
            <Icon />
          </div>

          <h6 className="text-xs font-semibold">{title}</h6>

          {notInitialized ? <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
              notInitialized ? getHealthBadgeClass("n/a") : badgeClass
            )}
          >
            N/A
          </div> :
            value
          }
        </div>
      ))}
    </div>
  );
};