import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { cn } from "@/lib/utils"

export type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span className={cn("text-muted-foreground font-medium uppercase tracking-wide", className)}>
        {title}
      </span>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "text-muted-foreground hover:text-foreground -ml-2.5 h-8 px-2 text-xs font-medium uppercase tracking-wide",
        className
      )}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <span className="ml-1 shrink-0">
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="size-3.5" aria-hidden />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="size-3.5" aria-hidden />
        ) : (
          <ChevronsUpDown className="text-muted-foreground/70 size-3.5" aria-hidden />
        )}
      </span>
    </Button>
  )
}
