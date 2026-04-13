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
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }, 
  );
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    void login(formData.email, formData.password) 
      .then((user: User | null) => {
        if (user) {
          navigate("/", { replace: true });
        } else { 
          setError("Invalid email or password"); 
        }
      })
      .catch((error: Error) => { 
        setError(error.message); 
      })
      .finally(() => {
        setIsLoading(false);
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
