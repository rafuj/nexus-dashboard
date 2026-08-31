import type { SortingState } from "@tanstack/react-table"
import type { Cabinet } from "../types/cabinetList"
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export type CabinetsListQuery = {
  search: string
  status?: string
  city?: string
  page?: number
  limit?: number
  sorting?: SortingState
}

export type CabinetsListResponse = {
  rows: Cabinet[]
  totalCount: number
}

export const staleTime = 20 * 1000 /* 20s */

export const getCabinetsList = async (
  params: CabinetsListQuery
): Promise<Cabinet[]> => {
  const { data } = await api.get(API_ROUTES.CABINETS, {
    params,
  })

  return data
}