import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateCabinetSerial } from "../api/generateCabinetSerial"


export const useGenerateSerial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateCabinetSerial,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["available-serial"],
      })
    },
  })
}