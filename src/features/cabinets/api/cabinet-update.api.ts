
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CreateCabinetFormValues } from "./cabinet.api"

export const updateCabinet = async (
  id: string,
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

  const { data } = await api.put(`${API_ROUTES.CABINETS}/${id}`, formData)

  return data
}