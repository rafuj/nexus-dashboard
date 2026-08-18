import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  errors?: string;
}

function Input({
  className,
  type,
  readOnly,
  placeholder,
  errors,
  ...props
}: InputProps) {
  return (
    <>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 rounded-md border border-border bg-white px-2.5 py-1 text-sm outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 text-accent-foreground",
          className,
          {"bg-[#BDBDBD]/15 !border-border cursor-auto" : readOnly}
        )}
        readOnly={readOnly}
        placeholder={readOnly ? "" : placeholder}
        {...props}
      />
      {errors && (
        <p className="mt-1 text-xs text-error">
          {errors}
        </p>
      )}
    </>
  );
}

export { Input };
