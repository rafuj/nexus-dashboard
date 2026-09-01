
import { useQuery } from "@tanstack/react-query"
import { serialCheck } from "../api/serialCheck.api";

export const useSerialCheck = (serial: string) => {
  const serialRegex = /^NEX-[A-Z0-9]{5}-[A-Z0-9]{4}$/;
  return useQuery({
    queryKey: ["serial", "check", serial],
    queryFn: () => serialCheck(serial),
    enabled: !!serial && serialRegex.test(serial),
    retry: 0
  })
}