import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface DeviceModel {
  id: string;
  modelName: string;
}

export const getDeviceModels = async (): Promise<DeviceModel[]> => {
  const { data } = await api.get(API_ROUTES.DEVICE_MODELS)

  return data
}