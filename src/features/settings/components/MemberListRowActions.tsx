"use client"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

import { EditMemberDrawer } from "./EditMemberDrawer"
import { ConfirmationPopup } from "@/app/components/confirmation-popup"
import { successToast } from "@/lib/toast"

export function MemberListRowActions() {
  const [open, setOpen] = useState<boolean>(false)
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  return (
    <>
      {/* Edit */}
      <div className="flex items-center gap-4 justify-center">
        <EditMemberDrawer open={openDrawer} setOpen={setOpenDrawer}>
          <button type="button" className="text-accent-foreground">
            <Pencil size={16} />
          </button>
        </EditMemberDrawer>
        {/* Delete Icon */}
        <button type="button" className="text-error w-7.5 h-7.5 rounded-full bg-card-error flex items-center justify-center" onClick={()=> setOpen(true)}>
            <Trash2 size={16} />
        </button>
      </div>
      <ConfirmationPopup
        open={open}
        setOpen={setOpen}
        title="Are you sure you want to delete this Member?"
        description="Deleting this member will permanently remove it from the system and may affect cabinet organization"
        onConfirm={() => {
          successToast("Member deleted successfully")
        }}
      />
    </>
  )
}