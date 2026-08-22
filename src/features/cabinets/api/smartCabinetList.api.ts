import type { SortingState } from "@tanstack/react-table"
import type { SmartCabinet } from "../types/cabinetList"
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export type CabinetsListQuery = {
  search?: string
  status?: string
  city?: string
  page: number
  limit: number
  sorting?: SortingState
}

export type CabinetsListResponse = {
  rows: SmartCabinet[]
  totalCount: number
}

export const staleTime = 20 * 1000 /* 20s */

export const getSmartCabinetList = async (
  params: CabinetsListQuery
): Promise<SmartCabinet[]> => {
  const { data } = await api.get(API_ROUTES.SMART_CABINETS, {
    params,
  })

  return data
}