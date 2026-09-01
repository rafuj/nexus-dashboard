
import { useQuery } from "@tanstack/react-query"
import { imeiCheck } from "../api/imeiCheck.api"

export const useImeiCheck = (imei: string, enabled:boolean) => {
  const imeiRegex = /^\d{15}$/;
  return useQuery({
    queryKey: ["imei", "check", imei],
    queryFn: () => imeiCheck(imei),
    enabled: enabled && !!imei && imeiRegex.test(imei),
    retry: 0
  })
}