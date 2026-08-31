import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList, } from "@/shared/components/ui/command";
import { Input } from "@/shared/components/ui/input";

interface City {
  name: string;
}

interface CityComboboxProps {
  availableCities: City[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  disabled?: boolean;
}

export function CityCombobox({
  availableCities,
  selectedCity,
  onSelectCity,
  disabled = false,
}: CityComboboxProps) {
  const [open, setOpen] = React.useState(false);

    const [searchValue, setSearchValue] = React.useState("");

    // Filter cities based on search input, then take ONLY the top 5 matches
    const filteredCities = React.useMemo(() => {
        if (!searchValue.trim()) {
        return availableCities.slice(0, 50);
        }

        const query = searchValue.toLowerCase();
        return availableCities
        .filter((city) => city.name.toLowerCase().includes(query))
        .slice(0, 50); // Hard cap at 5 filtered results
    }, [availableCities, searchValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || availableCities.length === 0}
          className={cn("w-full justify-between h-12.5 px-5 bg-white rounded-md border !border-border text-accent-foreground", {
            "!bg-[#BDBDBD]/15 !border-border cursor-auto !opacity-100 text-accent-foreground" : disabled
          })}
          
        >
          {selectedCity
            ? availableCities.find((city) => city.name === selectedCity)?.name || selectedCity
            : "Select city..."}
          {!disabled && <ChevronDown className="ml-2 h-4 w-4 shrink-0" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <Input
            placeholder="Search city..."
            value={searchValue}
            onChange={(e)=>setSearchValue(e.target.value)}
          />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {/* SLICE items to keep rendering under 100 items at a time */}
              {filteredCities.map((city) => (
                <CommandItem
                  key={city.name}
                  value={city.name}
                  onSelect={(currentValue) => {
                    onSelectCity(currentValue === selectedCity ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCity === city.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}