"use client";
import { Check, InfoIcon, Search, XCircle } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/shared/components/ui/combobox";
import type { Cabinet } from "../types/cabinetList";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn, formatDateDDMMYYYY } from "@/lib/utils";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Input } from "@/shared/components/ui/input";
import { useComponentTypesVariants } from "../hooks/useComponentTypesVariants";
import { useCabinetsList } from "../hooks/useCabinetsList";
import { useDebounce } from "@/app/hooks/use-debounce";
import { useAssetView } from "../hooks/useAssetView";
import { errorToast, successToast } from "@/lib/toast";
import { useActivityTypes } from "../hooks/useActivityTypes";
import { LoaderButton } from "@/app/components/loader-button";
import { useCreateActivity } from "../hooks/useCreateActivity";
import { getApiErrorMessage } from "@/app/api-manage/api";

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}
export type PadSet = {
  componentVariantId?: string;
  expiresAt?: Date | undefined;
  lotNumber?: string;
};
export type BatterySet = {
  expiresAt:Date | undefined,
  serialNumber:string,
  lotNumber:string
}
export const AddActivityModal: React.FC<ModalProps>  = ({ open, setOpen }) => {
  
  const [activity, setActivity] = useState<string>('')
  const [search, setSearch] = useState("");

  const [images, setImages] = useState({
    picture1: "",
    picture2: "",
    picture3: "",
  });

  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [category, setCategory] = useState<string>('')
  const [activityDate, setActivityDate] = useState<Date | undefined>(new Date())
  const [notes, setNotes] = useState<string>('')
  const [nextCheckUpDate, setNextCheckUpDate] = useState<Date | undefined>(undefined)

  const [battery, setBattery] = useState<BatterySet>({
    "expiresAt": undefined,
    "serialNumber":"",
    "lotNumber":""
  })

  const [padSets, setPadSets] = useState<PadSet[]>([
    {
      componentVariantId: "",
      expiresAt: undefined,
      lotNumber: "",
    },
    {
      componentVariantId: "",
      expiresAt: undefined,
      lotNumber: "",
    },
  ]);
  const updatePadSet = <K extends keyof PadSet>(
    index: number,
    field: K,
    value: PadSet[K]
  ) => {
    setPadSets((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const {data: activityTypes} = useActivityTypes()

  const debouncedSearch = useDebounce(search, 400)
  const {
      data:cabinets
    } = useCabinetsList({
      search: debouncedSearch
    })

  const { data: componentTypeDataVariants } = useComponentTypesVariants("1") // ID 1 is for "Pads Set"
  const { data: assetData, isSuccess : isAssetSuccess } = useAssetView(selectedCabinet?.id || "")

  // Update Existing Asset Values
  useEffect(()=> {
    if(isAssetSuccess && assetData) {
      // Update Pads
      const padsComponents = [...(assetData?.components || [])].filter(
        (c: any) => c.componentTypeId === "1"
      ).sort((a: any, b: any) => Number(a.id) - Number(b.id))
      setPadSets(
        padsComponents.map((pad) => {
          let expiresAt: Date | undefined = undefined;
          if (pad?.expiresAt) {
            const [day, month, year] = pad.expiresAt.split("-").map(Number);
            expiresAt = new Date(year, month - 1, day);
          }

          return {
            componentVariantId: pad?.componentVariantId || "",
            expiresAt,
            lotNumber: pad?.lotNumber || "",
          };
        })
      )

      // Update Battery
      const batteryComponent = assetData?.components?.find(
        (c: any) => c.componentTypeId === "2"
      );
      let batteryExpiresAt: Date | undefined = undefined;
      if (batteryComponent?.expiresAt) {
        const parts = batteryComponent?.expiresAt?.split("-").map(Number);
        const [day, month, year] = parts;
        batteryExpiresAt = new Date(year, month - 1, day);
      }

      setBattery({
        expiresAt: batteryExpiresAt,
        lotNumber: batteryComponent?.lotNumber || "",
        serialNumber: batteryComponent?.serialNumber || "",
      });
      
      // Update Next Check Update
      if (assetData?.checkupDate) {
        const parts = assetData?.checkupDate?.split("-").map(Number);
        const [day, month, year] = parts;
        setNextCheckUpDate(new Date(year, month - 1, day));
      }

    } else {
      setPadSets([
        {
          componentVariantId: "",
          expiresAt: undefined,
          lotNumber: "",
        },
        {
          componentVariantId: "",
          expiresAt: undefined,
          lotNumber: "",
        },
      ])
      setBattery({
        expiresAt: undefined,
        lotNumber: "",
        serialNumber: "",
      });
      setNextCheckUpDate(undefined)
    }
  }, [isAssetSuccess, assetData, selectedCabinet])


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
  const handleRemove = (key: "picture1" | "picture2" | "picture3") => {
    setImages((prev) => ({
      ...prev,
      [key]: "",
    }));
  };
  const onCloseModal = () =>{ 
    setOpen(false)
    setActivity("")
    setSelectedCabinet(null)
    setActivityDate(undefined)
    setCategory("")
    setNotes("")
    setImages({
      picture1: "",
      picture2: "",
      picture3: "",
    })
    setBattery({
      expiresAt: undefined,
      lotNumber: "",
      serialNumber: "",
    })
    setPadSets([
      {
        componentVariantId: "",
        expiresAt: undefined,
        lotNumber: "",
      },
      {
        componentVariantId: "",
        expiresAt: undefined,
        lotNumber: "",
      },
    ])
    setNextCheckUpDate(undefined)
  }

  const getAssetDetails = (typeId: string) => {
    switch (typeId) {
      case "1": { // Pads change (1 or 2 sets)
        const validSets = padSets
          .filter((set) => set.componentVariantId && set.expiresAt) // Filter out empty/unselected sets
          .map((set) => ({
            componentVariantId: set.componentVariantId,
            expiresAt: set.expiresAt ? formatDateDDMMYYYY(set.expiresAt) : "",
            lotNumber: set.lotNumber || "",
          }));

        return { sets: validSets };
      }

      case "2": { // Battery change
        return {
          expiresAt: battery.expiresAt ? formatDateDDMMYYYY(battery.expiresAt) : "",
          serialNumber: battery.serialNumber || "",
          lotNumber: battery.lotNumber || "",
        };
      }

      case "3": { // Routine check
        return {
          nextCheckupDate: nextCheckUpDate ? formatDateDDMMYYYY(nextCheckUpDate) : "",
        };
      }

      case "4": // Stolen (No details needed)
      default:
        return undefined;
    }
  };

  const createActivityMutation = useCreateActivity()

  const handleFormSubmit = async () => {
    try {
      const details = category === "asset" ? getAssetDetails(activity.split("-")[1]) : undefined;
      await createActivityMutation.mutateAsync({
        id: selectedCabinet?.id,
        activityAt: activityDate ? activityDate.toISOString() : new Date()?.toISOString(),
        category,
        notes,
        typeId: activity.split("-")[1],
        ...(details ? { details } : {}),
      })
      successToast("Activity Created Successfully")
      onCloseModal()
      } catch (error) {
        errorToast(getApiErrorMessage(error)) 
      }
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseModal}>
        <form>
          <DialogContent className="sm:max-w-[620px] bg-white max-h-[95dvh] overflow-y-auto py-0 !flex flex-col !gap-0" showCloseButton={false}>
            <DialogHeader className="flex flex-row items-center justify-between w-full sticky top-0 bg-white z-100 p-0 py-5 px-0">
              <DialogTitle className="text-2xl font-semibold text-accent-foreground">Add Activity</DialogTitle>
              <DialogClose asChild>
                <button type="button" className="text-foreground">
                  <XCircle />
                </button>
              </DialogClose>
            </DialogHeader>
            <DialogDescription asChild>
              <div>
                <div className="grid grid-cols-1 gap-5">
                  <div className="relative">
                    <Label className="text-xs text-accent-foreground font-medium block mb-2">Cabinet</Label>
                    {
                      selectedCabinet ? <>
                        <div className="border border-border rounded-[10px] flex items-center gap-2.5 px-3 py-2 md:max-w-[90%]">
                          <div className="rounded-full text-[#A72822] bg-[#FDF3F2] w-6 h-7.5 flex items-center justify-center">
                            <Check size={16} />
                          </div>
                          <div className="w-0 grow">
                            <h5 className="text-xs font-medium">{selectedCabinet.name}</h5>
                            <div className="text-xs text-[#717893]">{selectedCabinet.number} {selectedCabinet.street}, {selectedCabinet.city}</div>
                          </div>
                          <button type="button" className="text-[#A72822] font-medium text-xs select-none" onClick={()=> {
                            setSelectedCabinet(null);
                            setActivity("")
                          }}>Change</button>
                        </div>
                      </> : 
                      <Combobox
                        items={cabinets || []}
                        value={selectedCabinet}
                      >
                        <div className="relative">
                          <Search
                            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 pointer-events-none"
                            aria-hidden
                          />
                          <ComboboxInput
                            placeholder="Search for a cabinet"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 md:h-12.5 border-border !ring-0"
                            autoFocus
                            showClear
                          />
                        </div>
                        <ComboboxContent className="pointer-events-auto p-0">
                          <ComboboxEmpty className="px-6 py-10">
                            No Cabinet found.
                          </ComboboxEmpty>
                          <ComboboxList className="max-h-60 overflow-y-auto">
                            {(item) => (
                              <ComboboxItem key={item.id} value={item.name} className="data-highlighted:bg-[#FDF3F2]"
                                onClick={()=> {
                                  setSelectedCabinet(item)
                                  setSearch("")
                                }}
                              >
                                <div>
                                  <h5 className="font-medium text-xs">{item.name}</h5>
                                  <span className="text-xs text-[#717893]">{item.street} {item.number} · {item.city}</span>
                                </div>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    }
                  </div>
                  
                    <div>
                      <Label className="text-xs text-accent-foreground font-medium block mb-2">Activity Type</Label>
                      <Select value={activity} onValueChange={(value)=> {
                        setActivity(value);
                        if (value.startsWith("cabinet")) {
                          setCategory("cabinet")
                        }
                        else {
                          setCategory("asset")
                        }
                      }} disabled={!selectedCabinet}>
                        <SelectTrigger className="w-full !h-12.5 disabled:bg-white">
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full capitalize">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select activity type" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Cabinet</SelectLabel>
                            {activityTypes?.cabinet?.map((activity) => (<SelectItem className="pl-4 min-h-7 capitalize" value={"cabinet-"+activity.id}>{activity.name}</SelectItem>))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Asset</SelectLabel>
                            {activityTypes?.asset?.map((activity) => (<SelectItem className="pl-4 min-h-7 capitalize" value={"asset-"+activity.id}>{activity.name}</SelectItem>))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                  {/* Add Asset Pictures */}
                  {activity && (
                    <>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-2">Activity date</Label>
                        <DatePicker className="!bg-white text-xs pl-5 pr-4"
                            dateType="past"
                            showTime
                            value={activityDate}
                            onChange={(value)=>value ? setActivityDate(value): {}}
                          />
                      </div>
                      {activity === "asset-3" && (
                        <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-2">Next check-up date</Label>
                          <DatePicker className="!bg-white text-xs pl-5 pr-4"
                              dateType="future"
                              value={nextCheckUpDate} 
                              onChange={(value)=> setNextCheckUpDate(value)}
                            />
                        </div>
                      )}
                      {activity === "asset-2" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Expiration Date */}
                          <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">
                              Battery expiration date
                          </Label>
                          <DatePicker
                              className="!bg-white text-xs pl-5 pr-4"
                              dateType="future"
                              value={battery.expiresAt}
                              onChange={(value)=> setBattery(prev=> ({
                                ...prev,
                                expiresAt: value
                              }))}
                          />
                          </div>
          
                          {/* Serial Number */}
                          <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">
                              Battery serial number
                          </Label>
                          <Input
                              placeholder="e.g. SN928492819"
                              autoComplete="off"
                              className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                              value={battery.serialNumber}
                              onChange={(e)=> setBattery(prev=> ({
                                ...prev,
                                serialNumber: e.target.value
                              }))}
                          />
                          </div>
          
                          {/* Lot Number */}
                          <div>
                          <Label className="text-xs text-accent-foreground font-medium block mb-3">
                              Battery lot number
                          </Label>
                          <Input
                              placeholder="e.g. B-98765"
                              autoComplete="off"
                              className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                              value={battery.lotNumber}
                              onChange={(e)=> setBattery(prev=> ({
                                ...prev,
                                lotNumber: e.target.value
                              }))}
                          />
                          </div>
                      </div>
                      )}
                      {activity === "asset-1" && (
                        <div className="grid grid-cols-1 gap-4">
                          {padSets.map((padSet, index) => {
                            const isFirstSet = index === 0;
                            const ordinalText = isFirstSet ? "1st" : "2nd";

                            return (
                              <div
                                key={`pad-set-${index}`}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                              >
                                {/* Variant / For */}
                                <div>
                                  <Label className="text-xs text-accent-foreground font-medium block mb-3">
                                    {ordinalText} set pads for
                                    {isFirstSet && <span className="text-error">*</span>}
                                  </Label>
                                  <Select
                                    value={padSet.componentVariantId || ""}
                                    onValueChange={(variantId) =>
                                      updatePadSet(index, "componentVariantId", variantId)
                                    }
                                  >
                                    <SelectTrigger className="w-full !h-12.5">
                                      <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                                        <span className="line-clamp-1 w-0 grow text-left">
                                          <SelectValue placeholder="Select" />
                                        </span>
                                      </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {componentTypeDataVariants?.map((variant) => (
                                        <SelectItem key={variant.id} value={variant.id}>
                                          {variant.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Expiration Date */}
                                <div>
                                  <Label className="text-xs text-accent-foreground font-medium block mb-3">
                                    {ordinalText} set pads expiration date
                                    {isFirstSet && <span className="text-error">*</span>}
                                  </Label>
                                  <DatePicker
                                    value={padSet.expiresAt}
                                    onChange={(val) => updatePadSet(index, "expiresAt", val)}
                                    className="!bg-white text-xs pl-5 pr-4"
                                    dateType="future"
                                  />
                                </div>

                                {/* Lot Number */}
                                <div>
                                  <Label className="text-xs text-accent-foreground font-medium block mb-3">
                                    {ordinalText} set pads Lot number
                                  </Label>
                                  <Input
                                    placeholder="e.g. 14454"
                                    autoComplete="off"
                                    className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                                    value={padSet.lotNumber}
                                    onChange={(e) =>
                                      updatePadSet(index, "lotNumber", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-2">Notes</Label>
                        <Textarea
                          placeholder="Describe the location or any important details..."
                          autoComplete="off"
                          className="p-5 placeholder:text-accent-foreground/20 min-h-25 resize-none"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-2">Situation Pictures<span className="text-foreground">(max. 3)</span></Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <SingleImageUploader
                            value={images.picture1}
                            onChange={(file) => handleImageChange("picture1", file)}
                            onRemove={()=>handleRemove("picture1")}
                            className="h-20"
                          />
                          <SingleImageUploader
                            value={images.picture2}
                            onChange={(file) => handleImageChange("picture2", file)}
                            onRemove={()=>handleRemove("picture2")}
                            className="h-20"
                          />
                          <SingleImageUploader
                            value={images.picture3}
                            onChange={(file) => handleImageChange("picture3", file)}
                            onRemove={()=>handleRemove("picture3")}
                            className="h-20"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {/* Situation Pictures */}

                  <div className={cn(" border py-4.5 px-4 text-xs flex items-center gap-5 rounded-[10px] text-foreground", {
                    "card-warning bg-[#E57366]/10 border-[#E57366]/40" : activity,
                    "card-neutral bg-[#F7FAFE] border-[#D1DBED]" : !activity
                  })}>
                    <InfoIcon />
                    <div className="w-0 grow">
                      {activity ? "Reminder: If Maintenance Mode is enabled, disable it in the cabinet’s settings after ending all manual activities for this cabinet." : "You can enable Maintenance Mode in the cabinet's settings. While Maintenance Mode is enabled, all cabinet notifications and on-device feedback are paused."}
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
            <DialogFooter className="bg-white border-0 sticky bottom-0 mt-auto mb-0 py-5">
              <div className="flex flex-wrap gap-2 sm:gap-5 justify-center w-full">
                <DialogClose asChild>
                  <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3.5 px-5 rounded-full text-sm gap-1.25 sm:w-full sm:max-w-[140px] md:max-w-[180px]">Cancel</button>
                </DialogClose>
                <LoaderButton loading={createActivityMutation.isPending} type="submit" className="py-2 sm:py-3.5 px-5 rounded-full sm:w-full sm:max-w-[140px] md:max-w-[180px] h-auto" onClick={handleFormSubmit} disabled={!activity}>Add Activity</LoaderButton>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
