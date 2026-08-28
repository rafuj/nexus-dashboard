import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
export interface CabinetModelResponse {
  brand: string
  id: string
  modelName: string
}
export const getCabinetModels = async (brand:string): Promise<CabinetModelResponse[]> => {
  const { data } = await api.get(API_ROUTES.CABINET_MODELS, {
    params: {
      brand
    }
  })

  return data
}