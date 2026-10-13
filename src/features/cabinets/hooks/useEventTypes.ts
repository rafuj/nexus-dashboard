
import { useQuery } from "@tanstack/react-query"
import { getEventTypes } from "../api/event-type.api"

export const useEventTypes = () => {
    return useQuery({
      queryKey: ["event-types"],
      queryFn: () => getEventTypes(),
      placeholderData: (previousData) => previousData,
      staleTime: 60 * 1000 // 1 minute
    })
}