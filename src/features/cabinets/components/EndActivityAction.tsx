"use client"
import { EndActivityModal } from "../views/EndActivityModal"
import type { CabinetActivityRow } from "../types/activityList"
import { useState } from "react"

export function EndActivityAction({ row }: { row: CabinetActivityRow }) {
  
  const [openEndActivity, setOpenEndActivity] = useState<boolean>(false)
  
  return (
    <>
        <div className="flex items-center gap-2">
            <button type="button" className="card-error px-4 py-1.25 text-error border rounded-[4px] text-xs" onClick={()=> setOpenEndActivity(true)}>End Activity</button>
        </div>

        <EndActivityModal {
            ...{
                open: openEndActivity,
                setOpen: setOpenEndActivity
            }
        } />
    </>
  )
}
