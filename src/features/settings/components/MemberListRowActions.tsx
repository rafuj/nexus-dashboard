"use client"
import { Pencil, Trash2 } from "lucide-react"
import type { SettingsGroupRow } from "../types/settingsList"
import { useState } from "react"
import { MemberDeleteConfirmation } from "./MemberDeleteConfirmation"

import { EditMemberDrawer } from "./EditMemberDrawer"

export function MemberListRowActions({ row }: { row: SettingsGroupRow }) {
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
      <MemberDeleteConfirmation open={open} setOpen={setOpen} />
    </>
  )
}