
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface GenerateDeviceSerialInterface {
  deviceModelId: string
  productionYear: string
  quantity: number
}
export const generateDeviceSerial = async (values:GenerateDeviceSerialInterface) => {
  const { data } = await api.post(
    API_ROUTES.DEVICES_INVENTORY,
    values
  );

  return data;
};