import { useAuth } from "@/app/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { User } from "@/features/auth/types/auth";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PasswordInput } from "../components/PasswordInput";

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
    <div className={cn("", className)} {...props}>
        <div>
          <div>
            <h1 className="font-medium text-2xl md:text-[28px] mb-2">Welcome Back</h1>
            <p className="mb-7 text-sm md:text-base">
              Sign in to continue to your dashboard
            </p>
            {error && <p className="text-destructive">{error}</p>}
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <div>
                    <FieldLabel className="font-medium text-accent-foreground mb-3" htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="eg. johnfrans@gmail.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                    />
                  </div>
                </Field>
                <Field>
                  <div>
                    <FieldLabel className="font-medium text-accent-foreground mb-3" htmlFor="password">Password</FieldLabel>
                      <PasswordInput 
                        id="password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <div className="flex items-center mt-3">
                        <Link
                          to="/forgot-password"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-accent-foreground font-medium"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={!formData.email || !formData.password || isLoading}
                    className="h-10 lg:h-14 rounded-full"
                  >
                    Sign In
                  </Button>
                  <FieldDescription className="text-center text-accent-foreground">
                    Don&apos;t have an account? <Link className="font-semibold !no-underline" to="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
  );
}
