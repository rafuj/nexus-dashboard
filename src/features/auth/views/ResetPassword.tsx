import { cn } from "@/lib/utils";
import {
  FieldLabel,
} from "@/shared/components/ui/field";
import { useNavigate } from "react-router";
import { PasswordInput } from "../components/PasswordInput";
import { Button } from "@/shared/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .matches(/[0-9]/, "Password must contain at least 1 number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function ResetPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      console.log("Submitting password update...", values.password);

      // API call here
    },
  });

  const password = formik.values.password;

  const validations = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore =
    Object.values(validations).filter(Boolean).length;

  return (
    <div className={cn("", className)} {...props}>
      <div>
        <div>
          <div className="mb-4">
            <button
              type="button"
              className="md:-translate-x-3"
              onClick={() => navigate(-1)}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5817 12.5801L12.5817 22.5801C12.3997 22.7703 12.2569 22.9946 12.1617 23.2401C11.9617 23.727 11.9617 24.2732 12.1617 24.7601C12.2569 25.0056 12.3997 25.2299 12.5817 25.4201L22.5817 35.4201C22.7682 35.6066 22.9896 35.7545 23.2332 35.8554C23.4769 35.9564 23.738 36.0083 24.0017 36.0083C24.5343 36.0083 25.0451 35.7967 25.4217 35.4201C25.7984 35.0435 26.0099 34.5327 26.0099 34.0001C26.0099 33.4675 25.7984 32.9567 25.4217 32.5801L18.8217 26.0001H34.0017C34.5322 26.0001 35.0409 25.7894 35.416 25.4143C35.791 25.0393 36.0017 24.5306 36.0017 24.0001C36.0017 23.4697 35.791 22.961 35.416 22.5859C35.0409 22.2108 34.5322 22.0001 34.0017 22.0001H18.8217L25.4217 15.4201C25.6092 15.2342 25.758 15.013 25.8595 14.7693C25.9611 14.5256 26.0133 14.2641 26.0133 14.0001C26.0133 13.7361 25.9611 13.4747 25.8595 13.231C25.758 12.9872 25.6092 12.766 25.4217 12.5801C25.2358 12.3927 25.0146 12.2439 24.7709 12.1423C24.5272 12.0408 24.2658 11.9885 24.0017 11.9885C23.7377 11.9885 23.4763 12.0408 23.2326 12.1423C22.9889 12.2439 22.7677 12.3927 22.5817 12.5801Z"
                  fill="#151C48"
                />
              </svg>
            </button>
          </div>

          <h1 className="font-medium text-2xl md:text-[28px] mb-2">
            Change your password?
          </h1>

          <p className="mb-7 text-sm md:text-base">
            Please choose a different password
          </p>
        </div>

        <div>
          <form onSubmit={formik.handleSubmit}>
            {/* New Password */}
            <div className="flex flex-col">
              <FieldLabel className="font-medium text-accent-foreground text-base mb-2">
                New Password
              </FieldLabel>

              <PasswordInput
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="******************"
              />
            </div>

            {/* Confirm Password */}
            <div className="mt-5">
              <div className="flex flex-col">
                <FieldLabel className="font-medium text-accent-foreground text-base mb-2">
                  Confirm Password
                </FieldLabel>

                <PasswordInput
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="******************"
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-2 text-sm text-destructive">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Password Strength */}
              <div className="grid grid-cols-4 gap-1 mt-2">
                {[1, 2, 3, 4].map((index) => {
                  const isLit = strengthScore >= index * 1.25;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "h-[2px] rounded-full transition-colors duration-300",
                        isLit
                          ? "bg-[#1ACD6F]"
                          : "bg-foreground/30",
                      )}
                    />
                  );
                })}
              </div>

              {/* Password Requirements */}
              <div className="mt-5 space-y-1.5 lg:space-y-2.5 text-accent-foreground">
                <p className="text-sm lg:text-base">
                  Password must contain:
                </p>

                <CheckItem
                  label="8 or more characters"
                  isValid={validations.minLength}
                />

                <CheckItem
                  label="At least 1 uppercase letter"
                  isValid={validations.hasUpper}
                />

                <CheckItem
                  label="At least 1 lowercase letter"
                  isValid={validations.hasLower}
                />

                <CheckItem
                  label="At least 1 number"
                  isValid={validations.hasNumber}
                />

                <CheckItem
                  label="At least 1 special character"
                  isValid={validations.hasSpecial}
                />
              </div>

            </div>

            <Button
              type="submit"
              disabled={
                !formik.isValid ||
                !formik.dirty ||
                formik.isSubmitting
              }
              className="h-10 lg:h-14 rounded-full lg:text-base mt-5 w-full"
            >
              Change Password
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ label, isValid }: { label: string; isValid: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm md:text-base">
      {isValid ? (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_349_2010)">
          <circle cx="8.5" cy="8.5" r="8.5" fill="white"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M1 8.5C1 6.51088 1.79018 4.60322 3.1967 3.1967C4.60322 1.79018 6.51088 1 8.5 1C10.4891 1 12.3968 1.79018 13.8033 3.1967C15.2098 4.60322 16 6.51088 16 8.5C16 10.4891 15.2098 12.3968 13.8033 13.8033C12.3968 15.2098 10.4891 16 8.5 16C6.51088 16 4.60322 15.2098 3.1967 13.8033C1.79018 12.3968 1 10.4891 1 8.5ZM8.072 11.71L12.39 6.312L11.61 5.688L7.928 10.289L5.32 8.116L4.68 8.884L8.072 11.71Z" fill="#1ACD6F"/>
          </g>
          <defs>
          <clipPath id="clip0_349_2010">
          <rect width="17" height="17" fill="white"/>
          </clipPath>
          </defs>
        </svg>
      ) : (
        // Gray inactive state checkmark outline
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="#BDC3C7" strokeWidth="2" fill="none"/>
        </svg>
      )}
      <span className={cn("transition-colors", isValid ? "text-accent-foreground" : "text-foreground/50")}>
        {label}
      </span>
    </div>
  );
}