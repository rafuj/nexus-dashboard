import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { AvailableSerialNumbersQuery, AvailableSerialNumbersRow } from "../types/factoryType"

export type AvailableSerialNumbersResponse = {
  serialNumbers: AvailableSerialNumbersRow[]
  totalAvailable: string
  totalAvailableNex: string
  totalAvailableUpd: string
}

export const getAvailableSerialNumbers = async (
  params: AvailableSerialNumbersQuery
): Promise<AvailableSerialNumbersResponse> => {
  const { data } = await api.get(API_ROUTES.AVAILABLE_SERIAL_NUMBERS, {
    params,
  })

  return data
}