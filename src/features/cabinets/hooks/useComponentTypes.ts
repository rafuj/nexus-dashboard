
import { useQuery } from "@tanstack/react-query"
import { getComponentTypes } from "../api/componentTypes.api"

export const useComponentTypes = () => {
    return useQuery({
      queryKey: ["component-types"],
      queryFn: () => getComponentTypes(),
      placeholderData: (previousData) => previousData,
      staleTime: 10 * 60 * 1000
    })
}