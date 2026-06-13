import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { useState, type Dispatch, type SetStateAction } from "react"
import { SuccessModal } from "./SuccessModal"
interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const ConfirmationModal: React.FC<ModalProps>  = ({ open, setOpen }) => {

      const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] flex flex-col" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-accent-foreground">Confirm AED Addition</DialogTitle>
            <DialogDescription className="text-xs">
              Please review the entered information before adding this AED to the cabinet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3.75 pt-2 text-xs">
            <div className="rounded-t-[10px] rounded-b-[8px] border">
                <div className="py-3 px-2.5 bg-border rounded-t-[8px]">
                    <h6 className="text-sm font-semibold">Asset Details</h6>
                </div>
                <div>
                    <ul className="py-1">
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">Type of asset</span>
                            <span className="font-semibold text-accent-foreground">AED</span>
                        </li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">AED set suitable for</span>
                            <span className="font-semibold text-accent-foreground">Both adult and children</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="rounded-t-[10px] rounded-b-[8px] border">
                <div className="py-3 px-2.5 bg-border rounded-t-[8px]">
                    <h6 className="text-sm font-semibold">Pads Information</h6>
                </div>
                <div>
                    <ul className="py-1">
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">1st set pads for</span>
                            <span className="font-semibold text-accent-foreground">Adult + Child</span>
                        </li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">1st set pads expiration date</span>
                            <span className="font-semibold text-accent-foreground">17/08/2027</span>
                        </li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">1st set pads LOT number</span>
                            <span className="font-semibold text-accent-foreground">28392</span>
                        </li>
                        <li className="border-t border-border mx-2.5 my-1.5"></li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">2nd set pads for</span>
                            <span className="font-semibold text-accent-foreground">Adult + Child</span>
                        </li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">2nd set pads expiration date</span>
                            <span className="font-semibold text-accent-foreground">17/08/2027</span>
                        </li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">2nd set pads LOT number</span>
                            <span className="font-semibold text-accent-foreground">28392</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="rounded-t-[10px] rounded-b-[8px] border">
                <div className="py-3 px-2.5 bg-border rounded-t-[8px]">
                    <h6 className="text-sm font-semibold">Battery Information</h6>
                </div>
                <div>
                    <ul className="py-1">
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">Battery serial number</span>
                            <span className="font-semibold text-accent-foreground">SN02934729</span>
                        </li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">Battery expiration date</span>
                            <span className="font-semibold text-accent-foreground">30/01/2029</span>
                        </li>
                        <li className="grid grid-cols-2 px-2.5 py-1.5">
                            <span className="font-medium">Battery LOT number</span>
                            <span className="font-semibold text-accent-foreground">B-82734</span>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
          <DialogFooter className="!justify-center !flex-row !flex-wrap">
            <DialogClose asChild>
                <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]">Back to Edit</button>
            </DialogClose>
                <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]" onClick={()=> {
                    setOpen(false)
                    setSuccessModalOpen(true)
                }}>Confirm & Add</button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
    <SuccessModal open={successModalOpen} setOpen={setSuccessModalOpen} />
    </>
  )
}
