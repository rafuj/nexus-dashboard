import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateDeviceSerial } from "../api/generate-device-serial.api"


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