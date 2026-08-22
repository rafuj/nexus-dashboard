
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CreateCabinetFormValues } from "./cabinet.api";

export const createAsset = async (values: CreateCabinetFormValues) => {
  const { data } = await api.post(
    API_ROUTES.ASSETS,
    values
  );

  return data;
};