import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { cn } from "@/lib/utils"

export type DataTableProps<TData> = {
  table: TanstackTable<TData>
  emptyMessage?: string
  tableClassName?: string
}

export function DataTable<TData>({
  table,
  emptyMessage = "No results.",
  tableClassName,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  const colCount = table.getVisibleLeafColumns().length

  return (
    <Table className={tableClassName}>
      <TableHeader className="bg-muted/40 border-b">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b-0 hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  "text-muted-foreground text-xs font-medium uppercase tracking-wide",
                  header.column.columnDef.meta?.headerClassName
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={colCount}
              className="text-muted-foreground h-24 text-center text-sm"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cell.column.columnDef.meta?.cellClassName}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
