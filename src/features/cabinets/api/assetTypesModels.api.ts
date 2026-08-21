import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface AEDData {
  assetTypeId: string,
  brand: string,
  id: string,
  modelName: string
}
export interface AEDTypesModels {
  brand: string
}

export const getAssetTypesModels = async (id: string, params: AEDTypesModels): Promise<AEDData[]> => {
  const { data } = await api.get(`${API_ROUTES.ASSET_TYPES}/${id}/models`, {
    params
  })

  return data
}