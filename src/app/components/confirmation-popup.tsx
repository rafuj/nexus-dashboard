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
import { LoaderButton } from "./loader-button"

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onConfirm: () => void,
  title?: string,
  description?: string,
  confirmText?: string,
  cancelText?: string,
  loading?: boolean,
  icon?: React.ReactNode
}

export const ConfirmationPopup: React.FC<ModalProps>  = ({ open, setOpen, onConfirm, title = "Are you sure?", description = "Deleting this data will be removed permenantly.", confirmText = "Yes, Delete", cancelText = "Cancel", loading = false, icon }) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[440px] max-h-[90vh] flex flex-col py-12" showCloseButton={false}>
          <DialogHeader className="text-center">
            {icon && <div className="flex w-full justify-center items-center mb-5">{icon}</div>}
            <DialogTitle className="text-2xl font-semibold text-accent-foreground mb-3">{title}</DialogTitle>
            <DialogDescription className="text-sm px-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="!justify-center !flex-row !flex-wrap border-0 mt-5">
            <DialogClose asChild>
                <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]">{cancelText}</button>
            </DialogClose>
                <LoaderButton loading={loading} type="submit" className="flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]" onClick={()=> {
                  onConfirm();
                }}>
                    {confirmText}
                </LoaderButton>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
