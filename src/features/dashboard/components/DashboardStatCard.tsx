import { cn } from "@/lib/utils"
import type { DashboardStatDefinition } from "../types/dashboardStats"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router"
import { Skeleton } from "@/shared/components/ui/skeleton"

type DashboardStatCardProps = {
  stat: DashboardStatDefinition
  loading: boolean
}

export function DashboardStatCard({ stat,loading = false }: DashboardStatCardProps) {
  const Icon = stat.icon

  return (
    <Link to={stat.url} className={cn("py-4 px-5 sm:px-3 2xl:px-5 border rounded-[20px]", stat.className)}>
      {loading ? <Skeleton className="size-8.5 rounded-full bg-white" /> : <Icon aria-hidden />}
      <h3 className="text-2xl font-semibold mt-4 mb-1">
        {loading ? <div className="h-8 flex items-center"><Skeleton className="w-20 bg-white h-5 rounded" /></div> : stat.value}
      </h3>
      <p className="text-xs 2xl:text-sm pr-4 relative">
        {loading ? <div className="h-5 flex items-center"><Skeleton className="w-12 bg-white h-4 rounded" /></div>: stat.title}
        {!loading&&<span className="absolute top-1/2 right-0 -translate-y-1/2 text-accent-foreground">
          <ChevronRight />
        </span>}
      </p>
    </Link>
  )
}
