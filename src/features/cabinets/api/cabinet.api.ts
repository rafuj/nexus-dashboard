
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import { formatDateDDMMYYYY } from "@/lib/utils"


export interface CreateCabinetFormValues  {
  accessType: "public" | "private"
  addressLine1: string
  asset: {
    id: string // id is for error handling not for apies
    brand: string // brand is for error handling not for apies
    assetModelId?: string
    checkupDate?: Date | undefined
    components?: {
        componentTypeId: string
        componentVariantId?: string
        componentVariantName?: string // is set to visible in ui not for apies
        expiresAt: Date | undefined
        lotNumber?: string
        serialNumber?: string
    }[]
    expiresAt?: Date | undefined
    name: string
    notes?: string
    purchaseDate?: Date | undefined
    serialNumber?: string
  }
  name: string
  description?: string
  addressLine2: string
  zipCode: string
  city: string
  country: string
  serialNumber: string
  lockCode: string
  picture1: File | null
  picture2: File | null
  picture3: File | null
}

export const createCabinet = async (
  values: CreateCabinetFormValues,
) => {
  const formData = new FormData()

  // Cabinet
  formData.append("name", values.name)
  formData.append("accessType", values.accessType)
  formData.append("addressLine1", values.addressLine1)
  // formData.append("addressLine2", values.addressLine2)
  formData.append("zipCode", values.zipCode)
  formData.append("city", values.city)
  formData.append("country", values.country)
  formData.append("serialNumber", values.serialNumber)
  formData.append("lockCode", values.lockCode)

  if (values.description) {
    formData.append("description", values.description)
  }

  // Pictures
    // if (values.picture1 instanceof File) {
    //   formData.append("picture1", values.picture1);
    // }
    // if (values.picture2 instanceof File) {
    //   formData.append("picture2", values.picture2);
    // }
    // if (values.picture3 instanceof File) {
    //   formData.append("picture3", values.picture3);
    // }

  // Asset
  if (values.asset) {
    formData.append("asset[name]", values.asset.name)

    if (values.asset.assetModelId) {
      formData.append("asset[assetModelId]", values.asset.assetModelId)
    }

    if (values.asset?.checkupDate) {
      formData.append("asset[checkupDate]", formatDateDDMMYYYY(values.asset.checkupDate))
    }

    if (values.asset?.expiresAt) {
      formData.append("asset[expiresAt]", formatDateDDMMYYYY(values.asset.expiresAt))
    }

    if (values.asset.notes) {
      formData.append("asset[notes]", values.asset.notes)
    }

    if (values.asset?.purchaseDate) {
      formData.append("asset[purchaseDate]", formatDateDDMMYYYY(values.asset.purchaseDate))
    }

    if (values.asset.serialNumber) {
      formData.append("asset[serialNumber]", values.asset.serialNumber)
    }

    // Components
    values.asset.components?.forEach((component, index) => {
      formData.append(
        `asset[components][${index}][componentTypeId]`,
        component.componentTypeId,
      )

      if (component.componentVariantId) {
        formData.append(
          `asset[components][${index}][componentVariantId]`,
          component.componentVariantId,
        )
      }
  

      if (component.expiresAt) {
        formData.append(`asset[components][${index}][expiresAt]`, formatDateDDMMYYYY(component.expiresAt));
      }
      

      if (component.lotNumber) {
        formData.append(
          `asset[components][${index}][lotNumber]`,
          component.lotNumber,
        )
      }

      if (component.serialNumber) {
        formData.append(
          `asset[components][${index}][serialNumber]`,
          component.serialNumber,
        )
      }
    })
  }

  const { data } = await api.post(API_ROUTES.CABINETS, formData)

  return data
}