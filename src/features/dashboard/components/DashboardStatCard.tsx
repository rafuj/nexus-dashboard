import { cn } from "@/lib/utils"
import type { DashboardStatDefinition } from "../types/dashboardStats"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

type DashboardStatCardProps = {
  stat: DashboardStatDefinition
}

export function DashboardStatCard({ stat }: DashboardStatCardProps) {
  const Icon = stat.icon

  return (
    <div className={cn("py-4 px-5 border rounded-[20px]", stat.className)}>
      <Icon aria-hidden />
      <h3 className="text-2xl font-semibold mt-4 mb-1">
        {stat.value}
      </h3>
      <p className="text-sm pr-5 relative">
        {stat.title}
        <Link to="#" className="absolute top-1/2 right-0 -translate-y-1/2 text-accent-foreground">
          <ChevronRight />
        </Link>
      </p>
    </div>
  )
}
