"use client";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Info, InfoIcon } from "lucide-react";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";
import {  useNavigate } from "react-router";
import { CabinetsStepper } from "../components/CabinetsStepper";
import { useState } from "react";
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";
import SchedulePicker from "../components/SchedulePicker";
import type { AccessTypeI, AvailabilityType, BrightnessType, ColorType, DayConfig, StepType, VolumeType } from "../types/addCabinet";
import { assetTypeList, availabilityTypeList, brightnessList, colorList, dayList, STEPS, volumeList } from "../mock/addCabinetData";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { AVAILABLE_CREDITS, MANAGE_CABINETS } from "@/features/dashboard/mock/mockDashboardStats";
import { can, type Role } from "@/lib/permissions";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryState } from "nuqs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { CabinetStatistics } from "../components/CabinetStatistics";
import type { AssetInformation, BrandInfo } from "./AddCabinets";
import { brandsList } from "../mock/mockBrands";
import { MaintenanceMode } from "../components/MaintenanceMode";

interface BasicInformation {
  name: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  zip: string;
  city: string;
  country: string;
}
interface CabinetDetails {
  serialNumber: string;
  moduleCode: string;
  assignCredits: string;
  lockCode: string;
}

const CabinetView = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState<StepType>('basic-information')
  const [assetType, setAssetType] = useState<string>(assetTypeList[0].value)
  const [volume, setVolume] = useState<VolumeType>('0%')
  const [brightness, setBrightness] = useState<BrightnessType>('0%')
  const [color, setColor] = useState<ColorType>('white')
  const [availability, setAvailability] = useState<AvailabilityType>('custom-days-and-types')
  const [accessType, setAccessType] = useState<AccessTypeI>('public')
  const [schedule, setSchedule] = useState<DayConfig[]>(dayList)

  const [warrantyExpiration, setWarrantyExpiration] = useState<Date | undefined>(new Date())

  const [assetExpiration, setAssetExpiration] = useState<Date | undefined>(new Date("Tue Jul 07 2026 10:20:38 GMT+0600"))
  const [checkupDate, setCheckupDate] = useState<Date | undefined>(new Date("Tue Jul 07 2026 14:20:38 GMT+0600"))

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  
  const [images, setImages] = useState({
    picture1: "https://images.pexels.com/photos/4089662/pexels-photo-4089662.jpeg?_gl=1*1pmmgo6*_ga*MjUxOTAzMDY5LjE3ODE5MjE5NjQ.*_ga_8JE65Q40S6*czE3ODM0MDgyNzMkbzIkZzEkdDE3ODM0MDgzMDYkajI3JGwwJGgw",
    picture2: "",
    picture3: "",
  });

  const [basicInformation, setBasicInformation] = useState<BasicInformation>({
    name: "Amsterdam Central - Platform 5",
    description: "Hangs next to the kiosk",
    addressLine1: "Stationsplein 15",
    addressLine2: "",
    zip: "1012 AB",
    city: "Amsterdam",
    country: "Netherlands"
  })
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
  
  const [assetInformation, setAssetInformation] = useState<AssetInformation>({
    padsInformation: {
      firstSetPads: {
        for: "adult+children",
        expiration: new Date("Tue Jul 07 2026 14:20:38 GMT+0600"),
        IotNumber: "12233"
      },
      secondSetPads: {
        for: "adult",
        expiration: new Date("Tue Jul 07 2026 14:20:38 GMT+0600"),
        IotNumber: "12233"
      },
    },
    batteryInformation: {
      batterySerial: "SN928492819",
      batteryExpiration: new Date("Tue Jul 07 2026 14:20:38 GMT+0600"),
      batteryIotNumber: "B-98765"
    },
    notes: "lorem ipsum dolor set amet",
    brandInfo: {
      name: "",
      model: "",
    }
  })

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

    setImages((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file),
    }));
  };

  const handleSaveChanges = () => {
    setIsEditing("")
  }

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
                        brandsList.map((item)=> <SelectItem value={item.brand} key={item.brand}>{item.brand}</SelectItem> )
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
                        brandsList.find(item => item.brand === brandInfo.name)?.models?.map((item)=> <SelectItem value={item} key={item}>{item}</SelectItem> )
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
                    <CustomRadioGroup value={volume} setValue={setVolume} list={volumeList} readOnly={fieldsReadOnly} />
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
                    <CustomRadioGroup value={color} setValue={setColor} list={colorList} readOnly={fieldsReadOnly} />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Brightness</Label>
                    <CustomRadioGroup value={brightness} setValue={setBrightness} list={brightnessList} readOnly={fieldsReadOnly} />
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
                        "bg-primary/7 border-primary/20": 'public' === accessType
                      })} onClick={()=> setAccessType('public')} disabled={fieldsReadOnly}>
                        <Icons.team />
                        <div className="w-0 grow">
                          <h6 className="font-semibold text-xs">Public</h6>
                          <div className="text-xs">Accessible to everyone</div>
                        </div>
                      </button>
                      <button type="button" className={cn("flex items-center gap-3.75 text-left p-4 border border-border rounded-[10px]", {
                        "bg-primary/7 border-primary/20": 'private' === accessType
                      })} onClick={()=> setAccessType('private')} disabled={fieldsReadOnly}>
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
                    <CustomRadioGroup value={availability} setValue={setAvailability} list={availabilityTypeList} readOnly={fieldsReadOnly} />
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
                      {assetTypeList.find(i => i.value === assetType)?.label}
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
                      {assetTypeList.map((option) => (
                        <DropdownMenuItem className="text-accent-foreground font-semibold text-xs h-10 py-2 px-2.5 hover:!bg-chip" onClick={()=> setAssetType(option.value)}>
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 my-3.75 gap-4">
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Brand<span className="text-error">*</span></Label>
                  <Select value={assetInformation.brandInfo.name} onValueChange={(value)=> setAssetInformation(prev => ({
                    ...prev,
                    brandInfo:{
                      ...prev.brandInfo,
                      name: value,
                      model: ""
                    }
                  }))} disabled={fieldsReadOnly}>
                    <SelectTrigger className={cn("w-full !h-12.5",)}>
                      <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                        <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Brand" /></span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {
                        brandsList.map((item)=> <SelectItem value={item.brand} key={item.brand}>{item.brand}</SelectItem> )
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Model<span className="text-error">*</span></Label>
                  <Select value={assetInformation.brandInfo.model} onValueChange={(value)=> setAssetInformation(prev => ({
                    ...prev,
                    brandInfo: {
                      ...prev.brandInfo,
                      model: value
                    }
                  }))} disabled={fieldsReadOnly}>
                    <SelectTrigger className={cn("w-full !h-12.5")}>
                      <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                        <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select Model" /></span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {
                        brandsList.find(item => item.brand === assetInformation.brandInfo.name)?.models?.map((item)=> <SelectItem value={item} key={item}>{item}</SelectItem> )
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-3.75 gap-4">
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Asset Expiration Date<span className="text-error">*</span></Label>
                  <DatePicker value={assetExpiration} onChange={setAssetExpiration} className="!bg-white text-xs pl-5 pr-4" disabled={fieldsReadOnly} />
                </div>
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Check-Up Date<span className="text-error">*</span></Label>
                  <DatePicker value={checkupDate} onChange={setCheckupDate} className="!bg-white text-xs pl-5 pr-4" disabled={fieldsReadOnly} />
                </div>
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Warranty Expiration date <span className="text-error">*</span></Label>
                  <DatePicker value={warrantyExpiration} onChange={setWarrantyExpiration} disabled={fieldsReadOnly} className="!bg-white text-xs pl-5 pr-4" />
                </div>
                <div className="sm:col-span-2 xl:col-span-3">
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Notes<span className="text-error">*</span></Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    autoComplete="off"
                    className="p-5 placeholder:text-accent-foreground/20"
                    readOnly={fieldsReadOnly}
                    value={assetInformation.notes}
                    onChange={(e)=> setAssetInformation(prev=> ({
                      ...prev,
                      notes: e.target.value
                    }))}
                  />
                </div>
              </div>
            </div>
            {assetType !== "fire-extinguisher" && 
              <>
                {/* Battery Information */}
                <div className="mt-5">
                  <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                    <span className="w-0 grow">Pads Information</span>
                    <InfoIcon size={20} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 my-3.75 gap-4">
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">1st set pads for<span className="text-error">*</span></Label>
                      <Select value={assetInformation.padsInformation.firstSetPads.for}
                        onValueChange={(value: "adult" | "adult+children" | "children") =>
                          setAssetInformation((prev) => ({
                            ...prev,
                            padsInformation: {
                              ...prev.padsInformation,
                              firstSetPads: {
                                ...prev.padsInformation.firstSetPads,
                                for: value,
                              },
                            },
                          }))
                        } disabled={fieldsReadOnly}>
                        <SelectTrigger className="w-full !h-12.5">
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Adult + Child" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adult+children">Adult + Child</SelectItem>
                          <SelectItem value="adult">Adult Only</SelectItem>
                          <SelectItem value="children">Children</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">1st set pads expiration date<span className="text-error">*</span></Label>
                      <DatePicker value={assetInformation.padsInformation.firstSetPads.expiration} onChange={(value) =>
                          setAssetInformation((prev) => ({
                            ...prev,
                            padsInformation: {
                              ...prev.padsInformation,
                              firstSetPads: {
                                ...prev.padsInformation.firstSetPads,
                                expiration: value,
                              },
                            },
                          }))
                        } disabled={fieldsReadOnly} className="!bg-white text-xs pl-5 pr-4" />
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">1st set pads Iot number</Label>
                      <Input
                        placeholder="e.g. 14454"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        readOnly={fieldsReadOnly}
                        value={assetInformation.padsInformation.firstSetPads.IotNumber}
                        onChange={(e)=> setAssetInformation((prev) => ({
                            ...prev,
                            padsInformation: {
                              ...prev.padsInformation,
                              firstSetPads: {
                                ...prev.padsInformation.firstSetPads,
                                IotNumber: e.target.value,
                              },
                            },
                          })
                        )}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">2nd set pads for</Label>
                      <Select value={assetInformation.padsInformation.secondSetPads.for}
                        onValueChange={(value: "adult" | "adult+children" | "children") =>
                          setAssetInformation((prev) => ({
                            ...prev,
                            padsInformation: {
                              ...prev.padsInformation,
                              secondSetPads: {
                                ...prev.padsInformation.secondSetPads,
                                for: value,
                              },
                            },
                          }))
                        } disabled={fieldsReadOnly}>
                        <SelectTrigger className="w-full !h-12.5">
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Adult + Child" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adult+children">Adult + Child</SelectItem>
                          <SelectItem value="adult">Adult Only</SelectItem>
                          <SelectItem value="children">Children</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">2nd set pads expiration date</Label>
                      <DatePicker value={assetInformation.padsInformation.secondSetPads.expiration} onChange={(value) =>
                          setAssetInformation((prev) => ({
                            ...prev,
                            padsInformation: {
                              ...prev.padsInformation,
                              secondSetPads: {
                                ...prev.padsInformation.secondSetPads,
                                expiration: value,
                              },
                            },
                          }))
                        } disabled={fieldsReadOnly} className="!bg-white text-xs pl-5 pr-4" />
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">2nd set pads Iot number</Label>
                      <Input
                        placeholder="e.g. 14454"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        readOnly={fieldsReadOnly}
                        value={assetInformation.padsInformation.secondSetPads.IotNumber}
                        onChange={(e)=> setAssetInformation((prev) => ({
                            ...prev,
                            padsInformation: {
                              ...prev.padsInformation,
                              secondSetPads: {
                                ...prev.padsInformation.secondSetPads,
                                IotNumber: e.target.value,
                              },
                            },
                          })
                        )}
                      />
                    </div>
                  </div>
                </div>
                {/* Pads Information */}
                <div className="mt-5">
                  <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                    <span className="w-0 grow">Battery Information</span>
                    <InfoIcon size={20} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 my-3.75 gap-4">
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">Battery serial number<span className="text-error">*</span></Label>
                      <Input
                        placeholder="e.g. SN928492819"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        readOnly={fieldsReadOnly}
                        value={assetInformation.batteryInformation.batterySerial}
                        onChange={(e)=> setAssetInformation((prev) => ({
                            ...prev,
                            batteryInformation: {
                              ...prev.batteryInformation,
                              batterySerial: e.target.value
                            },
                          })
                        )}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">Battery expiration date<span className="text-error">*</span></Label>
                      <DatePicker value={assetInformation.batteryInformation.batteryExpiration} onChange={(value) =>
                          setAssetInformation((prev) => ({
                            ...prev,
                            batteryInformation: {
                              ...prev.batteryInformation,
                              batteryExpiration: value
                            },
                          }))
                        }
                        disabled={fieldsReadOnly} className="!bg-white text-xs pl-5 pr-4" />
                    </div>
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-3">Battery Iot number<span className="text-error">*</span></Label>
                      <Input
                        placeholder="e.g. B-98765"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        readOnly={fieldsReadOnly}
                        value={assetInformation.batteryInformation.batteryIotNumber}
                        onChange={(e)=> setAssetInformation((prev) => ({
                            ...prev,
                            batteryInformation: {
                              ...prev.batteryInformation,
                              batteryIotNumber: e.target.value
                            },
                          })
                        )}
                      />
                    </div>
                  </div>
                </div>
              </>
            }
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
                      value={basicInformation.name}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                    />
                  </div>
                  <div className="mb-3">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Description</Label>
                    <Textarea
                      placeholder="Describe the location or any important details..."
                      autoComplete="off"
                      className="px-5 pt-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      value={basicInformation.description}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
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
                      value={basicInformation.addressLine1}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        addressLine1: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Address Line 2</Label>
                    <Input
                      placeholder="Enter address 2"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      value={basicInformation.addressLine2}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        addressLine2: e.target.value
                      }))}
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
                      value={basicInformation.zip}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        zip: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">City <span className="text-error">*</span></Label>
                    <Input
                      placeholder="Enter City"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      value={basicInformation.city}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        city: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Country <span className="text-error">*</span></Label>
                    <Input
                      placeholder="Enter country"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      value={basicInformation.country}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        country: e.target.value
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Situation Pictures */}
              <div>
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                  <span className="w-0 grow">Situation Pictures</span>
                  <InfoIcon size={20} />
                </div>
                {!fieldsReadOnly && <Label className="text-xs text-accent-foreground font-medium block mb-3">Pictures <span className="text-foreground">(max. 3)</span></Label>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <SingleImageUploader
                    value={images.picture1}
                    onChange={(file) => handleImageChange("picture1", file)}
                    readOnly={fieldsReadOnly}
                  />
                  <SingleImageUploader
                    value={images.picture2}
                    onChange={(file) => handleImageChange("picture2", file)}
                    readOnly={fieldsReadOnly}
                  />
                  <SingleImageUploader
                    value={images.picture3}
                    onChange={(file) => handleImageChange("picture3", file)}
                    readOnly={fieldsReadOnly}
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
                          onClick={handleSaveChanges}
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
        <ConfirmationModal open={confirmModalOpen} setOpen={setConfirmModalOpen} />
      </main>
    </>
  );
};

export default CabinetView;