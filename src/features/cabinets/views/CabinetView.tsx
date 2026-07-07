"use client";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, CircleCheck, Info, InfoIcon, ShoppingCart } from "lucide-react";

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
import type { AccessTypeI, AssetType, AvailabilityType, BrightnessType, ColorType, DayConfig, PadsType, StepType, VolumeType } from "../types/addCabinet";
import { assetTypeList, availabilityTypeList, brightnessList, colorList, dayList, padsTypeList, STEPS, volumeList } from "../mock/addCabinetData";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { AVAILABLE_CREDITS, MANAGE_CABINETS } from "@/features/dashboard/mock/mockDashboardStats";
import { can, type Role } from "@/lib/permissions";
import { useAuth } from "@/app/hooks/useAuth";
import { useQueryState } from "nuqs";

interface BasicInformation {
  cabinetName: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  zip: string;
  city: string;
  country: string;
}
interface CabinetDetails {
  serialNumber: string;
  brand: string;
  model: string;
  brandName: string;
  modelName: string;
  moduleCode: string;
  assignCredits: string;
  lockCode: string;
}
interface AssetInformation {
  padsInformation: {
    firstSetPads: {
      for: "adult" | "adult+children" | "children",
      expiration: Date | undefined,
      IotNumber: string
    },
    secondSetPads: {
      for: "adult" | "adult+children" | "children",
      expiration: Date | undefined,
      IotNumber: string
    },
  },
  batteryInformation: {
    batterySerial: string,
    batteryExpiration: Date | undefined,
    batteryIotNumber: string
  }
}


const CabinetView = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState<StepType>('basic-information')
  const [assetType, setAssetType] = useState<AssetType>('aed')
  const [padsType, setPadsType] = useState<PadsType>('adult')
  const [volume, setVolume] = useState<VolumeType>('0%')
  const [brightness, setBrightness] = useState<BrightnessType>('0%')
  const [color, setColor] = useState<ColorType>('white')
  const [availability, setAvailability] = useState<AvailabilityType>('custom-days-and-types')
  const [accessType, setAccessType] = useState<AccessTypeI>('public')
  const [schedule, setSchedule] = useState<DayConfig[]>(dayList)

  const [padsExpiration, setPadsExpiration] = useState<Date | undefined>(new Date())
  const [batteryExpiration, setBatteryExpiration] = useState<Date | undefined>(new Date())

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  
  const [images, setImages] = useState({
    picture1: "https://images.pexels.com/photos/4089662/pexels-photo-4089662.jpeg?_gl=1*1pmmgo6*_ga*MjUxOTAzMDY5LjE3ODE5MjE5NjQ.*_ga_8JE65Q40S6*czE3ODM0MDgyNzMkbzIkZzEkdDE3ODM0MDgzMDYkajI3JGwwJGgw",
    picture2: "",
    picture3: "",
  });

  const [basicInformation, setBasicInformation] = useState<BasicInformation>({
    cabinetName: "Amsterdam Central - Platform 5",
    description: "Hangs next to the kiosk",
    addressLine1: "Stationsplein 15",
    addressLine2: "",
    zip: "1012 AB",
    city: "Amsterdam",
    country: "Netherlands"
  })
  const [cabinetDetails, setCabinetDetails] = useState<CabinetDetails>({
    serialNumber:"",
    brand: "nexus",
    model: "pro",
    brandName: "Nexus Brand",
    modelName: "ZXCBNM3X32",
    moduleCode: "NEXUSMODULEXC43",
    assignCredits: "1",
    lockCode: "UDWKSNDMS"
  })
  console.log("batteryExpiration",batteryExpiration)
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
                    <div className="flex items-center text-sm text-accent-foreground my-5 lg:my-6.5 gap-3">
                      <span className="h-px grow bg-accent-foreground"></span>
                      <span>Or enter cabinet details manually</span>
                      <span className="h-px grow bg-accent-foreground"></span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Brand<span className="text-error">*</span></Label>
                    <Select disabled={fieldsReadOnly}>
                      <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Nexus" /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nexus">Nexus</SelectItem>
                        <SelectItem value="nexus-2">Nexus 2</SelectItem>
                        <SelectItem value="nexus-3">Nexus 3</SelectItem>
                        <SelectItem value="nexus-4">Nexus 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Model<span className="text-error">*</span></Label>
                    <Select disabled={fieldsReadOnly}>
                      <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Pro" /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="pro-2">Pro 2</SelectItem>
                        <SelectItem value="pro-3">Pro 3</SelectItem>
                        <SelectItem value="pro-4">Pro 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center space-x-3 cursor-pointer select-none mb-2">
                      <Checkbox className="bg-transparent border-border" readOnly={fieldsReadOnly} />
                      <span className={cn("text-xs text-accent-foreground transition-colors")}>
                        Brand or model not in list
                      </span>
                    </label>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Brand Name</Label>
                    <Input
                      placeholder="Enter brand name"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      value={cabinetDetails.brandName}
                      onChange={(e)=> setCabinetDetails(prev => ({
                        ...prev,
                        brandName: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Model Name</Label>
                    <Input
                      placeholder="Enter model name"
                      autoComplete="off"
                      className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                      readOnly={fieldsReadOnly}
                      value={cabinetDetails.modelName}
                      onChange={(e)=> setCabinetDetails(prev => ({
                        ...prev,
                        modelName: e.target.value
                      }))}
                    />
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
                <CustomRadioGroup value={assetType} setValue={setAssetType} list={assetTypeList} readOnly={fieldsReadOnly}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 my-3.75 gap-4">
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Pads expiration date<span className="text-error">*</span></Label>
                  <DatePicker value={padsExpiration} onChange={setPadsExpiration} disabled={fieldsReadOnly} />
                </div>
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Battery expiration date<span className="text-error">*</span></Label>
                  <DatePicker value={batteryExpiration} onChange={setBatteryExpiration} disabled={fieldsReadOnly} />
                </div>
              </div>
              <div>
                <Label className="text-xs text-accent-foreground font-medium block mb-3">Pads type<span className="text-error">*</span></Label>
                <CustomRadioGroup value={padsType} setValue={setPadsType} list={padsTypeList} readOnly={fieldsReadOnly}/>
              </div>
            </div>
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
                    } disabled={fieldsReadOnly} />
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
                    } disabled={fieldsReadOnly} />
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
                    disabled={fieldsReadOnly} />
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
                      readOnly={fieldsReadOnly}
                      value={basicInformation.cabinetName}
                      onChange={(e)=> setBasicInformation(prev => ({
                        ...prev,
                        cabinetName: e.target.value
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
            {canManageCabinets && (
              <div className="grow">
                {isEditing ? (
                  <div className="flex flex-wrap justify-end gap-3">
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
                  </div>
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
          <div className="rounded-[15px] mt-6 md:pl-5">
            <div className="flex flex-wrap gap-10">
              <div className="w-full max-w-[180px] xl:max-w-[280px]">
                <div className="flex flex-col gap-10 md:min-h-[calc(100dvh-230px)] md:sticky md:top-36">
                  <CabinetsStepper step={step} setStep={setStep} stepList={STEPS} hideLine />
                  <div className="flex flex-wrap gap-2.5 md:flex-col md:items-start mt-auto">
                    <button type="button" className="flex items-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                      <span>Your Credits:</span>
                      <span className="font-semibold">48</span>
                    </button>
                    <button type="button" className="flex items-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                      <ShoppingCart size={18} />
                      <span>Buy Credits</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-0 grow">
                {switchContent()}
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