import { useState, type Dispatch, type SetStateAction } from "react"
"use client"
import { InfoIcon, LucideSearch, PlusCircle, Trash2, XCircle } from "lucide-react"
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
import { groupIcons } from "../mock/group-icons"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { members } from "../mock/settingsListData"
import { mockCabinetsList } from "@/features/cabinets/mock/mockCabinetsList"
import { cabinetStatusSoftBadgeClass } from "@/features/cabinets/lib/cabinetListDisplay"
interface EditGroupDrawerProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  children?: React.ReactNode,
}

export const EditGroupDrawer: React.FC<EditGroupDrawerProps>  = ({ open, setOpen, children}) => {
    const [selectedCabinets, setSelectedCabinets] = useState<typeof mockCabinetsList>([])

    const [selectedIconId, setSelectedIconId] = useState<string>("icon-5")

    const [searchQuery, setSearchQuery] = useState("")

    const filteredCabinets = mockCabinetsList.filter((cabinet) =>
      cabinet.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

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
                    <DrawerTitle className="text-2xl font-semibold text-accent-primary">Edit Group</DrawerTitle>
                    <p className="text-xs text-foreground">Update group details, cabinets, and members.</p>
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
                    <div className="pt-4">
                      <h6 className="text-sm font-semibold">Cabinets in this group ({mockCabinetsList.length})</h6>
                      <p className="text-xs mb-3">Cabinet assigned to this group will inherit its notifications and settings.</p>
                      <div className="border rounded-[10px] mt-3.75">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left font-medium text-accent-foreground text-xs bg-chip px-2.5 py-2 rounded-tl-[10px]">Cabinet Name</th>
                              <th className="text-left font-medium text-accent-foreground text-xs bg-chip px-2.5 py-2">Location</th>
                              <th className="text-left font-medium text-accent-foreground text-xs bg-chip px-2.5 py-2">Status</th>
                              <th className="font-medium text-accent-foreground text-xs bg-chip px-2.5 py-2 rounded-tr-[10px]">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockCabinetsList.map((i)=> {
                              const isSelected = selectedCabinets.some((c) => c.id === i.id)
                              return (
                                <tr className="group p-2.5" key={i.id}>
                                  <td className="border-b border-border group-last:border-0 px-2.5 py-2">
                                    <h6 className="text-xs text-accent-foreground">{i.name}</h6>
                                  </td>
                                  <td className="border-b border-border group-last:border-0 px-2.5 py-2">
                                    <div className="text-xs line-clamp-1 max-w-[80px]">{i.location}</div>
                                  </td>
                                  <td className="border-b border-border group-last:border-0 px-2.5 py-2">
                                      <span className={cn("py-1 px-2 rounded text-[10px] capitalize", cabinetStatusSoftBadgeClass(i.status))}>{i.status}</span>
                                  </td>
                                  <td className="border-b border-border group-last:border-0 px-2.5 py-2">
                                    <div className="text-center">
                                      <Button
                                        type="button"
                                        disabled={isSelected}
                                        onClick={() => handleAdd(i)}
                                        className="h-7.5 w-7.5 rounded-full text-xs bg-card-error text-error"
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="py-4">
                      <h6 className="text-sm font-semibold">Add more cabinets</h6>
                      <p className="text-xs mb-3">Search and add cabinets to include in this group.</p>
                      <div className="relative">
                        <LucideSearch className="absolute top-1/2 -translate-y-1/2 left-4" size={20} />
                        <Input
                          type="text"
                          placeholder="Search cabinet name..."
                          required
                          className="placeholder:text-foreground/40 bg-white border-border h-10 lg:h-12.5 pl-10 pr-12 peer"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                          type="button"
                          className="h-7.5 w-7.5 rounded-full text-xs bg-chip text-accent-foreground absolute top-1/2 -translate-y-1/2 right-2 peer-placeholder-shown:hidden"
                          onClick={()=>setSearchQuery("")}
                        >
                          <XCircle size={14} />
                        </Button>
                      </div>
                      <div className="border rounded-[10px] mt-3.75">
                        {filteredCabinets?.length > 0 ?filteredCabinets.map((i)=> {
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
                                <span className={cn("py-1 px-2 rounded text-[10px] capitalize whitespace-nowrap", cabinetStatusSoftBadgeClass(i.status))}>{i.status}</span>
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
                        ): <div className="text-sm text-center p-7">No Cabinets Found</div> }
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
                      <div className="border rounded-[10px] mt-3.75 p-5">
                        <h6 className="text-sm font-semibold">Members & notification coverage</h6>
                        <div className="mt-2 grid grid-cols-2">
                          <div className="flex items-center gap-3">
                            <Icons.members />
                            <div className="w-0 grow">
                              <h5 className="text-sm font-semibold">12 members</h5>
                              <div className="text-xs">Assigned to this group</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pb-4">
                      <h6 className="text-sm font-semibold">Members</h6>
                      <p className="text-xs mb-3">Update role or remove member from this group</p>
                      <div className="border rounded-[10px] mt-3.75 p-4">
                        <table className="w-full">
                          <colgroup>
                            <col className="w-1/3" />
                            <col className="w-1/4" />
                            <col className="w-1/4" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th className="pb-2 text-xs font-semibold text-accent-foreground text-left">Member</th>
                              <th className="pb-2 text-xs font-semibold text-accent-foreground text-left">Role</th>
                              <th className="pb-2 text-xs font-semibold text-accent-foreground">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((member) => (
                              <tr key={member.id}>
                                <td className="py-1.5">
                                  <div className="flex items-center gap-2 text-xs font-medium text-accent-foreground">
                                    <img
                                      src={member.avatar}
                                      className="size-9 rounded-full object-cover aspect-square"
                                      alt={member.name}
                                    />
                                    <span>{member.name}</span>
                                  </div>
                                </td>

                                <td className="py-1.5">
                                  <Select defaultValue={member.role}>
                                    <SelectTrigger className="w-full !h-8 text-sm">
                                      <div className="flex w-full items-center gap-1 text-xs text-accent-foreground">
                                        <span className="w-0 grow text-left line-clamp-1">
                                          <SelectValue placeholder="Change" />
                                        </span>
                                      </div>
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="editor">Editor</SelectItem>
                                      <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>

                                <td>
                                  <div className="flex justify-center">
                                    <Button
                                      type="button"
                                      className="h-7.5 w-7.5 rounded-full bg-card-error text-error"
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                    Save Changes
                  </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}