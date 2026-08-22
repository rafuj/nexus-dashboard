
import { useQuery } from "@tanstack/react-query"
import { getAssetTypes } from "../api/assetTypes.api"

export const useAssetTypes = () => {
    return useQuery({
      queryKey: ["asset-types"],
      queryFn: () => getAssetTypes(),
      placeholderData: (previousData) => previousData,
      staleTime: 10 * 60 * 1000
    })
}
