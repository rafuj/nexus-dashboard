"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range?: DateRange) => void
  disabled?: boolean
  className?: string
  prefix?: string
}

export function DateRangePicker({
  value,
  onChange,
  disabled = false,
  className = "",
  prefix = ""
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (range: DateRange | undefined) => {
  // 1. If the picker was empty or reset, just apply the new range
  if (!value?.from || !value?.to) {
    onChange?.(range)
    if (range?.from && range?.to) setOpen(false)
    return
  }

  // 2. If we had a full range, react-day-picker returns a weird mixed range.
  // We need to figure out which date the user JUST clicked.
  const clickedDate = range?.from?.getTime() === value.from.getTime() 
    ? range?.to 
    : range?.from

  // 3. Force a brand new selection starting from that clicked date
  onChange?.({ from: clickedDate, to: undefined })
}
  
  const label = React.useMemo(() => {
    if (value?.from && value?.to) {
      const sameYear = value.from.getFullYear() === value.to.getFullYear()

      return `${format(value.from, "MMM d")} - ${format(
        value.to,
        sameYear ? "d, yyyy" : "MMM d, yyyy"
      )}`
    }

    if (value?.from) {
      return format(value.from, "MMM d, yyyy")
    }

    return "Date range"
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "h-12.5 w-full justify-between text-left font-semibold text-accent-foreground !bg-white",
            className
          )}
        >
          {prefix &&  <span className="text-foreground font-normal">{prefix}</span> }
          {label}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          defaultMonth={value?.from}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}