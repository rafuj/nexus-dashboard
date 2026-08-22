import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

type LoaderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const LoaderButton = ({
  loading = false,
  className,
  children,
  disabled,
  ...props
}: LoaderButtonProps) => {
  return (
    <Button
      type="button"
      className={cn("relative", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      )}

      <span className={cn(loading && "invisible")}>
        {children}
      </span>
    </Button>
  );
};