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
import { SuccessModal } from "./SuccessModal"
import { formatDateSlash } from "@/lib/utils"
import { LoaderButton } from "@/app/components/loader-button"
import type { CreateCabinetFormValues } from "../types/cabinet"
interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  successModalOpen: boolean,
  setSuccessModalOpen: Dispatch<SetStateAction<boolean>>,
  values: CreateCabinetFormValues,
  handleSubmit: () => void
  id: string,
  isLoading: boolean,
  resetForm: () => void
}

export const ConfirmationModal: React.FC<ModalProps>  = ({ open, setOpen, successModalOpen, setSuccessModalOpen, values, handleSubmit, id, isLoading, resetForm }) => {


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[540px] max-h-[90vh] flex flex-col" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-accent-foreground">Confirm AED Addition</DialogTitle>
                        <DialogDescription className="text-xs">
                        Please review the entered information before adding this AED to the cabinet.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto flex flex-col gap-3.75 pt-2 text-xs">
                        {/* Asset Details */}
                        <div className="rounded-t-[10px] rounded-b-[8px] border">
                            <div className="py-3 px-2.5 bg-border rounded-t-[8px]">
                            <h6 className="text-sm font-semibold">Asset Details</h6>
                            </div>
                            <div>
                            <ul className="py-1">
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">Type of asset</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.name || "-"}
                                </span>
                                </li>
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">AED set suitable for</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[0]?.componentVariantName || "-"}
                                </span>
                                </li>
                            </ul>
                            </div>
                        </div>

                        {/* Pads Information */}
                        <div className="rounded-t-[10px] rounded-b-[8px] border">
                            <div className="py-3 px-2.5 bg-border rounded-t-[8px]">
                            <h6 className="text-sm font-semibold">Pads Information</h6>
                            </div>
                            <div>
                            <ul className="py-1">
                                {/* 1st Set Pads (Index 0) */}
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">1st set pads for</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[0]?.componentVariantName || "-"}
                                </span>
                                </li>
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">1st set pads expiration date</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[0]?.expiresAt
                                    ? formatDateSlash(values.asset.components[0].expiresAt)
                                    : "-"}
                                </span>
                                </li>
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">1st set pads LOT number</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[0]?.lotNumber || "-"}
                                </span>
                                </li>

                                <li className="border-t border-border mx-2.5 my-1.5"></li>

                                {/* 2nd Set Pads (Index 1) */}
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">2nd set pads for</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[1]?.componentVariantName || "-"}
                                </span>
                                </li>
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">2nd set pads expiration date</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[1]?.expiresAt
                                    ? formatDateSlash(values.asset.components[1].expiresAt)
                                    : "-"}
                                </span>
                                </li>
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">2nd set pads LOT number</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[1]?.lotNumber || "-"}
                                </span>
                                </li>
                            </ul>
                            </div>
                        </div>

                        {/* Battery Information */}
                        <div className="rounded-t-[10px] rounded-b-[8px] border">
                            <div className="py-3 px-2.5 bg-border rounded-t-[8px]">
                            <h6 className="text-sm font-semibold">Battery Information</h6>
                            </div>
                            <div>
                            <ul className="py-1">
                                {/* Battery (Index 2) */}
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">Battery serial number</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[2]?.serialNumber || "-"}
                                </span>
                                </li>
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">Battery expiration date</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[2]?.expiresAt
                                    ? formatDateSlash(values.asset.components[2].expiresAt)
                                    : "-"}
                                </span>
                                </li>
                                <li className="grid grid-cols-2 px-2.5 py-1.5">
                                <span className="font-medium">Battery LOT number</span>
                                <span className="font-semibold text-accent-foreground">
                                    {values.asset?.components?.[2]?.lotNumber || "-"}
                                </span>
                                </li>
                            </ul>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="!justify-center !flex-row !flex-wrap">
                        <DialogClose asChild>
                            <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]">Back to Edit</button>
                        </DialogClose>
                        <LoaderButton loading={isLoading} type="submit" className="flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]" onClick={handleSubmit}>Confirm & Add</LoaderButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <SuccessModal open={successModalOpen} setOpen={setSuccessModalOpen} cabinetId={id} resetForm={resetForm} />
        </>
    )
}
