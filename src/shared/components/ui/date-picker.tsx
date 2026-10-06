"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
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
  showTime?: boolean
}

const getTimeValue = (date?: Date) => {
  if (!date || (date.getHours() === 0 && date.getMinutes() === 0)) return ""

  return format(date, "HH:mm")
}

const withTime = (date: Date, time: string) => {
  if (!time) return date

  const [hours, minutes] = time.split(":").map(Number)
  const nextDate = new Date(date)
  nextDate.setHours(hours, minutes, 0, 0)

  return nextDate
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  className = "",
  dateType,
  showTime = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTime, setSelectedTime] = React.useState(() => getTimeValue(value))

  React.useEffect(() => {
    setSelectedTime(getTimeValue(value))
  }, [value])

  const handleSelect = (date?: Date) => {
    if (!date) {
      onChange?.(date)
      return
    }

    onChange?.(showTime ? withTime(date, selectedTime) : date)

    if (!showTime) setOpen(false)
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (value) onChange?.(withTime(value, time))
  }

  const clearTime = () => {
    setSelectedTime("")
    if (value) {
      const dateOnly = new Date(value)
      dateOnly.setHours(0, 0, 0, 0)
      onChange?.(dateOnly)
    }
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
          {value
            ? `${format(value, "dd/MM/yyyy")}${showTime && selectedTime ? ` - ${selectedTime}` : ""}`
            : "Select date"}
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
        {showTime && (
          <div className="border-t border-border p-3">
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-accent-foreground">Time (optional)</span>
              {selectedTime && (
                <button
                  type="button"
                  className="text-xs font-medium text-primary"
                  onClick={clearTime}
                >
                  Clear
                </button>
              )}
            </div>
            <Input
              type="time"
              value={selectedTime}
              disabled={!value}
              onChange={(event) => handleTimeChange(event.target.value)}
              className="h-10"
              aria-label="Activity time"
            />
            {!value && (
              <p className="mt-1.5 text-xs text-muted-foreground">Select a date before adding a time.</p>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
