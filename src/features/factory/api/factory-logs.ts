import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { FactoryRow } from "../types/factoryType"

interface FactoryLogsI {
  total: string,
  connectedNexus: string,
  nonConnectedNexus: string,
  separateModules: string,
  units: FactoryRow[]
}

export const getFactoryLogs = async (): Promise<FactoryLogsI> => {
  const { data } = await api.get(API_ROUTES.FACTORY_LOGS)
  return data
}