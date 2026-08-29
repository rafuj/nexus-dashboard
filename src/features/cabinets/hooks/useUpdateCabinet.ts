import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCabinet } from "../api/cabinet-update.api"
import type { CreateCabinetFormValues } from "../types/cabinet"

export const useUpdateCabinet = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreateCabinetFormValues) =>
      updateCabinet(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", id],
      })
    },
  })
}