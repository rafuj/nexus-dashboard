"use client"
import { Pencil, Trash2 } from "lucide-react"
import type { Cabinet } from "../types/cabinetList"
import { Link } from "react-router"

export function CabinetRowActions({ row }: { row: Cabinet }) {
  
  return (
    <div className="flex items-center gap-4 justify-center">
      <Link to={`/cabinets/list/${row.id}?isEditing=true`} className="truncate font-medium"><Pencil size={16} /></Link>
      <button type="button" className="text-error">
          <Trash2 size={16} />
      </button>
    </div>
  )
}
