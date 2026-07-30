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
import XCircle from "@/assets/icons/close-circle.svg?react"

import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}
export type Status = 'all' | 'expired' | 'expiring' | 'valid';

export interface Cabinet {
  member: string;
  status: Status;
  expiryDate: string;
}
export const memberData: Cabinet[] = [
  {
    member: 'Sophie Bakker',
    status: 'expired',
    expiryDate: '24 Jul 2026',
  },
  {
    member: 'Lucas Jansen',
    status: 'expiring',
    expiryDate: '4 Aug 2026',
  },
  {
    member: 'Mia Visser',
    status: 'expiring',
    expiryDate: '11 Aug 2026',
  },
  {
    member: 'John Smith',
    status: 'expiring',
    expiryDate: '27 Aug 2026',
  },
  {
    member: 'Noah Smit',
    status: 'valid',
    expiryDate: '18 Aug 2026',
  },
  {
    member: 'Emma de Vries',
    status: 'valid',
    expiryDate: '9 Sep 2026',
  },
];
export const CertificatesDetailsModal: React.FC<ModalProps>  = ({ open, setOpen }) => {


    const chipClass = "text-xs font-semibold rounded-full py-1.5 px-4 text-center min-w-20 block xl:min-w-24"
    const chipNeutral = "bg-[#F0F2F7] text-accent-foreground"
    const chipUrgent = "bg-[#FFE8E8] text-[#B81412]"
    const chipWarning = "bg-[#FFF2DB] text-[#B05705]"
    const chipSuccess = "bg-[#E5F7EB] text-[#147D40]"

    const getStatusChip = (status: Status) => {
        switch (status) {
        case 'expired':
            return <span className={`${chipClass} ${chipUrgent}`}>Expired</span>;
        case 'expiring':
            return <span className={`${chipClass} ${chipWarning}`}>Expiring</span>;
        case 'valid':
            return <span className={`${chipClass} ${chipSuccess}`}>Valid</span>;
        default:
            return <span className={`${chipClass} ${chipNeutral}`}>{status}</span>;
        }
    };
        
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <form>
                    <DialogContent className="sm:max-w-[770px] max-h-[90vh] flex flex-col bg-white" showCloseButton={false}>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-accent-foreground">Member certificates</DialogTitle>
                            <DialogDescription className="text-xs">
                            Certificates sorted by status priority and expiry date
                            </DialogDescription>
                            <DialogClose className="text-red-500 absolute top-5 right-5">
                                <XCircle />
                            </DialogClose>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto flex flex-col gap-3.75 pt-2 text-xs">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className={cn(chipClass, chipNeutral)}>24 total</span>
                                <span className={cn(chipClass, chipWarning)}>12 expiring</span>
                                <span className={cn(chipClass, chipUrgent)}>4 expired</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full w-auto text-left text-xs border-seperated">
                                    <thead>
                                        <tr className="bg-[#F7F9FB]">
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground rounded-l-[10px]">Member</th>
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground">Status</th>
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground">Expiry date</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-[#FDFDFE] bg-white">
                                            {memberData.map((row, index) => (
                                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-3.5 py-4 font-medium text-slate-900">{row.member}</td>
                                                <td className="px-3.5 py-4">
                                                    <div className="flex">
                                                        {getStatusChip(row.status)}
                                                    </div>
                                                </td>
                                                <td className="px-3.5 py-4 text-slate-600">{row.expiryDate}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <DialogFooter className="!justify-between !flex-row !flex-wrap items-center border-0 bg-transparent">
                            <span className="text-xs">Showing 6 priority records</span>
                            <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 w-full max-w-[140px] md:h-12.5 md:max-w-[180px]" onClick={()=> {
                                setOpen(false)
                            }}>Close</button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    )
}
