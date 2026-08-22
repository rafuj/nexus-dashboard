import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deviceInstallations } from "../api/device-installations.api"


export const useDeviceInstallations = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deviceInstallations,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cabinets-inventory", "list"],
      })
    },
  })
}