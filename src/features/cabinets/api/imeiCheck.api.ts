import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
export interface ImeiCheckResponse {
  id: string
  imei: string
  model: string
}
export const imeiCheck = async (imei:string): Promise<ImeiCheckResponse> => {
  const { data } = await api.get(API_ROUTES.IMEI_CHECK, {
    params: {
      imei
    }
  })

  return data
}