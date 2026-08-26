import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import type { Dispatch, SetStateAction } from "react"
import { useNavigate } from "react-router"
interface ModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  cabinetId?: string 
}

export const SuccessModal: React.FC<ModalProps>  = ({ open, setOpen, cabinetId }) => {
  const navigate = useNavigate()
  return (
    <Dialog open={open} onOpenChange={()=> {
        if(!open){
          setOpen(open);
        }
      }
    }>
      <form>
        <DialogContent className="sm:max-w-[346px]" showCloseButton={false}>
          <DialogHeader className="text-center">
            <div className="flex justify-center">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 5C16.25 5 5 16.25 5 30C5 43.75 16.25 55 30 55C43.75 55 55 43.75 55 30C55 16.25 43.75 5 30 5ZM25 42.5L12.5 30L16.025 26.475L25 35.425L43.975 16.45L47.5 20L25 42.5Z" fill="#A72822"/>
                </svg>
            </div>
            <DialogTitle className="text-2xl font-semibold text-accent-foreground">Successful</DialogTitle>
            <DialogDescription className="text-xs">
              Your new cabinet has been added and its information has been securely saved to the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="!justify-center !items-center !flex-col gap-2 !border-0 !pt-2">
            <button type="button" className="flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full md:h-12.5" onClick={()=> {
              setOpen(false)
              navigate('/cabinets/list/'+cabinetId)
            }}>OK</button>
            <button type="button" className="w-full underline text-sm font-semibold text-accent-foreground" onClick={()=> {
              setOpen(false)
            }}>Add another cabinet</button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
