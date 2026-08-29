import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAsset } from "../api/asset-update.api"
import type { CreateCabinetFormValues } from "../types/cabinet"

export const useUpdateAsset = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreateCabinetFormValues) =>
      updateAsset(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", "update", id],
      })
    },
  })
}