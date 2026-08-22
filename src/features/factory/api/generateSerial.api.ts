
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface GenerateSerialInterface {
    quantity: number
}
export const createGenerateSerial = async (values:GenerateSerialInterface) => {
  const { data } = await api.post(
    API_ROUTES.CABINETS_INVENTORY,
    values
  );

  return data;
};