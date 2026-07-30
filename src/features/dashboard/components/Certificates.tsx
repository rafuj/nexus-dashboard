
import { ChevronRight } from "lucide-react";
import { Icons } from "@/app/icons/icons";
import { Link } from "react-router";
import { CertificatesDetailsModal } from "./CertificatesDetailsModal";
import { useState } from "react";

export default function Certificates() {
    const [open, setOpen] = useState<boolean>(false)
    
    const statusData = [
        {
            label: "Up to date",
            count: 64,
            percentage: "74%",
            color: "bg-green-600",
        },
        {
            label: "Expiring soon",
            count: 14,
            percentage: "16%",
            color: "bg-yellow-400",
        },
        {
            label: "Expired",
            count: 8,
            percentage: "10%",
            color: "bg-red-600",
        },
    ]

    return (
        <div className="p-5 relative border rounded-[15px] bg-white">
            <h2 className="text-sm font-semibold mb-12">Certificates</h2>
            <Icons.certificatesIcon className="absolute top-5 right-5 xl:right-8" />
            <h6 className="font-bold text-3xl lg:text-[40px] leading-[1]">86</h6>
            <p className="mb-4 text-sm mt-1">Total Certificates</p>
            <div className="mb-5">
                <table className="w-full text-[12px] max-w-[215px]">
                    <tbody>
                        {statusData.map((item) => (
                            <tr key={item.label} className="h-8">
                                <td className="py-2">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`w-2 h-2 rounded-full ${item.color} shrink-0`}
                                        />
                                        <span className="text-slate-500">{item.label}</span>
                                    </div>
                                </td>

                                <td className="py-2 text-right font-semibold text-slate-900">
                                    {item.count}
                                </td>

                                <td className="py-2 pl-6 text-right font-semibold text-slate-900">
                                    {item.percentage}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to="#" className="text-xs pr-5 relative inline-flex items-center gap-2 text-accent-foreground" onClick={()=> setOpen(true)}>
                View certificates
                <span>
                    <ChevronRight size={16} />
                </span>
            </Link>
            <CertificatesDetailsModal open={open} setOpen={setOpen} />
        </div>
    )
}