import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export const cabinetCities = async (): Promise<string[]> => {
  const { data } = await api.get(API_ROUTES.CABINET_CITIES)

  return data
}