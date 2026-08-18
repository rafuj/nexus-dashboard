
import { useQuery } from "@tanstack/react-query"
import {
  getCabinetsList,
  staleTime,
  type CabinetsListQuery,
} from "../api/cabinetList.api"

export const useCabinetsList = (params: CabinetsListQuery) => {
  return useQuery({
    queryKey: ["cabinets", "list", params],
    queryFn: () => getCabinetsList(params),
    placeholderData: (previousData) => previousData,
    staleTime
  })
}