"use client";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Info, InfoIcon } from "lucide-react";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";
import {  useNavigate, useParams } from "react-router";
import { CabinetsStepper } from "../components/CabinetsStepper";
import { useEffect, useState } from "react";
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn, convertDDMMYYYY } from "@/lib/utils";
import SchedulePicker from "../components/SchedulePicker";
import { cabinetInitialValues, type AvailabilityType, type BrightnessType, type ColorType, type DayConfig, type StepType, type VolumeType } from "../types/addCabinet";
import { availabilityTypeList, brightnessList, colorList, dayList, STEPS, volumeList } from "../mock/addCabinetData";
import { AVAILABLE_CREDITS, MANAGE_CABINETS } from "@/features/dashboard/mock/mockDashboardStats";
import { can, type Role } from "@/lib/permissions";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryState } from "nuqs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { CabinetStatistics } from "../components/CabinetStatistics";
import type { BrandInfo } from "./AddCabinets";
import { mockBrandsList } from "../mock/mockBrands";
import { MaintenanceMode } from "../components/MaintenanceMode";
import { useFormik } from "formik";
import { errorToast, successToast } from "@/lib/toast";
import { COUNTRY_OPTIONS } from "@/lib/country-helper";
import { useAssetTypes } from "../hooks/useAssetTypes";
import { useAssetTypesBrands } from "../hooks/useAssetTypesBrands";
import { useAssetTypesModels } from "../hooks/useAssetTypesModels";
import { useComponentTypes } from "../hooks/useComponentTypes";
import ComponentVariant from "../components/ComponentVariant";
import { useCabinetsView } from "../hooks/useCabinetsView";
import { useAssetView } from "../hooks/useAssetView";
import { useUpdateCabinet } from "../hooks/useUpdateCabinet";
import { cabinetAssetUpdateSchema, cabinetUpdateSchema } from "../types/validationSchema";
import type { ComponentTypesAED } from "../api/componentTypes.api";
import { getFormChanges } from "@/lib/getFormChanges";
import type { CreateCabinetFormValues } from "../api/cabinet.api";

interface CabinetDetails {
  serialNumber: string;
  moduleCode: string;
  assignCredits: string;
  lockCode: string;
}

const CabinetView = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState<StepType>('basic-information')
  const [volume, setVolume] = useState<VolumeType>('0%')
  const [brightness, setBrightness] = useState<BrightnessType>('0%')
  const [color, setColor] = useState<ColorType>('white')
  const [availability, setAvailability] = useState<AvailabilityType>('custom-days-and-types')
  const [schedule, setSchedule] = useState<DayConfig[]>(dayList)

  // const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  // const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)
  
  const [cabinetDetails, setCabinetDetails] = useState<CabinetDetails>({
    serialNumber:"",
    moduleCode: "NEXUSMODULEXC43",
    assignCredits: "1",
    lockCode: "UDWKSNDMS"
  })
  
  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    name: "",
    model: "",
  })
  const { id } = useParams()
  const { data, isSuccess } = useCabinetsView(id ?? '')
  const updateCabinetMutation = useUpdateCabinet(id ?? '')
  
  const { data: assetViewData, isSuccess: isAssetViewSuccess } = useAssetView(id || "")
  // const updateAssetMutation = useUpdateAsset(assetViewData?.id ?? '')
  
  console.log("assetViewData", assetViewData)

  useEffect(() => {
    if (isSuccess && isAssetViewSuccess && data && assetViewData) {
      // 2. Separate pads and battery from the reversed array
      const padsComponents = [...(assetViewData?.components || [])].filter(
        (c: any) => c.componentTypeId === "1"
      );

      const batteryComponent = [...(assetViewData?.components || [])].find(
        (c: any) => c.componentTypeId === "2"
      );
      formik.resetForm({
        values: cabinetInitialValues({
          ...data,
          asset: {
            assetModelId: assetViewData?.assetModelId,
            checkupDate: convertDDMMYYYY(assetViewData?.checkupDate),
            expiresAt: convertDDMMYYYY(assetViewData?.expiresAt),
            purchaseDate: convertDDMMYYYY(assetViewData?.purchaseDate),
            name: assetViewData?.name,
            notes: assetViewData?.notes,
            serialNumber: assetViewData?.serialNumber,
            brand: assetViewData?.assetModel?.brand,
            id: assetViewData?.assetModel?.assetTypeId,
            cabinetId: id,

            components: [
              // Slot 0: 1st Set Pads
              {
                componentTypeId: "1",
                componentVariantId: padsComponents[0]?.componentVariantId || "",
                expiresAt: convertDDMMYYYY(padsComponents[0]?.expiresAt),
                lotNumber: padsComponents[0]?.lotNumber || "",
                serialNumber: padsComponents[0]?.serialNumber || "",
                componentVariantName: padsComponents[0]?.componentVariant?.name || "",
              },
              // Slot 1: 2nd Set Pads
              {
                componentTypeId: "1",
                componentVariantId: padsComponents[1]?.componentVariantId || "",
                expiresAt: convertDDMMYYYY(padsComponents[1]?.expiresAt),
                lotNumber: padsComponents[1]?.lotNumber || "",
                serialNumber: padsComponents[1]?.serialNumber || "",
                componentVariantName: padsComponents[1]?.componentVariant?.name || "",
              },
              // Slot 2: Battery
              {
                componentTypeId: "2",
                componentVariantId: batteryComponent?.componentVariantId || "",
                expiresAt: convertDDMMYYYY(batteryComponent?.expiresAt),
                lotNumber: batteryComponent?.lotNumber || "",
                serialNumber: batteryComponent?.serialNumber || "",
                componentVariantName: batteryComponent?.componentVariant?.name || "",
              },
            ],
          },
        }),
      });
    }
  }, [isSuccess, isAssetViewSuccess, data, assetViewData]);

  const formik = useFormik({
    initialValues: cabinetInitialValues(),
    validationSchema: step === "asset-information" ? cabinetAssetUpdateSchema : cabinetUpdateSchema,
    onSubmit: async () => {

      try {

        // await updateCabinetMutation.mutateAsync(values);
        const changes = getFormChanges(formik.initialValues, values) as CreateCabinetFormValues;

        // Extract asset changes cleanly; default to empty object to prevent runtime errors
        const { asset: assetChanges, ...otherChanges } = changes;
        const { components: componentChanges, ...restAsset } = assetChanges || {};

        const { components: components2, ...rest } = values.asset

        const hasRestAsset = Object.keys(restAsset).length > 0;
        const hasComponentChanges = Boolean(componentChanges);

        const payload = {
          ...otherChanges,
          name: values.name,
          accessType: values.accessType,
          addressLine1: values.addressLine1,
          zipCode: values.zipCode,
          city: values.city,
          country: values.country,
          ...((hasRestAsset || hasComponentChanges) && {
            asset: {
              ...(hasRestAsset && {...rest}),
              ...(hasComponentChanges && { 
                  components: values.asset.components, 
                  name: rest.name,
                  id: rest.id, 
                }),
              },
          }),
        };

        await updateCabinetMutation.mutateAsync(payload as CreateCabinetFormValues)
        successToast("Updated successfully")
        setIsEditing("")
        formik.resetForm({values})
        // setStep("basic-information")
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Something went wrong",
        );
      }
    },
  });

  // const handleSave =() =>{
  //   if(step === "asset-information") {
  //     setConfirmModalOpen(true)
  //   } else {
  //     formik.handleSubmit()
  //   }
  // }

  const {values, setFieldValue, errors, touched, handleChange, handleBlur} = formik

  console.log("values", values)
  console.log("errors", errors)
  
  const { data: assetTypes, isLoading } = useAssetTypes()
    const { data: brandsList } = useAssetTypesBrands(values.asset.id)
    const { data: modelsList } = useAssetTypesModels(values.asset.id, {brand: values.asset.brand })
    const { data: componentTypes } = useComponentTypes()

  const { user } = useAuth();
  const role: Role = user?.role ?? "viewer";

  const canManageCabinets = can(role, MANAGE_CABINETS)

  const [isEditing, setIsEditing] = useQueryState("isEditing", { defaultValue: "" })

  const fieldsReadOnly = !canManageCabinets || (canManageCabinets && isEditing === "")

  const handleImageChange = (
    key: "picture1" | "picture2" | "picture3",
    file: File | null
  ) => {
    if (!file) return;
    setFieldValue(key, URL.createObjectURL(file))
  };


  const switchContent = () => {
    switch (step) {
      case 'cabinet-details':
        return (
            <div>
              {/* Brand Details */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                  <span className="w-0 grow">Brand Details</span>
                  <InfoIcon size={20} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 my-3.75 gap-4">
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Serial number (optional)</Label>
                    <Input
                      placeholder="e.g. SN1234567890"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      value={cabinetDetails.serialNumber}
                      onChange={(e)=> setCabinetDetails(prev => ({
                        ...prev,
                        serialNumber: e.target.value
                      }))}
                    />
                    <div className="text-xs mt-2">If the serial number is recognised the brand, model and module code (if applicable) will be filled in automatically.</div>
                    <div className="flex items-center text-sm text-accent-foreground my-5 gap-3">
                      <span className="h-px grow bg-accent-foreground"></span>
                      <span>Or enter cabinet details manually</span>
                      <span className="h-px grow bg-accent-foreground"></span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Brand<span className="text-error">*</span></Label>
                    <Select value={brandInfo.name} onValueChange={(value)=> setBrandInfo(prev => ({
                      ...prev,
                      name: value,
                      model: ""
                    }))} disabled={fieldsReadOnly}>
                      <SelectTrigger className={cn("w-full !h-12.5")}>
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Brand" /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                      {
                        mockBrandsList.map((item)=> <SelectItem value={item.brand} key={item.brand}>{item.brand}</SelectItem> )
                      }
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Model<span className="text-error">*</span></Label>
                    <Select value={brandInfo.model} onValueChange={(value)=> setBrandInfo(prev => ({
                      ...prev,
                      model: value
                    }))} disabled={fieldsReadOnly}>
                      <SelectTrigger className={cn("w-full !h-12.5")}>
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Model" /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                      {
                        mockBrandsList.find(item => item.brand === brandInfo.name)?.models?.map((item)=> <SelectItem value={item} key={item}>{item}</SelectItem> )
                      }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <div className="bg-card-info rounded-md px-2.5 py-3 text-accent-foreground text-xs flex gap-2.5">
                      <Info size={18} />
                      <div className="w-0 grow self-center">
                        Not all cabinets have a serial code. You can always enter the cabinet details manually.
                      </div>
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
                <div className="grid grid-cols-1 my-3.75 gap-4">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Module Code<span className="text-error">*</span></Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter module code"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20 pr-10"
                        readOnly={fieldsReadOnly}
                        value={cabinetDetails.moduleCode}
                        onChange={(e)=> setCabinetDetails(prev => ({
                          ...prev,
                          moduleCode: e.target.value
                        }))}
                      />
                      {/* if code recognised */}
                      <CircleCheck size={20} className="absolute top-1/2 right-3 -translate-y-1/2 text-[#11BE48]" />
                      {/* else this close icon is hidden for now */}
                      {/* <XCircle size={20} className="absolute top-1/2 right-3 -translate-y-1/2 text-error" /> */}
                    </div>
                    <div className="text-xs font-semibold flex items-center gap-2 text-[#11BE48] mt-2">
                      <CircleCheck size={18} />
                      <span>Module code recognised</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium flex justify-between items-center mb-3">
                      <span>Assign credits<span className="text-error">*</span></span>
                      <span>Available credits: <span className={cn("text-[#11BE48]", {
                        "text-error":AVAILABLE_CREDITS === 0
                      })}>{AVAILABLE_CREDITS}</span></span>
                    </Label>
                    <Input
                      placeholder="Enter module count"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      type="number"
                      min="0"
                      readOnly={fieldsReadOnly}
                      value={cabinetDetails.assignCredits}
                      onChange={(e)=> setCabinetDetails(prev => ({
                        ...prev,
                        assignCredits: e.target.value
                      }))}
                    />
                    {AVAILABLE_CREDITS == 0 && (
                      <div className="bg-card-error rounded-md px-2.5 py-3 text-accent-foreground text-xs flex gap-2.5 mt-2">
                        <Info size={18} />
                        <div className="w-0 grow self-center">
                          <div>No sufficient amount of credits. You can buy more.</div>
                        </div>
                      </div>
                    )}
                    <div className="text-xs mt-2">1 credit = 1 year of connectivity</div>
                  </div>
                </div>
              </div>
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
                    <Select disabled={fieldsReadOnly}>
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
                    <Select disabled={fieldsReadOnly}>
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
                    <CustomRadioGroup<VolumeType> value={volume} setValue={setVolume} list={volumeList} readOnly={fieldsReadOnly} />
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
                    <CustomRadioGroup<ColorType> value={color} setValue={setColor} list={colorList} readOnly={fieldsReadOnly} />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Brightness</Label>
                    <CustomRadioGroup<BrightnessType> value={brightness} setValue={setBrightness} list={brightnessList} readOnly={fieldsReadOnly} />
                  </div>
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
                      readOnly={fieldsReadOnly}
                      value={cabinetDetails.lockCode}
                      onChange={(e)=> setCabinetDetails(prev => ({
                        ...prev,
                        lockCode: e.target.value
                      }))}
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
            </div>
        )
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
                      {!fieldsReadOnly && <ChevronDown className="ml-auto size-4" />}
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
                      // }} disabled={!brandsList || fieldsReadOnly}>
                      }} disabled={true}>
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
                      // }} disabled={!modelsList || fieldsReadOnly}>
                      }} disabled={true}>
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
                )
              }

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-3.75 gap-4">
                <div className="sm:col-span-2 xl:col-span-3">
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Notes</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    autoComplete="off"
                    className="p-5 placeholder:text-accent-foreground/20"
                    readOnly={fieldsReadOnly}
                    value={values.asset.notes}
                    name="asset.notes"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {values.asset.id === "1" && (
              componentTypes?.map((componentType:ComponentTypesAED)=> (
                  <ComponentVariant componentType={componentType} key={componentType.id} formik={formik} fieldsReadOnly={fieldsReadOnly} />
                ))
            )}
          </div>
        )
      default: 
        return (
            <div>
                <MaintenanceMode />
                <CabinetStatistics />
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
                      readOnly={fieldsReadOnly}
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched.name ? errors.name : ''}
                      
                    />
                  </div>
                  <div className="mb-3">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Description</Label>
                    <Textarea
                      placeholder="Describe the location or any important details..."
                      autoComplete="off"
                      className="px-5 pt-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
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
                    <Input
                      placeholder="Enter address 1"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      name="addressLine1"
                      value={values.addressLine1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched.addressLine1 ? errors.addressLine1 : ''}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Address Line 2</Label>
                    <Input
                      placeholder="Enter address 2"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
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
                      placeholder="city"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      name="zipCode"
                      value={values.zipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched.zipCode ? errors.zipCode : ''}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">City <span className="text-error">*</span></Label>
                    <Input
                      placeholder="Enter City"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={touched.city ? errors.city : ''}
                    />
                  </div>
                  <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">Country <span className="text-error">*</span></Label>
                      <Select
                        value={values.country || ""}
                        onValueChange={(value) => setFieldValue("country", value)}
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
                            <SelectItem key={country.iso2} value={country.iso2}>
                              <div className="flex items-center justify-between w-full gap-2">
                                <span>{country.name}</span>
                                <span className="text-muted-foreground text-xs">({country.iso2})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                </div>
              </div>

              {/* Situation Pictures */}
              {!fieldsReadOnly && (!values.picture1 && !values.picture2 && !values.picture3) && (
                <div>
                  <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                    <span className="w-0 grow">Situation Pictures</span>
                    <InfoIcon size={20} />
                  </div>
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
              )}
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
              </div>
            </div>
          </div>
        </header>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" className="inline-flex items-center gap-2 text-xl font-semibold text-accent-foreground" onClick={()=> navigate(-1)}>
              <ChevronLeft size={24} />
              <span>Cabinet Details</span>
            </button>
          </div>
          <div className="rounded-[15px] mt-6 md:pl-5">
            <div className="flex flex-wrap gap-10">
              <div className="w-full max-w-[180px] xl:max-w-[280px]">
                <div className="flex flex-col gap-10 md:sticky md:top-36">
                  <CabinetsStepper step={step} setStep={setStep} stepList={STEPS} hideLine />
                </div>
              </div>
              <div className="w-full md:w-0 grow">
                {switchContent()}
                {canManageCabinets && (
                  <div className="flex flex-wrap gap-3 sm:gap-5 justify-end py-3.75 bg-background sticky bottom-0 mt-10 w-full">
                    {/* If want to remove sticky */}
                    {/* <div className="flex flex-wrap gap-3 sm:gap-5 justify-end py-3.75 bg-background mt-10 w-full"> */}
                    {isEditing ? (
                      <>
                        <button type="button" 
                          className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]"
                          onClick={()=> setIsEditing("")}
                        >
                          Cancel
                        </button>
                        <button type="button" 
                          className="flex items-center justify-center bg-primary text-white py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]"
                          onClick={()=>formik.handleSubmit()}
                        >
                          Save Changes
                        </button>
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
              </div>
            </div>
          </div>

        </div>
        {/* <ConfirmationModal {
            ...{
              open:confirmModalOpen,
              setOpen: setConfirmModalOpen,
              successModalOpen,
              setSuccessModalOpen,
              values,
              handleSubmit: formik.handleSubmit
            }
        } /> */}
      </main>
    </>
  );
};

export default CabinetView;