import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import { formatDateDDMMYYYY } from "@/lib/utils"
import type { CreateCabinetFormValues } from "../types/cabinet"

export const updateAsset = async (
  id: string,
  values: CreateCabinetFormValues,
) => {

  const payload = {
      name: values.asset.name,
      assetTypeId: values.asset.id,
      assetModelId: values.asset.assetModelId,
      notes: values.asset.notes,
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
  }
  if(values.asset.id !== "1") {
    delete payload.assetModelId
  }

  const { data } = await api.put(`${API_ROUTES.ASSETS}/${id}`, payload)

  return data
}

export interface ComponentFormValue {
  componentTypeId: string
  componentVariantId?: string
  expiresAt?: Date | undefined
  lotNumber?: string
  serialNumber?: string
  id: string
}

export const updateAssetComponent = async (
  assetId: string,
  componentId: string,
  component: ComponentFormValue,
) => {
  const payload = {
    componentTypeId: component.componentTypeId,
    componentVariantId: component.componentVariantId,
    expiresAt: component.expiresAt
      ? formatDateDDMMYYYY(component.expiresAt)
      : '',
    lotNumber: component.lotNumber,
    serialNumber: component.serialNumber,
  }

  if(componentId) {
    const { data } = await api.put(
      `${API_ROUTES.ASSETS}/${assetId}/components/${componentId}`,
      payload,
    )
    return data
  } else {
    const { data } = await api.post(
      `${API_ROUTES.ASSETS}/${assetId}/components`,
      payload,
    )
    return data
  }
}

export const updateAssetComponents = async (
  assetId: string,
  components: ComponentFormValue[],
) => {
  return Promise.all(
    components.map((component) =>
      updateAssetComponent(
        assetId,
        component.id,
        component,
      ),
    ),
  )
}