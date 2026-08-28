import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
export interface SerialCheckResponse {
  id: string
  imei: string
  serialNumber: string
  smart: boolean
}
export const serialCheck = async (serialNumber:string): Promise<SerialCheckResponse> => {
  const { data } = await api.get(API_ROUTES.SERIAL_CHECK, {
    params: {
      serialNumber
    }
  })

  return data
}
