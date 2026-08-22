import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDevices } from "../api/devices.api"


export const useCreateDevices = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDevices,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cabinets-inventory", "list"],
      })
    },
  })
}