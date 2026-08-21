import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export const staleTime = 20 * 1000 /* 20s */

// export const getCabinetsView = async (id:string): Promise<Cabinet> => {
export const getAssetView = async (id:string): Promise<any> => {
  const { data } = await api.get(`${API_ROUTES.CABINETS}/${id}/asset`)
  return data
}