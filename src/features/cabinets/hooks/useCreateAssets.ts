import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAsset } from "../api/assets.api"

export const useCreateAssets = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAsset,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", "create"],
      })
    },
  })
}