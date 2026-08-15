import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PasswordInput } from "../components/PasswordInput";
import { Link } from "react-router";
import avatar from "@/assets/avatar.png";
import { useRef, useState } from "react";
import { CustomRadioGroup, type RadioOption } from "@/shared/components/CustomRadioGroup";
import { useFormik } from "formik";
import * as Yup from "yup";

export type AccountType = "personal" | "business";

export const accountTypeList: RadioOption<AccountType>[] = [
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
  accountType: Yup.string()
    .oneOf(["personal", "business"])
    .required("Account type is required"),

  companyName: Yup.string().when("accountType", {
    is: "business",
    then: (schema) => schema.required("Company Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  firstName: Yup.string()
    .trim()
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .required("Last name is required"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  phone: Yup.string()
    .notRequired(),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    // .matches(
    //   /[A-Z]/,
    //   "Password must contain at least 1 uppercase letter",
    // )
    // .matches(
    //   /[a-z]/,
    //   "Password must contain at least 1 lowercase letter",
    // )
    // .matches(
    //   /[0-9]/,
    //   "Password must contain at least 1 number",
    // )
    // .matches(
    //   /[^A-Za-z0-9]/,
    //   "Password must contain at least 1 special character",
    // )
    // .required("Password is required"),
});

export default function SignupForm({
  className,
}: {
  className?: string
}) {
  const [previewSrc, setPreviewSrc] = useState<string>(avatar);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      accountType: "personal" as AccountType,
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      avatar: null as File | null,
    },

    validationSchema,

    onSubmit: async (values) => {
      console.log("Signup values:", values);

      // API call here
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      // Replace with your errorToast if you're using toast
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewSrc(objectUrl);

    formik.setFieldValue("avatar", file);
  };

  return (
    <div className={cn("", className)}>
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
              value={formik.values.accountType}
              setValue={(value) => {
                formik.setFieldValue("accountType", value);
              }}
              list={accountTypeList}
              textClassName="text-sm"
            />

            {formik.touched.accountType &&
              formik.errors.accountType && (
                <p className="mt-1 text-sm text-error">
                  {formik.errors.accountType}
                </p>
              )}
          </div>

          {/* Company Name */}
          {formik.values.accountType === "business" && (
            <div className="mb-3">
              <label className="font-medium text-accent-foreground mb-2.5 block">
                Company Name{" "}
                <span className="text-foreground">
                  *
                </span>
              </label>

              <Input
                type="text"
                name="companyName"
                placeholder="e.g. Global Rescue"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
              />

              {formik.touched.companyName &&
                formik.errors.companyName && (
                  <p className="mt-1 text-sm text-error">
                    {formik.errors.companyName}
                  </p>
                )}
            </div>
          )}

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
  );
}