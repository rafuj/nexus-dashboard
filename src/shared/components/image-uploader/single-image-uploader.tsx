import React, { useMemo, useEffect } from "react";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SingleImageUploaderProps = {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  label?: string;
  accept?: string;
  className?: string;
  onRemove?: () => void;
  readOnly?: boolean;
};

function SingleImageUploader({
  value,
  onChange,
  onRemove,
  label = "Add Photo",
  accept = "image/*",
  className,
  readOnly,
}: SingleImageUploaderProps) {
  // Generate local preview URL from File object (or fallback to string URL if existing)
  const previewUrl = useMemo(() => {
    if (!value) return null;
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return value; // In case an existing remote URL string was passed
  }, [value]);

  // Clean up Blob memory on unmount/file change
  useEffect(() => {
    return () => {
      if (previewUrl && value instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const file = e.target.files?.[0];
    onChange?.(file || null);
    // Reset file input value so selecting the same file again triggers onChange
    e.target.value = "";
  };

  const handleRemove = () => {
    if (readOnly) return;
    if (onRemove) {
      onRemove();
    } else {
      onChange?.(null);
    }
  };

  if (readOnly && !value) return null;

  return (
    <div
      className={cn(
        "bg-background relative w-full h-30 rounded-[10px] overflow-hidden cursor-pointer",
        className
      )}
    >
      {!readOnly && !previewUrl && (
        <label className="absolute inset-[-3px] flex flex-col items-center justify-center gap-2.5 border-[4px] border-dashed border-accent-foreground rounded-[12px] text-xs text-accent-foreground cursor-pointer">
          <PlusCircle size={20} />
          <span>{label}</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
        </label>
      )}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {previewUrl && !readOnly && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-background shadow text-blue-500">
            <Pencil size={16} />
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleChange}
            />
          </label>
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-background shadow text-error"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export { SingleImageUploader };