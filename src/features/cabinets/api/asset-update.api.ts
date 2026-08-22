import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import { formatDateDDMMYYYY } from "@/lib/utils"
import type { CreateCabinetFormValues } from "./cabinet.api"

export const updateAsset = async (
  id: string,
  values: CreateCabinetFormValues,
) => {

  const formattedComponents = values.asset.components
    ?.filter(
      (component) =>
        component.componentVariantId ||
        component.expiresAt ||
        component.lotNumber ||
        component.serialNumber
    )
    .map((component) => ({
      componentTypeId: component.componentTypeId,
      ...(component.componentVariantId && {
        componentVariantId: component.componentVariantId,
      }),
      ...(component.expiresAt && {
        expiresAt: formatDateDDMMYYYY(component.expiresAt),
      }),
      ...(component.lotNumber && { lotNumber: component.lotNumber }),
      ...(component.serialNumber && { serialNumber: component.serialNumber }),
    }))

  const payload = {
    // ...values,
      name: values.asset.name,
      assetModelId: values.asset.assetModelId,
      notes: values.asset.assetModelId,
      serialNumber: values.asset.serialNumber,
      cabinetId: values.asset.cabinetId,

      checkupDate: values.asset.checkupDate
        ? formatDateDDMMYYYY(values.asset.checkupDate)
        : undefined,
      expiresAt: values.asset.expiresAt
        ? formatDateDDMMYYYY(values.asset.expiresAt)
        : undefined,
      purchaseDate: values.asset.purchaseDate
        ? formatDateDDMMYYYY(values.asset.purchaseDate)
        : undefined,
      components: formattedComponents
  }

  const { data } = await api.put(`${API_ROUTES.ASSETS}/${id}`, payload)

  return data
}
