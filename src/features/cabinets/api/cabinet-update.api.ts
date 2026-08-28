
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CreateCabinetFormValues } from "./cabinet.api"

export const updateCabinet = async (
  id: string,
  values: CreateCabinetFormValues,
) => {
  const formData = new FormData()

  // Cabinet
  if(values.name) {
    formData.append("name", values.name)
  }
  if(values.accessType) {
    formData.append("accessType", values.accessType)
  }
  if(values.addressLine1) {
    formData.append("addressLine1", values.addressLine1)
  }
  if(values.latitude){
    formData.append("latitude", values.latitude)
  }
  if(values.longitude){
    formData.append("longitude", values.longitude)
  }
  if(values.addressLine2) {
    formData.append("addressLine2", values.addressLine2)
  }
  if(values.zipCode) {
    formData.append("zipCode", values.zipCode)
  }
  if(values.city) {
    formData.append("city", values.city)
  }
  if(values.country) {
    formData.append("country", values.country)
  }
  if (values.brand === "Nexus") {
    if(values.serialNumber) {
      formData.append("serialNumber", values.serialNumber)
    }
  } else {
    // reason behind this is IMEI is not updatable like this
    // if(values.imei){
    //   formData.append("imei", values.imei)
    // }
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

  const { data } = await api.put(`${API_ROUTES.CABINETS}/${id}`, formData)

  return data
}