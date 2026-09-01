"use client"
import { Pencil, Trash2 } from "lucide-react"
import type { SettingsGroupRow } from "../types/settingsList"
import { useState } from "react"
import { EditGroupDrawer } from "./EditGroupDrawer"
import { ConfirmationPopup } from "@/app/components/confirmation-popup"
import { successToast } from "@/lib/toast"

export function ListRowActions({ row }: { row: SettingsGroupRow }) {
  const [open, setOpen] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  console.log("row",row)
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
      <ConfirmationPopup 
        open={open}
        setOpen={setOpen}
        title="Are you sure you want to delete this group?"
        description="Deleting this group will permanently remove it from the system and may affect cabinet organization, member access, and related configurations."
        onConfirm={() => {
          successToast("Group deleted successfully")
          setOpen(false)
        }}
      />
    </>
  )
}
