import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface ComponentTypesAED {
  id: string
  name: string
}

export const getComponentTypes = async (): Promise<ComponentTypesAED[]> => {
  const { data } = await api.get(API_ROUTES.COMPONENT_TYPES)

  return data
}