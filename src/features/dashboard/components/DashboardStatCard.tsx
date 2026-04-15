import type { DashboardStatDefinition } from "../types/dashboardStats"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

type DashboardStatCardProps = {
  stat: DashboardStatDefinition
}

export function DashboardStatCard({ stat }: DashboardStatCardProps) {
  const Icon = stat.icon

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {stat.title}
          </CardTitle>
          {stat.hint ? (
            <CardDescription className="text-xs">{stat.hint}</CardDescription>
          ) : null}
        </div>
        <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border border-border">
          <Icon className="size-4" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {stat.value}
        </p>
      </CardContent>
    </Card>
  )
}
