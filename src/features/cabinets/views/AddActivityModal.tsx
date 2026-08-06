"use client";
import { InfoIcon, Search, XCircle } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { activityStatusList } from "../mock/addCabinetActivity";
import type { ActivityStatus } from "../types/addActivity";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const AddActivityModal: React.FC<ModalProps>  = ({ open, setOpen }) => {
  
  const [activity, setActivity] = useState<ActivityStatus>('ongoing')
  const [search, setSearch] = useState<string>("")


  const [images, setImages] = useState({
    picture1: "",
    picture2: "",
    picture3: "",
  });

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


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogContent className="sm:max-w-[540px] bg-white p-5 pb-7.5 pt-10 xl:pt-8" showCloseButton={false}>
            <DialogHeader className="flex flex-row items-center justify-between w-full">
              <DialogTitle className="text-2xl font-semibold text-accent-foreground">Add Activity</DialogTitle>
              <DialogClose asChild>
                <button type="button" className="text-foreground">
                  <XCircle />
                </button>
              </DialogClose>
            </DialogHeader>
            <DialogDescription>
              <div className="pt-1">
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Cabinet</Label>
                    <div className="relative">
                      <Search
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        id="cabinet-search"
                        placeholder="Search for a cabinet"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 border border-border bg-white md:!h-12.5"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Activity Type</Label>
                    <Select>
                      <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select activity type" /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="door-open">Door opened</SelectItem>
                        <SelectItem value="connectivity-lost">Connectivity lost</SelectItem>
                        <SelectItem value="asset-removed">Asset removed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="card-neutral border py-4.5 px-4 text-xs flex items-center gap-5 bg-[#F7FAFE] border-[#D1DBED] rounded-[10px] text-foreground">
                    <InfoIcon />
                    <div className="w-0 grow">
                      You can enable Maintenance Mode in the cabinet's settings. This pauses all cabinet notifications until Maintenance Mode is disabled again.
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
            <DialogFooter className="bg-white border-0">
              <div className="flex flex-wrap gap-2 sm:gap-5 justify-center sticky bottom-0 w-full">
                <DialogClose asChild>
                  <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3.5 px-5 rounded-full text-sm gap-1.25 sm:w-full sm:max-w-[140px] md:max-w-[180px]">Cancel</button>
                </DialogClose>
                <DialogClose asChild>
                  <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 sm:py-3.5 px-5 rounded-full text-sm gap-1.25 sm:w-full sm:max-w-[140px] md:max-w-[180px]">Add Activity</button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
