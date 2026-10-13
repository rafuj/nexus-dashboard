import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

interface EventTypeI {
    id: string
    name: string
}
export interface EventType {
  cabinet: EventTypeI[]
  asset: EventTypeI[]
}

export const getEventTypes = async (): Promise<EventType> => {
  const { data } = await api.get(API_ROUTES.EVENT_TYPES)

  return data
}