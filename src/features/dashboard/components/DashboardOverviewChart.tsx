import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { MaintenanceDetailsModal } from "./MaintenanceDetailsModal";
import { useState } from "react";

interface MaintenanceI {
    dueIn30Days: number
    dueIn90Days: number
    overdue: number
    total: number
    upToDate: number
}
const data = (maintenance:MaintenanceI) => [
    { name: "Overdue", value: maintenance?.overdue, color: "#D50000" },
    { name: "Due in 30 days", value: maintenance?.dueIn30Days, color: "#E66100" },
    { name: "Due in 90 days", value: maintenance?.dueIn90Days, color: "#F2CC00" },
    { name: "Up to date", value: maintenance?.upToDate, color: "#388E3C" },
];

interface Props {
  maintenance: MaintenanceI
}
export default function DashboardOverviewChart({ maintenance }: Props) {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className="p-5 relative border rounded-[15px] bg-white">
            <h2 className="text-sm font-semibold">Maintenance Overview</h2>
            <div className="mb-2">
                <div className="flex items-center gap-4">
                    {/* Legend */}
                    <div className="space-y-5">
                        {data(maintenance).map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between gap-4 sm:gap-8 text-xs"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-[#6B7280]">{item.name}</span>
                                </div>

                                <span className="font-semibold text-accent-foreground">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="relative w-[200px] sm:w-[240px] aspect-square mx-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data(maintenance)}
                                    dataKey="value"
                                    innerRadius="68%"
                                    outerRadius="100%"
                                    paddingAngle={1}
                                    stroke="#fff"
                                    strokeWidth={3}
                                >
                                    {data(maintenance).map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <h2 className="text-2xl xl:text-[32px] font-bold leading-none">
                                {maintenance?.total || 0}
                            </h2>
                            <p className="text-sm xl:text-base text-accent-foreground mt-2 m-0">
                                Total
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <MaintenanceDetailsModal open={open} setOpen={setOpen} />
            <Link to="#" className="text-xs pr-5 relative inline-flex items-center gap-2 text-accent-foreground" onClick={()=> setOpen(true)}>
                View maintenance details
                <span>
                    <ChevronRight size={16} />
                </span>
            </Link>
        </div>
    );
}