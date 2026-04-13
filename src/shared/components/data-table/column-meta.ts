import type { RowData } from "@tanstack/table-core"

declare module "@tanstack/table-core" {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string
    cellClassName?: string
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

export {}
