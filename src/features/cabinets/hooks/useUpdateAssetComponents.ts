import { useMutation } from "@tanstack/react-query"
import { updateAssetComponents, type ComponentFormValue } from "../api/asset-update.api"

export const useUpdateAssetComponents = () => {
  return useMutation({
    mutationFn: ({
      assetId,
      components,
    }: {
      assetId: string
      components: ComponentFormValue[]
    }) => updateAssetComponents(assetId, components),
  })
}