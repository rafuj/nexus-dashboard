
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface CreateDevicesI {
  serialNumber: string
  imei: string
}
export const deviceImeiLink = async (values:CreateDevicesI) => {
  const { data } = await api.post(
    API_ROUTES.DEVICES_IMEI_LINK,
    values
  );

  return data;
};