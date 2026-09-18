
import { useQuery } from "@tanstack/react-query"
import { updRegex } from "../types/cabinet"
import { deviceSerialCheck } from "../api/device-serial-check.api"

export const useDeviceSerialCheck = (serialNumber: string, enabled:boolean) => {
  return useQuery({
    queryKey: ["devices-serial-check", serialNumber],
    queryFn: () => deviceSerialCheck(serialNumber),
    enabled: enabled && !!serialNumber && updRegex.test(serialNumber),
    retry: 0
  })
}