import { useAuth } from "@/app/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { User } from "@/features/auth/types/auth";
import { Button } from "@/shared/components/ui/button";
import {
  FieldDescription,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";
import { PasswordInput } from "../components/PasswordInput";
import { errorToast, successToast } from "@/lib/toast";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
const { login } = useAuth();
const navigate = useNavigate();

const formik = useFormik({
  initialValues: {
    email: "",
    password: "",
  },

  validationSchema: Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required"),
  }),

  onSubmit: async (values) => {
    try {
      const user: User | null = await login(
        values.email,
        values.password,
      );
      if (user) {
        successToast("Please verify OTP to Login")
        navigate("/verify-otp", { replace: true });
      }
    } catch (error) {
        errorToast("Invalid Email or Password")
    }
  },
});

  return (
    <div className={cn("", className)} {...props}>
        <div>
          <div>
            <h1 className="font-medium text-2xl md:text-[28px] mb-2">Welcome Back</h1>
            <p className="mb-7 text-sm md:text-base">
              Sign in to continue to your dashboard
            </p>
          </div>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel className="font-medium text-accent-foreground mb-2.5">
                    Email
                  </FieldLabel>

                  <Input
                    type="email"
                    name="email"
                    placeholder="eg. johnfrans@gmail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                  />

                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-destructive">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              
                <div>
                  <FieldLabel className="font-medium text-accent-foreground mb-2.5">
                    Password
                  </FieldLabel>

                  <PasswordInput
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-destructive">
                      {formik.errors.password}
                    </p>
                  )}

                  <div className="flex items-center mt-3">
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-accent-foreground font-medium lg:text-base"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={
                    !formik.isValid ||
                    !formik.dirty ||
                    formik.isSubmitting
                  }
                  className="h-10 lg:h-14 rounded-full lg:text-base"
                >
                  Sign In
                </Button>

                <FieldDescription className="text-center text-accent-foreground lg:text-base">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="font-semibold !no-underline"
                    to="/signup"
                  >
                    Sign up
                  </Link>
                </FieldDescription>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
