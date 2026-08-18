
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

export interface CreateCabinetFormValues  {
  name: string
  description: string
  street: string
  building: string
  postalCode: string
  city: string
  country: string
  picture1: File | null
  picture2: File | null
  picture3: File | null
}

export const createCabinet = async (
  values: CreateCabinetFormValues,
) => {
  const formData = new FormData()

  formData.append("name", values.name)
  formData.append("description", values.description)
  formData.append("street", values.street)
  formData.append("building", values.building)
  formData.append("postalCode", values.postalCode)
  formData.append("city", values.city)
  formData.append("country", values.country)

  if (values.picture1) {
    formData.append("pictures", values.picture1)
  }

  if (values.picture2) {
    formData.append("pictures", values.picture2)
  }

  if (values.picture3) {
    formData.append("pictures", values.picture3)
  }

  const { data } = await api.post(API_ROUTES.CABINETS, formData)

  return data
}