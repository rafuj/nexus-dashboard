import type { SortingState } from "@tanstack/react-table"
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CabinetEventRow } from "../types/eventList"

export type CabinetsEventsListQuery = {
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
  rows: CabinetEventRow[]
  totalCount: number
}

export const staleTime = 20 * 1000 /* 20s */

export const getEventsList = async (
  params: CabinetsEventsListQuery
): Promise<CabinetEventRow[]> => {
  const { data } = await api.get(API_ROUTES.EVENTS, {
    params,
  })

  return data
}