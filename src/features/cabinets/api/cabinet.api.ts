
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { BrightnessType, ColorType, VolumeType } from "../types/cabinet"


export interface CreateCabinetFormValues  {
  accessType: "public" | "private"
  addressLine1: string
  name: string
  description?: string
  addressLine2: string
  latitude: string
  longitude: string
  zipCode: string
  city: string
  country: string
  serialNumber: string
  customSerialNumber?: string // only for ui
  lockCode: string
  picture1: File | null
  picture2: File | null
  picture3: File | null
  
  // model
  cabinetModelId: string
  brand: string // only for ui
  cabinetModel?: {
    brand: string
  }
  serialNumberRecognition: boolean // for logic
  imeiRecognition: boolean // only for ui
  
  // optional values for create cabinet
  imei: string
  volume: VolumeType
  color: ColorType
  brightness: BrightnessType
  primaryLanguage: string
  secondaryLanguage: string

  // asset info
  asset: {
    id: string // id is for error handling not for apies
    brand: string // brand is for error handling not for apies
    cabinetId?: string // cabinetId is for error handling not for apies
    assetModelId?: string
    assetModel?: { // only for ui
      brand: string
      assetTypeId: string
    }
    checkupDate?: Date | undefined
    components?: {
        componentTypeId: string
        componentVariantId?: string
        componentVariantName?: string // is set to visible in ui not for apies
        expiresAt: Date | undefined
        lotNumber?: string
        serialNumber?: string
        id: string // for update api
    }[]
    expiresAt?: Date | undefined
    name: string
    notes?: string
    purchaseDate?: Date | undefined
    serialNumber?: string
  }
}

export const createCabinet = async (
  values: CreateCabinetFormValues,
) => {
  const formData = new FormData()

  // Cabinet
  formData.append("name", values.name)
  formData.append("accessType", values.accessType)
  formData.append("addressLine1", values.addressLine1)
  formData.append("latitude", values.latitude)
  formData.append("longitude", values.longitude)
  formData.append("zipCode", values.zipCode)
  formData.append("city", values.city)
  formData.append("country", values.country)
  formData.append("cabinetModelId", values.cabinetModelId)

  if (values.addressLine2) {
    formData.append("addressLine2", values.addressLine2)
  }
  if (values.brand === "Nexus") {
    formData.append("serialNumber", values.serialNumber)
  } else {
    if(values.imei){
      formData.append("imei", values.imei)
    }
    if(values.serialNumber){
      formData.append("customSerialNumber", values.serialNumber)
    }
  }
  if (values.lockCode) {
    formData.append("lockCode", values.lockCode)
  }
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


  const { data } = await api.post(API_ROUTES.CABINETS, formData)

  return data
}