import type { SystemLogsDefinition } from "../types/dashboardStats"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { 
  cn, 
  formatActivityDate 
} from "@/lib/utils"

type DashboardSystemActivityTableProps = {
  items: SystemLogsDefinition[]
}

/**
 * Workspace audit log
 */
export function DashboardSystemActivityTable({ items }: DashboardSystemActivityTableProps) {
  return (
    <div className="max-h-[min(22rem,55vh)] overflow-auto px-1 sm:px-0">
      <Table className="min-w-lg table-fixed">
        <TableHeader className="bg-card border-border sticky top-0 z-1 border-b">
          <TableRow className="border-b-0 hover:bg-transparent">
            <TableHead className="text-muted-foreground w-50 min-w-50 text-xs font-medium uppercase tracking-wide">
              Date & Time
            </TableHead>
            <TableHead className="text-muted-foreground pr-4 text-xs font-medium uppercase tracking-wide">
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-muted-foreground w-50 min-w-50 align-middle text-sm tabular-nums whitespace-nowrap">
                {formatActivityDate(item.date)}
              </TableCell>
              <TableCell
                className={cn(
                  "text-foreground pr-4 align-middle text-sm leading-snug whitespace-normal wrap-break-word",
                  item.type === "user" && "font-medium"
                )}
              >
                {item.activity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
