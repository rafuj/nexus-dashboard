import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { FactoryRow } from "../types/factoryType"

export const getGeneratedSerialNumbers = async (): Promise<FactoryRow[]> => {
  const { data } = await api.get(API_ROUTES.CABINETS_INVENTORY)
  return data
}