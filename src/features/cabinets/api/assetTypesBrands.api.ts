import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export const getAssetTypesBrands = async (id: string): Promise<string[]> => {
  const { data } = await api.get(`${API_ROUTES.ASSET_TYPES}/${id}/brands`)

  return data
}