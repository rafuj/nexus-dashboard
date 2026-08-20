"use client";
import { Helmet } from "react-helmet-async";
import {  ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Info, InfoIcon, Settings, ShoppingCart } from "lucide-react";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";
import {  useNavigate } from "react-router";
import { CabinetsStepper } from "../components/CabinetsStepper";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn, formatDateSlash } from "@/lib/utils";
import SchedulePicker from "../components/SchedulePicker";
import type { AccessTypeI, AvailabilityType, BrightnessType, ColorType, DayConfig, StepType, VolumeType } from "../types/addCabinet";
import { availabilityTypeList, brightnessList, colorList, dayList, STEPS, volumeList } from "../mock/addCabinetData";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { AVAILABLE_CREDITS } from "@/features/dashboard/mock/mockDashboardStats";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { errorToast, successToast } from "@/lib/toast";
import type { CreateCabinetFormValues } from "../api/cabinet.api";
import { useCreateCabinet } from "../hooks/useCreateCabinet";
import { useAssetTypes } from "../hooks/useAssetTypes";
import { useAssetTypesModels } from "../hooks/useAssetTypesModels";
import { useComponentTypes } from "../hooks/useComponentTypes";
import { useAssetTypesBrands } from "../hooks/useAssetTypesBrands";
import ComponentVariant from "../components/ComponentVariant";
import { mockBrandsList } from "../mock/mockBrands";
import { COUNTRY_OPTIONS } from "@/lib/country-helper";

export interface BrandInfo {
  name: string;
  model: string;
}

const validationSchema = Yup.object({
  // step 1 (basic information)
  name: Yup.string()
    .trim()
    .required("Cabinet name is required"),

  description: Yup.string()
    .trim(),

  addressLine1: Yup.string()
    .trim()
    .required("Address is required"),

  addressLine2: Yup.string()
    .trim(),

  zipCode: Yup.string()
    .trim()
    .required("Zip code is required"),

  city: Yup.string()
    .trim()
    .required("City is required"),

  country: Yup.string()
    .trim()
    .required("Country is required"),
    // step 2 (cabinet details)
    accessType: Yup.string()
    .trim()
    .required("Access type is required"),
    // Step 3: Asset (Conditional Validation)
  asset: Yup.lazy((assetValues) => {
    const isTypeOne = String(assetValues?.id ?? "") === "1";

    return Yup.object({
      id: Yup.string().notRequired(),
      name: Yup.string().trim().required("Asset name is required"),
      assetModelId: isTypeOne ? Yup.string().trim().required("Model is required") : Yup.string().trim().notRequired(),
      
      brand: isTypeOne ? Yup.string().trim().required("Brand is required") : Yup.string().trim().notRequired(),

      components: isTypeOne
        ? Yup.array().test(
            "validate-required-components",
            "Required components validation",
            function (components) {
              if (!components || !Array.isArray(components)) return true;

              const errors = [];

              // Index 0: 1st Set Pads (Required)
              if (!components[0]?.componentVariantId) {
                errors.push(
                  this.createError({
                    path: `${this.path}[0].componentVariantId`,
                    message: "1st set pads type is required",
                  })
                );
              }
              if (!components[0]?.expiresAt) {
                errors.push(
                  this.createError({
                    path: `${this.path}[0].expiresAt`,
                    message: "1st set pads expiration date is required",
                  })
                );
              }

              // Index 1: 2nd Set Pads (Optional - No validation required)

              // Index 2: Battery (Required)
              if (!components[2]?.expiresAt) {
                errors.push(
                  this.createError({
                    path: `${this.path}[2].expiresAt`,
                    message: "Battery expiration date is required",
                  })
                );
              }

              // Return all collected errors directly as a ValidationError stack
              if (errors.length > 0) {
                return new Yup.ValidationError(errors);
              }

              return true;
            }
          )
        : Yup.array().notRequired(),

      checkupDate: Yup.date().nullable().notRequired(),
      expiresAt: Yup.date().nullable().notRequired(),
      purchaseDate: Yup.date().nullable().notRequired(),
      serialNumber: Yup.string().trim().notRequired(),
      notes: Yup.string().trim().notRequired(),
    });
  }),
});
const initialValues: CreateCabinetFormValues = {
  accessType: "public",

  name: "",
  description: "",

  addressLine1: "",
  addressLine2: "",
  zipCode: "",
  city: "",
  country: "",

  serialNumber: "",
  lockCode: "",

  picture1: null,
  picture2: null,
  picture3: null,

  asset: {
    assetModelId: "",
    checkupDate: undefined,
    components: [
      { componentTypeId: "1", componentVariantId: "", expiresAt: undefined, lotNumber: "", serialNumber: "", componentVariantName: "" }, // Index 0: 1st Set Pads (Required)
      { componentTypeId: "1", componentVariantId: "", expiresAt: undefined, lotNumber: "", serialNumber: "", componentVariantName: "" }, // Index 1: 2nd Set Pads (Optional)
      { componentTypeId: "2", componentVariantId: "", expiresAt: undefined, lotNumber: "", serialNumber: "" }, // Index 2: Battery (Required)
    ],
    expiresAt: undefined,
    name: "",
    notes: "",
    purchaseDate: undefined,
    serialNumber: "",

    // states for validations
    brand: "",
    id: "",
  },
}

export default function AddCabinets() {
  const navigate = useNavigate();

  const [step, setStep] = useState<StepType>('basic-information')
  
  const [volume, setVolume] = useState<VolumeType>('0%')
  const [brightness, setBrightness] = useState<BrightnessType>('0%')
  const [color, setColor] = useState<ColorType>('white')
  const [availability, setAvailability] = useState<AvailabilityType>('24/7')
  
  const [schedule, setSchedule] = useState<DayConfig[]>(dayList)

  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    name: "",
    model: ""
  })

  const [assetExpiration, setAssetExpiration] = useState<Date | undefined>(new Date())

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)

  const [assignCredits, setAssignCredits] = useState<number|''>(0)

  const createCabinetMutation = useCreateCabinet()

  // Basic Information
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const cleanedComponents = values.asset?.components?.filter((comp, index) => {
          // Index 1 is 2nd set pads
          if (index === 1 && comp.componentTypeId === "1") {
            const hasValue =
              comp.componentVariantId ||
              comp.expiresAt ||
              comp.lotNumber ||
              comp.serialNumber;

            // Drop 2nd set pads if user entered nothing
            return Boolean(hasValue);
          }
          return true; // Keep 1st set pads and Battery
        });

        const payload = {
          ...values,
          asset: {
            ...values.asset,
            components: cleanedComponents,
          },
        };

        console.log("Cleaned API Payload:", payload);
        await createCabinetMutation.mutateAsync(values)
        successToast("Cabinet created successfully")
        setStep("basic-information")
        setConfirmModalOpen(false)
        setSuccessModalOpen(true)
        formik.resetForm()
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Something went wrong",
        );
      }
    },
  });

  const {values, setFieldValue, errors, touched, handleChange, handleBlur} = formik

  console.log("values",values)
  console.log("errors",errors)
  console.log("touched",touched)
  
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
      if(errors.name || errors.addressLine1 || errors.zipCode || errors.city || errors.country) {
        return
      } else {
        formik.setErrors({})
        formik.setTouched({})
        setStep("cabinet-details")
      }
    }
    if (step === "cabinet-details") {
      if(errors.accessType) {
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
                      name="serialNumber"
                      value={values.serialNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Public availability</Label>
                    <CustomRadioGroup value={availability} setValue={setAvailability} list={availabilityTypeList} />
                  </div>
                  {availability === 'custom-days-and-types' && (
                    <SchedulePicker schedule={schedule} onScheduleChange={setSchedule} />
                  )}
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
                        "text-error": AVAILABLE_CREDITS === 0
                      })}>{AVAILABLE_CREDITS}</span></span>
                    </Label>
                    <Input
                      placeholder="Enter module count"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      type="number"
                      min="0"
                      max={AVAILABLE_CREDITS}
                      value={assignCredits === 0 ? "" : assignCredits}
                      onChange={handleAssignCreditChange}
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
                    <Select>
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
                    <Select>
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
                    <CustomRadioGroup value={volume} setValue={setVolume} list={volumeList} />
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
                    <CustomRadioGroup value={color} setValue={setColor} list={colorList} />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Brightness</Label>
                    <CustomRadioGroup value={brightness} setValue={setBrightness} list={brightnessList} />
                  </div>
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
                          name="serialNumber"
                          value={values.serialNumber}
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
                          <DatePicker value={assetExpiration} onChange={setAssetExpiration} className="!bg-white text-xs pl-5 pr-4" />
                        </div>
                        <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">Check-Up Date</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4" 
                            dateType="future"
                            value={values.asset.checkupDate} 
                            onChange={(value)=>setFieldValue("asset.checkupDate", value)}/>
                        </div>
                        <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">Date of Purchase</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4" dateType="past"
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
              <>
                {componentTypes?.map((componentType:{id:string, name:string})=> (
                  <ComponentVariant componentType={componentType} key={componentType.id} formik={formik} />
                ))}
              </>
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
                    <Input
                      placeholder="addressLine1"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
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
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
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
                      placeholder="Enter city"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
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
              handleSubmit: formik.handleSubmit
            }
          }
        />
      </main>
    </>
  );
}
