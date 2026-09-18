
import { useQuery } from "@tanstack/react-query"
import { getFactoryLogs } from "../api/factory-logs"

export const useFactoryLogs = () => {
  return useQuery({
    queryKey: ["factory-logs"],
    queryFn: () => getFactoryLogs(),
    placeholderData: (previousData) => previousData,
  })
}