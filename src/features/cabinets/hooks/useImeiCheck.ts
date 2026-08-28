
import { useQuery } from "@tanstack/react-query"
import { imeiCheck } from "../api/imeiCheck.api"

export const useImeiCheck = (imei: string) => {
  const imeiRegex = /^\d{15}$/;
  return useQuery({
    queryKey: ["imei", "check", imei],
    queryFn: () => imeiCheck(imei),
    enabled: !!imei && imeiRegex.test(imei),
    retry: 0
  })
}