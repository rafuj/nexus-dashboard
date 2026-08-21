
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface DeviceI {
  imei: string
  serialNumber: string
}

export interface CreateDevicesI { 
  installations: DeviceI[],
}
export const deviceInstallations = async (values:CreateDevicesI) => {
  const { data } = await api.post(
    API_ROUTES.DEVICE_INSTALLATION,
    values
  );

  return data;
};