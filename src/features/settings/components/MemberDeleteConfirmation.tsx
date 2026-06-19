import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { type Dispatch, type SetStateAction } from "react"

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const MemberDeleteConfirmation: React.FC<ModalProps>  = ({ open, setOpen }) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[440px] max-h-[90vh] flex flex-col py-12" showCloseButton={false}>
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-semibold text-accent-foreground mb-3">Are you sure you want to delete this Member?</DialogTitle>
            <DialogDescription className="text-sm px-2">
              Deleting this member will permanently remove it from the system and may affect cabinet organization
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="!justify-center !flex-row !flex-wrap border-0 mt-5">
            <DialogClose asChild>
                <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]">Cancel</button>
            </DialogClose>
                <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]" onClick={()=> {
                    setOpen(false)
                }}>
                    Yes, Delete
                </button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
