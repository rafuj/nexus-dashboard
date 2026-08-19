import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface AEDData {
  id: string,
  name: string
}

export const getComponentTypes = async (): Promise<AEDData> => {
  const { data } = await api.get(API_ROUTES.COMPONENT_TYPES)

  return data
}