import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

interface ActivityTypeI {
    id: string
    name: string
}
export interface ActivityType {
  cabinet: ActivityTypeI[]
  asset: ActivityTypeI[]
}

export const getActivityTypes = async (): Promise<ActivityType> => {
  const { data } = await api.get(API_ROUTES.ACTIVITY_TYPES)

  return data
}