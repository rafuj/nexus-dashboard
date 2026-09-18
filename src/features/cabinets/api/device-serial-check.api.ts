import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface DevicesSerialCheckResponse {
  id: string,
  deviceModelId: string,
  model: string,
  serialNumber: string,
  imei: string | null,
  reservedAt: string | null
}

export const deviceSerialCheck = async (serialNumber: string): Promise<DevicesSerialCheckResponse> => {
  const { data } = await api.get(API_ROUTES.IMEI_CHECK, {
    params: {
      serialNumber
    }
  })

  return data
}