
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"
import type { CreateCabinetFormValues } from "../types/cabinet"

export const createCabinet = async (
  values: CreateCabinetFormValues,
) => {
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

  return data
}