
import { useQuery } from "@tanstack/react-query"
import {
  staleTime,
  type CabinetsListQuery,
} from "../api/cabinetList.api"
import { getSmartCabinetList } from "../api/smartCabinetList.api"

export const useSmartCabinetsList = (params: CabinetsListQuery) => {
  return useQuery({
    queryKey: ["smart-cabinets", params],
    queryFn: () => getSmartCabinetList(params),
    placeholderData: (previousData) => previousData,
    staleTime,
    retry: false
  })
}