import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface AEDData {
  assetTypeId: string,
  brand: string,
  id: string,
  modelName: string
}

export const getAssetTypesModels = async (id: string): Promise<AEDData> => {
  const { data } = await api.get(`${API_ROUTES.ASSET_TYPES}/${id}/models`)

  return data
}