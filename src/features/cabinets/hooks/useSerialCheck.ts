
import { useQuery } from "@tanstack/react-query"
import { serialCheck } from "../api/serialCheck.api";
import { serialRegex } from "../types/cabinet";

export const useSerialCheck = (serial: string, enabled:boolean) => {
  return useQuery({
    queryKey: ["serial", "check", serial],
    queryFn: () => serialCheck(serial),
    enabled: enabled && !!serial && serialRegex.test(serial),
    retry: 0
  })
}