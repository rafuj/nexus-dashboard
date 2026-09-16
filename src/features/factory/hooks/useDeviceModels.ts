
import { useQuery } from "@tanstack/react-query"
import { getDeviceModels } from "../api/device-models.api"

export const useDeviceModels = () => {
    return useQuery({
      queryKey: ["devices-models"],
      queryFn: () => getDeviceModels(),
      placeholderData: (previousData) => previousData,
      staleTime: 30 * 1000,
      retry: false
    })
}