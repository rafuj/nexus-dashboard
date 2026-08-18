import { parseAsStringLiteral, useQueryState } from "nuqs";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { countries } from "@/features/settings/mock/mockCountries";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { errorToast, successToast } from "@/lib/toast";
import { useAuth } from "@/app/hooks/useAuth";
import { removeEmptyValues } from "@/lib/utils";
import { PasswordInput } from "../components/PasswordInput";
import { Link, useNavigate } from "react-router";
import { CustomRadioGroup, type RadioOption } from "@/shared/components/CustomRadioGroup";
import React, { useState } from "react";
import OtpInput from 'react-otp-input';

export type TenantType = "personal" | "business";

export const tenantTypeList: RadioOption<TenantType>[] = [
  {
    id: "personal",
    value: "personal",
    label: "Personal",
  },
  {
    id: "business",
    value: "business",
    label: "Company",
  },
];

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

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
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

export default function SignUp() {
  
  const [tabs, setTabs] = useQueryState("tabs",   parseAsStringLiteral(["signup", "verify-otp-reg"]).withDefault("signup"))
  // const [tabs, setTabs] = useState("signup")

  const { sendOtpReg, verifyOtpReg, signup } = useAuth();
  const navigate = useNavigate()

  const [otp, setOtp] = useState<string>("")
  const OTP_LENGTH = 6

  const formik = useFormik({
    initialValues: {
      tenantType: "personal" as TenantType,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      tenantName: "",
      organization: {
        city: "",
        country: "",
        legalName: "",
        postalCode: "",
        street: "",
        vatNumber: "",
      },
      phone: ""
    },

    validationSchema,

    onSubmit: async (values) => {

      try {
        await sendOtpReg(values.email)
        successToast("OTP sent successfully. Please verify your email.")
        setTabs("verify-otp-reg")
      } catch (error) {
        errorToast(
          error instanceof Error
            ? error.message
            : "Something went wrong",
        );
      }

    },
  });

  const handleOtpVerify = async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault()
    if (!formik.values.email || otp.length !== OTP_LENGTH) {
      return
    }

    try {
      await verifyOtpReg({
        email: formik.values.email,
        otpCode: otp,
      })

      const values = removeEmptyValues(formik.values)

      const { organization, ...rest } = values

      const signupValues =
        values.tenantType === "personal"
          ? rest
          : values

      await signup(signupValues)

      successToast("Account created successfully")
      navigate("/login")
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      )
    }
  }

  const switchComponent = () => {
    switch (tabs) {
        case "verify-otp-reg":
            return (
              <div>
                <div>
                  <div>
                    <h1 className="font-medium text-2xl md:text-[28px] mb-2">
                      Verify Signup OTP
                    </h1>

                    <p className="mb-7 text-sm md:text-base">
                      We've sent an OTP to {formik.values.email}, enter verify to register
                    </p>
                  </div>
                  <div>
                    <form onSubmit={handleOtpVerify}>
                      <div className="mb-8">
                        <label className="font-medium text-accent-foreground mb-2.5 block">
                          Enter OTP
                        </label>
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={OTP_LENGTH}
                          renderSeparator={<span className="mx-2"></span>}
                          renderInput={(props) => <input {...props} className="grow border border-accent-foreground/20 rounded text-accent-foreground h-12 text-center focus:outline-primary focus:outline focus:border-primary" />}
                        />
                      </div>

                      <div className="mt-4">
                        <Button
                          type="submit"
                          disabled={!formik.values.email || otp.length !== OTP_LENGTH}
                          className="h-10 lg:h-14 rounded-full lg:text-base w-full"
                        >
                          Verify OTP
                        </Button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            )
        default :
            return (
              <div>
                <div>
                  <h1 className="font-medium text-2xl md:text-[28px] mb-2">
                    Sign Up
                  </h1>

                  <p className="mb-7 text-sm md:text-base">
                    Create you account to join our rescue network
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  <div className="space-y-3">
                    {/* Account Type */}
                    <div className="mb-3">
                      <label className="font-medium text-accent-foreground mb-2.5 block">
                        Account Type{" "}
                        <span className="text-error">*</span>
                      </label>

                      <CustomRadioGroup
                        value={formik.values.tenantType}
                        setValue={(value) => {
                          formik.setFieldValue("tenantType", value);
                        }}
                        list={tenantTypeList}
                        textClassName="text-sm"
                      />

                      {formik.touched.tenantType &&
                        formik.errors.tenantType && (
                          <p className="mt-1 text-sm text-error">
                            {formik.errors.tenantType}
                          </p>
                        )}
                    </div>

                    {/* Company Name */}
                    {/* {formik.values.tenantType === "business" && ( */}
                      <div className="mb-3">
                        <label className="font-medium text-accent-foreground mb-2.5 block">
                          Company Name{" "}
                          <span className="text-error">
                            *
                          </span>
                        </label>

                        <Input
                          type="text"
                          name="tenantName"
                          placeholder="e.g. Global Rescue"
                          value={formik.values.tenantName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                        />

                        {formik.touched.tenantName &&
                          formik.errors.tenantName && (
                            <p className="mt-1 text-sm text-error">
                              {formik.errors.tenantName}
                            </p>
                          )}
                      </div>
                    {/* )} */}

                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <label className="font-medium text-accent-foreground mb-2.5 block">
                          First Name{" "}
                          <span className="text-error">*</span>
                        </label>

                        <Input
                          type="text"
                          name="firstName"
                          placeholder="eg. John"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                        />

                        {formik.touched.firstName &&
                          formik.errors.firstName && (
                            <p className="mt-1 text-sm text-error">
                              {formik.errors.firstName}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="font-medium text-accent-foreground mb-2.5 block">
                          Last Name{" "}
                          <span className="text-error">*</span>
                        </label>

                        <Input
                          type="text"
                          name="lastName"
                          placeholder="eg. Smith"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                        />

                        {formik.touched.lastName &&
                          formik.errors.lastName && (
                            <p className="mt-1 text-sm text-error">
                              {formik.errors.lastName}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="font-medium text-accent-foreground mb-2.5 block">
                        Email <span className="text-error">*</span>
                      </label>

                      <Input
                        type="email"
                        name="email"
                        placeholder="e.g. johnsmith@xyz.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                      />

                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-sm text-error">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>
                    {formik.values.tenantType === "business" && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                            <label className="font-medium text-accent-foreground mb-2.5 block">Country <span className="text-error">*</span></label>
                          <Select value={formik.values.organization.country} onValueChange={(value) => {
                              formik.setFieldValue("organization.country", value);
                              formik.setFieldValue("organization.city", "");
                              formik.setFieldTouched("organization.city", false)
                          }}>
                              <SelectTrigger className="w-full text-sm md:!h-14 bg-transparent" onBlur={() => formik.setFieldTouched("organization.country", true)}>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map(country => <SelectItem value={country.name} key={country.name}>{country.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            {formik.touched.organization?.country &&
                              formik.errors.organization?.country && (
                                <p className="mt-1 text-sm text-error">
                                  {formik.errors.organization?.country}
                                </p>
                              )}
                        </div>
                        <div>
                            <label className="font-medium text-accent-foreground mb-2.5 block">City <span className="text-error">*</span></label>
                            <Select value={formik.values.organization.city} onValueChange={(value)=> formik.setFieldValue("organization.city", value)}>
                              <SelectTrigger className="w-full text-sm md:!h-14 bg-transparent" onBlur={() => formik.setFieldTouched("organization.city", true)}>
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.find(item => item.name === formik.values.organization.country)?.cities?.map((item)=> <SelectItem value={item} key={item}>{item}</SelectItem> )}
                              </SelectContent>
                            </Select>
                            {formik.touched.organization?.city &&
                              formik.errors.organization?.city && (
                                <p className="mt-1 text-sm text-error">
                                  {formik.errors.organization?.city}
                                </p>
                              )}
                        </div>
                        <div>
                            <label className="font-medium text-accent-foreground mb-2.5 block">Legal Name <span className="text-error">*</span></label>
                            <Input
                              type="text"
                              name="organization.legalName"
                              placeholder="e.g. Global Resources"
                              value={formik.values.organization.legalName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                            {formik.touched.organization?.legalName &&
                              formik.errors.organization?.legalName && (
                                <p className="mt-1 text-sm text-error">
                                  {formik.errors.organization?.legalName}
                                </p>
                              )}
                        </div>
                        <div>
                            <label className="font-medium text-accent-foreground mb-2.5 block">Postal Code <span className="text-error">*</span></label>
                            <Input
                              type="text"
                              name="organization.postalCode"
                              placeholder="e.g. 1290"
                              value={formik.values.organization.postalCode}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                            {formik.touched.organization?.postalCode &&
                              formik.errors.organization?.postalCode && (
                                <p className="mt-1 text-sm text-error">
                                  {formik.errors.organization?.postalCode}
                                </p>
                              )}
                        </div>
                        <div>
                            <label className="font-medium text-accent-foreground mb-2.5 block">Street <span className="text-error">*</span></label>
                            <Input
                              type="text"
                              name="organization.street"
                              placeholder="e.g. 12"
                              value={formik.values.organization.street}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                            {formik.touched.organization?.street &&
                              formik.errors.organization?.street && (
                                <p className="mt-1 text-sm text-error">
                                  {formik.errors.organization?.street}
                                </p>
                              )}
                        </div>
                        <div>
                            <label className="font-medium text-accent-foreground mb-2.5 block">Vat Number <span className="text-error">*</span></label>
                            <Input
                              type="text"
                              name="organization.vatNumber"
                              placeholder="e.g. 12"
                              value={formik.values.organization.vatNumber}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                            {formik.touched.organization?.vatNumber &&
                              formik.errors.organization?.vatNumber && (
                                <p className="mt-1 text-sm text-error">
                                  {formik.errors.organization?.vatNumber}
                                </p>
                              )}
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    <div>
                      <label className="font-medium text-accent-foreground mb-2.5 block">
                        Phone Number{" "}
                        <span className="text-foreground">
                          (optional)
                        </span>
                      </label>

                      <Input
                        type="text"
                        name="phone"
                        placeholder="e.g. +123456789"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="font-medium text-accent-foreground mb-2.5 block">
                        Password <span className="text-error">*</span>
                      </label>

                      <PasswordInput
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Choose a strong password"
                      />

                      {formik.touched.password &&
                        formik.errors.password && (
                          <p className="mt-1 text-sm text-error">
                            {formik.errors.password}
                          </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        className="h-10 lg:h-14 rounded-full w-full"
                        type="submit"
                        disabled={
                          !formik.isValid ||
                          !formik.dirty ||
                          formik.isSubmitting
                        }
                      >
                        Create Account
                      </Button>

                      <p className="px-6 text-center text-accent-foreground lg:text-base mt-2">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="!no-underline font-semibold"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            )
    }
  }
  
  return switchComponent()
}