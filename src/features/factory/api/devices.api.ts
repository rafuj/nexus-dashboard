
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface deviceI { 
  imeis: string[],
  model: string
}
export const createDevices = async (values:deviceI) => {
  const { data } = await api.post(
    API_ROUTES.DEVICES,
    values
  );

  return data;
};