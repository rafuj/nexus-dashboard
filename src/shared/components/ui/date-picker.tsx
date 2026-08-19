"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  value?: Date
  onChange?: (date?: Date) => void
  disabled?: boolean
  className?: string
  dateType?: "future" | "past"
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  className = "",
  dateType
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (date?: Date) => {
    onChange?.(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(`h-12.5 w-full justify-between text-left font-semibold text-accent-foreground !bg-transparent ${className}`, {
            "!bg-[#BDBDBD]/15 !border-border cursor-auto !opacity-100" : disabled
          })}
        >
          {value ? format(value, "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy")}
          {!disabled && (<CalendarIcon />)}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          defaultMonth={value}
          disabled={
            dateType === "future"
              ? { before: new Date() }
              : dateType === "past"
                ? { after: new Date() }
                : undefined
          }
        />
      </PopoverContent>
    </Popover>
  )
}