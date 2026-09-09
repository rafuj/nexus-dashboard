
import { useQuery } from "@tanstack/react-query"  
import { cabinetCities } from "../api/cabinetCities.api"

export const useCabinetCities = () => {
    return useQuery({
      queryKey: ["cabinet", "cities"],
      queryFn: () => cabinetCities(),
      placeholderData: (previousData) => previousData,
      staleTime: 30 * 1000 /* 30 seconds */
    })
}