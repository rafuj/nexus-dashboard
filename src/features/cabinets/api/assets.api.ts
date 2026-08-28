
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CreateCabinetFormValues } from "./cabinet.api";
import { formatDateDDMMYYYY } from "@/lib/utils";

export const createAsset = async (values: CreateCabinetFormValues) => {

  let payload: any = {
    assetTypeId: values.asset.id,
    checkupDate: values?.asset?.checkupDate ? formatDateDDMMYYYY(values?.asset?.checkupDate) : null,
    expiresAt: values?.asset?.expiresAt ? formatDateDDMMYYYY(values?.asset?.expiresAt) : null,
    name: values?.asset?.name,
    notes: values?.asset?.notes,
    purchaseDate: values?.asset?.purchaseDate ? formatDateDDMMYYYY(values?.asset?.purchaseDate) : null,
    serialNumber: values?.asset?.serialNumber,
    components: values?.asset?.components
      ?.filter(
        (component) =>
          component.componentVariantId ||
          component.expiresAt ||
          component.lotNumber ||
          component.serialNumber,
      )
      .map((component) => ({
        componentTypeId: component.componentTypeId,

        ...(component.componentVariantId && {
          componentVariantId: component.componentVariantId,
        }),

        ...(component.expiresAt && {
          expiresAt: formatDateDDMMYYYY(component.expiresAt),
        }),

        ...(component.lotNumber && {
          lotNumber: component.lotNumber,
        }),

        ...(component.serialNumber && {
          serialNumber: component.serialNumber,
        }),
      })) ?? [],
  }
  
  if(values?.asset?.assetModelId){
    payload.assetModelId = values?.asset?.assetModelId
  }
  const { data } = await api.post(`${API_ROUTES.CABINETS}/${values?.asset?.cabinetId}/asset`, payload);

  return data;
};
