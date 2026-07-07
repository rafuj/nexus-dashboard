import type { Dispatch, SetStateAction } from "react"
"use client"
import { Camera, ChevronDown, InfoIcon } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
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
import avatar from "@/assets/avatar-placeholder.png"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from "@/shared/components/ui/combobox"

interface EditDrawerProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  children?: React.ReactNode,
}

export const CreateMemberDrawer: React.FC<EditDrawerProps>  = ({ open, setOpen, children}) => {

  const [status, setStatus] = useState<string>('active')
  const [role, setRole] = useState<string>('viewer')
  const [notificationMethod, setNotificationMethod] = useState<string>('email')
  const [notificationGroup, setNotificationGroup] = useState<string[]>([])


  const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>("");

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a JPG, JPEG, or PNG image.");
        return;
      }

      setPreview(URL.createObjectURL(file));
    };

    const openFilePicker = () => {
      fileInputRef.current?.click();
    };


    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="sm:!max-w-[540px] h-screen flex flex-col">
                <DrawerHeader className="pt-9 px-5">
                    <DrawerTitle className="text-2xl font-semibold text-accent-primary">Add Member</DrawerTitle>
                </DrawerHeader>
                <DrawerDescription className="px-5 grow h-0 overflow-y-auto" asChild>
                  <div>
                    <div>
                      <div className="bg-border rounded-lg px-2.5 py-2.75 flex justify-between items-center text-accent-foreground mb-5">
                        <span className="font-semibold text-sm">Profile Details</span>
                        <InfoIcon size={20} />
                      </div>
                      <div className="mb-10 flex items-center gap-7.5">
                        <div className="rounded-full w-[160px] border-[3px] border-primary aspect-square p-[2px] relative">
                          <img src={preview || avatar} alt="" className="rounded-full w-full aspect-square object-cover bg-chip" />
                          <input 
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileSelect} />
                          <button type="button" className="absolute bottom-0 right-0 border-2 border-white rounded-full bg-primary text-white w-11 aspect-square flex justify-center items-center" onClick={openFilePicker}>
                            <Camera />
                          </button>
                        </div>
                        <div className="w-0 grow">
                          <Button
                            type="button"
                            className="h-10 lg:h-12.5 rounded-full text-sm px-5 lg:px-7 xl:min-w-[242px] bg-chip text-accent-foreground"
                            onClick={openFilePicker}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.4974 8.33333V13.3333H12.4974V8.33333H15.8307L9.9974 2.5L4.16406 8.33333H7.4974ZM9.9974 4.83333L11.8307 6.66667H10.8307V11.6667H9.16406V6.66667H8.16406L9.9974 4.83333ZM15.8307 15H4.16406V16.6667H15.8307V15Z" fill="#151C48"/>
                            </svg>
                            Upload an Image
                          </Button>
                          <div className="text-sm text-accent-foreground mt-2.5">
                            Accepted files type: .jpg, .jpeg, .png
                          </div>
                        </div>
                      </div>
                      <FieldGroup>
                        <div className="grid grid-cols-2 gap-5 gap-x-3.75">
                            <Field>
                              <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">First Name</FieldLabel>
                                <Input
                                  type="text"
                                  placeholder="eg. Emerson"
                                  required
                                  className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-12.5 md:px-5"
                                />
                              </div>
                            </Field>
                            <Field>
                              <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Last Name</FieldLabel>
                                <Input
                                  type="text"
                                  placeholder="eg. Siphron"
                                  required
                                  className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-12.5 md:px-5"
                                />
                              </div>
                            </Field>
                            <Field>
                              <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Phone Number</FieldLabel>
                                <Input
                                  type="text"
                                  placeholder="eg. +31 938 482 1932"
                                  required
                                  className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-12.5 md:px-5"
                                />
                              </div>
                            </Field>
                            <Field>
                              <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Email Address</FieldLabel>
                                <Input
                                  type="text"
                                  placeholder="eg. johnfrans@gmail.com"
                                  required
                                  className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-12.5 md:px-5"
                                />
                              </div>
                            </Field>
                            <Field className="col-span-2">
                              <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Job Title</FieldLabel>
                                <Input
                                  type="text"
                                  placeholder="eg. Field Operations Coordinator"
                                  required
                                  className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-12.5 md:px-5"
                                />
                              </div>
                            </Field>
                        </div>
                        </FieldGroup>
                    </div>
                    <div className="mt-5">
                      <h6 className="text-sm font-semibold">Role</h6>
                      <p className="text-xs mb-3">Set the member’s role and permissions.</p>
                      <RadioGroup className="grid grid-cols-3 gap-3">
                        {roleList.map((item) => (
                          <button
                            key={item.status}
                            type="button"
                            onClick={() => setRole(item.status)}
                            className={cn(
                              "border border-border rounded-lg px-2.5 py-4 text-left transition-colors",
                              {
                                "border-primary/20 bg-primary/10": role === item.status,
                              }
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className={cn("", {
                                  "text-white": item.status === role
                                })}
                                style={
                                  {
                                    "--color-chip":
                                      role === item.status ? "var(--color-primary)" : "",
                                  } as React.CSSProperties
                                }
                              >
                                {item.icon}
                              </div>
                              <div className="mt-1">
                                <RadioGroupItem value={item.status} checked={role === item.status} />
                              </div>
                            </div>
                            <h6 className="capitalize font-medium mt-2">{item.status}</h6>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </button>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="mt-5">
                      <h6 className="text-sm font-semibold">Notification Groups</h6>
                      <p className="text-xs mb-3">Select one or more groups this member will receive alerts for.</p>
                      <Combobox
                        items={notificationGroupList}
                        multiple
                        value={notificationGroup}
                        onValueChange={setNotificationGroup}
                      >
                        <ComboboxChips className="border-border min-h-12.5 !px-2.5 !ring-0 shadow-none">
                          <ComboboxValue>
                            {notificationGroup.map((name) => {
                              const item = notificationGroupList.find(i => i.name === name)
                              return (
                                <ComboboxChip key={name} className={cn("py-1 h-7", {
                                  "bg-[#ECE3FD] text-[#7029F6]": name === "Amsterdam Office",
                                  "bg-[#FEE8D9] text-[#F76908]": name === "Rotterdam Retail",
                                  "bg-[#DFF4F9] text-[#0DB4DC]": name === "Public Access",
                                })}>
                                  <span className="flex items-center gap-2">
                                    {item?.icon}
                                    {name}
                                  </span>
                                </ComboboxChip>
                              )
                            })}
                          </ComboboxValue>
                          {notificationGroup.length !== notificationGroupList.length &&  <ComboboxChipsInput placeholder="Add group" />}
                          <ChevronDown />
                        </ComboboxChips>

                        <ComboboxContent className="min-w-[var(--radix-popper-anchor-width)] w-[var(--radix-popper-anchor-width)] pointer-events-auto">
                          <ComboboxEmpty className="p-5">No items found.</ComboboxEmpty>

                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.name} value={item.name}>
                                <span className="flex items-center gap-2">
                                  {item.icon}
                                  {item.name}
                                </span>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>
                    <div className="mt-5">
                      <h6 className="text-sm font-semibold">Notification Method</h6>
                      <p className="text-xs mb-3">Choose how this member will receive notifications.</p>
                      <div className="grid grid-cols-3 gap-3">
                        {notifications.map((item) => (
                          <button
                            key={item.status}
                            type="button"
                            onClick={() => setNotificationMethod(item.status)}
                            className={cn(
                              "border border-border rounded-lg p-4 text-left transition-colors",
                              {
                                "border-primary/20 bg-primary/10": notificationMethod === item.status,
                              }
                            )}
                          >
                            <div className={cn("", {
                                "text-white": item.status === notificationMethod
                              })}
                              style={
                                {
                                  "--color-chip":
                                    notificationMethod === item.status ? "var(--color-primary)" : "",
                                } as React.CSSProperties
                              }
                            >
                              {item.icon}
                            </div>
                            <h6 className="capitalize font-medium mt-2">{item.status}</h6>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5">
                      <h6 className="text-sm font-semibold">Status</h6>
                      <p className="text-xs mb-3">Manage this member’s account status.</p>
                      <RadioGroup className="grid grid-cols-2 gap-3">
                        {statuses.map((item) => (
                          <button
                            key={item.status}
                            type="button"
                            onClick={() => setStatus(item.status)}
                            className={cn(
                              "border border-border rounded-lg p-4 text-left transition-colors",
                              {
                                "border-primary/20 bg-primary/10": status === item.status,
                              }
                            )}
                          >
                            <RadioGroupItem value={item.status} checked={status === item.status} />
                            <h6 className="capitalize font-medium mt-2">{item.status}</h6>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          </button>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </DrawerDescription>
                <DrawerFooter className="py-5 flex-row justify-end">
                  <Button
                    type="button"
                    className="h-10 lg:h-12.5 rounded-full text-sm px-5 lg:px-7 xl:min-w-[180px] bg-chip text-accent-foreground"
                  >
                    Remove Member
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
const statuses = [
  {
    status: "active",
    description: "Member can access the system and receive notifications.",
  },
  {
    status: "suspended",
    description: "Member cannot access the system or receive notifications.",
  },
];
const notifications = [
  {
    status: "email",
    description: "Via email only",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="var(--color-chip)"/>
        <path d="M30 14C30 12.9 29.1 12 28 12H12C10.9 12 10 12.9 10 14V26C10 27.1 10.9 28 12 28H28C29.1 28 30 27.1 30 26V14ZM28 14L20 19L12 14H28ZM28 26H12V16L20 21L28 16V26Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    status: "app",
    description: "In-app only",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="var(--color-chip)"/>
        <path d="M17.5052 26.6693H22.5052V25.0026H17.5052V26.6693ZM14.1719 29.1693V10.8359H25.8385V15.0859H26.6719V19.0859H25.8385V29.1693H14.1719ZM15.8385 27.5026H24.1719V12.5026H15.8385V27.5026Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    status: "both",
    description: "Email and in-app",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="var(--color-chip)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5157 13.22C17.8947 13.388 17.3147 13.651 16.9107 14.015C15.8077 15.01 15.3587 16.358 15.3587 18.788C15.3587 20.52 14.3727 22.16 13.6627 23.222C13.5087 23.454 13.4607 23.675 13.4697 23.808C13.4737 23.868 13.4877 23.896 13.4937 23.906C13.4977 23.913 13.5097 23.932 13.5577 23.958C14.2497 24.328 15.2937 24.598 16.5007 24.769C17.6625 24.9249 18.8335 25.0021 20.0057 25C20.271 25 20.5253 25.1054 20.7128 25.2929C20.9004 25.4804 21.0057 25.7348 21.0057 26C21.0057 26.2652 20.9004 26.5196 20.7128 26.7071C20.5253 26.8946 20.271 27 20.0057 27C18.8777 27 17.5217 26.935 16.2197 26.75C14.9377 26.567 13.6167 26.257 12.6147 25.722C11.8777 25.328 11.5217 24.642 11.4747 23.943C11.4287 23.284 11.6517 22.633 11.9997 22.112C12.7167 21.038 13.3587 19.853 13.3587 18.788C13.3587 16.127 13.8507 14.081 15.5717 12.53C16.2967 11.876 17.2077 11.503 17.9907 11.29C18.6473 11.1079 19.3245 11.0105 20.0057 11C20.271 11 20.5253 11.1054 20.7128 11.2929C20.9004 11.4804 21.0057 11.7348 21.0057 12C21.0057 12.2652 20.9004 12.5196 20.7128 12.7071C20.5253 12.8946 20.271 13 20.0057 13C19.6997 13 19.1297 13.052 18.5157 13.22Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.49 13.22C22.111 13.388 22.691 13.651 23.095 14.015C24.198 15.01 24.647 16.358 24.647 18.788C24.647 20.52 25.633 22.16 26.343 23.222C26.497 23.454 26.545 23.675 26.536 23.808C26.5365 23.8422 26.5282 23.8759 26.512 23.906C26.508 23.913 26.496 23.932 26.448 23.958C25.756 24.328 24.712 24.598 23.505 24.769C22.3432 24.9249 21.1722 25.0021 20 25C19.7348 25 19.4804 25.1054 19.2929 25.2929C19.1054 25.4804 19 25.7348 19 26C19 26.2652 19.1054 26.5196 19.2929 26.7071C19.4804 26.8946 19.7348 27 20 27C21.128 27 22.483 26.935 23.786 26.75C25.068 26.567 26.389 26.257 27.391 25.722C28.128 25.328 28.484 24.642 28.531 23.943C28.577 23.284 28.354 22.633 28.006 22.112C27.289 21.038 26.647 19.853 26.647 18.788C26.647 16.127 26.155 14.081 24.434 12.53C23.709 11.876 22.798 11.503 22.015 11.29C21.3584 11.1079 20.6813 11.0105 20 11C19.7348 11 19.4804 11.1054 19.2929 11.2929C19.1054 11.4804 19 11.7348 19 12C19 12.2652 19.1054 12.5196 19.2929 12.7071C19.4804 12.8946 19.7348 13 20 13C20.306 13 20.876 13.052 21.49 13.22Z" fill="currentColor"/>
        <path d="M22.6562 11.68C22.6562 12.375 21.2603 11.722 20.1562 11.722C19.0523 11.722 17.6562 12.375 17.6562 11.679C17.6562 10.984 18.6562 10 20.1562 10C21.6562 10 22.6562 10.984 22.6562 11.68Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18 26C18 26.5304 18.2107 27.0391 18.5858 27.4142C18.9609 27.7893 19.4696 28 20 28C20.5304 28 21.0391 27.7893 21.4142 27.4142C21.7893 27.0391 22 26.5304 22 26H24C24 27.0609 23.5786 28.0783 22.8284 28.8284C22.0783 29.5786 21.0609 30 20 30C18.9391 30 17.9217 29.5786 17.1716 28.8284C16.4214 28.0783 16 27.0609 16 26H18Z" fill="currentColor"/>
      </svg>
    ),
  },
];
const roleList = [
  {
    status: "viewer",
    description: "Can view cabinets and receive alerts.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="var(--color-chip)"/>
        <path d="M20 19.9974C22.3 19.9974 24.1667 18.1307 24.1667 15.8307C24.1667 13.5307 22.3 11.6641 20 11.6641C17.7 11.6641 15.8333 13.5307 15.8333 15.8307C15.8333 18.1307 17.7 19.9974 20 19.9974ZM20 13.3307C21.375 13.3307 22.5 14.4557 22.5 15.8307C22.5 17.2057 21.375 18.3307 20 18.3307C18.625 18.3307 17.5 17.2057 17.5 15.8307C17.5 14.4557 18.625 13.3307 20 13.3307ZM13.3333 28.3307H26.6667C27.125 28.3307 27.5 27.9557 27.5 27.4974V26.6641C27.5 23.4474 24.8833 20.8307 21.6667 20.8307H18.3333C15.1167 20.8307 12.5 23.4474 12.5 26.6641V27.4974C12.5 27.9557 12.875 28.3307 13.3333 28.3307ZM18.3333 22.4974H21.6667C23.9667 22.4974 25.8333 24.3641 25.8333 26.6641H14.1667C14.1667 24.3641 16.0333 22.4974 18.3333 22.4974Z" fill="currentColor"/>
      </svg>

    ),
  },
  {
    status: "editor",
    description: "Can edit cabinets and manage settings.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="var(--color-chip)"/>
        <path d="M14.1667 25.8333H15.3542L23.5 17.6875L22.3125 16.5L14.1667 24.6458V25.8333ZM12.5 27.5V23.9583L23.5 12.9792C23.6667 12.8264 23.8508 12.7083 24.0525 12.625C24.2542 12.5417 24.4658 12.5 24.6875 12.5C24.9092 12.5 25.1244 12.5417 25.3333 12.625C25.5422 12.7083 25.7228 12.8333 25.875 13L27.0208 14.1667C27.1875 14.3194 27.3092 14.5 27.3858 14.7083C27.4625 14.9167 27.5006 15.125 27.5 15.3333C27.5 15.5556 27.4619 15.7675 27.3858 15.9692C27.3097 16.1708 27.1881 16.3547 27.0208 16.5208L16.0417 27.5H12.5ZM22.8958 17.1042L22.3125 16.5L23.5 17.6875L22.8958 17.1042Z" fill="currentColor"/>
        </svg>
    ),
  },
  {
    status: "admin",
    description: "Full access to settings and members.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="var(--color-chip)"/>
        <path d="M20 10.8359L27.5 14.1693V19.1693C27.5 23.7943 24.3 28.1193 20 29.1693C15.7 28.1193 12.5 23.7943 12.5 19.1693V14.1693L20 10.8359ZM20 12.6526L14.1667 15.2526V19.3526C14.1667 22.9526 16.875 26.6693 20 27.5026C23.125 26.6693 25.8333 22.9526 25.8333 19.3526V15.2526L20 12.6526ZM23.3333 21.6693V22.9943C23.3 23.1776 23.15 23.3026 22.9417 23.3359H17.0583C16.85 23.3026 16.7 23.1776 16.6667 22.9943V21.6693H23.3333ZM24.1667 16.6693L23.3333 20.8359H16.6667L15.8333 16.6693L18.0583 18.8943L20 16.9526L21.9417 18.8943L24.1667 16.6693Z" fill="currentColor"/>
      </svg>

    ),
  },
];
const notificationGroupList = [
  {
    name: "Amsterdam Office",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32812 3.33594C5.32812 2.8055 5.53884 2.2968 5.91391 1.92172C6.28898 1.54665 6.79769 1.33594 7.32812 1.33594H12.6615C13.1919 1.33594 13.7006 1.54665 14.0757 1.92172C14.4507 2.2968 14.6615 2.8055 14.6615 3.33594V12.6693C14.6615 13.1997 14.4507 13.7084 14.0757 14.0835C13.7006 14.4586 13.1919 14.6693 12.6615 14.6693H7.32812C6.79769 14.6693 6.28898 14.4586 5.91391 14.0835C5.53884 13.7084 5.32812 13.1997 5.32812 12.6693V3.33594ZM7.32812 2.66927C7.15131 2.66927 6.98174 2.73951 6.85672 2.86453C6.7317 2.98956 6.66146 3.15913 6.66146 3.33594V12.6693C6.66146 12.8461 6.7317 13.0157 6.85672 13.1407C6.98174 13.2657 7.15131 13.3359 7.32812 13.3359H12.6615C12.8383 13.3359 13.0078 13.2657 13.1329 13.1407C13.2579 13.0157 13.3281 12.8461 13.3281 12.6693V3.33594C13.3281 3.15913 13.2579 2.98956 13.1329 2.86453C13.0078 2.73951 12.8383 2.66927 12.6615 2.66927H7.32812Z" fill="#7029F6"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.32812 7.33594C1.32813 6.8055 1.53884 6.2968 1.91391 5.92172C2.28898 5.54665 2.79769 5.33594 3.32812 5.33594H6.32812V6.66927H3.32812C3.15131 6.66927 2.98174 6.73951 2.85672 6.86453C2.7317 6.98956 2.66146 7.15913 2.66146 7.33594V12.6693C2.66146 12.8461 2.7317 13.0157 2.85672 13.1407C2.98174 13.2657 3.15131 13.3359 3.32812 13.3359H9.66146V14.6693H3.32812C2.79769 14.6693 2.28898 14.4586 1.91391 14.0835C1.53884 13.7084 1.32813 13.1997 1.32812 12.6693V7.33594Z" fill="#7029F6"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 11.3333C8 10.9797 8.14048 10.6406 8.39052 10.3905C8.64057 10.1405 8.97971 10 9.33333 10H10.6667C11.0203 10 11.3594 10.1405 11.6095 10.3905C11.8595 10.6406 12 10.9797 12 11.3333V13.3333H10.6667V11.3333H9.33333V13.3333H8V11.3333Z" fill="#7029F6"/>
        <path d="M7.99479 4.0026C7.99479 3.82579 8.06503 3.65622 8.19005 3.5312C8.31508 3.40618 8.48465 3.33594 8.66146 3.33594C8.83827 3.33594 9.00784 3.40618 9.13286 3.5312C9.25789 3.65622 9.32812 3.82579 9.32812 4.0026V4.66927C9.32812 4.84608 9.25789 5.01565 9.13286 5.14068C9.00784 5.2657 8.83827 5.33594 8.66146 5.33594C8.48465 5.33594 8.31508 5.2657 8.19005 5.14068C8.06503 5.01565 7.99479 4.84608 7.99479 4.66927V4.0026ZM7.99479 7.33594C7.99479 7.15913 8.06503 6.98956 8.19005 6.86453C8.31508 6.73951 8.48465 6.66927 8.66146 6.66927C8.83827 6.66927 9.00784 6.73951 9.13286 6.86453C9.25789 6.98956 9.32812 7.15913 9.32812 7.33594V8.0026C9.32812 8.17942 9.25789 8.34898 9.13286 8.47401C9.00784 8.59903 8.83827 8.66927 8.66146 8.66927C8.48465 8.66927 8.31508 8.59903 8.19005 8.47401C8.06503 8.34898 7.99479 8.17942 7.99479 8.0026V7.33594ZM3.32812 10.0026C3.32812 9.82579 3.39836 9.65622 3.52339 9.5312C3.64841 9.40618 3.81798 9.33594 3.99479 9.33594C4.1716 9.33594 4.34117 9.40618 4.4662 9.5312C4.59122 9.65622 4.66146 9.82579 4.66146 10.0026V10.6693C4.66146 10.8461 4.59122 11.0157 4.4662 11.1407C4.34117 11.2657 4.1716 11.3359 3.99479 11.3359C3.81798 11.3359 3.64841 11.2657 3.52339 11.1407C3.39836 11.0157 3.32812 10.8461 3.32812 10.6693V10.0026ZM10.6615 4.0026C10.6615 3.82579 10.7317 3.65622 10.8567 3.5312C10.9817 3.40618 11.1513 3.33594 11.3281 3.33594C11.5049 3.33594 11.6745 3.40618 11.7995 3.5312C11.9246 3.65622 11.9948 3.82579 11.9948 4.0026V4.66927C11.9948 4.84608 11.9246 5.01565 11.7995 5.14068C11.6745 5.2657 11.5049 5.33594 11.3281 5.33594C11.1513 5.33594 10.9817 5.2657 10.8567 5.14068C10.7317 5.01565 10.6615 4.84608 10.6615 4.66927V4.0026ZM10.6615 7.33594C10.6615 7.15913 10.7317 6.98956 10.8567 6.86453C10.9817 6.73951 11.1513 6.66927 11.3281 6.66927C11.5049 6.66927 11.6745 6.73951 11.7995 6.86453C11.9246 6.98956 11.9948 7.15913 11.9948 7.33594V8.0026C11.9948 8.17942 11.9246 8.34898 11.7995 8.47401C11.6745 8.59903 11.5049 8.66927 11.3281 8.66927C11.1513 8.66927 10.9817 8.59903 10.8567 8.47401C10.7317 8.34898 10.6615 8.17942 10.6615 8.0026V7.33594Z" fill="#7029F6"/>
      </svg>
    ),
  },
  {
    name: "Rotterdam Retail",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_453_6688)">
        <path d="M14.6719 3.33073H1.33854C1.16173 3.33073 0.992161 3.40097 0.867137 3.52599C0.742113 3.65102 0.671875 3.82059 0.671875 3.9974V6.66406C0.673035 7.07669 0.801794 7.47886 1.0405 7.81544C1.27921 8.15202 1.61618 8.40652 2.00521 8.54406V14.6641C2.00521 14.8409 2.07545 15.0104 2.20047 15.1355C2.32549 15.2605 2.49506 15.3307 2.67188 15.3307H13.3385C13.5154 15.3307 13.6849 15.2605 13.8099 15.1355C13.935 15.0104 14.0052 14.8409 14.0052 14.6641V8.54406C14.3942 8.40652 14.7312 8.15202 14.9699 7.81544C15.2086 7.47886 15.3374 7.07669 15.3385 6.66406V3.9974C15.3385 3.82059 15.2683 3.65102 15.1433 3.52599C15.0183 3.40097 14.8487 3.33073 14.6719 3.33073ZM10.0052 4.66406H11.3385V6.66406C11.3385 6.84087 11.2683 7.01044 11.1433 7.13547C11.0183 7.26049 10.8487 7.33073 10.6719 7.33073C10.4951 7.33073 10.3255 7.26049 10.2005 7.13547C10.0754 7.01044 10.0052 6.84087 10.0052 6.66406V4.66406ZM7.33854 4.66406H8.67188V6.66406C8.67188 6.84087 8.60164 7.01044 8.47661 7.13547C8.35159 7.26049 8.18202 7.33073 8.00521 7.33073C7.8284 7.33073 7.65883 7.26049 7.5338 7.13547C7.40878 7.01044 7.33854 6.84087 7.33854 6.66406V4.66406ZM4.67188 4.66406H6.00521V6.66406C6.00521 6.84087 5.93497 7.01044 5.80995 7.13547C5.68492 7.26049 5.51535 7.33073 5.33854 7.33073C5.16173 7.33073 4.99216 7.26049 4.86714 7.13547C4.74211 7.01044 4.67188 6.84087 4.67188 6.66406V4.66406ZM2.67188 7.33073C2.49506 7.33073 2.32549 7.26049 2.20047 7.13547C2.07545 7.01044 2.00521 6.84087 2.00521 6.66406V4.66406H3.33854V6.66406C3.33854 6.84087 3.2683 7.01044 3.14328 7.13547C3.01826 7.26049 2.84869 7.33073 2.67188 7.33073ZM9.33854 13.9974H6.67188V12.6641C6.67188 12.3104 6.81235 11.9713 7.0624 11.7213C7.31245 11.4712 7.65159 11.3307 8.00521 11.3307C8.35883 11.3307 8.69797 11.4712 8.94802 11.7213C9.19807 11.9713 9.33854 12.3104 9.33854 12.6641V13.9974ZM12.6719 13.9974H10.6719V12.6641C10.6719 11.9568 10.3909 11.2785 9.89083 10.7784C9.39073 10.2783 8.71245 9.9974 8.00521 9.9974C7.29796 9.9974 6.61969 10.2783 6.11959 10.7784C5.61949 11.2785 5.33854 11.9568 5.33854 12.6641V13.9974H3.33854V8.54406C3.58339 8.45269 3.80936 8.31711 4.00521 8.14406C4.37189 8.47203 4.84659 8.65335 5.33854 8.65335C5.8305 8.65335 6.30519 8.47203 6.67188 8.14406C7.03856 8.47203 7.51325 8.65335 8.00521 8.65335C8.49716 8.65335 8.97186 8.47203 9.33854 8.14406C9.70522 8.47203 10.1799 8.65335 10.6719 8.65335C11.1638 8.65335 11.6385 8.47203 12.0052 8.14406C12.2011 8.31711 12.427 8.45269 12.6719 8.54406V13.9974ZM14.0052 6.66406C14.0052 6.84087 13.935 7.01044 13.8099 7.13547C13.6849 7.26049 13.5154 7.33073 13.3385 7.33073C13.1617 7.33073 12.9922 7.26049 12.8671 7.13547C12.7421 7.01044 12.6719 6.84087 12.6719 6.66406V4.66406H14.0052V6.66406ZM2.87188 1.9974H13.3385C13.5154 1.9974 13.6849 1.92716 13.8099 1.80213C13.935 1.67711 14.0052 1.50754 14.0052 1.33073C14.0052 1.15392 13.935 0.984349 13.8099 0.859325C13.6849 0.7343 13.5154 0.664063 13.3385 0.664062H2.87188C2.69506 0.664063 2.52549 0.7343 2.40047 0.859325C2.27545 0.984349 2.20521 1.15392 2.20521 1.33073C2.20521 1.50754 2.27545 1.67711 2.40047 1.80213C2.52549 1.92716 2.69506 1.9974 2.87188 1.9974Z" fill="#F76908"/>
        </g>
        <defs>
        <clipPath id="clip0_453_6688">
        <rect width="16" height="16" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    name: "Public Access",
    icon: (
      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 3.66667C4.65321 3.66667 4.80492 3.63649 4.94646 3.57786C5.08801 3.51923 5.21662 3.43329 5.32496 3.32496C5.43329 3.21662 5.51923 3.08801 5.57786 2.94646C5.63649 2.80492 5.66667 2.65321 5.66667 2.5C5.66667 2.34679 5.63649 2.19508 5.57786 2.05354C5.51923 1.91199 5.43329 1.78338 5.32496 1.67504C5.21662 1.56671 5.08801 1.48077 4.94646 1.42214C4.80492 1.36351 4.65321 1.33333 4.5 1.33333C4.19058 1.33333 3.89383 1.45625 3.67504 1.67504C3.45625 1.89383 3.33333 2.19058 3.33333 2.5C3.33333 2.80942 3.45625 3.10617 3.67504 3.32496C3.89383 3.54375 4.19058 3.66667 4.5 3.66667ZM4.5 5C4.8283 5 5.15339 4.93534 5.45671 4.8097C5.76002 4.68406 6.03562 4.49991 6.26777 4.26777C6.49991 4.03562 6.68406 3.76002 6.8097 3.45671C6.93534 3.15339 7 2.8283 7 2.5C7 2.1717 6.93534 1.84661 6.8097 1.54329C6.68406 1.23998 6.49991 0.96438 6.26777 0.732233C6.03562 0.500087 5.76002 0.315938 5.45671 0.190301C5.15339 0.0646645 4.8283 -4.89212e-09 4.5 0C3.83696 9.88008e-09 3.20107 0.263392 2.73223 0.732233C2.26339 1.20107 2 1.83696 2 2.5C2 3.16304 2.26339 3.79893 2.73223 4.26777C3.20107 4.73661 3.83696 5 4.5 5ZM0.844 7.018C1.44333 6.18533 2.35667 5.66667 3.524 5.66667H5.80933C6.97733 5.66667 7.89 6.18533 8.48933 7.018C9.07133 7.82667 9.33333 8.89267 9.33333 10C9.33333 10.1768 9.26309 10.3464 9.13807 10.4714C9.01305 10.5964 8.84348 10.6667 8.66667 10.6667C8.48985 10.6667 8.32029 10.5964 8.19526 10.4714C8.07024 10.3464 8 10.1768 8 10C8 9.082 7.78 8.31533 7.40667 7.79667C7.05133 7.302 6.53533 7 5.80933 7H3.524C2.79733 7 2.282 7.302 1.926 7.79667C1.55333 8.31467 1.33333 9.082 1.33333 10C1.33333 10.1768 1.2631 10.3464 1.13807 10.4714C1.01305 10.5964 0.843478 10.6667 0.666667 10.6667C0.489856 10.6667 0.320286 10.5964 0.195262 10.4714C0.0702379 10.3464 0 10.1768 0 10C0 8.89267 0.262 7.82667 0.844 7.018Z" fill="#0DB4DC"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9.99994C0 9.82313 0.0702379 9.65356 0.195262 9.52854C0.320286 9.40351 0.489856 9.33327 0.666667 9.33327H8.64733C8.82414 9.33327 8.99371 9.40351 9.11874 9.52854C9.24376 9.65356 9.314 9.82313 9.314 9.99994C9.314 10.1768 9.24376 10.3463 9.11874 10.4713C8.99371 10.5964 8.82414 10.6666 8.64733 10.6666H0.666667C0.489856 10.6666 0.320286 10.5964 0.195262 10.4713C0.0702379 10.3463 0 10.1768 0 9.99994ZM8.59467 1.24461L8.576 1.24327C8.47582 1.23746 8.37646 1.22183 8.27933 1.19661C8.04933 1.13527 7.84267 1.01261 7.74867 0.799941L7.74 0.781274C7.60133 0.467941 7.744 0.0926076 8.082 0.0346076C8.42376 -0.0228569 8.77374 -0.00863745 9.10971 0.0763632C9.44568 0.161364 9.76031 0.315289 10.0336 0.528367C10.3069 0.741444 10.533 1.00902 10.6974 1.31411C10.8618 1.61919 10.9609 1.95513 10.9886 2.30058C11.0162 2.64604 10.9717 2.99347 10.8579 3.32082C10.7442 3.64816 10.5636 3.94828 10.3276 4.20211C10.0917 4.45594 9.80551 4.65794 9.48733 4.79529C9.16914 4.93263 8.82588 5.00233 8.47933 4.99994C8.13667 4.99727 7.936 4.64927 8.02333 4.31794L8.02867 4.29794C8.08733 4.07261 8.27267 3.91861 8.48867 3.82194C8.58631 3.77878 8.6882 3.74594 8.79267 3.72394C9.08544 3.65506 9.34385 3.48356 9.52104 3.24054C9.69825 2.99751 9.78251 2.69904 9.75857 2.39923C9.73462 2.09942 9.60406 1.81811 9.39053 1.60628C9.17701 1.39446 8.89466 1.26615 8.59467 1.24461ZM9 6.33327C9 6.15646 9.07024 5.98689 9.19526 5.86187C9.32029 5.73685 9.48985 5.66661 9.66667 5.66661H9.80933C10.9773 5.66661 11.89 6.18527 12.4893 7.01794C13.0713 7.82661 13.3333 8.89261 13.3333 9.99994C13.3333 10.1768 13.2631 10.3463 13.1381 10.4713C13.013 10.5964 12.8435 10.6666 12.6667 10.6666C12.4899 10.6666 12.3203 10.5964 12.1953 10.4713C12.0702 10.3463 12 10.1768 12 9.99994C12 9.08194 11.78 8.31527 11.4067 7.79661C11.0513 7.30194 10.5353 6.99994 9.80933 6.99994H9.66667C9.48985 6.99994 9.32029 6.9297 9.19526 6.80468C9.07024 6.67965 9 6.51009 9 6.33327Z" fill="#0DB4DC"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 10.0026C10 9.82579 10.0702 9.65622 10.1953 9.5312C10.3203 9.40617 10.4899 9.33594 10.6667 9.33594H12.6473C12.8241 9.33594 12.9937 9.40617 13.1187 9.5312C13.2438 9.65622 13.314 9.82579 13.314 10.0026C13.314 10.1794 13.2438 10.349 13.1187 10.474C12.9937 10.599 12.8241 10.6693 12.6473 10.6693H10.6667C10.4899 10.6693 10.3203 10.599 10.1953 10.474C10.0702 10.349 10 10.1794 10 10.0026Z" fill="#0DB4DC"/>
      </svg>
    ),
  },
]