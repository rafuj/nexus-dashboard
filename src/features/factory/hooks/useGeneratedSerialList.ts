
import { useQuery } from "@tanstack/react-query"
import { getGeneratedSerialNumbers } from "../api/generatedSerialNumbers.api"

export const useGeneratedSerialList = () => {
  return useQuery({
    queryKey: ["cabinets-inventory", "list"],
    queryFn: () => getGeneratedSerialNumbers(),
    placeholderData: (previousData) => previousData,
  })
}