"use client";
import { InfoIcon, XCircle } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const EndActivityModal: React.FC<ModalProps>  = ({ open, setOpen }) => {

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
              <div>
                <DialogTitle className="text-2xl font-semibold text-accent-foreground">End Activity</DialogTitle>
                <DialogDescription className="text-xs">
                  Add details about what you have done before ending this activity.
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <button type="button" className="text-foreground">
                  <XCircle />
                </button>
              </DialogClose>
            </DialogHeader>
            <DialogDescription asChild>
              <div>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Notes <span className="text-error">*</span></Label>
                    <Textarea
                      placeholder="Describe the location or any important details..."
                      autoComplete="off"
                      className="px-5 placeholder:text-accent-foreground/20"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Situation Pictures <span className="text-foreground">(max. 3)</span></Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <SingleImageUploader
                        value={images.picture1}
                        onChange={(file) => handleImageChange("picture1", file)}
                        className="h-20"
                      />
                      <SingleImageUploader
                        value={images.picture2}
                        onChange={(file) => handleImageChange("picture2", file)}
                        className="h-20"
                      />
                      <SingleImageUploader
                        value={images.picture3}
                        onChange={(file) => handleImageChange("picture3", file)}
                        className="h-20"
                      />
                    </div>
                  </div>
                  <div className="card-warning border py-4.5 px-4 text-xs flex items-center bg-[#FFF7F2] border-[#E5736666] gap-4 rounded-[10px] text-foreground">
                    <InfoIcon className="text-accent-foreground" size={20} />
                    <div className="w-0 grow">
                      Reminder: If Maintenance Mode is enabled, disable it in the cabinet's settings after ending all manual activities for this cabinet.
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
                  <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 sm:py-3.5 px-5 rounded-full text-sm gap-1.25 sm:w-full sm:max-w-[140px] md:max-w-[180px]">End Activity</button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
