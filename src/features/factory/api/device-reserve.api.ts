
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface CreateDevicesI {
  serialNumber: string
}
export const deviceReserve = async (values:CreateDevicesI) => {
  const { data } = await api.post(
    API_ROUTES.DEVICES_RESERVE,
    values
  );

  return data;
};