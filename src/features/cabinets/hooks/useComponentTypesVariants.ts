
import { useQuery } from "@tanstack/react-query"
import { getComponentTypesVariants } from "../api/componentTypesVariants.api"

export interface AEDData {
  componentTypeId: string,
  id: string,
  name: string
}

export const useComponentTypesVariants = (id: string) => {
    return useQuery({
      queryKey: ["component-types", id],
      queryFn: () => getComponentTypesVariants(id),
      placeholderData: (previousData) => previousData,
      staleTime: 10 * 60 * 1000
    })
}