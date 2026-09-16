
import { useQuery } from "@tanstack/react-query"
import { getAvailableSerialNumbers } from "../api/available-serial.api"
import type { AvailableSerialNumbersQuery } from "../types/factoryType"

export const useAvailableSerialNumbers = (params: AvailableSerialNumbersQuery) => {
  return useQuery({
    queryKey: ["available-serial", params],
    queryFn: () => getAvailableSerialNumbers(params),
    placeholderData: (previousData) => previousData
  })
}