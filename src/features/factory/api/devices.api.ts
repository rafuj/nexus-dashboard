
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface CreateDevicesI { 
  imeis: string[],
  model: string
}
export const createDevices = async (values:CreateDevicesI) => {
  const { data } = await api.post(
    API_ROUTES.DEVICES,
    values
  );

  return data;
};