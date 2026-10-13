"use client"
import { EndActivityModal } from "../views/EndActivityModal"
import type { CabinetEventRow } from "../types/eventList"
import { useState } from "react"

export function EndActivityAction({ row }: { row: CabinetEventRow }) {
  
  const [openEndActivity, setOpenEndActivity] = useState<boolean>(false)
  console.log("row", row)
  
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
