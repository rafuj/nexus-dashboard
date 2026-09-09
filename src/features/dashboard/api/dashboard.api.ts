import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export const getDashboard = async () => {
  const { data } = await api.get(`${API_ROUTES.DASHBOARD}`)

  return data
}