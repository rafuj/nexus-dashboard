"use client";
import { Helmet } from "react-helmet-async";
import {  ChevronDown, ChevronLeft, ChevronRight, Info, InfoIcon } from "lucide-react";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";
import {  useNavigate } from "react-router";
import { CabinetsStepper } from "../components/CabinetsStepper";
import { useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";
import SchedulePicker from "../components/SchedulePicker";
import type { AvailabilityType, DayConfig, StepType } from "../types/addCabinet";
import { availabilityTypeList, dayList, STEPS } from "../mock/addCabinetData";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { useFormik } from "formik";
import { errorToast, successToast } from "@/lib/toast";
import { useCreateCabinet } from "../hooks/useCreateCabinet";
import { useAssetTypes } from "../hooks/useAssetTypes";
import { useAssetTypesModels } from "../hooks/useAssetTypesModels";
import { useComponentTypes } from "../hooks/useComponentTypes";
import { useAssetTypesBrands } from "../hooks/useAssetTypesBrands";
import ComponentVariant from "../components/ComponentVariant";
import { mockBrandsList } from "../mock/mockBrands";
import { cabinetInitialValues } from "../types/addCabinet";
import { cabinetValidationSchema } from "../types/validationSchema";
import { getApiErrorMessage } from "@/app/api-manage/api";
import { PlacesAutocomplete } from "@/shared/components/places-autocomplete";
import { COUNTRY_OPTIONS, formatPostalCode, getCitiesByCountry } from "@/lib/country-helper";

export interface BrandInfo {
  name: string;
  model: string;
}


export default function AddCabinets() {
  const navigate = useNavigate();

  const [step, setStep] = useState<StepType>('basic-information')
  
  const [availability, setAvailability] = useState<AvailabilityType>('24/7')
  
  const [schedule, setSchedule] = useState<DayConfig[]>(dayList)

  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    name: "",
    model: ""
  })

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const createCabinetMutation = useCreateCabinet()

  // Basic Information
  const formik = useFormik({
    initialValues: cabinetInitialValues(),
    validationSchema: cabinetValidationSchema,
    onSubmit: async (values) => {
      try {
        await createCabinetMutation.mutateAsync(values)
        successToast("Cabinet created successfully")
        setStep("basic-information")
        setConfirmModalOpen(false)
        setSuccessModalOpen(true)
        formik.resetForm()
      } catch (error) {
          errorToast(getApiErrorMessage(error));
      }
    },
  });

  const {values, setValues, setFieldValue, errors, touched, handleChange, handleBlur} = formik
  
  const { data: assetTypes, isLoading } = useAssetTypes()
  const { data: brandsList } = useAssetTypesBrands(values.asset.id)
  const { data: modelsList } = useAssetTypesModels(values.asset.id, {brand: values.asset.brand })
  const { data: componentTypes } = useComponentTypes()
  
  const handleImageChange = (
    key: "picture1" | "picture2" | "picture3",
    file: File | null
  ) => {
    if (!file) return;
    setFieldValue(key, URL.createObjectURL(file))
  };

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
      if(errors.name || errors.addressLine1 || errors.zipCode || errors.city || errors.country || errors.accessType) {
        return
      } else {
        formik.setErrors({})
        formik.setTouched({})
        setStep("asset-information")
      }
    }

    if (step === "asset-information") {
      if(Object.keys(errors).length !== 0){
        errorToast("Please fill all required fields")
      }else {
        setConfirmModalOpen(true)
      }
    }
  };

  const availableCities = useMemo(() => {
    if (values.country) {
      return getCitiesByCountry(values.country);
    }

    return [];
  }, [values.country]);


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
                      className={cn("data-[state=open]:text-sidebar-accent-foreground cursor-pointer rounded-none !bg-white !ring-0 border border-border h-12.5 rounded-[10px] font-semibold !text-accent-foreground !px-5 text-xs")}
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
                      {!isLoading && assetTypes?.map((option) => (
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
                        }} disabled={!brandsList}>
                        <SelectTrigger className={cn("w-full !h-12.5")}>
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Brand" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {
                            brandsList?.map((item)=> <SelectItem value={item} key={item+"brand"}>{item}</SelectItem> )
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
                        }} disabled={!modelsList}>
                        <SelectTrigger className={cn("w-full !h-12.5")}>
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Model" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {
                            modelsList?.map((item)=> <SelectItem value={item.id} key={item+"model"}>{item.modelName}</SelectItem> )
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
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Date of purchase</Label>
                        <DatePicker className="!bg-white text-xs pl-5 pr-4"
                          dateType="past"
                          value={values.asset.purchaseDate}
                          onChange={(value)=>setFieldValue("asset.purchaseDate", value)} />
                      </div>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">Next check-up</Label>
                        <DatePicker className="!bg-white text-xs pl-5 pr-4"
                          dateType="future"
                          value={values.asset.checkupDate} 
                          onChange={(value)=>setFieldValue("asset.checkupDate", value)} />
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
                            onChange={(value)=>setFieldValue("asset.expiresAt", value)} />
                        </div>
                        <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">Check-Up Date</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4" 
                            dateType="future"
                            value={values.asset.checkupDate} 
                            onChange={(value)=>setFieldValue("asset.checkupDate", value)} />
                        </div>
                        <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">Date of Purchase</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4" 
                            dateType="past"
                            value={values.asset.purchaseDate} 
                            onChange={(value)=>setFieldValue("asset.purchaseDate", value)} />
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
                  />
                </div>
            </div>
            {values.asset.id === "1" && (
              componentTypes?.map((componentType:{id:string, name:string})=> (
                  <ComponentVariant componentType={componentType} key={componentType.id} formik={formik} />
                ))
            )}
          </div>
        )
      default: 
        return (
            <div>
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
                      maxLength={50}
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
                    />
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                  <span className="w-0 grow">Address Info</span>
                  <InfoIcon size={20} />
                </div>
                <div className="pb-3 grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Address Line 1 <span className="text-error">*</span></Label>
                    <PlacesAutocomplete
                      placeholder="Search for an address"
                      value={values.addressLine1}
                      onValueChange={(value)=> setFieldValue("addressLine1", value)}
                      onPlaceSelect={(place) => {
                        const { postalCode, countryCode, city, address } = place
                          const country = countryCode?.toUpperCase() ?? '';
                          setValues({
                            ...values,
                            addressLine1: address,
                            country: country,
                            city: city ?? '',
                            zipCode: formatPostalCode(postalCode || '', country),
                          });
                          handleBlur("zipCode")
                      }}
                    />
                    {touched.addressLine1 && errors.addressLine1 && <p className="mt-1 text-error text-xs">{errors.addressLine1}</p> }
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
                    />
                  </div>
                </div>
                <div className="pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Zip code <span className="text-error">*</span></Label>
                    <Input
                      placeholder="Enter zip code"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20 !bg-transparent"
                      name="zipCode"
                      value={values.zipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched.zipCode ? errors.zipCode : ''}
                      maxLength={12}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">City <span className="text-error">*</span></Label>
                    <Select
                      value={values.city || ""}
                      onValueChange={(value) => setFieldValue("city", value)}
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
                          <SelectItem key={country.iso} value={country.iso}>
                            <div className="flex items-center justify-between w-full gap-2">
                              <span>{country.country}</span>
                              <span className="text-muted-foreground text-xs">({country.iso})</span>
                            </div>
                          </SelectItem>
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
                    <Select value={brandInfo.name} onValueChange={(value)=> setBrandInfo(prev => ({
                      ...prev,
                      name: value,
                      model: ""
                    }))}>
                      <SelectTrigger className={cn("w-full !h-12.5")}>
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder={"Select Brand"} /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                      {
                        mockBrandsList.map((item)=> <SelectItem value={item.brand} key={item.brand+"mock-model"}>{item.brand}</SelectItem> )
                      }
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Model<span className="text-error">*</span></Label>
                    <Select value={brandInfo.model} onValueChange={(value)=> setBrandInfo(prev => ({
                      ...prev,
                      model: value
                    }))}>
                      <SelectTrigger className={cn("w-full !h-12.5")}>
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder={"Select Model"} /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                      {
                        mockBrandsList.find(item => item.brand === brandInfo.name)?.models?.map((item)=> <SelectItem value={item} key={item+'mock-model'}>{item}</SelectItem> )
                      }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Serial number (optional)</Label>
                    <Input
                      placeholder="e.g. SN1234567890"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      name="serialNumber"
                      value={values.serialNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="text-xs mt-2">
                      Select the brand and model first. Serial Number of the Nexus brand will automatically be recognised and the remaining compatible cabinet details will be filled in automatically
                    </div>
                  </div>
                  {/* <div className="col-span-2">
                    <div className="bg-card-info rounded-md px-2.5 py-3 text-accent-foreground text-xs flex gap-2.5">
                      <Info size={18} />
                      <div className="w-0 grow self-center">
                        Not all cabinets have a serial code. You can always enter the cabinet details manually.
                      </div>
                    </div>
                  </div> */}
                </div>                
              </div>
              
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
                      })} onClick={()=> setFieldValue("accessType", 'public')}>
                        <Icons.team />
                        <div className="w-0 grow">
                          <h6 className="font-semibold text-xs">Public</h6>
                          <div className="text-xs">Accessible to everyone</div>
                        </div>
                      </button>
                      <button type="button" className={cn("flex items-center gap-3.75 text-left p-4 border border-border rounded-[10px]", {
                        "bg-primary/7 border-primary/20": 'private' === formik.values.accessType
                      })} onClick={()=> setFieldValue("accessType", 'private')}>
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
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Public availability</Label>
                    <CustomRadioGroup<AvailabilityType> value={availability} setValue={setAvailability} list={availabilityTypeList} />
                  </div>
                  {availability === 'custom-days-and-types' && (
                    <SchedulePicker schedule={schedule} onScheduleChange={setSchedule} />
                  )}
                </div>
              </div>

              {/* Situation Pictures */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75 mt-5">
                  <span className="w-0 grow">Situation Pictures</span>
                  <InfoIcon size={20} />
                </div>
                <Label className="text-xs text-accent-foreground font-medium block mb-3">Pictures <span className="text-foreground">(max. 3)</span></Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <SingleImageUploader
                    value={values.picture1}
                    onChange={(file) => handleImageChange("picture1", file)}
                    onRemove={() => setFieldValue("picture1", null)}
                  />
                  <SingleImageUploader
                    value={values.picture2}
                    onChange={(file) => handleImageChange("picture2", file)}
                    onRemove={() => setFieldValue("picture2", null)}
                  />
                  <SingleImageUploader
                    value={values.picture3}
                    onChange={(file) => handleImageChange("picture3", file)}
                    onRemove={() => setFieldValue("picture3", null)}
                  />
                </div>
              </div>
            </div>
        )
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Cabinets | Updaid</title>
      </Helmet>

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
            <span>Add Cabinet</span>
          </button>
          <div className="border bg-white rounded-[15px] mt-4 p-5">
            <div className="flex flex-wrap gap-10">
              <div className="w-full max-w-[180px] xl:max-w-[280px]">
                <div className="flex flex-col gap-10 md:sticky md:top-36">
                  <CabinetsStepper step={step} setStep={setStep} stepList={STEPS} />
                </div>
              </div>
              <div className="w-full md:w-0 grow">
                {switchContent()}
                <div className="flex flex-wrap gap-2 sm:gap-5 justify-end py-3.75 bg-white sticky bottom-0 mt-10">
                  <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]">Cancel</button>
                  <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]" onClick={handleNext}>{step === "asset-information" ? "Submit Asset" : "Next"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmationModal {
            ...{
              open:confirmModalOpen,
              setOpen: setConfirmModalOpen,
              successModalOpen,
              setSuccessModalOpen,
              values,
              handleSubmit: formik.handleSubmit,
              apiInstance:createCabinetMutation
            }
          }
        />
      </main>
    </>
  );
}
