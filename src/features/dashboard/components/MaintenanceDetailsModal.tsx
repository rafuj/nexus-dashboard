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
import XCircle from "@/assets/icons/close-circle.svg?react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}
type Status = 'all' | 'warning' | 'urgent' | 'up-to-date';

export type CabinetItem = 'Pads' | 'Battery';
export interface Cabinet {
  name: string;
  city: string;
  status: Status;
  expiryDate: string;
  what: CabinetItem;
}
export const cabinetData: Cabinet[] = [
  {
    name: 'Cabinet 014',
    city: 'Delft',
    status: 'urgent',
    expiryDate: '24 Jul 2026',
    what: 'Pads',
  },
  {
    name: 'Cabinet 031',
    city: 'Rotterdam',
    status: 'warning',
    expiryDate: '4 Aug 2026',
    what: 'Battery',
  },
  {
    name: 'Cabinet 047',
    city: 'Utrecht',
    status: 'warning',
    expiryDate: '11 Aug 2026',
    what: 'Pads',
  },
  {
    name: 'Cabinet 079',
    city: 'Amsterdam',
    status: 'warning',
    expiryDate: '27 Aug 2026',
    what: 'Pads',
  },
  {
    name: 'Cabinet 062',
    city: 'Eindhoven',
    status: 'up-to-date',
    expiryDate: '18 Aug 2026',
    what: 'Battery',
  },
  {
    name: 'Cabinet 103',
    city: 'Groningen',
    status: 'up-to-date',
    expiryDate: '9 Sep 2026',
    what: 'Battery',
  },
];
export const MaintenanceDetailsModal: React.FC<ModalProps>  = ({ open, setOpen }) => {

    const [status, setStatus] = useState<Status>('all');

    // Helper function to filter cabinets by status

    const filterCabinets = (cabinets: Cabinet[], selectedStatus: Status): Cabinet[] => {
    if (selectedStatus === 'all') return cabinets;
    return cabinets.filter((cabinet) => cabinet.status === selectedStatus);
    };


    const chipClass = "text-xs font-semibold rounded-full py-1.5 px-4 text-center min-w-20 block xl:min-w-24"
    const chipNeutral = "bg-[#F0F2F7] text-accent-foreground"
    const chipUrgent = "bg-[#FFE8E8] text-[#B81412]"
    const chipWarning = "bg-[#FFF2DB] text-[#B05705]"
    const chipSuccess = "bg-[#E5F7EB] text-[#147D40]"

    const getStatusChip = (status: Status) => {
        switch (status) {
        case 'urgent':
            return <span className={`${chipClass} ${chipUrgent}`}>Urgent</span>;
        case 'warning':
            return <span className={`${chipClass} ${chipWarning}`}>Warning</span>;
        case 'up-to-date':
            return <span className={`${chipClass} ${chipSuccess}`}>Up-to-date</span>;
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
                            <DialogTitle className="text-2xl font-semibold text-accent-foreground">Maintenance overview</DialogTitle>
                            <DialogDescription className="text-xs">
                            Cabinets sorted by status priority and expiry date
                            </DialogDescription>
                            <DialogClose className="text-red-500 absolute top-5 right-5">
                                <XCircle />
                            </DialogClose>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto flex flex-col gap-3.75 pt-2 text-xs">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className={cn(chipClass, chipNeutral)}>24 total</span>
                                    <span className={cn(chipClass, chipUrgent)}>4 urgent</span>
                                    <span className={cn(chipClass, chipWarning)}>12 warning</span>
                                </div>
                                <div className="ml-auto">
                                    <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                                        <SelectTrigger className="w-full min-w-42 sm:w-44 text-sm md:!h-12.5">
                                            <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                                            <span className="font-normal text-foreground">Status:</span>
                                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="All Status" /></span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={'all'}>All</SelectItem>
                                            <SelectItem value={'urgent'}>Urgent</SelectItem>
                                            <SelectItem value={'up-to-date'}>Up-to-date</SelectItem>
                                            <SelectItem value={'warning'}>Warning</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full w-auto text-left text-xs border-seperated">
                                    <thead>
                                        <tr className="bg-[#F7F9FB]">
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground rounded-l-[10px]">Cabinet name</th>
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground">City</th>
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground">Status</th>
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground">Expiry date</th>
                                            <th scope="col" className="px-3.5 py-3 font-semibold text-accent-foreground rounded-r-[10px]">What</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-[#FDFDFE] bg-white">
                                            {filterCabinets(cabinetData, status).map((row, index) => (
                                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-3.5 py-4 font-medium text-slate-900">{row.name}</td>
                                                <td className="px-3.5 py-4 text-slate-600">{row.city}</td>
                                                <td className="px-3.5 py-4">{getStatusChip(row.status)}</td>
                                                <td className="px-3.5 py-4 text-slate-600">{row.expiryDate}</td>
                                                <td className="px-3.5 py-4 text-slate-600">{row.what}</td>
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
