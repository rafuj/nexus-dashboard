"use client"
import { Pencil, Trash2 } from "lucide-react"
import type { SettingsGroupRow } from "../types/settingsList"
import { useState } from "react"
import { DeleteConfirmation } from "./DeleteConfirmation"
import { EditGroupDrawer } from "./EditGroupDrawer"

export function ListRowActions({ row }: { row: SettingsGroupRow }) {
  const [open, setOpen] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  return (
    <>
      <div className="flex items-center gap-4 justify-center">
        <EditGroupDrawer open={drawerOpen} setOpen={setDrawerOpen}>
          <button type="button" className="text-accent-foreground">
              <Pencil size={16} />
          </button>
        </EditGroupDrawer>
        <button type="button" className="text-error w-7.5 h-7.5 rounded-full bg-card-error flex items-center justify-center" onClick={()=> setOpen(true)}>
            <Trash2 size={16} />
        </button>
      </div>
      <DeleteConfirmation open={open} setOpen={setOpen} />
    </>
  )
}
