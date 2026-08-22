import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createGenerateSerial } from "../api/generateSerial.api"


export const useGenerateSerial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGenerateSerial,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cabinets-inventory", "list"],
      })
    },
  })
}