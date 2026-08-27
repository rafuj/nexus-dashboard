import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export const getDeviceState = async (id:string): Promise<any> => {
  const { data } = await api.get(`${API_ROUTES.CABINETS}/${id}/device-state`)
  return data
}