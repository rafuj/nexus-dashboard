"use client";
import { Check, InfoIcon, Search, XCircle } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/shared/components/ui/combobox";
import { mockCabinetsList } from "../mock/mockCabinetsList";
import type { Cabinet } from "../types/cabinetList";

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const AddActivityModal: React.FC<ModalProps>  = ({ open, setOpen }) => {
  
  const [activity, setActivity] = useState<string>('')
  const [search, setSearch] = useState("");

  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);

  const filteredCabinets = mockCabinetsList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) || item.city.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase())
  );
  

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogContent className="sm:max-w-[540px] bg-white p-5 pb-7.5 pt-10 xl:pt-8" showCloseButton={false}>
            <DialogHeader className="flex flex-row items-center justify-between w-full">
              <DialogTitle className="text-2xl font-semibold text-accent-foreground">Add Activity</DialogTitle>
              <DialogClose asChild>
                <button type="button" className="text-foreground">
                  <XCircle />
                </button>
              </DialogClose>
            </DialogHeader>
            <DialogDescription asChild>
              <div className="pt-1">
                <div className="grid grid-cols-1 gap-5">
                  <div className="relative">
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Cabinet</Label>
                    {
                      selectedCabinet ? <>
                        <div className="border border-border rounded-[10px] flex items-center gap-2.5 px-3 py-2 md:max-w-[90%]">
                          <div className="rounded-full text-[#A72822] bg-[#FDF3F2] w-6 h-7.5 flex items-center justify-center">
                            <Check size={16} />
                          </div>
                          <div className="w-0 grow">
                            <h5 className="text-xs font-medium">{selectedCabinet.name}</h5>
                            <div className="text-xs text-[#717893]">{selectedCabinet.street} {selectedCabinet.city}</div>
                          </div>
                          <button type="button" className="text-[#A72822] font-medium text-xs select-none" onClick={()=> {
                            setSelectedCabinet(null);
                          }}>Change</button>
                        </div>
                      </> : 
                      <Combobox
                        items={filteredCabinets}
                        value={selectedCabinet}
                      >
                        <div className="relative">
                          <Search
                            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 pointer-events-none"
                            aria-hidden
                          />
                          <ComboboxInput
                            placeholder="Search for a cabinet"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 md:h-12.5 border-border !ring-0"
                            autoFocus
                            showClear
                          />
                        </div>
                        <ComboboxContent className="pointer-events-auto p-0">
                          <ComboboxEmpty className="px-6 py-10">
                            No Cabinet found.
                          </ComboboxEmpty>
                          <ComboboxList className="max-h-60 overflow-y-auto">
                            {(item) => (
                              <ComboboxItem key={item.id} value={item.name} className="data-highlighted:bg-[#FDF3F2]"
                                onClick={()=> {
                                  setSelectedCabinet(item)
                                  setSearch("")
                                }}
                              >
                                <div>
                                  <h5 className="font-medium text-xs">{item.name}</h5>
                                  <span className="text-xs text-[#717893]">{item.street} {item.city}</span>
                                </div>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    }
                  </div>
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Activity Type</Label>
                    <Select value={activity} onValueChange={(value)=> setActivity(value)}>
                      <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select activity type" /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="door-open">Door opened</SelectItem>
                        <SelectItem value="connectivity-lost">Connectivity lost</SelectItem>
                        <SelectItem value="asset-removed">Asset removed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="card-neutral border py-4.5 px-4 text-xs flex items-center gap-5 bg-[#F7FAFE] border-[#D1DBED] rounded-[10px] text-foreground">
                    <InfoIcon />
                    <div className="w-0 grow">
                      You can enable Maintenance Mode in the cabinet's settings. This pauses all cabinet notifications until Maintenance Mode is disabled again.
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
            <DialogFooter className="bg-white border-0">
              <div className="flex flex-wrap gap-2 sm:gap-5 justify-center sticky bottom-0 w-full">
                <DialogClose asChild>
                  <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3.5 px-5 rounded-full text-sm gap-1.25 sm:w-full sm:max-w-[140px] md:max-w-[180px]">Cancel</button>
                </DialogClose>
                <DialogClose asChild>
                  <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 sm:py-3.5 px-5 rounded-full text-sm gap-1.25 sm:w-full sm:max-w-[140px] md:max-w-[180px]">Add Activity</button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
