
import { useQuery } from "@tanstack/react-query"
import { imeiCheck } from "../api/imeiCheck.api"
import { imeiRegex } from "../types/cabinet"

export const useImeiCheck = (imei: string, enabled:boolean) => {
  return useQuery({
    queryKey: ["imei", "check", imei],
    queryFn: () => imeiCheck(imei),
    enabled: enabled && !!imei && imeiRegex.test(imei),
    retry: 0
  })
}