"use client"
import { Pencil, Trash2 } from "lucide-react"
import type { CabinetListRow } from "../types/cabinetList"

export function CabinetRowActions({ row }: { row: CabinetListRow }) {
  return (
    <div className="flex items-center gap-4 justify-center">
      <button type="button" className="text-accent-foreground">
          <Pencil size={16} />
      </button>
      <button type="button" className="text-error">
          <Trash2 size={16} />
      </button>
    </div>
  )
}
