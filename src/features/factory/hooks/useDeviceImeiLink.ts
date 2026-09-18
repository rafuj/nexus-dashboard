import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deviceImeiLink } from "../api/device-imei-link.api"


export const useDeviceImeiLink = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deviceImeiLink,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cabinets-inventory", "list"],
      })
    },
  })
}