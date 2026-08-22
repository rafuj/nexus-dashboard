import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface AEDData {
  componentTypeId: string,
  id: string,
  name: string
}

export const getComponentTypesVariants = async (id: string): Promise<AEDData[]> => {
  const { data } = await api.get(`${API_ROUTES.COMPONENT_TYPES}/${id}/variants`)

  return data
}