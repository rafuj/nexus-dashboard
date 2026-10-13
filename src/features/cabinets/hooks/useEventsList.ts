
import { useQuery } from "@tanstack/react-query"
import { getEventsList, type CabinetsEventsListQuery } from "../api/event-list.api"

export const useEventsList = (params: CabinetsEventsListQuery) => {
  return useQuery({
    queryKey: ["events", "list", params],
    queryFn: () => getEventsList(params),
    placeholderData: (previousData) => previousData,
    retry: false
  })
}