
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export const createActivity = async (
  values: any
) => {
  const { id, ...rest } = values;
  const { data } = await api.post(`${API_ROUTES.CABINETS}/${id}/activities`, rest)

  return data
}