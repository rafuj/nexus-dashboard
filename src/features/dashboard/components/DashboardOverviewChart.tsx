import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Overdue", value: 4, color: "#D50000" },
    { name: "Due in 30 days", value: 12, color: "#E66100" },
    { name: "Due in 90 days", value: 31, color: "#F2CC00" },
    { name: "Up to date", value: 201, color: "#388E3C" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export default function DashboardOverviewChart() {
    return (
        <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="space-y-5">
                {data.map((item) => (
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
                            data={data}
                            dataKey="value"
                            innerRadius="70%"
                            outerRadius="100%"
                            paddingAngle={1}
                            stroke="#fff"
                            strokeWidth={3}
                        >
                            {data.map((entry) => (
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
                        {total}
                    </h2>
                    <p className="text-sm xl:text-base text-accent-foreground mt-2 m-0">
                        Total
                    </p>
                </div>
            </div>
        </div>
    );
}