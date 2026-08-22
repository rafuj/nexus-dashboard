
import { useQuery } from "@tanstack/react-query"
import { getAssetTypesModels, type AEDTypesModels } from "../api/assetTypesModels.api"

export const useAssetTypesModels = (id: string, params: AEDTypesModels) => {
    return useQuery({
      queryKey: ["asset-types", "models", params],
      queryFn: () => getAssetTypesModels(id, params),
      enabled: !!id && !!params?.brand,
      placeholderData: (previousData) => previousData,
      staleTime: 10 * 60 * 1000
    })
}