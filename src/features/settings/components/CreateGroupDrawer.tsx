import { useState, type Dispatch, type SetStateAction } from "react"
"use client"
import { InfoIcon, LucideSearch, PlusCircle, XCircle } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from "@/shared/components/ui/drawer"
import { Field, FieldGroup, FieldLabel,  } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea"
import { Icons } from "@/app/icons/icons"
import { cn } from "@/lib/utils"
import { groupIcons, selectedGroupIcon } from "../mock/group-icons"
import { cabinetStatusSoftBadgeClass } from "@/features/cabinets/lib/cabinetListDisplay"

interface CreateDrawerProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  children?: React.ReactNode,
}

export const CreateGroupDrawer: React.FC<CreateDrawerProps>  = ({ open, setOpen, children}) => {
    const [selectedCabinets, setSelectedCabinets] = useState<typeof cabinets>([])

    const [selectedIconId, setSelectedIconId] = useState<string>("group-icon-1")

    // Add cabinet
    const handleAdd = (cabinet: any) => {
      setSelectedCabinets((prev) => {
        const exists = prev.find((c) => c.id === cabinet.id)
        if (exists) return prev
        return [...prev, cabinet]
      })
    }

    // Remove cabinet
    const handleRemove = (id: string) => {
      setSelectedCabinets((prev) => prev.filter((c) => c.id !== id))
    }

    // Clear all
    const handleClear = () => {
      setSelectedCabinets([])
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="sm:!max-w-[540px] h-screen flex flex-col">
                <DrawerHeader className="pt-9 px-5">
                    <DrawerTitle className="text-2xl font-semibold text-accent-primary">Create Group</DrawerTitle>
                    <p className="text-xs text-foreground">Create groups to organize cabinets and send alerts to the right people.</p>
                </DrawerHeader>
                <DrawerDescription className="px-5 grow h-0 overflow-y-auto" asChild>
                  <div>
                    <div>
                      <div className="bg-border rounded-lg px-2.5 py-2.75 flex justify-between items-center text-accent-foreground mb-5">
                        <span className="font-semibold text-sm">Group Details</span>
                        <InfoIcon size={20} />
                      </div>
                      <FieldGroup>
                        <div className="grid grid-cols-1 gap-5 gap-x-3.75">
                            <Field>
                              <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Group Name</FieldLabel>
                                <Input
                                  type="text"
                                  placeholder="e.g. North Region Sites"
                                  required
                                  className="placeholder:text-foreground/40 bg-white border-border h-10 lg:h-12.5 md:px-5"
                                />
                              </div>
                            </Field>
                            <Field>
                              <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Description <span className="text-foreground">(optional)</span></FieldLabel>
                                <Textarea
                                  placeholder="e.g. North Region Sites"
                                  required
                                  className="placeholder:text-foreground/40 bg-white border-border min-h-[70px] md:p-5 resize-none"
                                />
                              </div>
                            </Field>
                        </div>
                        </FieldGroup>
                    </div>
                    <div className="mt-5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-accent-foreground">Icons</span>
                        <span>{groupIcons.length} icons</span>
                      </div>
                      <div className="mt-3 border card-neutral p-[15px] rounded-[10px] bg-chip flex flex-wrap gap-2.25">
                        {groupIcons.map((icon) => (
                          <button type="button" className={cn("size-12.5 rounded-[10px] bg-white text-foreground border border-border flex justify-center items-center",{
                            "bg-[#615FFF] text-white border-[#615FFF]" : selectedIconId === icon.id
                          })} key={icon.id} onClick={()=> setSelectedIconId(icon.id)}>
                            {<icon.icon className="size-10" />}
                          </button> 
                        )
                        )}
                      </div>
                    </div>
                    <div className="py-4">
                      <h6 className="text-sm font-semibold">Add Cabinets</h6>
                      <p className="text-xs mb-3">Search and add cabinets to include in this group.</p>
                      <div className="relative">
                        <LucideSearch className="absolute top-1/2 -translate-y-1/2 left-4" size={20} />
                        <Input
                          type="text"
                          placeholder="Search cabinet name..."
                          required
                          className="placeholder:text-foreground/40 bg-white border-border h-10 lg:h-12.5 pl-10 pr-12 peer"
                        />
                        <Button
                          type="button"
                          className="h-7.5 w-7.5 rounded-full text-xs bg-chip text-accent-foreground absolute top-1/2 -translate-y-1/2 right-2 peer-placeholder-shown:hidden"
                        >
                          <XCircle size={14} />
                        </Button>
                      </div>
                      <div className="border rounded-[10px] mt-3.75">
                        {cabinets.map((i)=> {
                          const isSelected = selectedCabinets.some((c) => c.id === i.id)
                          return (
                            <div className="border-b border-border last:border-0 p-2.5 flex items-center justify-between" key={i.id}>
                              <div className="flex items-center gap-2.5 w-[40%] grow">
                                <Icons.cabinet />
                                <div className="">
                                  <h6 className="text-xs font-medium">{i.name}</h6>
                                  <div className="text-xs">{i.location}</div>
                                </div>
                              </div>
                              <span className="flex items-center gap-1.5 text-xs capitalize w-25 grow">
                                <span className={cn("py-1 px-2 rounded text-[10px] capitalize", cabinetStatusSoftBadgeClass(i.status))}>{i.status}</span>
                              </span>
                              <div className="w-21 flex justify-end">
                                <Button
                                  type="button"
                                  disabled={isSelected}
                                  onClick={() => handleAdd(i)}
                                  className="h-7.5 rounded-full text-xs px-3 bg-border text-accent-foreground gap-1"
                                >
                                  <PlusCircle size={14} />
                                  {isSelected ? "Added" : "Add"}
                                </Button>
                              </div>
                            </div>
                          )}
                        )}
                      </div>
                      {selectedCabinets?.length > 0 && (
                        <div className="mt-5">
                          <div className="flex justify-between items-center">
                            <h6 className="text-sm font-semibold">
                              Selected Cabinets ({selectedCabinets.length})
                            </h6>

                            <button
                              type="button"
                              onClick={handleClear}
                              className="text-foreground text-xs"
                            >
                              Clear all
                            </button>
                          </div>
                          
                          <div className="border rounded-[10px] mt-2">
                            {selectedCabinets.map((i) => (
                              <div
                                key={i.id}
                                className="border-b border-border last:border-0 p-2.5 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2.5 w-[40%]">
                                  <button type="button">
                                    <Icons.draggable />
                                  </button>
                                  <Icons.cabinet />
                                  <div>
                                    <h6 className="text-xs font-medium">{i.name}</h6>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs capitalize w-25">
                                  <div className="text-xs truncate">{i.location}</div>
                                </div>

                                <Button
                                  type="button"
                                  onClick={() => handleRemove(i.id)}
                                  className="h-7.5 w-7.5 rounded-full text-xs bg-card-error text-error"
                                >
                                  <XCircle size={14} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-border"></div>
                  </div>
                </DrawerDescription>
                <DrawerFooter className="py-5 flex-row justify-end">
                  <Button
                    type="button"
                    className="h-10 lg:h-12.5 rounded-full text-sm px-5 lg:px-7 xl:min-w-[180px] bg-chip text-accent-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 lg:h-12.5 rounded-full text-sm px-5 lg:px-7 xl:min-w-[180px]"
                  >
                    Create Group
                  </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
const cabinets = [
  {
    id:"1",
    name: "AMS-001",
    location: "Amsterdam, NL",
    status: "connected",
  },
  {
    id:"2",
    name: "AMS-002",
    location: "Amsterdam, NL",
    status: "warning",
  },
  {
    id:"3",
    name: "AMS-015",
    location: "Amsterdam, NL",
    status: "disconnected",
  },
  {
    id:"4",
    name: "AMS-007",
    location: "Utrecht, NL",
    status: "connected",
  },
]