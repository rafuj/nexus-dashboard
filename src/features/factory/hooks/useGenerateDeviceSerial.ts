import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateDeviceSerial } from "../api/generateDeviceSerial.api"


export const useGenerateDeviceSerial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateDeviceSerial,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["available-serial"],
      })
    },
  })
}