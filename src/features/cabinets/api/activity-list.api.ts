import type { SortingState } from "@tanstack/react-table"
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CabinetActivityRow } from "../types/activityList"

export type CabinetsActivityListQuery = {
  search?: string
  status?: string
  type?: string
  group?: string
  dateRange?: [string, string]
  page?: number
  limit?: number
  sorting?: SortingState
}

export type CabinetsActivityListResponse = {
  rows: CabinetActivityRow[]
  totalCount: number
}

export const staleTime = 20 * 1000 /* 20s */

export const getActivitiesList = async (
  params: CabinetsActivityListQuery
): Promise<CabinetActivityRow[]> => {
  const { data } = await api.get(API_ROUTES.ACTIVITIES, {
    params,
  })

  return data
}