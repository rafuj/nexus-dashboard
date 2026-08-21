
import { useQuery } from "@tanstack/react-query"
import { getAssetView } from "../api/assetView.api"

export const useAssetView = (id: string) => {
  return useQuery({
    queryKey: ["assets", "view", id],
    queryFn: () => getAssetView(id),
    placeholderData: (previousData) => previousData,
    enabled: !!id,
  })
}