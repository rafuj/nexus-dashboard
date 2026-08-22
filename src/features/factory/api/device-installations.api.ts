
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface InstallationDeviceI {
  imei: string
  serialNumber: string
}

export interface CreateDevicesI { 
  installations: InstallationDeviceI[],
}
export const deviceInstallations = async (values:CreateDevicesI) => {
  const { data } = await api.post(
    API_ROUTES.DEVICE_INSTALLATION,
    values
  );

  return data;
};