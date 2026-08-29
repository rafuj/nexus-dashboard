
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CreateCabinetFormValues } from "../types/cabinet"

export const createCabinet = async (
  values: CreateCabinetFormValues,
) => {
  // const formData = new FormData()

  // Cabinet
  // formData.append("name", values.name)
  // formData.append("accessType", values.accessType)
  // formData.append("addressLine1", values.addressLine1)
  // formData.append("latitude", values.latitude)
  // formData.append("longitude", values.longitude)
  // formData.append("zipCode", values.zipCode)
  // formData.append("city", values.city)
  // formData.append("country", values.country)
  // formData.append("cabinetModelId", values.cabinetModelId)

  // if (values.addressLine2) {
  //   formData.append("addressLine2", values.addressLine2)
  // }
  // if (values.brand === "Nexus") {
  //   formData.append("serialNumber", values.serialNumber)
  // } else {
  //   if(values.imei){
  //     formData.append("imei", values.imei)
  //   }
  //   if(values.serialNumber){
  //     formData.append("customSerialNumber", values.serialNumber)
  //   }
  // }
  // if (values.lockCode) {
  //   formData.append("lockCode", values.lockCode)
  // }
  // if (values.description) {
  //   formData.append("description", values.description)
  // }

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

    const payload = {
      name: values.name,
      accessType: values.accessType,
      street: values.street,
      number: values.number,
      latitude: values.latitude,
      longitude: values.longitude,
      zipCode: values.zipCode,
      city: values.city,
      country: values.country,
      cabinetModelId: values.cabinetModelId,
      addressLine2: values.addressLine2,
      lockCode: values.lockCode,
      description: values.description,
      ...(values.brand === "Nexus"
        ? {
            serialNumber: values.serialNumber || '',
          }
        : {
            customSerialNumber: values.serialNumber || '',
            imei: values.imei || '',
          }),
    }


  const { data } = await api.post(API_ROUTES.CABINETS, payload)
  // const { data } = await api.post(API_ROUTES.CABINETS, formData)

  return data
}