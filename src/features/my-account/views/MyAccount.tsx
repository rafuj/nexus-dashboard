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
import { useEffect, useMemo, useRef, useState } from "react"
import { BriefcaseBusiness, Pen, User2, UserLock } from "lucide-react";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { COUNTRY_OPTIONS, getCitiesByCountry } from "@/lib/country-helper";
import { tenantTypeList, type TenantType } from "@/features/auth/views/SignUp";
import { useFormik } from "formik";
import * as Yup from "yup";
import { errorToast, successToast } from "@/lib/toast";
import { useAuth } from "@/app/hooks/useAuth";

const validationSchema = Yup.object({
  tenantType: Yup.string()
    .oneOf(["personal", "business"])
    .required("Tenant type is required"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  firstName: Yup.string()
    .trim()
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .required("Last name is required"),

  // password: Yup.string()
  //   .min(8, "Password must be at least 8 characters")
  //   .required("Password is required"),
  phone: Yup.string()
  .trim()
  .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
  .notRequired(),

  tenantName: Yup.string()
    .trim()
    .when("tenantType", {
      is: "business",
      then: (schema) => schema.required("Tenant name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  organization: Yup.object({
    city: Yup.string().trim(),
    country: Yup.string().trim(),
    legalName: Yup.string().trim(),
    postalCode: Yup.string().trim(),
    street: Yup.string().trim(),
    vatNumber: Yup.string().trim(),
  }).when("tenantType", {
    is: "business",
    then: (schema) =>
      schema.shape({
        city: Yup.string()
          .trim()
          .required("City is required"),

        country: Yup.string()
          .trim()
          .required("Country is required"),

        legalName: Yup.string()
          .trim()
          .required("Legal name is required"),

        postalCode: Yup.string()
          .trim()
          .required("Postal code is required"),

        street: Yup.string()
          .trim()
          .required("Street is required"),

        vatNumber: Yup.string()
          .trim()
          .required("VAT number is required"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
});
export default function MyAccount() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const { updateProfile, getUser, user } = useAuth();

    const formik = useFormik({
      initialValues: {
        tenantType: "personal" as TenantType,
        email: "",
        firstName: "",
        lastName: "",
        // password: "",
        tenantName: "",
        organization: {
          city: "",
          country: "",
          legalName: "",
          postalCode: "",
          street: "",
          vatNumber: "",
        },
        phone: "",
        jobTitle: ""
      },
  
      validationSchema,
  
      onSubmit: async (values) => {
        setIsLoading(true)
  
        try {
          // need to update the changes
          await updateProfile(values)
          await getUser()
          successToast("Profile Updated")
          setIsLoading(false)
        } catch (error) {
          errorToast(
            error instanceof Error
              ? error.message
              : "Something went wrong",
          );
          setIsLoading(false)
        }
  
      },
    });

    useEffect(()=>{
      formik.resetForm({
        values: {
          tenantType: user?.tenant?.type as TenantType,
          email: user?.email ?? '',
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          tenantName: user?.tenant?.name ?? '',
          organization: {
            city: "",
            country: "",
            legalName: "",
            postalCode: "",
            street: "",
            vatNumber: "",
          },
          phone: "",
          jobTitle: ""
        }
      })
    }, [user])

    const { values, setFieldValue, handleChange, handleBlur } = formik

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


    const changePasswordFormik = useFormik({
      initialValues: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      validationSchema: Yup.object({
        currentPassword: Yup.string().required("Current password is required"),

        newPassword: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("New password is required"),

        confirmNewPassword: Yup.string()
          .oneOf([Yup.ref("newPassword")], "Passwords must match")
          .required("Confirm new password is required"),
      }),
      onSubmit: async (values) => {
        console.log(values);
      },
  });

  const availableCities = useMemo(() => {
    return getCitiesByCountry(values.organization.country);
  }, [values.organization.country]);

  console.log("isLoading", isLoading)

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
                        {values.tenantType === 'business' && <div className="text-error text-xs font-semibold mt-3">
                          Company account
                        </div>}
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
                                      value={values.firstName}
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
                                      value={values.lastName}
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
                                      value={values.email}
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
                                      name="phone"
                                      value={values.phone}
                                      onChange={handleChange}
                                  />
                              </div>
                          </Field>
                      </div>
                      <div className="border-t pt-3 mt-5"></div>

                    <Field className="mb-3">
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Account Type <span className="text-error">*</span> </FieldLabel>
                            <CustomRadioGroup value={values.tenantType} setValue={(e)=> setFieldValue("tenantType", e)} list={tenantTypeList} />
                        </div>
                    </Field>
                    {
                      values.tenantType === 'business' &&
                        <>
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
                                        value={values.tenantName}
                                        onChange={(e)=> setFieldValue("tenantName", e.target.value)}
                                    />
                                </div>
                            </Field>
                            <Field>
                                <div>
                                    <FieldLabel className="font-medium text-accent-foreground mb-2.5">Legal Name</FieldLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Global Resources"
                                        className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                        value={values.organization.legalName}
                                        onChange={handleChange}
                                        name="organization.legalName"
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
                                        value={values?.jobTitle}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
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
                                        value={values.organization.vatNumber}
                                        name="organization.vatNumber"
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>
                            <Field>
                                <div>
                                    <FieldLabel className="font-medium text-accent-foreground mb-2.5">Street</FieldLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 12"
                                        className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                        value={values.organization.street}
                                        name="organization.street"
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>
                            <Field>
                                <div>
                                    <FieldLabel className="font-medium text-accent-foreground mb-2.5">House Number</FieldLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 12"
                                        className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                        // value={values.organization.houseNumber}
                                        name="organization.houseNumber"
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>
                            <Field className="col-span-2">
                                <div>
                                    <FieldLabel className="font-medium text-accent-foreground mb-2.5">Zip Code</FieldLabel>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 12"
                                        className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                                        value={values.organization.postalCode}
                                        name="organization.postalCode"
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>
                            <div>
                              <FieldLabel className="font-medium text-accent-foreground mb-2.5">Country</FieldLabel>
                              <Select value={values.organization.country} onValueChange={(value)=> {
                                setFieldValue("organization.country", value);
                                setFieldValue("organization.city", '');
                              }}>
                                  <SelectTrigger className="w-full text-sm md:!h-14">
                                    <SelectValue placeholder="Select Country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {COUNTRY_OPTIONS.map(country => <SelectItem value={country.iso} key={country.iso}>{country.country}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">City</FieldLabel>
                                <Select value={values.organization.city} onValueChange={(value)=> setFieldValue("organization.city", value)}>
                                  <SelectTrigger className="w-full text-sm md:!h-14">
                                    <SelectValue placeholder="Select City" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableCities?.map((item)=> <SelectItem value={item.name} key={item.name}>{item.name}</SelectItem> )}
                                  </SelectContent>
                                </Select>
                            </div>
                          </div>
                        </>
                    }
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
                              <PasswordInput 
                                placeholder="Current password"
                                name="currentPassword"
                                type="password"
                                value={changePasswordFormik.values.currentPassword}
                                onChange={changePasswordFormik.handleChange}
                                onBlur={changePasswordFormik.handleBlur}
                               />
                          </div>
                      </Field>
                      <Field>
                          <div>
                              <FieldLabel className="font-medium text-accent-foreground mb-2.5">New Password</FieldLabel>
                              <PasswordInput placeholder="Choose a strong password"
                                name="newPassword"
                                type="password"
                                value={changePasswordFormik.values.newPassword}
                                onChange={changePasswordFormik.handleChange}
                                onBlur={changePasswordFormik.handleBlur}
                               />
                          </div>
                      </Field>
                      <Field>
                          <div>
                              <FieldLabel className="font-medium text-accent-foreground mb-2.5">Confirm Password</FieldLabel>
                              <PasswordInput placeholder="Re-enter new password"
                                name="confirmNewPassword"
                                type="password"
                                value={changePasswordFormik.values.confirmNewPassword}
                                onChange={changePasswordFormik.handleChange}
                                onBlur={changePasswordFormik.handleBlur}
                               />
                          </div>
                      </Field>
                    </div>
                    <div>
                      <FieldLabel className="font-medium text-accent-foreground mb-2.5 hidden md:block">&nbsp;</FieldLabel>
                      <button className="h-10 lg:h-14 rounded-full flex items-center justify-center bg-accent-foreground text-white py-2 sm:py-3 px-5 text-sm gap-1.25 sm:w-full max-w-[180px]" type="button" onClick={()=> changePasswordFormik.handleSubmit()}>Update Password</button>
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
