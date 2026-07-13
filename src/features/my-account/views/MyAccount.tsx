"use client";

import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Button } from "@/shared/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import avatar from '@/assets/avatar-placeholder.png'
import { useRef, useState } from "react"
import { BriefcaseBusiness, Pen, User2, UserLock } from "lucide-react";

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    jobTitle: string;
    chamberOfCommerceNumber: string;
    vatNumber: string;
    privateAddress: string;
    workAddress: string;
}
export default function MyAccount() {

  const [formState, setFormState] = useState<FormState>({
      firstName: "Admin",
      lastName: "User",
      email: "johnsmith@xyz.com",
      phone: "+88018392829282",
      companyName: "Global Rescue",
      jobTitle: "Senior Safety Officer",
      chamberOfCommerceNumber: "029472826",
      vatNumber: "CBHSKJSLYYUK73298KD7",
      privateAddress: "1207 Tipu Sultan",
      workAddress: "Elephant Road Bata Signal Mor"
  }); 

  // 1. Manage the image preview state (defaults to your initial avatar)
    const [previewSrc, setPreviewSrc] = useState<string>(avatar); 
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 2. Handle file selection and generate a preview URL
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Optional: Add simple validation for images
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            setPreviewSrc(objectUrl);

            // TODO: Send 'file' to your backend or cloud storage here
            console.log('Selected file:', file);
        }
    };

  return (
    <>
      <Helmet>
        <title>Explore Upgrades | Updaid</title>
      </Helmet>
      <main>
        
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">My Account</h1>
                <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                  <li>Manage your personal information here</li>
                </ul>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5">
          <section aria-label="My Account">
            <div
              className={cn(
                "bg-white border rounded-[10px] border-border py-10 px-6 md:px-10",
              )}
            >
              <div className="flex flex-wrap gap-8 md:gap-10">
                <div className="w-full md:w-50 2xl:w-100">
                  <div className="md:sticky md:top-35">
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="relative w-20 md:w-25 xl:w-30">
                        <img src={previewSrc} className="size-full aspect-square object-cover rounded-full" alt="" />
                        <label className="size-7 bg-accent-foreground rounded-full text-white flex items-center justify-center absolute bottom-0 right-0 cursor-pointer">
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          <Pen size={16} />
                        </label>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-base mt-3 text-accent-foreground">Admin User</div>
                        <div className="text-xs mt-1">Senior Safety Officer</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-0 grow">
                  <FieldGroup className="gap-3">
                      <h3 className="flex items-center gap-2 font-semibold mb-2 text-lg">
                        <User2 className="text-primary" size={25} /> <span>Personal Information</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <Field>
                              <div>
                                  <FieldLabel className="font-medium text-accent-foreground mb-2.5">First Name</FieldLabel>
                                  <Input 
                                      type="text" 
                                      placeholder="eg. John" 
                                      className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5" 
                                      value={formState.firstName}
                                      readOnly
                                  />
                              </div>
                          </Field>
                          <Field>
                              <div>
                                  <FieldLabel className="font-medium text-accent-foreground mb-2.5">Last Name</FieldLabel>
                                  <Input 
                                      type="text" 
                                      placeholder="eg. Smith" 
                                      className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5" 
                                      value={formState.lastName}
                                      readOnly
                                  />
                              </div>
                          </Field>
                          <Field>
                              <div>
                                  <FieldLabel className="font-medium text-accent-foreground mb-2.5">Email</FieldLabel>
                                  <Input
                                      type="email"
                                      placeholder="e.g. johnsmith@xyz.com"
                                      className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                      value={formState.email}
                                      readOnly
                                  />
                              </div>
                          </Field>
                          <Field>
                              <div>
                                  <FieldLabel className="font-medium text-accent-foreground mb-2.5">Phone Number</FieldLabel>
                                  <Input
                                      type="text"
                                      placeholder="e.g. Global Rescue"
                                      className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                      value={formState.phone}
                                      onChange={(e)=> setFormState(prev => ({
                                        ...prev,
                                        phone: e.target.value
                                      }))}
                                  />
                              </div>
                          </Field>
                      </div>
                      <div className="border-t pt-3 mt-5"></div>
                      <h3 className="flex items-center gap-2 font-semibold mb-2 text-lg">
                        <BriefcaseBusiness className="text-primary" size={25} /> <span>Professional Information</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Company Name</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. Global Rescue"
                                    className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                    value={formState.companyName}
                                    onChange={(e)=> setFormState(prev => ({
                                      ...prev,
                                      companyName: e.target.value
                                    }))}
                                />
                            </div>
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Position / job title</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. Safety Officer"
                                    className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                    value={formState.jobTitle}
                                    onChange={(e)=> setFormState(prev => ({
                                      ...prev,
                                      jobTitle: e.target.value
                                    }))}
                                />
                            </div>
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Chamber of Commerce number</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. 029472826"
                                    className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                    value={formState.chamberOfCommerceNumber}
                                    onChange={(e)=> setFormState(prev => ({
                                      ...prev,
                                      chamberOfCommerceNumber: e.target.value
                                    }))}
                                />
                            </div>
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">VAT number</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. CBHSKJSLYYUK73298KD7"
                                    className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                    value={formState.vatNumber}
                                    onChange={(e)=> setFormState(prev => ({
                                      ...prev,
                                      vatNumber: e.target.value
                                    }))}
                                />
                            </div>
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Private address</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. 1207 Tipu Sultan"
                                    className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                    value={formState.privateAddress}
                                    onChange={(e)=> setFormState(prev => ({
                                      ...prev,
                                      privateAddress: e.target.value
                                    }))}
                                />
                            </div>
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Work address</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g. Elephant Road Bata Signal Mor"
                                    className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"

                                    value={formState.workAddress}
                                    onChange={(e)=> setFormState(prev => ({
                                      ...prev,
                                      workAddress: e.target.value
                                    }))}
                                />
                            </div>
                        </Field>
                      </div>
                      <Field>
                          <div className="flex flex-wrap gap-3 justify-end w-full mt-5">
                            <button className="h-10 lg:h-14 rounded-full flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]" type="reset">Cancel</button>
                            <Button className="h-10 lg:h-14 rounded-full flex items-center justify-center bg-primary text-white py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[180px]" type="submit">Save Changes</Button>
                          </div>
                      </Field>
                  </FieldGroup>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "bg-white border rounded-[10px] border-border py-10 px-6 md:px-10 mt-5",
              )}
            >
              
              <FieldGroup className="gap-3">
                  <h3 className="flex items-center gap-2 font-semibold mb-2 text-lg">
                    <UserLock className="text-primary" size={25} /> <span>Security Information</span>
                  </h3>
                  <div className="flex flex-wrap gap-5 justify-end">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-0 grow">
                      <Field>
                          <div>
                              <FieldLabel className="font-medium text-accent-foreground mb-2.5">Current Password</FieldLabel>
                              <PasswordInput placeholder="Current password" />
                          </div>
                      </Field>
                      <Field>
                          <div>
                              <FieldLabel className="font-medium text-accent-foreground mb-2.5">New Password</FieldLabel>
                              <PasswordInput placeholder="Choose a strong password" />
                          </div>
                      </Field>
                      <Field>
                          <div>
                              <FieldLabel className="font-medium text-accent-foreground mb-2.5">Confirm Password</FieldLabel>
                              <PasswordInput placeholder="Re-enter new password" />
                          </div>
                      </Field>
                    </div>
                    <div>
                      <FieldLabel className="font-medium text-accent-foreground mb-2.5 hidden md:block">&nbsp;</FieldLabel>
                      <button className="h-10 lg:h-14 rounded-full flex items-center justify-center bg-accent-foreground text-white py-2 sm:py-3 px-5 rounded-lg text-sm gap-1.25 sm:w-full max-w-[180px]" type="submit">Update Password</button>
                    </div>
                  </div>
              </FieldGroup>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
