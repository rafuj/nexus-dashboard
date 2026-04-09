import { useAuth } from "@/app/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { User } from "@/features/auth/types/auth";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth(); // Get the login function from the context
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }, // Default form data
  );
  const [error, setError] = useState<string | null>(null); // Default error message
  const [isLoading, setIsLoading] = useState(false); // Default loading state
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    void login(formData.email, formData.password) // Login the user
      .then((user: User | null) => {
        if (user) { // If the user is authenticated, redirect to the dashboard
          navigate("/", { replace: true }); // Redirect to the dashboard
        } else { // If the user is not authenticated, set the error message
          setError("Invalid email or password"); // Set the error message
        }
      })
      .catch((error: Error) => { // If the user is not authenticated, set the error message
        setError(error.message); // Set the error message
      })
      .finally(() => {
        setIsLoading(false); // Set the loading state to false
      });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          {error && <p className="text-destructive">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={!formData.email || !formData.password || isLoading}
                >
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
