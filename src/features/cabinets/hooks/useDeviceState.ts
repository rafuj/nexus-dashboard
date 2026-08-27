
import { useQuery } from "@tanstack/react-query"
import { getDeviceState } from "../api/deviceState.api"

export const useDeviceState = (id: string) => {
  return useQuery({
    queryKey: ["device-state", id],
    queryFn: () => getDeviceState(id),
    placeholderData: (previousData) => previousData,
    enabled: !!id,
    staleTime: 10 * 1000,
  })
}