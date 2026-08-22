
import { useQuery } from "@tanstack/react-query"
import { getAssetTypesBrands } from "../api/assetTypesBrands.api"

export const useAssetTypesBrands = (id: string) => {
    return useQuery({
      queryKey: ["asset-types", "brands", id],
      queryFn: () => getAssetTypesBrands(id),
      enabled: !!id,
      placeholderData: (previousData) => previousData,
      staleTime: 10 * 60 * 1000
    })
}