import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import DoorIcon from "@/assets/icons/door.svg?react";
import AssetPresenceIcon from "@/assets/icons/asset-presence.svg?react";
import AssetHealthIcon from "@/assets/icons/asset-health.svg?react";
import TemperatureIcon from "@/assets/icons/temperature.svg?react";
import ConnectivityIcon from "@/assets/icons/connectivity.svg?react";
import dayjs from "dayjs";
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
  doorOpen: boolean
  assetTakenAt: string | ""
  assetPresent: boolean
  assetHealth: string | ""
  temperature: number | 0
  isConnected: boolean
}
export const CabinetStatistics = ({deviceSerialNumber}: {deviceSerialNumber: string}) => {  

  const [state, setState] = useState<DeviceState>({
  doorOpenedAt: "",
  doorOpen: false,
  assetTakenAt: "",
  assetPresent: false,
  assetHealth: "",
  temperature: 0,
  isConnected: false,
})

  const {id} = useParams()

  const {data, isSuccess} = useDeviceState(id ?? '')
  const {deviceState} = useDeviceStreamState(deviceSerialNumber ? id : "")

  const notInitialized = !data

  useEffect(()=>{
    if(deviceState) {
      const lastSeen = dayjs(deviceState?.lastSeenAt)
      setState({
        doorOpenedAt: String(deviceState?.doorStateChangedAt),
        assetTakenAt: deviceState?.assetStateChangedAt ? String(deviceState?.assetStateChangedAt) : "",
        assetPresent: !!deviceState?.assetPresent,
        assetHealth: String(deviceState?.assetHealth),
        temperature: Number(deviceState?.temperature) || 0,
        isConnected: lastSeen.isValid() && dayjs().diff(lastSeen, "hours", true) < 12,
        doorOpen: !!deviceState?.doorOpen,
      })
    } else if(isSuccess) {
      setState({
        doorOpenedAt: String(data?.doorStateChangedAt),
        assetTakenAt: data?.assetStateChangedAt ? String(data?.assetStateChangedAt) : "",
        assetPresent: !!data?.assetPresent,
        assetHealth: data?.assetHealth,
        temperature: Number(data?.temperature) || 0,
        isConnected: Boolean(dayjs().diff(dayjs(data?.lastSeenAt), "hours", true) < 12),
        doorOpen: !!data?.doorOpen,
      })
    }
  }, [deviceState, isSuccess])

  const cards = [
    {
      title: "Door",
      Icon: DoorIcon,
      badgeClass: getDoorBadgeClass(state?.doorOpen, state.doorOpenedAt),
      value: <Tooltip>
            <TooltipTrigger className="w-full">
              <span
                className={cn(
                  "px-3 py-1 rounded-[4px] text-xs w-full text-center block transition-all capitalize",
                  getDoorBadgeClass(state?.doorOpen, state.doorOpenedAt)
                )}
              >
                    {getDoorStatus(state?.doorOpen, state.doorOpenedAt)}
              </span>
            </TooltipTrigger>
              <TooltipContent side="right" className={cn(getDoorStatusTooltipClass(state?.doorOpen, state.doorOpenedAt))}>
                {getDoorStatusTooltip(state?.doorOpen, state.doorOpenedAt)}
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
      badgeClass: getHealthBadgeClass(state.assetHealth),
      value: <Tooltip>
              <TooltipTrigger className="w-full">
                <span
                    className={cn(
                      "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all uppercase",
                      getHealthBadgeClass(state.assetHealth)
                    )}
                  >
                    {state.assetHealth}
                  </span>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(getHealthBadgeTooltipColor(state.assetHealth))}>
                {getHealthTooltip(state.assetHealth)}
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
      badgeClass: state.isConnected
          ? "bg-card-success text-success"
          : "bg-card-error text-error",
      value: <div
            className={cn(
              "px-3 py-1 rounded-[4px] text-xs w-full text-center inline-block transition-all",
              state.isConnected
                ? "bg-card-success text-success"
                : "bg-card-error text-error"
            )}
          >
            {state.isConnected
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