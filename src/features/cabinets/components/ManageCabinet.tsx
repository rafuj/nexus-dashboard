import {  ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Info, InfoIcon } from "lucide-react";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";
import {  useNavigate, useParams } from "react-router";
import { CabinetsStepper } from "./CabinetsStepper";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn, formatDateSlash } from "@/lib/utils";
import SchedulePicker from "./SchedulePicker";
import type { AvailabilityType, BrightnessType, ColorType, CreateCabinetFormValues, DayConfig, VolumeType } from "../types/cabinet";
import { availabilityTypeList, brightnessList, colorList, dayList, STEPS, volumeList } from "../mock/addCabinetData";
import { ConfirmationModal } from "./ConfirmationModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { useFormik } from "formik";
import { errorToast, successToast } from "@/lib/toast";
import { useCreateCabinet } from "../hooks/useCreateCabinet";
import { useAssetTypes } from "../hooks/useAssetTypes";
import { useAssetTypesModels } from "../hooks/useAssetTypesModels";
import { useComponentTypes } from "../hooks/useComponentTypes";
import { useAssetTypesBrands } from "../hooks/useAssetTypesBrands";
import ComponentVariant from "./ComponentVariant";
import { cabinetInitialValues } from "../types/cabinet";
import { assetUpdateSchema, cabinetUpdateSchema, cabinetValidationSchema } from "../types/validationSchema";
import { getApiErrorMessage } from "@/app/api-manage/api";
import { PlacesAutocomplete } from "@/shared/components/places-autocomplete";
import { COUNTRY_OPTIONS, formatPostalCode, getCitiesByCountry } from "@/lib/country-helper";
import { AVAILABLE_CREDITS, MANAGE_CABINETS } from "@/features/dashboard/mock/mockDashboardStats";
import { useCabinetBrands } from "../hooks/useCabinetBrands";
import { useCabinetModels } from "../hooks/useCabinetModels";
import { useSerialCheck } from "../hooks/useSerialCheck";
import { useImeiCheck } from "../hooks/useImeiCheck";
import { useCreateAssets } from "../hooks/useCreateAssets";
import { LoaderButton } from "@/app/components/loader-button";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useUpdateCabinet } from "../hooks/useUpdateCabinet";
import { getFormChanges } from "@/lib/getFormChanges";
import { can, type Role } from "@/lib/permissions";
import { useAuth } from "@/app/hooks/useAuth";
import { MaintenanceMode } from "./MaintenanceMode";
import { CabinetStatistics } from "./CabinetStatistics";
import { useCabinetsView } from "../hooks/useCabinetsView";
import { useAssetView } from "../hooks/useAssetView";
import { useUpdateAsset } from "../hooks/useUpdateAsset";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUpdateAssetComponents } from "../hooks/useUpdateAssetComponents";

interface ManageCabinetProps {
  className?: string
}

export default function ManageCabinet({className}: ManageCabinetProps) {
  const navigate = useNavigate();

  const [step, setStep] = useQueryState(
    'step',
    parseAsStringEnum(STEPS.map(step => step.id)).withDefault('basic-information')
  )
  
  const { id: cabinetId } = useParams<{ id: string }>()
  const [id, setId] = useQueryState(
    "id",
    parseAsString.withDefault("")
  )
  
  const [availability, setAvailability] = useState<AvailabilityType>('24/7')

  const [schedule, setSchedule] = useState<DayConfig[]>(dayList)

  const [assignCredits, setAssignCredits] = useState<number|''>(0)

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const createCabinetMutation = useCreateCabinet()
  const updateCabinetMutation = useUpdateCabinet(cabinetId ?? id ?? '')
  const createAssetMutation = useCreateAssets()

  // Cabinet View States
  const { user } = useAuth();
  const role: Role = user?.role ?? "admin";
  const canManageCabinets = can(role, MANAGE_CABINETS)
  const [isEditing, setIsEditing] = useQueryState("isEditing", { defaultValue: "" })
  const fieldsReadOnly = !cabinetId ? false : (!canManageCabinets || (canManageCabinets && isEditing === ""))
  const { data, isSuccess, isLoading } = useCabinetsView(cabinetId ?? '')
  const { data: assetViewData, isSuccess: isAssetViewSuccess } = useAssetView(cabinetId || "")
  const updateAssetMutation = useUpdateAsset(assetViewData?.id || "")
  const updateAssetComponents = useUpdateAssetComponents()
  // Cabinet View States
  const validationSchema = useMemo(() => {
    if (!cabinetId) {
      return cabinetValidationSchema
    }

    return step === 'basic-information'
      ? cabinetUpdateSchema
      : assetUpdateSchema
  }, [cabinetId, step])
  // Basic Information
  const formik = useFormik({
    initialValues: cabinetInitialValues(),
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Only When adding a new asset
        await createAssetMutation.mutateAsync({
          ...values,
          asset: {
            ...values.asset,
            cabinetId: id || cabinetId
          }
        })
        setConfirmModalOpen(false)
        if(!cabinetId) {
          successToast("Cabinet created successfully")
          setStep("basic-information")
          setSuccessModalOpen(true)
        } else {
          successToast("Asset updated successfully")
          formik.resetForm({values})
          setIsEditing("")
        }
      } catch (error) {
          errorToast(getApiErrorMessage(error));
      }
    },
  });

  const {values, setValues, setFieldValue, errors, touched, handleChange, handleBlur} = formik
  
  const { data: assetTypes, isLoading: assetTypesLoading } = useAssetTypes()
  const { data: brandsList } = useAssetTypesBrands(values.asset.id)
  const { data: modelsList } = useAssetTypesModels(values.asset.id, {brand: values.asset.brand })
  const { data: componentTypes } = useComponentTypes()

  // CABINET BRAND and MODELS
  const { data: cabinetBrands } = useCabinetBrands()
  const { data: cabinetModels } = useCabinetModels(values.brand)
  // serial number recognition api 
  const { data: serialData, isLoading: serialLoading, isSuccess: isSerialSuccess } = useSerialCheck(values.serialNumber)
  // module code recognition api 
  const { data: imeiData, isLoading: imeiLoading, isSuccess: isImeiSuccess } = useImeiCheck(values.imei)

  useEffect(()=>{
    if(serialData && isSerialSuccess) {
      setFieldValue("serialNumberRecognition", true)
      if(!cabinetId) {
        setFieldValue("imei", serialData?.imei)
        setFieldValue("imeiRecognition", true)
      }
    } else if(isSerialSuccess && !serialData) {
      if(!cabinetId) {
        setFieldValue("imei", "")
        setFieldValue("imeiRecognition", false)
      }
    }
  },[serialData, isSerialSuccess, cabinetId])

  useEffect(()=>{
    if(imeiData && isImeiSuccess && !cabinetId) {
      setFieldValue("imeiRecognition", true)
    }
  },[imeiData, isImeiSuccess, cabinetId])

  // reset formik when there is a cabinet data
  useEffect(() => {
    if (isSuccess && isAssetViewSuccess && data && assetViewData) {
      formik.resetForm({
        values: cabinetInitialValues({
          ...data,
          asset: {
            ...assetViewData,
            cabinetId: cabinetId,
            components: assetViewData?.components?.reverse() // component array stored in reverse order 
          },
        }),
      });
    }
  }, [isSuccess, isAssetViewSuccess, data, assetViewData]);
  
  const handleImageChange = (
    key: "picture1" | "picture2" | "picture3",
    file: File | null
  ) => {
    if (!file) return;
    setFieldValue(key, URL.createObjectURL(file))
  };

  // Handle Next Button
  const handleNext = async () => {

    const errors = await formik.validateForm();

    if(Object.keys(errors).length !== 0){
      formik.setTouched(
        Object.keys(errors).reduce(
          (acc, key) => {
            acc[key] = true;
            return acc;
          },
          {} as Record<string, boolean>
        )
      );
    }

    if (step === "basic-information") {
      // Error Block
      if(errors.name || errors.addressLine1 || errors.zipCode || errors.city || errors.country || errors.accessType || errors.brand || errors.cabinetModelId || errors.imei) {
        errorToast("Please fill all required fields")
        return
      } else {
        // No Error Block
        // It means this is an update operation
        if(id) {
          handleCabinetUpdate()
        } else {
          try {
            const cabinetRes = await createCabinetMutation.mutateAsync(values)
            if(cabinetRes) {
              setId(cabinetRes.id)
              formik.setErrors({})
              formik.setTouched({})
              formik.resetForm({values})
              setStep("asset-information")
            }
            } catch (error) {
              errorToast(getApiErrorMessage(error)) 
            }
        }
      }
    }

    if (step === "asset-information") {
      if(Object.keys(errors).length !== 0){
        if(!id && !cabinetId) {
          errorToast("Please create cabinet first")
          setStep("basic-information")
        } else {
          errorToast("Please fill all required fields")
        }
      } else {
        if(values.asset.id === "1"){
          setConfirmModalOpen(true)
        } else {
          await formik.submitForm()
        }
      }
    }
  };

  // Cabinet Update Function
  const handleCabinetUpdate = async () => {
    const changes = getFormChanges(formik.initialValues, values) as CreateCabinetFormValues;
    if(Object.keys(changes).length === 0) {
      if(cabinetId) {
        errorToast("No changes found")
        setIsEditing("")
      } else {
        setStep("asset-information")
      }
      return
    }
    
    const { asset, ...otherChanges } = changes;
    const payload = {
      ...otherChanges,
      name: values.name,
      accessType: values.accessType,
      addressLine1: values.addressLine1,
      zipCode: values.zipCode,
      city: values.city,
      country: values.country,
    };
    try {
      await updateCabinetMutation.mutateAsync(payload as CreateCabinetFormValues)
      successToast("Cabinet updated successfully")
      setIsEditing("")
      formik.resetForm({values})
      if(!cabinetId) {
        setStep("asset-information")
      }
    } catch (error) {
      errorToast(getApiErrorMessage(error))
    }
  }
  // Asset Update Function
  const handleAssetUpdate = async () => {
    const changes = getFormChanges(formik.initialValues.asset, values.asset) as CreateCabinetFormValues;
    if(Object.keys(changes).length === 0) {
      errorToast("No changes found")
      return
    }
    if(assetViewData) {
      try {
        
          await updateAssetMutation.mutateAsync({
            ...values,
            asset: {
              ...values.asset,
              cabinetId,
            },
          })

          if (values.asset.components && values.asset.id === "1") {
            try {
              await updateAssetComponents.mutateAsync({
                assetId: assetViewData.id,
                components: values.asset.components,
              })
            } catch (error) {
              errorToast(getApiErrorMessage(error))
              return
            }

            successToast('Asset updated successfully')
            formik.resetForm({ values })
            
          } else {
            successToast('Asset updated successfully')
            formik.resetForm({ values })
          }
      } catch (error) {
        errorToast(getApiErrorMessage(error))
      }
    } else {
      if(values.asset.id === "1") {
        setConfirmModalOpen(true)
      } else {
        formik.handleSubmit()
      }
    }
  }

  // Handle Save Changes Button
  const handleSaveChanges = async () => {

    const errors = await formik.validateForm();

    if(Object.keys(errors).length !== 0){
      formik.setTouched(
        Object.keys(errors).reduce(
          (acc, key) => {
            acc[key] = true;
            return acc;
          },
          {} as Record<string, boolean>
        )
      );
    }

    if (step === "basic-information") {
      if(errors.name || errors.addressLine1 || errors.zipCode || errors.city || errors.country || errors.accessType || errors.brand || errors.cabinetModelId || errors.imei) {
        errorToast("Please fill all required fields")
        return
      } else {
        handleCabinetUpdate()
      }
    }

    if (step === "asset-information") {
      if(Object.keys(errors).length !== 0){
        errorToast("Please fill all required fields")
      } else {
        handleAssetUpdate()
      }
    }
  };

  const availableCities = useMemo(() => {
    if (values.country) {
      return getCitiesByCountry(values.country);
    }

    return [];
  }, [values.country]);

  const connectivityUntil = useMemo(() => {
      if (typeof assignCredits !== "number" || assignCredits <= 0) {
        return null;
      }

      const targetDate = new Date();
      // Accurately adds N years (handles leap years correctly)
      targetDate.setFullYear(targetDate.getFullYear() + assignCredits);
      return targetDate;
    }, [assignCredits]);

  const handleAssignCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

    if (value === "") {
      setAssignCredits("");
      return;
    }

    let numericValue = Number(value);
    if (numericValue > AVAILABLE_CREDITS) {
      numericValue = AVAILABLE_CREDITS;
    }

    setAssignCredits(numericValue);
  };

  const switchContent = () => {
    switch (step) {
      case 'asset-information':
        return (
          <div>
            {/* Asset Details */}
            <div>
              <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                <span className="w-0 grow">Asset Details</span>
                <InfoIcon size={20} />
              </div>
              <div>
                <Label className="text-xs text-accent-foreground font-medium block mb-3">Type of assets<span className="text-error">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className={cn("data-[state=open]:text-sidebar-accent-foreground cursor-pointer rounded-none !bg-white !ring-0 border border-border h-12.5 rounded-[10px] font-semibold !text-accent-foreground !px-5 text-xs", {
                        "!bg-[#BDBDBD]/15 !opacity-100": fieldsReadOnly
                      })}
                      disabled={fieldsReadOnly}
                    >
                      {values.asset.name || "Select Asset Type"}
                      <ChevronDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="rounded-lg w-auto min-w-[245px] p-3"
                    side={"bottom"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      {!assetTypesLoading && assetTypes?.map((option) => (
                        <DropdownMenuItem className="text-accent-foreground font-semibold text-xs h-10 py-2 px-2.5 hover:!bg-chip" 
                          onClick={()=> {
                            setFieldValue("asset.id", option.id)
                            setFieldValue("asset.name", option.name)
                          }} key={option.id}>
                          {option.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {touched.asset && errors?.asset?.name && (
                    <p className="mt-1 text-xs text-error">
                      {errors.asset.name}
                    </p>
                  )}
              </div>
              
              
                {values.asset.id === "1" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 my-3.75 gap-4">
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">Brand<span className="text-error">*</span></Label>
                      <Select value={values.asset.brand} onValueChange={(value)=> {
                          setFieldValue("asset.brand", value)
                          setFieldValue("asset.assetModelId", "")
                        }} disabled={!brandsList || fieldsReadOnly}>
                        <SelectTrigger className={cn("w-full !h-12.5")}>
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Brand" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {
                            brandsList?.map((item)=> <SelectItem value={item} key={item}>{item}</SelectItem> )
                          }
                        </SelectContent>
                      </Select>
                      {touched.asset && errors.asset?.brand && (
                          <p className="mt-1 text-xs text-error">
                            {errors.asset?.brand}
                          </p>
                        )}
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">Model<span className="text-error">*</span></Label>
                      <Select value={values.asset.assetModelId} onValueChange={(value)=> {
                          setFieldValue("asset.assetModelId", value)
                        }} disabled={!modelsList || fieldsReadOnly}>
                        <SelectTrigger className={cn("w-full !h-12.5")}>
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Model" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {
                            modelsList?.map((item)=> <SelectItem value={item.id} key={item.id}>{item.modelName}</SelectItem> )
                          }
                        </SelectContent>
                      </Select>
                      {touched.asset && errors.asset?.assetModelId && (
                        <p className="mt-1 text-xs text-error">
                          {errors.asset?.assetModelId}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-3.75 gap-4 sm:col-span-2">
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Serial number</Label>
                        <Input
                          placeholder="Enter serial number"
                          autoComplete="off"
                          className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                          name="asset.serialNumber"
                          value={values.asset.serialNumber}
                          onChange={formik.handleChange}
                          errors={touched.asset ? errors.asset?.serialNumber : ''}
                          readOnly={fieldsReadOnly}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Date of purchase</Label>
                        <DatePicker className="!bg-white text-xs pl-5 pr-4"
                          dateType="past"
                          value={values.asset.purchaseDate}
                          onChange={(value)=>setFieldValue("asset.purchaseDate", value)} disabled={fieldsReadOnly} />
                      </div>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Next check-up</Label>
                        <DatePicker className="!bg-white text-xs pl-5 pr-4"
                          dateType="future"
                          value={values.asset.checkupDate} 
                          onChange={(value)=>setFieldValue("asset.checkupDate", value)} disabled={fieldsReadOnly} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-3.75 gap-4">
                      <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">Asset Expiration Date</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4"
                            dateType="future"
                            value={values.asset.expiresAt}
                            onChange={(value)=>setFieldValue("asset.expiresAt", value)} disabled={fieldsReadOnly} />
                        </div>
                        <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">Check-Up Date</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4" 
                            dateType="future"
                            value={values.asset.checkupDate} 
                            onChange={(value)=>setFieldValue("asset.checkupDate", value)} disabled={fieldsReadOnly} />
                        </div>
                        <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">Date of Purchase</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4" 
                            dateType="past"
                            value={values.asset.purchaseDate} 
                            onChange={(value)=>setFieldValue("asset.purchaseDate", value)} disabled={fieldsReadOnly} />
                        </div>
                    </div>
                  </>
                )}
                <div className="pt-[2px]">
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Notes</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    autoComplete="off"
                    className="p-5 placeholder:text-accent-foreground/20"
                    value={values.asset.notes}
                    name="asset.notes"
                    onChange={handleChange}
                    readOnly={fieldsReadOnly}
                  />
                </div>
            </div>
            {values.asset.id === "1" && (
              componentTypes?.map((componentType:{id:string, name:string})=> (
                  <ComponentVariant componentType={componentType} key={componentType.id} formik={formik} fieldsReadOnly={fieldsReadOnly} />
                ))
            )}
          </div>
        )
      default: 
        return (
            <div>
              {cabinetId && (
                <>
                  <MaintenanceMode />
                  {/* {data?.smart && <CabinetStatistics />} */}
                  <CabinetStatistics />
                </>
              )}
              {/* Cabinet Details */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                  <span className="w-0 grow">Name & Description</span>
                  <InfoIcon size={20} />
                </div>
                <div className="pb-2">
                  <div className="mb-3">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Cabinet Name <span className="text-error">*</span></Label>
                    <Input
                      placeholder="e.g. Amsterdam Central - Platform 5"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched.name ? errors.name : ''}
                      maxLength={20}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                  <div className="mb-3">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Description</Label>
                    <Textarea
                      placeholder="Describe the location or any important details..."
                      autoComplete="off"
                      className="p-5 placeholder:text-accent-foreground/20"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                </div>
              </div>

              {/* Cabinet Location */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                  <span className="w-0 grow">Cabinet Location</span>
                  <InfoIcon size={20} />
                </div>
                <div className="pb-3 grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium flex items-center mb-3">Address Line 1<span className="text-error">*</span></Label>
                    <PlacesAutocomplete
                      placeholder="Search for an address"
                      value={values.addressLine1}
                      onValueChange={(value)=> setFieldValue("addressLine1", value)}
                      onPlaceSelect={(place) => {
                        const { postalCode, countryCode, city, lat, lng, houseNumber, street, address } = place
                          const country = countryCode?.toUpperCase() ?? '';
                          setValues({
                            ...values,
                            addressLine1: address,
                            country: country,
                            city: city ?? '',
                            zipCode: formatPostalCode(country === "LT" ? "LT"+postalCode : country === "LV" ? "LV"+postalCode : country === "EE" ? "EE"+postalCode : postalCode || '', country),
                            latitude: lat || 0,
                            longitude: lng || 0,
                            number: houseNumber || '',
                            street: street || '',
                          });
                          handleBlur("zipCode")
                      }}
                      disabled={fieldsReadOnly}
                      inputClassName={cn({
                        "!bg-[#BDBDBD]/15 !border-border cursor-auto" : fieldsReadOnly
                      })}
                    />
                    {(touched.addressLine1 || touched.latitude) && (errors.addressLine1 || errors.latitude) && <p className="mt-1 text-error text-xs">{errors.addressLine1 || errors.latitude}</p> }
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Address Line 2</Label>
                    <Input
                      placeholder="e.g. building"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="addressLine2"
                      value={values.addressLine2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Street <span className="text-error">*</span></Label>
                    <Input
                      placeholder="e.g. building"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="street"
                      value={values.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">House Number <span className="text-error">*</span></Label>
                    <Input
                      placeholder="e.g. building"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="number"
                      value={values.number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                </div>
                <div className="pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Zip code <span className="text-error">*</span></Label>
                    <Input
                      placeholder="Enter zip code"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="zipCode"
                      value={values.zipCode}
                      onChange={(e)=> {
                        const { value } = e.target;
                        const country = values.country || "";
                        const formatted = formatPostalCode(value, country);
                        setFieldValue("zipCode", formatted);
                      }}
                      onBlur={handleBlur}
                      errors={touched.zipCode ? errors.zipCode : ''}
                      maxLength={12}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">City <span className="text-error">*</span></Label>
                    <Select
                      value={values.city || ""}
                      onValueChange={(value) => setFieldValue("city", value)}
                      disabled={fieldsReadOnly}
                    >
                      <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left">
                            <SelectValue placeholder="Select city" />
                          </span>
                        </div>
                      </SelectTrigger>

                      <SelectContent>
                          {availableCities?.map((item)=> <SelectItem value={item.name} key={item.name}>{item.name}</SelectItem> )}
                          {values.city &&
                          !availableCities?.some(
                            (item) => item.name.toLowerCase() === values.city.toLowerCase()
                          ) && (
                            <SelectItem value={values.city} key={values.city}>
                              {values.city}
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Country <span className="text-error">*</span></Label>
                    <Select
                      value={values.country || ""}
                      onValueChange={(value) => {
                        setFieldValue("country", value)
                        setFieldValue("city", "")
                      }}
                      disabled={fieldsReadOnly}
                    >
                      <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left">
                            <SelectValue placeholder="Select country" />
                          </span>
                        </div>
                      </SelectTrigger>

                      <SelectContent>
                        {COUNTRY_OPTIONS.map((country) => (
                          <SelectItem key={country.iso} value={country.iso}>{country.country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.country && errors.country && <p className="mt-1 text-error text-xs">{errors.country}</p> }
                  </div>
                </div>
              </div>

              {/* Brand Details */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                  <span className="w-0 grow">Brand Details</span>
                  <InfoIcon size={20} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 my-3.75 gap-4">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Brand<span className="text-error">*</span></Label>
                    <Select value={values.brand} onValueChange={(value)=> {
                      setFieldValue("brand", value)
                      setFieldValue("cabinetModelId", "")
                      // update module code value on brand change
                      if(!cabinetId) {
                        if(value === "Nexus") {
                          setFieldValue("imei", serialData?.imei || "")
                        } else {
                          if(serialData?.imei === values.imei) {
                            setFieldValue("imei", "")
                          }
                        }
                      }
                    }} disabled={fieldsReadOnly}>
                      <SelectTrigger className={cn("w-full !h-12.5")}>
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder={"Select Brand"} /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                      {cabinetBrands?.map((item)=> <SelectItem value={item} key={item}>{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {touched.brand && errors.brand && <p className="mt-1 text-error text-xs">{errors.brand}</p> }
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Model<span className="text-error">*</span></Label>
                    <Select value={values.cabinetModelId} onValueChange={(value)=> setFieldValue("cabinetModelId", value)} disabled={fieldsReadOnly}>
                      <SelectTrigger className={cn("w-full !h-12.5")}>
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder={"Select Model"} /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                      {cabinetModels?.map((item)=> <SelectItem value={item.id} key={item.id}>{item.modelName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {touched.cabinetModelId && errors.cabinetModelId && <p className="mt-1 text-error text-xs">{errors.cabinetModelId}</p> }
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Serial number {values.brand === "Nexus" ? <span className="text-error">*</span> : "(optional)"} </Label>
                    <Input
                      placeholder="e.g. SN1234567890"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="serialNumber"
                      value={values.serialNumber}
                      onChange={(e)=> {
                        setValues({
                          ...values, 
                          serialNumberRecognition: false,
                          serialNumber: e.target.value,
                        })
                        if(!cabinetId) {
                          setFieldValue("imei", serialData?.imei === values.imei ? "" : values.imei)
                        }
                      }}
                      onBlur={handleBlur}
                      readOnly={serialLoading || !values.brand || fieldsReadOnly}
                      maxLength={50}
                      errors={touched.serialNumber ? errors.serialNumber : (errors.serialNumberRecognition ? errors.serialNumberRecognition : '')}
                    />
                    <div className="text-xs mt-2">
                      Select the brand and model first. Serial Number of the Nexus brand will automatically be recognised and the remaining compatible cabinet details will be filled in automatically
                    </div>
                  </div>
                </div>                
              </div>

              {/* Updaid Connection */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75 mt-5">
                  <span className="w-0 grow">Updaid Connection</span>
                  <InfoIcon size={20} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 my-3.75 gap-4">
                  <div className="xl:col-span-2">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Module Code<span className="text-error">*</span></Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter module code"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20 pr-10"
                        name="imei"
                        value={values.imei}
                        onChange={(e)=> {
                          setValues({
                            ...values,
                            imeiRecognition: false,
                            imei: e.target.value
                          })
                        }}
                        onBlur={handleBlur}
                        maxLength={50}
                        readOnly={Boolean(
                          (values.brand === "Nexus" && serialData?.imei) || imeiLoading
                        ) || fieldsReadOnly || Boolean(cabinetId)}
                        errors={touched.imei ? errors.imei : (errors.imeiRecognition ? errors.imeiRecognition : '')}
                      />
                      {values.imeiRecognition && <CircleCheck size={20} className="absolute top-1/2 right-3 -translate-y-1/2 text-[#11BE48]" />}
                    </div>
                    {values.imeiRecognition && (
                      <div className="text-xs font-semibold flex items-center gap-2 text-[#11BE48] mt-2">
                        <CircleCheck size={18} />
                        <span>Module code recognised</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium flex justify-between items-center mb-3">
                      <span>Assign credits<span className="text-error">*</span></span>
                      <span>Available credits: <span className={cn("text-[#11BE48]", {
                        "text-error": AVAILABLE_CREDITS === 0
                      })}>{AVAILABLE_CREDITS}</span></span>
                    </Label>
                    <Input
                      placeholder="Enter module count"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      type="number"
                      min="0"
                      max={AVAILABLE_CREDITS > 50 ? 50 : AVAILABLE_CREDITS}
                      value={assignCredits === 0 ? "" : assignCredits}
                      onChange={handleAssignCreditChange}
                      readOnly={fieldsReadOnly}
                    />
                    {AVAILABLE_CREDITS === 0 && (
                      <div className="bg-card-error rounded-md px-2.5 py-3 text-accent-foreground text-xs flex gap-2.5 mt-2">
                        <Info size={18} />
                        <div className="w-0 grow self-center">
                          <div>No sufficient amount of credits. You can buy more.</div>
                        </div>
                      </div>
                    )}
                    <div className="text-xs flex justify-between flex-wrap mt-2 gap-3">
                      <div className="grow">
                        {connectivityUntil && <div className="flex justify-between items-center border border-[#151C48] rounded px-2.5 py-1.25 bg-[#F8F9FB] text-accent-foreground">
                          <div>
                              Connectivity until:
                          </div>
                          <strong className="font-semibold">{formatDateSlash(connectivityUntil)}</strong>
                        </div>}
                      </div>
                      <div className="text-xs mt-2">1 credit = 1 year of connectivity</div>
                    </div>
                  </div>
                </div>
              </div>
              {(values.imeiRecognition || data?.imei) && (
                <>
                  {/* Sound Settings */}
                  <div>
                    <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75 mt-5">
                      <span className="w-0 grow">Sound Settings</span>
                      <InfoIcon size={20} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 my-3.75 gap-4">
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">
                          Primary Language or Buzzer
                          <span className="text-error">*</span>
                        </Label>
                        <Select value={values.primaryLanguage} onValueChange={(value) => setFieldValue("primaryLanguage", value)}>
                          <SelectTrigger className="w-full !h-12.5">
                            <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                              <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="English" /></span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="frennch">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Secondary Language (optional)</Label>
                        <Select value={values.secondaryLanguage} onValueChange={(value) => setFieldValue("secondaryLanguage", value)}>
                          <SelectTrigger className="w-full !h-12.5">
                            <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                              <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="None" /></span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="frennch">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Volume</Label>
                        <CustomRadioGroup<VolumeType> value={values.volume} setValue={(value) => setFieldValue("volume", value)} list={volumeList} />
                      </div>
                    </div>
                  </div>
                  {/* LED Settings */}
                  <div>
                    <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75 mt-5">
                      <span className="w-0 grow">LED Settings</span>
                      <InfoIcon size={20} />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Colour</Label>
                        <CustomRadioGroup<ColorType> value={values.color} setValue={(value) => setFieldValue("color", value)} list={colorList} />
                      </div>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Brightness</Label>
                        <CustomRadioGroup<BrightnessType> value={values.brightness} setValue={(value) => setFieldValue("brightness", value)} list={brightnessList} />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Access Details */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75 mt-5">
                  <span className="w-0 grow">Access Details</span>
                  <InfoIcon size={20} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Access Type <span className="text-error">*</span></Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button type="button" className={cn("flex items-center gap-3.75 text-left p-4 border border-border rounded-[10px]", {
                        "bg-primary/7 border-primary/20": 'public' === formik.values.accessType
                      })} onClick={()=> setFieldValue("accessType", 'public')} disabled={fieldsReadOnly}>
                        <Icons.team />
                        <div className="w-0 grow">
                          <h6 className="font-semibold text-xs">Public</h6>
                          <div className="text-xs">Accessible to everyone</div>
                        </div>
                      </button>
                      <button type="button" className={cn("flex items-center gap-3.75 text-left p-4 border border-border rounded-[10px]", {
                        "bg-primary/7 border-primary/20": 'private' === formik.values.accessType
                      })} onClick={()=> setFieldValue("accessType", 'private')} disabled={fieldsReadOnly}>
                        <Icons.lock2 />
                        <div className="w-0 grow">
                          <h6 className="font-semibold text-xs">Private</h6>
                          <div className="text-xs">Restricted to authorized users</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Lock code (optional)</Label>
                    <Input
                      placeholder="Enter 4-8 digit lock code"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="lockCode"
                      value={values.lockCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Public availability</Label>
                    <CustomRadioGroup<AvailabilityType> value={availability} setValue={setAvailability} list={availabilityTypeList} readOnly={fieldsReadOnly} />
                  </div>
                  {availability === 'custom-days-and-types' && (
                    <SchedulePicker schedule={schedule} onScheduleChange={setSchedule} readOnly={fieldsReadOnly} />
                  )}
                </div>
              </div>

              {/* Situation Pictures */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75 mt-5">
                  <span className="w-0 grow">Situation Pictures</span>
                  <InfoIcon size={20} />
                </div>
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Pictures <span className="text-foreground">(max. 3)</span></Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SingleImageUploader
                      value={values.picture1}
                      onChange={(file) => handleImageChange("picture1", file)}
                      onRemove={() => setFieldValue("picture1", null)}
                      readOnly={fieldsReadOnly}
                    />
                    <SingleImageUploader
                      value={values.picture2}
                      onChange={(file) => handleImageChange("picture2", file)}
                      onRemove={() => setFieldValue("picture2", null)}
                      readOnly={fieldsReadOnly}
                    />
                    <SingleImageUploader
                      value={values.picture3}
                      onChange={(file) => handleImageChange("picture3", file)}
                      onRemove={() => setFieldValue("picture3", null)}
                      readOnly={fieldsReadOnly}
                    />
                  </div>
                </div>
              </div>
            </div>
        )
    }
  };

  return (
    <main>
      <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
        <div className="flex items-center gap-3 md:gap-5">
          <CollapsedSidebarTrigger />
          <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
            <div className="md:w-0 grow">
              <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Cabinets</h1>
              <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                <li>Cabinets</li>
                <li className="mx-2"><ChevronRight size={20} /></li>
                <li className="text-accent-foreground">List</li>
              </ul>
            </div>
            <div className="flex items-center max-sm:flex-wrap gap-2.5">
              <div className="max-sm:hidden">
                <DateAndTimeChip />
              </div>
              <button type="button" className="flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                <Icons.export /> <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="p-5">
        <button type="button" className="inline-flex items-center gap-2 text-xl font-semibold text-accent-foreground" onClick={()=> navigate(-1)}>
          <ChevronLeft size={24} />
          <span>{cabinetId ? "Cabinet Details" : "Add Cabinet"}</span>
        </button>
        {!isLoading ? (
        <div className={cn(className)}>
          <div className="flex flex-wrap gap-10">
            <div className="w-full max-w-[180px] xl:max-w-[280px]">
              <div className="flex flex-col gap-10 md:sticky md:top-36">
                <CabinetsStepper step={step} setStep={setStep} stepList={STEPS} />
              </div>
            </div>
            <div className="w-full md:w-0 grow">
              {switchContent()}
              {cabinetId ? <>
                {canManageCabinets && (
                    <div className="flex flex-wrap gap-3 sm:gap-5 justify-end py-3.75 bg-background sticky bottom-0 mt-10 w-full">
                      {isEditing ? (
                        <>
                          <button type="button" 
                            className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]"
                            onClick={()=> setIsEditing("")}
                          >
                            Cancel
                          </button>
                          <LoaderButton type="button" 
                            className="flex items-center justify-center bg-primary text-white py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px] min-h-11"
                            onClick={handleSaveChanges}
                            loading={updateCabinetMutation.isPending || updateAssetMutation.isPending}
                          >
                            Save Changes
                          </LoaderButton>
                        </>
                      ) : (
                        <button type="button" 
                          className="flex items-center justify-center bg-primary text-white py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 min-w-[83px] ml-auto"
                          onClick={()=> setIsEditing("true")}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  )}
                </> : (
                  <div className="flex flex-wrap gap-2 sm:gap-5 justify-end py-3.75 bg-white sticky bottom-0 mt-10">
                    <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]" onClick={()=> navigate("/cabinets/list")}>
                      Cancel
                    </button>
                    <LoaderButton type="submit" loading={createCabinetMutation.isPending || createAssetMutation.isPending || updateCabinetMutation.isPending} className="flex items-center justify-center bg-primary text-white min-h-9 sm:min-h-11 sm:!py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]" onClick={handleNext}>
                      {step === "asset-information" ? "Submit Asset" : "Next"}
                    </LoaderButton>
                  </div>
                )}
            </div>
          </div>
        </div>
        ) : (
        <div className="p-7 bg-white h-[calc(100vh-280px)]">
            <div className="flex flex-wrap gap-24">
              <div className="flex flex-col gap-3 w-full md:w-[200px]">
                <Skeleton className="h-[20px] rounded" />
                <Skeleton className="h-[20px] rounded" />
                <Skeleton className="h-[20px] rounded" />
              </div>
              <div className="w-0 grow">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-5 gap-5">
                    <Skeleton className="h-16 rounded" />
                    <Skeleton className="h-16 rounded" />
                    <Skeleton className="h-16 rounded" />
                    <Skeleton className="h-16 rounded" />
                    <Skeleton className="h-16 rounded" />
                  </div>
                  <Skeleton className="h-[50px] rounded" />
                  <Skeleton className="h-[50px] rounded" />
                  <Skeleton className="h-[150px] rounded" />
                  <Skeleton className="h-[50px] rounded" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal {
          ...{
            open:confirmModalOpen,
            setOpen: setConfirmModalOpen,
            successModalOpen,
            setSuccessModalOpen,
            values,
            handleSubmit: formik.handleSubmit,
            id: id,
            isLoading: createAssetMutation.isPending,
            resetForm: () => {
              formik.resetForm();
              setStep("basic-information");
              setId("")
            }
          }
        }
      />
    </main>
  );
}
