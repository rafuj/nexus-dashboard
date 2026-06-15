import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SingleImageUploaderProps = {
  value?: string;
  onChange?: (file: File | null) => void;
  label?: string;
  accept?: string;
  className?: string;
  onRemove?: () => void;
};

function SingleImageUploader({
  value,
  onChange,
  onRemove,
  label = "Add Photo",
  accept = "image/*",
  className
}: SingleImageUploaderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange?.(null);
      return;
    }
    onChange?.(file);
  };
  
  const handleRemove = () => {
    if (onRemove) {
        onRemove();
        return;
    }
    // fallback: notify parent to clear the value
    onChange?.(null);
    };

  return (
    <div
      className={cn(
        "bg-background relative w-full h-30 rounded-[10px] overflow-hidden cursor-pointer",
        className
      )}
    >
    <label className="absolute top-0 w-full h-full left-0 rounded-[10px]">
        {!value && (
            <div className="text-accent-foreground absolute inset-[-3px] flex flex-col items-center justify-center gap-2.5 border-[4px] border-dashed border-accent-foreground rounded-[12px] text-xs">
            <PlusCircle size={20} />
            <span>{label}</span>
            </div>
        )}

        <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
        />
      </label>

      {value && (
        <img
          src={value}
          alt="Uploaded"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {value && (
        <div className="absolute top-2 right-2 flex gap-2">
          {/* Edit */}
          <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-background shadow text-blue-500">
            <Pencil size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
          </label>

          {/* Remove */}
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