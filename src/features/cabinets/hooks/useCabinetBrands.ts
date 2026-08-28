
import { useQuery } from "@tanstack/react-query"
import { getCabinetBrands } from "../api/cabinetBrands.api"

export const useCabinetBrands = () => {
    return useQuery({
      queryKey: ["cabinet", "brands"],
      queryFn: () => getCabinetBrands(),
      placeholderData: (previousData) => previousData,
      staleTime: 30 * 1000 /* 30 seconds */
    })
}