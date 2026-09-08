import { useAuth } from "@/app/hooks/useAuth";
import { cn } from "@/lib/utils";
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
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { LoaderButton } from "@/app/components/loader-button";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const [otp, setOtp] = useState<string>("")
  const OTP_LENGTH = 6
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { login, verifyOtp, getUserRolePermission, getUser } = useAuth();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState("login")

  const [timer, setTimer] = useState({
    minutes: 2,
    seconds: 59,
  })
  const [expiresIn, setExpiresIn] = useState({
    minutes: 29,
    seconds: 59,
  })

  const [resendDisabled, setResendDisabled] = useState<boolean>(false)
  const [codeExpired, setCodeExpired] = useState<boolean>(false)

  useEffect(() => {
    if(!codeExpired) return
    const countdown = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }

        if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        }

        clearInterval(countdown)
        setCodeExpired(false)
        setResendDisabled(false)
        setTabs("login")
        return prev
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [codeExpired])

  useEffect(() => {
    if(!resendDisabled) return
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }

        if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        }

        clearInterval(countdown)
        setResendDisabled(false)
        return prev
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [resendDisabled])

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
        setIsLoading(true)
        await login(
          values.email,
          values.password,
        );
        successToast("Please verify OTP to Login")
        setTabs("verify-otp");
        setIsLoading(false)
        setResendDisabled(true)
        setCodeExpired(true)
        setTimer({
          minutes: 2,
          seconds: 59
        })
        setExpiresIn({
          minutes: 29,
          seconds: 59
        })
      } catch (error) {
          errorToast("Invalid Email or Password")
          setIsLoading(false)
      }
    },
  });

  
  const handleOtpVerify = async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault()
    if (otp.length !== OTP_LENGTH) {
      return
    }
    setIsLoading(true)

    try {
      await verifyOtp(otp)
      await getUserRolePermission();
      await getUser();
      setIsLoading(false)
      successToast("OTP verified successfully")
      navigate("/")
    } catch (error) {
      errorToast(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      )
      setIsLoading(false)
      setTabs("login")
      setOtp("")
    }
  }

  const switchComponent = () => {
    switch (tabs) {
      case "verify-otp":
        return (
          <div>
            <div>
              <h1 className="font-medium text-2xl md:text-[28px] mb-2">
                Confirm Verification Code
              </h1>

              <p className="mb-7 text-sm md:text-base">
                We've sent a verification code to {formik.values.email}
              </p>
            </div>
            <div>
              <form onSubmit={handleOtpVerify}>
                <div className="mb-8">
                  <label className="font-medium text-accent-foreground mb-2.5 block">
                    Enter Code
                  </label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={OTP_LENGTH}
                    renderSeparator={<span className="mx-2"></span>}
                    renderInput={(props) => <input {...props} className="grow border border-accent-foreground/20 rounded text-accent-foreground h-12 text-center focus:outline-primary focus:outline focus:border-primary" />}
                  />
                </div>

                <div className="mt-4">
                  <LoaderButton
                    type="submit"
                    disabled={otp.length !== OTP_LENGTH}
                    className="h-10 lg:h-14 rounded-full lg:text-base w-full"
                    loading={isLoading}
                  >
                    Confirm Login
                  </LoaderButton>
                </div>

              </form>
            </div>
            
            <div className="mt-2"></div>

            <div className="text-center text-accent-foreground lg:text-base pt-2">
              Didn't receive code?{" "}
              {resendDisabled ? (
                <>
                  Resend in <span className="font-semibold">{`${timer.minutes<10?'0':''}${timer.minutes}:${timer.seconds<10?'0':''}${timer.seconds}s`}</span>
                </>
                ) : (
                  <button
                type="button"
                className="font-semibold"
                onClick={() => formik.submitForm()}
                disabled={formik.isSubmitting}
              >
                Resend
              </button>
            )}
            </div>


            <div className="text-center text-accent-foreground text-sm">
              {!resendDisabled && (
                <>
                  <div className="flex items-center gap-2.5 max-w-[240px] mx-auto mb-5 mt-7">
                    <div className="h-px grow w-0 bg-accent-foreground" />
                    <div className="size-1.25 rounded-full bg-accent-foreground" />
                    <div className="h-px grow w-0 bg-accent-foreground" />
                  </div>
                  <div>
                    Verification code will expire in{" "}
                    <span className="font-semibold">{`${expiresIn.minutes<10?'0':''}${expiresIn.minutes}:${expiresIn.seconds<10?'0':''}${expiresIn.seconds}s`}</span>
                  </div>
                </>
                )}
            </div>

          </div>
        )
      default: 
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
                    
                    <LoaderButton
                      type="submit"
                      disabled={
                        !formik.isValid ||
                        !formik.dirty ||
                        formik.isSubmitting
                      }
                      className="h-10 lg:h-14 rounded-full lg:text-base"
                      loading={isLoading}
                    >
                      Sign In
                    </LoaderButton>
    
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
        )
    }
  }

  return switchComponent()
}
