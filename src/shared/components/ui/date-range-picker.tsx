"use client"

import * as React from "react"
import { format, subMonths } from "date-fns"
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
  dateType?: 'future' | 'past' | 'all' 
}

export function DateRangePicker({
  value,
  onChange,
  disabled = false,
  className = "",
  prefix = "",
  dateType = "all"
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (range: DateRange | undefined) => {
    // No existing complete range
    if (!value?.from || !value?.to) {
      onChange?.(range)

      // Close only after selecting both dates
      if (range?.from && range?.to) {
        setOpen(false)
      }

      return
    }

    // Existing range is complete.
    // User clicked a new date, so start a new range.
    const clickedDate =
      range?.from?.getTime() === value.from.getTime()
        ? range?.to
        : range?.from

    if (!clickedDate) return

    onChange?.({
      from: clickedDate,
      to: undefined,
    })

    // IMPORTANT:
    // Don't close here — user still needs to select the second date.
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

    return "Select"
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
          defaultMonth={
            dateType === "past"
              ? value?.from
                ? subMonths(value.from, 1)
                : subMonths(new Date(), 1)
              : value?.from ?? new Date()
          }
          numberOfMonths={2}
          className=""
          disabled={
            dateType === "future"
              ? (date) => date < new Date()
              : dateType === "past"
                ? (date) => date > new Date()
                : false
          }
        />
      </PopoverContent>
    </Popover>
  )
}