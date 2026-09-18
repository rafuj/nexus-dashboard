import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deviceReserve } from "../api/device-reserve.api"


export const useDeviceReserve = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deviceReserve,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["available-serial", "factory-logs"],
      })
    },
  })
}