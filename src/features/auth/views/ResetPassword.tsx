import { cn } from "@/lib/utils";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { useNavigate } from "react-router";
import { PasswordInput } from "../components/PasswordInput";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";

export default function ResetPassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [value, setValue] = useState<{password:string, confirmPassword:string}>({
    password:'',
    confirmPassword:''
  })
  const navigate = useNavigate();

  return (
      <div className={cn("", className)} {...props}>
        <div>
          <div>
            <div className="mb-4">
              <button type="button" className="md:-translate-x-3" onClick={()=> navigate(-1)}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5817 12.5801L12.5817 22.5801C12.3997 22.7703 12.2569 22.9946 12.1617 23.2401C11.9617 23.727 11.9617 24.2732 12.1617 24.7601C12.2569 25.0056 12.3997 25.2299 12.5817 25.4201L22.5817 35.4201C22.7682 35.6066 22.9896 35.7545 23.2332 35.8554C23.4769 35.9564 23.738 36.0083 24.0017 36.0083C24.5343 36.0083 25.0451 35.7967 25.4217 35.4201C25.7984 35.0435 26.0099 34.5327 26.0099 34.0001C26.0099 33.4675 25.7984 32.9567 25.4217 32.5801L18.8217 26.0001H34.0017C34.5322 26.0001 35.0409 25.7894 35.416 25.4143C35.791 25.0393 36.0017 24.5306 36.0017 24.0001C36.0017 23.4697 35.791 22.961 35.416 22.5859C35.0409 22.2108 34.5322 22.0001 34.0017 22.0001H18.8217L25.4217 15.4201C25.6092 15.2342 25.758 15.013 25.8595 14.7693C25.9611 14.5256 26.0133 14.2641 26.0133 14.0001C26.0133 13.7361 25.9611 13.4747 25.8595 13.231C25.758 12.9872 25.6092 12.766 25.4217 12.5801C25.2358 12.3927 25.0146 12.2439 24.7709 12.1423C24.5272 12.0408 24.2658 11.9885 24.0017 11.9885C23.7377 11.9885 23.4763 12.0408 23.2326 12.1423C22.9889 12.2439 22.7677 12.3927 22.5817 12.5801Z" fill="#151C48"/>
                </svg>
              </button>
            </div>
            <h1 className="font-medium text-2xl md:text-[28px] mb-2">Change your password?</h1>
            <p className="mb-7 text-sm md:text-base">
              Please choose a different password
            </p>
          </div>
          <div>
            <form>
              <FieldGroup>
                <Field>
                  <div>
                    <FieldLabel className="font-medium text-accent-foreground mb-2.5">Password <span className="text-error">*</span></FieldLabel>
                    <PasswordInput  />
                  </div>
                </Field>
                <Field>
                  <div>
                    <FieldLabel className="font-medium text-accent-foreground mb-2.5">Confirm Password <span className="text-error">*</span></FieldLabel>
                    <PasswordInput  />
                  </div>
                </Field>
                <Field>
                  <Button
                    type="submit"
                    className="h-10 lg:h-14 rounded-full lg:text-base"
                  >
                    Change Password
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    );
}
