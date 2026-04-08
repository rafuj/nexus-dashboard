import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"

export default function SignupForm({ ...props } : React.ComponentProps<typeof Card>) {
    return (
        <Card {...props}>
        <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
            Enter your information below to create your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
            <FieldGroup>
                <Field>
                    <FieldLabel>Account Type</FieldLabel>

                    <RadioGroup defaultValue="personal" className="w-fit grid-flow-col">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="personal" id="account-personal" />
                            <label htmlFor="account-personal">Personal</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="business" id="account-business" />
                            <label htmlFor="account-business">Business</label>
                        </div>
                    </RadioGroup>
                </Field>
                <Field>
                    <FieldLabel htmlFor="name">First Name</FieldLabel>
                    <Input id="firstname" type="text" placeholder="John" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="name">Last Name</FieldLabel>
                    <Input id="lastname" type="text" placeholder="Doe" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </Field>
                <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
                <FieldDescription>
                    Must be at least 8 characters long.
                </FieldDescription>
                </Field>
                <Field>
                <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                </FieldLabel>
                <Input id="confirm-password" type="password" required />
                <FieldDescription>Please confirm your password.</FieldDescription>
                </Field>
                <FieldGroup>
                <Field>
                    <Button type="submit">Create Account</Button>
                    <FieldDescription className="px-6 text-center">
                    Already have an account? <a href="/login">Sign in</a>
                    </FieldDescription>
                </Field>
                </FieldGroup>
            </FieldGroup>
            </form>
        </CardContent>
        </Card>     
    )
}