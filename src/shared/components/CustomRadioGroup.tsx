import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";


// Define the shape of each radio option
export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
  id: string;
}

interface CustomRadioGroupProps<T extends string> {
  name?: string;
  value: T;
  setValue: (value: T) => void;
  list: RadioOption<T>[];
  className?: string;
}

export function CustomRadioGroup<T extends string>({
  name,
  value,
  setValue,
  list,
  className = "",
}: CustomRadioGroupProps<T>) {
  return (
    <RadioGroup
      name={name}
      value={value}
      onValueChange={(val) => setValue(val as T)}
      className={cn("flex flex-wrap gap-x-8 gap-4",className)}
    >
      {list.map((option) => (
        <label key={option.id} className="flex items-center gap-2">
          <RadioGroupItem value={option.value} id={option.id} />
          <span className="cursor-pointer text-accent-foreground font-normal text-xs">
            {option.label}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}