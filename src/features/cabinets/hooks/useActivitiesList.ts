
import { useQuery } from "@tanstack/react-query"
import { getActivitiesList, type CabinetsActivityListQuery } from "../api/activity-list.api"

export const useActivitiesList = (params: CabinetsActivityListQuery) => {
  return useQuery({
    queryKey: ["activities", "list", params],
    queryFn: () => getActivitiesList(params),
    placeholderData: (previousData) => previousData,
    retry: false
  })
}