import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent
} from "@/shared/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { PasswordInput } from "../components/PasswordInput"
import { Link } from "react-router"


export default function SignupForm({className, ...props } : React.ComponentProps<typeof Card>) {
    return (
        <div className={cn("", className)} {...props}>
          <div>
            <h1 className="font-medium text-2xl md:text-[28px] mb-2">Sign Up</h1>
            <p className="mb-7 text-sm md:text-base">
              Create you account to join our rescue network
            </p>
          </div>
            <form>
                <FieldGroup className="gap-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">First Name <span className="text-error">*</span> </FieldLabel>
                                <Input id="firstname" type="text" placeholder="eg. John" className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5" required />
                            </div>
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Last Name <span className="text-error">*</span> </FieldLabel>
                                <Input id="lastname" type="text" placeholder="eg. Smith" className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5" required />
                            </div>
                        </Field>
                    </div>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Email <span className="text-error">*</span></FieldLabel>
                            <Input
                                type="email"
                                placeholder="e.g. johnsmith@xyz.com"
                                required
                                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                        </div>
                    </Field>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Phone Number <span className="text-foreground">(optional)</span></FieldLabel>
                            <Input
                                type="text"
                                placeholder="e.g. Global Rescue"
                                required
                                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                        </div>
                    </Field>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Company Name <span className="text-foreground">(optional)</span></FieldLabel>
                            <Input
                                type="text"
                                placeholder="e.g. Global Rescue"
                                required
                                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                        </div>
                    </Field>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Password <span className="text-error">*</span></FieldLabel>
                            <PasswordInput placeholder="Choose a strong password" />
                        </div>
                    </Field>
                    <FieldGroup>
                    <Field>
                        <Button className="h-10 lg:h-14 rounded-full" type="submit">Sign Up</Button>
                        <FieldDescription className="px-6 text-center text-accent-foreground">
                            Already have an account? <Link to="/login" className="!no-underline font-semibold">Sign in</Link>
                        </FieldDescription>
                    </Field>
                    </FieldGroup>
                </FieldGroup>
            </form> 
        </div>
    )
}