import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { XCircle } from "lucide-react"

import type { Dispatch, SetStateAction } from "react"
import HowToUseIcon from "@/assets/icons/how-to-use-icon.svg?react"
import EmailUsIcon from "@/assets/icons/email-us.svg?react"
import CallUsIcon from "@/assets/icons/call-us.svg?react"
import ArrowRightIcon from "@/assets/icons/arrow-right.svg?react"
import SupportClockIcon from "@/assets/icons/support-clock.svg?react"
import { Link } from "react-router"

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}


export const SupportModal: React.FC<ModalProps>  = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[540px] bg-white" showCloseButton={false}>
          <DialogHeader className="gap-0.5 pt-2">
            <DialogTitle className="text-2xl font-semibold text-accent-foreground">Support</DialogTitle>
            <DialogTrigger className="text-primary absolute top-5 right-5">
                <XCircle />
            </DialogTrigger>
            <DialogDescription className="text-xs">
              We’re here to help. Choose an option below:
            </DialogDescription>
          </DialogHeader>
          <div>
            <h2 className="text-sm font-semibold mb-3.5">How can we help you?</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="card-info bg-[#E2EDFD] border-[#C9DAF4] border p-5 rounded-[10px]">
                    <div className="mb-3">
                        <HowToUseIcon />
                    </div>
                    <h6 className="text-sm font-semibold mb-1">How to use</h6>
                    <p className="text-xs mb-1">
                        Find answer to common questions and learn how to get the most out of the dashboard.
                    </p>
                    <div className="flex justify-end">
                        <Link to="#" className="flex">
                            <ArrowRightIcon className="text-[#1267E9]" />
                        </Link>
                    </div>
                </div>
                <div className="card-success2 border p-5 rounded-[10px]">
                    <div className="mb-3">
                        <EmailUsIcon />
                    </div>
                    <h6 className="text-sm font-semibold mb-1">Email Us</h6>
                    <p className="text-xs mb-1">
                        Send us a message and our support team will get back to you as soon as possible.
                    </p>
                    <div className="flex justify-end">
                        <Link to="#" className="flex">
                            <ArrowRightIcon className="text-success2" />
                        </Link>
                    </div>
                </div>
                <div className="card-neutral border bg-[#F3EFFF] border-[#E6DEFE] p-5 rounded-[10px] col-span-2 flex items-center gap-2.5">
                    <div>
                        <CallUsIcon />
                    </div>
                    <div className="w-0 grow max-w-[278px] mr-auto">
                        <h6 className="text-sm font-semibold mb-1">Call us</h6>
                        <p className="text-xs">
                            You can call us during working hours. One of our team member will help you further.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Link to="#" className="flex">
                            <ArrowRightIcon className="text-[#663ECA]" />
                        </Link>
                    </div>
                </div>
                <div className="col-span-2 text-center pt-1">
                    <div className="flex justify-center mb-1.5">
                        <SupportClockIcon />
                    </div>
                    <h5 className="text-sm font-semibold mb-1">Support Hours</h5>
                    <div className="text-xs">
                        <span className="font-semibold text-accent-foreground">Monday - Friday, 9.00 - 17.30 hour</span>
                        <br />
                        We typically reply with a few hours.
                    </div>
                </div>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
