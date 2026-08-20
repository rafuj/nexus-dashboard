
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"


export interface AssetFormValues {
  assetType: {
    id: string;
    name: string;
  };

  brandInfo: {
    name: string;
    model: string;
  };

  serialNumber: string;
  dateOfPurchase: Date | null;
  nextCheckUp: Date | null;

  padsInformation: {
    firstSetPads: {
      for: string;
      expiration: string | Date | null;
      IotNumber: string;
    };
    secondSetPads: {
      for: string;
      expiration: string | Date | null;
      IotNumber: string;
    };
  };

  batteryInformation: {
    batterySerial: string;
    batteryExpiration: string | Date | null;
    batteryIotNumber: string;
  };

  notes: string;
}

export const createAsset = async (values: AssetFormValues) => {
  const { data } = await api.post(
    API_ROUTES.ASSETS,
    values
  );

  return data;
};