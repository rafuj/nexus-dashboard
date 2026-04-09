import { Link } from "react-router"

import type { RecentActivityDefinition } from "../types/dashboardStats"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { 
  formatActivityDate, 
  getIcon
} from "@/lib/utils"

type DashboardSmartCabinetActivityTableProps = {
  items: RecentActivityDefinition[]
}

/**
 * Scrollable cabinet event log
 */
export function DashboardSmartCabinetActivityTable({
  items,
}: DashboardSmartCabinetActivityTableProps) {
  return (
    <div className="max-h-[min(22rem,55vh)] overflow-auto px-1 sm:px-0">
      <Table className="min-w-176 table-fixed">
        <TableHeader className="bg-card border-border sticky top-0 z-1 border-b">
          <TableRow className="border-b-0 hover:bg-transparent">
            <TableHead className="text-muted-foreground w-12 pl-4 text-xs font-medium uppercase tracking-wide">
              <span className="sr-only">Type</span>
            </TableHead>
            <TableHead className="text-muted-foreground w-50 min-w-50 text-xs font-medium uppercase tracking-wide">
              Date & Time
            </TableHead>
            <TableHead className="text-muted-foreground w-32 text-xs font-medium uppercase tracking-wide">
              Cabinet
            </TableHead>
            <TableHead className="text-muted-foreground pr-4 text-xs font-medium uppercase tracking-wide">
              Event
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="w-12 pl-4 align-middle">
                <span
                  className="inline-flex"
                  title={item.type}
                  aria-label={`Event type: ${item.type}`}
                >
                  {getIcon(item.type)}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground w-50 min-w-50 align-middle text-sm tabular-nums whitespace-nowrap">
                {formatActivityDate(item.date)}
              </TableCell>
              <TableCell className="w-32 align-middle whitespace-nowrap">
                <Link
                  to={`/cabinetview?cabinetId=${encodeURIComponent(item.cabinetId)}`}
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  {item.cabinetId}
                </Link>
              </TableCell>
              <TableCell className="text-foreground pr-4 align-middle text-sm leading-snug whitespace-normal wrap-break-word">
                {item.activity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
