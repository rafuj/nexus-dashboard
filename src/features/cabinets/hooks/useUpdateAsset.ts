import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateCabinetFormValues } from "../api/cabinet.api"
import { updateAsset } from "../api/asset-update.api"

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