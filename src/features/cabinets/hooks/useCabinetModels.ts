
import { useQuery } from "@tanstack/react-query"
import { getCabinetModels } from "../api/cabinetModels.api"

export const useCabinetModels = (brand: string) => {
    return useQuery({
      queryKey: ["cabinet", "models", brand],
      queryFn: () => getCabinetModels(brand),
      placeholderData: (previousData) => previousData,
      staleTime: 30 * 1000, /* 30 seconds */
      enabled: !!brand
    })
}