
import { useQuery } from "@tanstack/react-query"
import { getCabinetsView } from "../api/cabinetView.api"

export const useCabinetsView = (id: string) => {
  return useQuery({
    queryKey: ["cabinets", id],
    queryFn: () => getCabinetsView(id),
    placeholderData: (previousData) => previousData,
    enabled: !!id,
    staleTime: 15 * 1000, // 15s
  })
}