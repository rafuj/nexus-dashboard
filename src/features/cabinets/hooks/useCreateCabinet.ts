import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createCabinet
} from "../api/cabinet.api"

export const useCreateCabinet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCabinet,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cabinets", "list"],
      })
    },
  })
}