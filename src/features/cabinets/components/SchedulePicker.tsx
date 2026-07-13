import React, { useCallback, useMemo } from 'react';
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { X } from "lucide-react";
import { cn } from '@/lib/utils';
import type { DayConfig } from '../types/addCabinet';

interface ScheduleRowProps {
  dayConfig: DayConfig;
  onChange: (day: string, patch: Partial<DayConfig>) => void;
  timeOptions: string[];
  readOnly?: boolean
}
interface SchedulePickerProps {
  schedule: DayConfig[];
  onScheduleChange: (newSchedule: DayConfig[]) => void;
  readOnly?: boolean
}

export const ScheduleRow = React.memo(function ScheduleRow({
  dayConfig,
  onChange,
  timeOptions,
  readOnly
}: ScheduleRowProps) {
  const { day, checked, startTime, endTime } = dayConfig;

  const handleUpdate = useCallback(
    (patch: Partial<DayConfig>) => {
      onChange(day, patch);
    },
    [onChange, day]
  );

  const isDisabled = !checked || readOnly;

  return (
    <div className="flex items-center">
      <label className="flex items-center space-x-3 w-[105px] cursor-pointer select-none">
        <Checkbox
          id={`chk-${day}`}
          checked={checked}
          onCheckedChange={(val) => handleUpdate({ checked: !!val })}
        />
        <span className={cn(
          "font-medium transition-colors",
          checked ? "text-foreground" : "text-foreground/50"
        )}>
          {day}
        </span>
      </label>

      <div className="w-[112px]">
        <Select
          disabled={isDisabled}
          value={startTime}
          onValueChange={(val) => handleUpdate({ startTime: val })}
        >
          <SelectTrigger className="w-full h-11 px-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="w-9 text-center">to</span>

      <div className="w-[112px]">
        <Select
          disabled={isDisabled}
          value={endTime}
          onValueChange={(val) => handleUpdate({ endTime: val })}
        >
          <SelectTrigger className="w-full h-11 px-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!readOnly && (
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => handleUpdate({ checked: false })}
          className="ml-1 p-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

export default function SchedulePicker({
  schedule,
  onScheduleChange,
  readOnly = false,
}: SchedulePickerProps) {
  const DEFAULT_TIME_OPTIONS = useMemo(
    () => Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
    []
  );

  const handleRowChange = useCallback(
    (day: string, patch: Partial<DayConfig>) => {
      if (readOnly) return;

      const next = schedule.map((item: DayConfig) => {
        if (item.day !== day) return item;

        const updated: DayConfig = { ...item, ...patch };

        const startNum = parseInt(updated.startTime.replace(":", ""), 10);
        const endNum = parseInt(updated.endTime.replace(":", ""), 10);

        if (startNum >= endNum) {
          const startIndex = DEFAULT_TIME_OPTIONS.indexOf(updated.startTime);
          const endIndex = DEFAULT_TIME_OPTIONS.indexOf(updated.endTime);

          if (patch.startTime) {
            updated.endTime =
              DEFAULT_TIME_OPTIONS[Math.min(startIndex + 1, 23)];
          }

          if (patch.endTime) {
            updated.startTime =
              DEFAULT_TIME_OPTIONS[Math.max(endIndex - 1, 0)];
          }
        }

        return updated;
      });

      onScheduleChange(next);
    },
    [schedule, onScheduleChange, DEFAULT_TIME_OPTIONS, readOnly]
  );

  return (
    <div className="flex flex-col gap-2.5 text-xs">
      {schedule.map((dayConfig) => (
        <ScheduleRow
          key={dayConfig.day}
          dayConfig={dayConfig}
          onChange={handleRowChange}
          timeOptions={DEFAULT_TIME_OPTIONS}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}