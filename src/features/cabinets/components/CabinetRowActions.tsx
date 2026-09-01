"use client"
import { Pencil, Trash2 } from "lucide-react"
import type { Cabinet } from "../types/cabinetList"
import { Link } from "react-router"
import { useState } from "react"
import { successToast } from "@/lib/toast"
import { ConfirmationPopup } from "@/app/components/confirmation-popup"

export function CabinetRowActions({ row }: { row: Cabinet }) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <div className="flex items-center gap-4 justify-center">
        <Link to={`/cabinets/list/${row.id}?isEditing=true`} className="truncate font-medium"><Pencil size={16} /></Link>
        <button type="button" className="text-error" onClick={()=> setOpen(true)}>
            <Trash2 size={16} />
        </button>
      </div>
      <ConfirmationPopup
        open={open}
        setOpen={setOpen}
        title="Are you sure you want to remove this cabinet?"
        description="Removing this cabinet will permanently remove it from the system."
        onConfirm={() => {
          successToast("Cabinet removed successfully")
          setOpen(false)
        }}
      />
    </>
  )
}
