
import { useQuery } from "@tanstack/react-query"
import { getActivityTypes } from "../api/activity-type.api"

export const useActivityTypes = () => {
    return useQuery({
      queryKey: ["activity-types"],
      queryFn: () => getActivityTypes(),
      placeholderData: (previousData) => previousData,
      staleTime: 60 * 1000 // 1 minute
    })
}
