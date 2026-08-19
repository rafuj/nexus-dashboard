
import { useQuery } from "@tanstack/react-query"
import { getAssetTypesModels } from "../api/assetTypesModels.api"

export const useAssetTypesModels = (id: string) => {
    return useQuery({
      queryKey: ["asset-types", id],
      queryFn: () => getAssetTypesModels(id),
      placeholderData: (previousData) => previousData,
      staleTime: 10 * 60 * 1000
    })
}